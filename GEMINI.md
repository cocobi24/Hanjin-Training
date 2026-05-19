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

## 참가자에게

Gemini CLI에서 자연어로 요청하면 됩니다. 예시:

```
파일 업로드 후 Gemini에게 분석을 요청하는 Agent 컴포넌트를 만들어줘.
callGemini 함수를 사용하고, 로딩 상태와 오류 메시지를 화면에 표시해줘.
```
