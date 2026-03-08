---
name: sync-readme
description: media, sjpt 폴더의 파일 목록을 README.md에 바로가기 링크로 동기화한다.
user-invocable: true
---

# README 링크 동기화

## 규칙

1. `media/`, `sjpt/` 폴더의 `.md` 파일 목록을 각각 조회한다.
2. `README.md`의 `## media`, `## sjpt` 섹션 아래에 파일별 링크를 추가한다.
3. 링크 형식: `- [YYYY-MM-DD](media/YYYY-MM-DD.md)` (날짜순 정렬)
4. 이미 링크가 있는 파일은 스킵하고, 새 파일만 기존 목록 아래에 추가한다.
5. 완료 후 변경 사항을 알려준다.
