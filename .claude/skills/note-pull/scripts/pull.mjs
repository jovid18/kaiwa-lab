/**
 * note 발행 글(또는 초안)을 URL로 받아 diary/YYYY-MM-DD.md로 내려받는다.
 * (note_mcp/scripts/pull.ts 포팅 — 이 리포 안에서 자체 실행, 외부 의존성 없음)
 *
 * 사용 (리포 루트에서):
 *   node .claude/skills/note-pull/scripts/pull.mjs <note-url>
 *   node .claude/skills/note-pull/scripts/pull.mjs <url> --date 2026-07-02  # 파일명 날짜 강제
 *   node .claude/skills/note-pull/scripts/pull.mjs <url> --force            # 기존 파일 덮어쓰기
 *   node .claude/skills/note-pull/scripts/pull.mjs <url> --out foo.md       # 출력 경로 강제
 *   node .claude/skills/note-pull/scripts/pull.mjs <url> --dir other/       # 출력 디렉토리 변경 (기본: diary/)
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { getConfig, requireSessionCookie, DEFAULT_DIARY_DIR } from "./env.mjs";
import { NoteClient } from "./note-client.mjs";
import { noteHtmlToMd } from "./note-to-md.mjs";

function parseArgs(argv) {
  const a = { force: false };
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i];
    if (v === "--force") a.force = true;
    else if (v === "--date") a.date = argv[++i];
    else if (v === "--out") a.out = argv[++i];
    else if (v === "--dir") a.dir = argv[++i];
    else if (!v.startsWith("--") && !a.url) a.url = v;
  }
  return a;
}

/** note URL/편집 URL/키 → note key (n로 시작하는 식별자) */
function extractKey(input) {
  const s = input.trim();
  let m =
    s.match(/\/n\/(n[0-9a-z]+)/i) || // https://note.com/<user>/n/<key>
    s.match(/\/notes\/(n[0-9a-z]+)/i); // https://editor.note.com/notes/<key>/edit
  if (m) return m[1];
  m = s.match(/^(n[0-9a-z]{8,})$/i); // 키만 준 경우
  if (m) return m[1];
  throw new Error(`note key를 URL에서 찾지 못했습니다: ${input}`);
}

const pad = (n) => String(n).padStart(2, "0");

/** 파일명 날짜(YYYY-MM-DD) 결정: --date > 제목의 날짜 > publish_at/created_at */
function resolveDate(args, title, publishAt, createdAt) {
  if (args.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) throw new Error(`--date 형식은 YYYY-MM-DD 여야 합니다: ${args.date}`);
    return { date: args.date, source: "--date" };
  }
  const ref = publishAt || createdAt || "";
  const refYear = ref.slice(0, 4);
  const t = (title ?? "").trim();
  let m = t.match(/(\d{4})[-.\/](\d{1,2})[-.\/](\d{1,2})/);
  if (m) return { date: `${m[1]}-${pad(m[2])}-${pad(m[3])}`, source: "제목" };
  m = t.match(/(?:^|\D)(\d{1,2})[.\/](\d{1,2})(?:\D|$)/);
  if (m && refYear) return { date: `${refYear}-${pad(m[1])}-${pad(m[2])}`, source: `제목 + ${publishAt ? "발행" : "생성"}연도` };
  if (ref) return { date: ref.slice(0, 10), source: publishAt ? "발행일시" : "생성일시" };
  throw new Error("파일명 날짜를 결정할 수 없습니다. --date YYYY-MM-DD 로 지정하세요.");
}

/** YAML 스칼라 (gray-matter/js-yaml 출력 형식과 호환: 필요할 때만 single-quote) */
function yamlScalar(v) {
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  const s = String(v);
  const plain =
    /^[A-Za-z_\u0080-\uFFFF][A-Za-z0-9_\u0080-\uFFFF-]*$/u.test(s) &&
    !/^(true|false|null|yes|no|on|off)$/i.test(s);
  return plain ? s : `'${s.replace(/'/g, "''")}'`;
}

/** frontmatter + 본문 직렬화 (gray-matter matter.stringify 대체) */
function stringifyWithFrontmatter(content, data) {
  const lines = [];
  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) {
      lines.push(`${k}:`);
      for (const item of v) lines.push(`  - ${yamlScalar(item)}`);
    } else {
      lines.push(`${k}: ${yamlScalar(v)}`);
    }
  }
  const body = content.endsWith("\n") ? content : content + "\n";
  return `---\n${lines.join("\n")}\n---\n${body}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.url)
    throw new Error(
      "사용법: node pull.mjs <note-url> [--date YYYY-MM-DD] [--force] [--out path] [--dir path]",
    );

  const cfg = getConfig();
  const client = new NoteClient(requireSessionCookie(cfg));
  const key = extractKey(args.url);

  // 발행 글은 draft=false, 초안은 draft=true. 발행 우선 시도.
  let note = await client.getNote(key, { draft: false });
  if (!note.body) note = await client.getNote(key, { draft: true });

  const { markdown, warnings } = noteHtmlToMd(note.body ?? "");
  const { date, source } = resolveDate(args, note.name, note.publishAt, note.createdAt);

  const outPath = args.out
    ? resolve(args.out)
    : join(args.dir ? resolve(args.dir) : DEFAULT_DIARY_DIR, `${date}.md`);

  if (existsSync(outPath) && !args.force) {
    throw new Error(`이미 존재: ${outPath}\n덮어쓰려면 --force, 다른 이름은 --out 사용.`);
  }

  const frontmatter = {
    title: note.name ?? key,
    note_id: note.id,
    note_key: note.key,
    status: note.status,
    ...(note.tags.length ? { tags: note.tags } : {}),
    source_url: args.url,
    ...(note.publishAt ? { published_at: note.publishAt } : {}),
    pulled_at: new Date().toISOString(),
  };

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, stringifyWithFrontmatter("\n" + markdown, frontmatter));

  console.log(`✅ 저장 완료: ${outPath}`);
  console.log(`   제목: ${note.name}  (status=${note.status})`);
  console.log(`   날짜: ${date} (출처: ${source})`);
  if (note.tags.length) console.log(`   태그: ${note.tags.join(", ")}`);
  if (warnings.length) console.log(`⚠ 변환 경고:\n   - ${warnings.join("\n   - ")}`);
}

main().catch((e) => {
  console.error(`❌ ${e.message}`);
  process.exit(1);
});
