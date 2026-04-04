# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

일본어 회화 학습용 개인 리포지토리. 코드 없이 마크다운 파일과 Claude Code 스킬로 운영된다.

## Repository Structure

- `media/` — 미디어(드라마·영상 등) 학습 노트 (날짜별 `.md`)
- `sjpt/` — SJPT(Speaking Japanese Proficiency Test) 학습 노트 (날짜별 `.md`)
- `sudden/` — 순간작문(한→일 번역) 연습 노트 (날짜별 `.md`)

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
| `/commit`                      | 날짜 기반 자동 번호 커밋 + README 링크 동기화 + push |

## Conventions

- 학습 노트 파일명: `YYYY-MM-DD.md`
- 커밋 메시지: `YYYY-MM-DD-NN` (날짜 + 자동 번호)
- 코멘트·설명은 한국어로 작성. 일본어는 `「」`로 감싼 짧은 인용만 허용
- 변형 분해는 `>` blockquote 형식, 첫 줄(원형)에만 후리가나 표기
- `/word`의 한글 뜻에 괄호 부가 설명을 넣지 않는다
