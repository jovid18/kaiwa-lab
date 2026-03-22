---
name: today
description: 오늘 날짜 기준 학습 노트 MD 파일을 생성한다. media, sjpt 또는 sudden 폴더를 인자로 받는다.
argument-hint: <media|sjpt|sudden>
user-invocable: true
---

# 오늘의 학습 노트 생성

대상 폴더: `$ARGUMENTS`

## 섹션 템플릿

- `media`: `## Content`
  - `## Content` 하위에는 항상 `### word`와 `### expression`을 함께 생성한다.
  - `### word`에만 아래 테이블을 포함한다 (`### expression`에는 테이블 없음):
    ```markdown
    | 일본어 | 발음 | 한글 뜻 |
    | ------ | ---- | ------- |
    |        |      |         |
    ```
- `sjpt`: `## Part`, `## Question`, `## Answer`
  - 최초 생성 시 `## word` 섹션과 단어 테이블을 날짜 헤딩과 첫 `## Part` 사이에 포함한다:
    ```markdown
    | 일본어 | 발음 | 한글 뜻 |
    | ------ | ---- | ------- |
    |        |      |         |
    ```
- `sudden`: `## 한글`, `## 일본어`
  - 최초 생성 시 `## word` 섹션과 단어 테이블을 날짜 헤딩과 첫 `## 한글` 사이에 포함한다:
    ```markdown
    | 일본어 | 발음 | 한글 뜻 |
    | ------ | ---- | ------- |
    |        |      |         |
    ```

## 규칙

1. `$ARGUMENTS`는 반드시 `media`, `sjpt` 또는 `sudden` 중 하나여야 한다. 그 외 값이면 안내 후 중단.
2. 오늘 날짜를 `YYYY-MM-DD` 형식으로 구한다 (시스템 currentDate 컨텍스트 활용).
3. 파일 경로: `$ARGUMENTS/YYYY-MM-DD.md`
4. **파일이 없으면 (최초 생성)**: 날짜 헤딩 + 섹션 템플릿으로 생성한다.
   - media 예시:

     ```markdown
     # YYYY-MM-DD

     ## Content

     ### word

     | 일본어 | 발음 | 한글 뜻 |
     | ------ | ---- | ------- |
     |        |      |         |

     ### expression
     ```

   - sjpt 예시:

     ```markdown
     # YYYY-MM-DD

     ## word

     | 일본어 | 발음 | 한글 뜻 |
     | ------ | ---- | ------- |
     |        |      |         |

     ## Part

     ## Question

     ## Answer
     ```

   - sudden 예시:

     ```markdown
     # YYYY-MM-DD

     ## word

     | 일본어 | 발음 | 한글 뜻 |
     | ------ | ---- | ------- |
     |        |      |         |

     ## 한글

     ## 일본어
     ```

5. **파일이 이미 존재하면**: 파일 끝에 섹션 템플릿만 추가한다 (날짜 헤딩 없이).
   - media 예시: `## Content` (+ `### word`, `### expression` 및 테이블)를 추가
   - sjpt 예시: `## Part`, `## Question`과 `## Answer`를 추가
   - sudden 예시: `## 한글`과 `## 일본어`를 추가
6. 완료 후 경로와 수행한 작업(생성/추가)을 알려준다.
