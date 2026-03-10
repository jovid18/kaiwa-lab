---
name: commit
description: 오늘 날짜 기반 자동 번호 매기기 커밋 후 push한다. (예: 2025-03-08-01)
user-invocable: true
---

# 날짜 기반 커밋 & Push

## 규칙

### 1단계: README 링크 동기화
1. `media/`, `sjpt/`, `sudden/` 폴더의 `.md` 파일 목록을 각각 조회한다.
2. `README.md`의 `## media`, `## sjpt`, `## sudden` 섹션 아래에 파일별 링크를 추가한다.
3. 링크 형식: `- [YYYY-MM-DD](media/YYYY-MM-DD.md)` (날짜순 정렬)
4. 이미 링크가 있는 파일은 스킵하고, 새 파일만 기존 목록 아래에 추가한다.
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
