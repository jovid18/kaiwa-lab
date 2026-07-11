---
name: commit
description: 오늘 날짜 기반 자동 번호 매기기 커밋 후 push한다. (예: 2025-03-08-01)
user-invocable: true
---

# 날짜 기반 커밋 & Push

## 규칙

### 1단계: README 링크 동기화

1. `sjpt/`, `sudden/`, `media/`, `diary/` 폴더의 `.md` 파일 목록을 각각 조회한다.
2. `README.md`의 통합 표를 업데이트한다. 표 구조:
   ```
   | 날짜 | sjpt | sudden | media | diary |
   |---|---|---|---|---|
   | MM-DD | [✓](sjpt/YYYY-MM-DD.md) | [✓](sudden/YYYY-MM-DD.md) | [✓](media/YYYY-MM-DD.md) | [✓](https://note.com/jovid_18/n/<note_key>) |
   ```
3. 각 행은 하나의 날짜. 열은 폴더별로 해당 파일이 있으면 `[✓](폴더/YYYY-MM-DD.md)` 링크, 없으면 빈 칸.
   - **diary 열은 예외**: 로컬 md 대신 note.com 블로그 링크를 건다. 파일 frontmatter의 `note_key`로
     `https://note.com/jovid_18/n/<note_key>` URL을 구성한다. `note_key`가 없으면 로컬 md 링크로 폴백.
4. 날짜순 정렬. 새 날짜는 해당 위치에 행을 삽입하고, 기존 행에 새 파일이 추가된 경우 해당 셀만 채운다.
5. 변경이 있으면 `git add README.md`로 스테이징한다.

### 2단계: 커밋 & Push

1. 오늘 날짜를 `YYYY-MM-DD` 형식으로 구한다 (시스템 currentDate 컨텍스트 활용).
2. `git log --oneline`에서 오늘 날짜 패턴(`YYYY-MM-DD-NN`)으로 시작하는 커밋 메시지를 검색한다.
3. 번호 결정:
   - 해당 날짜 커밋이 없으면 → `-01`
   - 있으면 → 마지막 번호 + 1 (예: `-01` 존재 시 `-02`)
4. 모든 변경 사항을 스테이징(`git add -A`)하고, 커밋 메시지를 `YYYY-MM-DD-NN`으로 커밋한다.
5. 커밋 완료 후 `git push`한다.
6. 결과(커밋 메시지, push 상태)를 알려준다.
