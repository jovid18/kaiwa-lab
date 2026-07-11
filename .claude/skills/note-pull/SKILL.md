---
name: note-pull
description: >-
  note.com 일기 URL을 받아 diary/YYYY-MM-DD.md로 내려받는다. 사용자가 note 링크
  (https://note.com/.../n/<key> 또는 editor.note.com/notes/<key>/edit)를 주면서
  "pull", "가져와", "내려받아", "저장" 등을 말하거나, 링크만 던질 때 사용.
  교정 후 note 웹에서 수동 수정한 최종본을 다시 받을 때(재pull)도 이 스킬을 쓴다.
---

# note-pull

note.com에 쓴 일본어 일기를 URL로 받아 `diary/YYYY-MM-DD.md`로 내려받는다.
형제 디렉토리 `../note_mcp`의 pull 스크립트를 호출하는 것이 전부다 — 직접 fetch하거나 HTML을 손으로 변환하지 말 것.

> 전제: `../note_mcp`가 형제 디렉토리로 존재하고, `.env`에 유효한 note 세션 쿠키가 있어야 한다.

## 절차

1. 사용자 메시지에서 note URL(또는 `n`으로 시작하는 key)을 뽑는다. `?app_launch=...` 같은
   쿼리는 붙어 있어도 됨 — 스크립트가 알아서 key를 추출한다.

2. 실행:

   ```bash
   (cd ../note_mcp && npm run pull -- "<url>" --dir ../kaiwa-lab/diary)
   ```

   - **재pull**(사용자가 note 웹에서 수정을 마치고 최종본을 다시 받는 경우): 같은 명령에 `--force`를 붙여 덮어쓴다.
   - 기존 파일이 있는데 `--force` 없이 실행하면 스크립트가 에러로 막는다 → 재pull 맥락이 맞는지 확인 후 `--force`.

3. **날짜 출처 검증.** 출력의 `날짜: ... (출처: ...)`를 확인한다. note 글 제목을 `YYYY-MM-DD`로
   쓰는 것이 이 워크플로우의 단일 진실원이므로, **출처가 "제목"이 아니면** 제목이 형식에 어긋난 것이다 —
   사용자에게 올바른 날짜를 물어 `--date YYYY-MM-DD`를 추가해 다시 실행하고(`--dir`은 유지),
   note 쪽 제목도 `YYYY-MM-DD`로 고치도록 안내한다.

4. 실행 결과(저장 경로, 제목, 날짜, `⚠ 변환 경고`)를 사용자에게 요약해 보고한다.
   경고가 있으면(임베드/미지원 블록 등) 해당 부분은 note 원문과 대조가 필요할 수 있음을 알린다.

## 전체 워크플로우에서의 위치

```
1. 사용자가 note.com에 일기 작성 (제목: YYYY-MM-DD)
2. /note-pull   ← 최초 pull
3. /note-proofread  → 교정 제안을 diff로 확인
4. 사용자가 note 웹 에디터에서 직접 수정
5. /note-pull --force  ← 최종본 재pull
6. /commit
```

diary는 **pull 전용**이다. note로 되올리는(`note_push`) 흐름은 이 리포에서 다루지 않는다.

## 실패 대응

- `401/403` 또는 인증 오류: 쿠키 만료. `(cd ../note_mcp && npm run refresh-cookie)` 안내 (macOS 전용, Chrome에서 note 로그인 상태여야 함).
- `500`: 존재하지 않거나 접근 불가한 note key. URL을 다시 확인.
- `note key를 URL에서 찾지 못했습니다`: URL 형식이 다름 → key(`n...`)만 뽑아 전달.
