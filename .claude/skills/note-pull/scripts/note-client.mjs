/**
 * note 비공식 API 래퍼 (읽기 전용 슬림판 — note_mcp/src/note-client.ts에서 pull에 필요한 부분만 포팅).
 * 핵심: X-Requested-With: XMLHttpRequest 헤더 필수.
 */

const API_BASE = "https://note.com/api";
const ORIGIN = "https://editor.note.com";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36";

export class NoteApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "NoteApiError";
    this.status = status;
    this.body = body;
  }
}

export class NoteClient {
  constructor(sessionCookie) {
    this.sessionCookie = sessionCookie;
  }

  headers(extra = {}) {
    return {
      Cookie: `_note_session_v5=${this.sessionCookie}`,
      "User-Agent": UA,
      Accept: "application/json",
      Origin: ORIGIN,
      Referer: `${ORIGIN}/`,
      "X-Requested-With": "XMLHttpRequest",
      ...extra,
    };
  }

  async request(method, path) {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, { method, headers: this.headers() });
    const text = await res.text();

    if (!res.ok) {
      const hint =
        res.status === 401 || res.status === 403
          ? " (쿠키 만료 가능 — refresh-cookie.mjs 시도)"
          : "";
      throw new NoteApiError(
        `note API ${method} ${path} → ${res.status}${hint}`,
        res.status,
        text.slice(0, 500),
      );
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  /** 인증 확인 + 현재 유저 */
  async currentUser() {
    const json = await this.request("GET", "/v2/current_user");
    const d = json.data;
    return {
      id: d.id,
      key: d.key,
      nickname: d.nickname,
      urlname: d.urlname,
      noteCount: d.note_count,
    };
  }

  /** 노트 조회 (초안 포함). 발행 노트는 draft=false 로 조회. */
  async getNote(key, opts = {}) {
    const draft = opts.draft ?? true;
    const ts = Date.now();
    const json = await this.request(
      "GET",
      `/v3/notes/${key}?draft=${draft}&draft_reedit=false&ts=${ts}`,
    );
    const d = json.data;
    const tags = Array.isArray(d.hashtag_notes)
      ? d.hashtag_notes
          .map((h) => String(h?.hashtag?.name ?? "").replace(/^#/, "").trim())
          .filter(Boolean)
      : [];
    return {
      id: d.id,
      key: d.key,
      name: d.name,
      status: d.status,
      body: d.body,
      publishAt: d.publish_at ?? null,
      createdAt: d.created_at ?? null,
      tags,
    };
  }
}
