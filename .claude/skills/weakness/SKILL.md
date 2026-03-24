---
name: weakness
description: 약점 현황을 조회한다. 전체 현황 또는 특정 유형(grammar, vocabulary, expression)을 확인할 수 있다.
argument-hint: [grammar|vocabulary|expression]
user-invocable: true
---

# 약점 현황 조회

입력: `$ARGUMENTS`

## 동작 흐름

1. `weakness/index.md`를 읽어 전체 현황을 파악한다.
2. `$ARGUMENTS`가 비어 있으면 `index.md`의 전체 현황 테이블을 터미널에 표시한다.
3. `$ARGUMENTS`가 `grammar`, `vocabulary`, `expression` 중 하나이면 해당 상세 파일을 읽어 터미널에 표시한다.
4. 각 패턴의 상태를 현재 날짜 기준으로 재계산하여 표시한다.

## 상태 기준

- 🔴 반복중: 5회 이상
- 🟡 주의: 2~4회
- 🟢 개선됨: 최근 5일간 해당 패턴 미발생

## 규칙

1. 데이터를 수정하지 않는다. 읽기 전용이다.
2. 출력은 한국어로 한다.
3. 상태가 변경되어야 할 항목이 있으면 알려준다 (예: "조건형 선택 오류는 최근 5일 무발생으로 🟢 개선됨으로 변경 가능").
