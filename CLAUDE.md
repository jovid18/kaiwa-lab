# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

일본어 회화 학습용 개인 리포지토리. 마크다운 파일과 Claude Code 스킬로 운영된다.
유일한 코드는 note.com pull용 내장 스크립트(`.claude/skills/note-pull/scripts/`, 의존성 없는 순수 Node)뿐이다.

## Repository Structure

- `media/` — 미디어(드라마·영상 등) 학습 노트 (날짜별 `.md`)
- `sjpt/` — SJPT(Speaking Japanese Proficiency Test) 학습 노트 (날짜별 `.md`)
- `sudden/` — 순간작문(한→일 번역) 연습 노트 (날짜별 `.md`)
- `diary/` — note.com에 쓴 일본어 일기 (날짜별 `.md`, pull 전용 — `/today` 대상 아님)

## Key Workflows (Slash Commands)

| 커맨드                         | 설명                                                 |
| ------------------------------ | ---------------------------------------------------- |
| `/today <media\|sjpt\|sudden>` | 오늘 날짜 학습 노트 생성/추가                        |
| `/add-sudden`                  | sudden 노트에 한글 문장 추가 (일본어는 비워둠)       |
| `/translate`                   | sudden 노트의 한→일 번역 피드백 + 활용형 분해        |
| `/feedback <한글> \| <일본어>` | sjpt 답변 피드백 (diff + 코멘트)                     |
| `/word <테이블>`               | 단어 테이블 빈 칸 채워서 오늘 노트에 기록            |
| `/analyze <일본어>`            | 문장 한글 뜻 추가 + 활용형 변형 분해                 |
| `/tip <파일> <주제>`           | 학습 팁 정리하여 파일에 추가                         |
| `/note-pull <URL>`             | note.com 일기를 `diary/`로 내려받기 (재pull은 --force) |
| `/note-proofread`              | pull한 일기 교정 제안 (stage 원본 vs working tree diff) |
| `/commit`                      | 날짜 기반 자동 번호 커밋 + README 링크 동기화 + push |

## Diary Workflow

일기는 note.com이 원본이고 이 리포는 **pull 전용 아카이브**다 (note로 되올리지 않는다):

1. 사용자가 note.com에 일기 작성 — **제목을 `YYYY-MM-DD`로** (파일명 날짜의 단일 진실원)
2. `/note-pull <URL>` — 리포 내장 pull 스크립트로 `diary/YYYY-MM-DD.md` 생성
3. `/note-proofread` — 교정 제안을 git diff로 제시
4. 사용자가 note 웹 에디터에서 직접 수정
5. `/note-pull <URL>` 재실행(`--force`) — 최종본으로 덮어쓰기
6. `/commit`

## Conventions

- 학습 노트 파일명: `YYYY-MM-DD.md`
- 커밋 메시지: `YYYY-MM-DD-NN` (날짜 + 자동 번호)
- 코멘트·설명은 한국어로 작성. 일본어는 `「」`로 감싼 짧은 인용만 허용
- 변형 분해는 `>` blockquote 형식, 첫 줄(원형)에만 후리가나 표기
- `/word`의 한글 뜻에 괄호 부가 설명을 넣지 않는다
