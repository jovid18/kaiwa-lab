# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

일본어 회화 학습용 개인 리포지토리. 코드 없이 마크다운 파일과 Claude Code 스킬로 운영된다.

## Repository Structure

- `media/` — 미디어(드라마·영상 등) 학습 노트 (날짜별 `.md`)
- `sjpt/` — SJPT(Speaking Japanese Proficiency Test) 학습 노트 (날짜별 `.md`)
- `sudden/` — 순간작문(한→일 번역) 연습 노트 (날짜별 `.md`)
- `weakness/` — 약점 추적 시스템
  - `index.md` — 전체 약점 현황 대시보드 (횟수·상태·최근 발생)
  - `grammar.md`, `vocabulary.md`, `expression.md` — 카테고리별 상세 기록
- `review/` — 약점 복습 시스템 (라운드 로빈 방식, `session.html`로 출제)

## Key Workflows (Slash Commands)

| 커맨드                         | 설명                                                              |
| ------------------------------ | ----------------------------------------------------------------- |
| `/today <media\|sjpt\|sudden>` | 오늘 날짜 학습 노트 생성/추가                                     |
| `/add-sudden`                  | sudden 노트에 한글 문장 추가 (일본어는 비워둠)                    |
| `/translate`                   | sudden 노트의 한→일 번역 피드백 + 활용형 분해 + weakness 업데이트 |
| `/feedback <한글> \| <일본어>` | sjpt 답변 피드백 (diff + 코멘트) + weakness 업데이트              |
| `/word <테이블>`               | 단어 테이블 빈 칸 채워서 오늘 노트에 기록                         |
| `/analyze <일본어>`            | 문장 한글 뜻 추가 + 활용형 변형 분해                              |
| `/weakness [유형]`             | 약점 현황 조회 (읽기 전용)                                        |
| `/review [유형]`               | 약점 패턴별 복습 HTML 생성 → 결과 반영                            |
| `/tip <파일> <주제>`           | 학습 팁 정리하여 파일에 추가                                      |
| `/commit`                      | 날짜 기반 자동 번호 커밋 + README 링크 동기화 + push              |

## Weakness Tracking System

피드백 스킬(`/translate`, `/feedback`)은 수정 사항 발생 시 반드시 `weakness/` 파일을 업데이트한다.

**패턴 분류:**

- 문법: 조사 누락/오용, 동사 활용형 오류, ~ている 누락, 가능형, ~なくて vs ~ないで/ず, 조건형 선택, 기타
- 어휘: 유사어 혼동, 카타카나 표기, 구어↔문어 혼용, 한자 표기
- 표현: 경어 수준, 문말/종조사, 문체 불일치, 접속사

**상태 기준:** 🔴 5회+ · 🟡 2~4회 · 🟢 최근 5일 무발생

**복습 시스템 (라운드 로빈):**

- 각 패턴 헤더에 `연속통과`(0~3)와 `다음복습`(날짜 또는 빈 값) 메타데이터 관리
- 테이블 상위 5개 행을 출제 → 맞히면 맨 아래로, 틀리면 제자리
- 3회 연속 통과 시 졸업 → `<details>` 섹션으로 이동
- 새 오류는 테이블 맨 위에 추가 (최우선 복습 대상)

## Conventions

- 학습 노트 파일명: `YYYY-MM-DD.md`
- 커밋 메시지: `YYYY-MM-DD-NN` (날짜 + 자동 번호)
- 코멘트·설명은 한국어로 작성. 일본어는 `「」`로 감싼 짧은 인용만 허용
- 변형 분해는 `>` blockquote 형식, 첫 줄(원형)에만 후리가나 표기
- `/word`의 한글 뜻에 괄호 부가 설명을 넣지 않는다
