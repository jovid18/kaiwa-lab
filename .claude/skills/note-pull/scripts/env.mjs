/**
 * .env 로더 (dotenv 대체) + 경로 상수. 의존성 없음.
 * .env 위치: 스킬 디렉토리(.claude/skills/note-pull/.env) — .gitignore로 제외됨.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
export const SKILL_DIR = dirname(SCRIPTS_DIR); // .claude/skills/note-pull
export const REPO_ROOT = resolve(SKILL_DIR, "../../.."); // kaiwa-lab
export const ENV_PATH = join(SKILL_DIR, ".env");
export const DEFAULT_DIARY_DIR = join(REPO_ROOT, "diary");

/** .env 파일을 읽어 KEY=VALUE 객체로 반환 (없으면 빈 객체) */
export function readEnvFile() {
  if (!existsSync(ENV_PATH)) return {};
  const out = {};
  for (const line of readFileSync(ENV_PATH, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
  return out;
}

export function getConfig() {
  const env = { ...readEnvFile(), ...process.env };
  return {
    sessionCookie: env.NOTE_SESSION_V5?.trim() ?? "",
    chromeProfile: env.NOTE_CHROME_PROFILE?.trim() ?? "",
  };
}

/** 쿠키가 없으면 안내 메시지와 함께 throw */
export function requireSessionCookie(cfg) {
  if (!cfg.sessionCookie) {
    throw new Error(
      "NOTE_SESSION_V5 쿠키가 없습니다. `node .claude/skills/note-pull/scripts/refresh-cookie.mjs`로 Chrome에서 추출하거나 .env에 직접 넣으세요.",
    );
  }
  return cfg.sessionCookie;
}
