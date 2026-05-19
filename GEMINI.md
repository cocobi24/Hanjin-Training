# Hanjin Training — Gemini CLI 컨텍스트

이 파일은 Gemini CLI(`gemini` 명령어)가 프로젝트를 이해하는 데 사용됩니다.
새 터미널에서 `gemini`를 실행하면 이 파일을 자동으로 읽어 프로젝트 맥락을 파악합니다.

## 프로젝트 개요

한진 바이브 코딩 교육용 React 보일러플레이트입니다.
참가자가 Gemini CLI와 대화하며 업무 자동화 Agent 컴포넌트를 직접 만드는 실습에 사용합니다.

## 기술 스택

- React 19 + TypeScript + SCSS (Sass) + Zustand + Vite
- SCSS 변수: `src/styles/_variables.scss`
- 경로 별칭: `@/` → `src/`
- Gemini API 헬퍼: `src/lib/gemini.ts` — `callGemini`, `analyzeWithGemini` 함수 제공
- Google 연동 헬퍼: `src/lib/google.ts` — `getGoogleAccessToken`, `sendGmail`, `createCalendarEvent`, `sendGoogleChat` 함수 제공

## Gemini API 사용 규칙

- API 키는 `import.meta.env.VITE_GEMINI_API_KEY` 로 참조 (절대 하드코딩 금지)
- API 호출은 `src/lib/gemini.ts` 의 `callGemini` / `analyzeWithGemini` 함수를 통해 사용
- 모든 컴포넌트는 `src/components/` 하위에 폴더 단위로 생성
- SCSS는 BEM 방식으로 작성하고, `_variables.scss` 의 변수를 우선 사용

## Google 연동 사용 규칙

- Gmail 발송 · Calendar 생성: `src/lib/google.ts` 의 `getGoogleAccessToken` → `sendGmail` / `createCalendarEvent` 순서로 호출
- Google Chat 발송: `sendGoogleChat(message)` 한 줄로 호출 (OAuth 불필요, Webhook 방식)
- Client ID · Webhook URL은 `.env.local` 에서만 참조 (절대 하드코딩 금지)

## 파일 구조 규칙

```
src/
├── components/          # UI 컴포넌트 (폴더 단위)
│   └── MyAgent/
│       ├── index.tsx
│       └── index.scss
├── lib/
│   ├── gemini.ts        # Gemini API 헬퍼 (수정 금지)
│   └── google.ts        # Google 연동 헬퍼 (수정 금지)
└── styles/
    ├── _variables.scss  # SCSS 변수
    └── index.scss       # 글로벌 스타일
```

## 코드 스타일

- 컴포넌트: 함수형, named export
- 상태 관리: 로컬 상태는 `useState`, 전역은 Zustand
- 비동기: async/await, 오류는 try/catch로 처리하고 사용자에게 메시지 표시
- 주석: 최소화, 비명확한 로직에만 작성

## 실습 데이터

`data/` 폴더에 시나리오별 실습 파일이 있습니다. Agent를 테스트할 때 아래 파일을 사용하세요.

### 시나리오 01 — 근태 검증 보고서 자동화

| 파일 | 설명 |
| --- | --- |
| `data/시나리오_01_HR데이터.csv` | HR 시스템 퇴근 기록 (715행, 2026년 4월, jeju_1~jeju_24) |
| `data/시나리오_01_수기데이터.csv` | 현업 수기 승인 종업시간 기록 (738행, 31개 시트 통합) |

두 파일을 **성명** 기준으로 대조해 HR 퇴근시간과 수기 승인_종업 시간의 차이를 찾습니다.

- HR 주요 컬럼: `근무일`, `사번`, `성명`, `직급`, `퇴근시간`, `기준퇴근시간`, `근태`, `비고`
- 수기 주요 컬럼: `날짜`, `성명`, `정상근무_시업`, `정상근무_종업`, `승인_시업`, `승인_종업`, `비고`

### 시나리오 02 — 이메일 작성 자동화

| 파일 | 설명 |
| --- | --- |
| `data/시나리오_02_견적서_우양정공.json` | 우양정공㈜ 견적서 (18억원, VAT 별도, 납기 55일) |
| `data/시나리오_02_견적서_보우시스템.json` | 보우시스템 견적서 (19억원, VAT 별도, 납기 2개월) |

Gemini에게 두 JSON 파일을 읽혀 **비교 요약표 → 메일 초안 → 회의 일정**을 생성합니다.

- 핵심 비교 항목: `합계금액`, `네고가`, `납기`, `결재조건`, `견적유효기간`, `성능보증`, `특기사항`
- 메일 목적 예시: 두 견적 비교 후 우선 협력사 선정 결재 요청

### 시나리오 03 — KPI 분석 자동화

| 파일 | 설명 |
| --- | --- |
| `data/시나리오_03_예정시간내완료율.csv` | 집배점별 배송 예정시간내 완료율 (706행) |
| `data/시나리오_03_비대면배송사진전송률.csv` | 집배점별 비대면 사진 전송률 (706행) |
| `data/시나리오_03_물류배송현황.csv` | 개별 운송장 배송 상태 (55행) |

세 파일을 조합해 **KPI 미달 집배점 목록 → Google Chat 공지 초안**을 생성합니다.

- 완료율 미달 기준: 90% 미만 (기본값, 변경 가능)
- 주요 컬럼: `택배지점`, `집배점`, `배송 예정 시간내 완료율`, `전송률`

---

## 참가자에게

Gemini CLI에서 자연어로 요청하면 됩니다. 예시:

```
파일 업로드 후 Gemini에게 분석을 요청하는 Agent 컴포넌트를 만들어줘.
callGemini 함수를 사용하고, 로딩 상태와 오류 메시지를 화면에 표시해줘.
```
