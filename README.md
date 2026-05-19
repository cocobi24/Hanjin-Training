# Hanjin Training

React + TypeScript + SCSS + Zustand + Vite 바이브 코딩 교육용 보일러플레이트

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. API 키 설정

`.env.example` 파일을 복사해 `.env.local` 을 만들고, 강사가 공유한 키를 붙여넣습니다.

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 키를 입력합니다:

```
VITE_GEMINI_API_KEY=강사가_공유한_키
VITE_GEMINI_MODEL=gemini-2.0-flash
```

### 3. Gemini CLI 설치 (바이브 코딩 도구)

```bash
npm install -g @google/gemini-cli
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 5. Gemini CLI 실행 (바이브 코딩 시작)

프로젝트 폴더에서 실행합니다.

```bash
gemini
```

---

## 바이브 코딩 방법

Gemini CLI를 실행한 뒤 자연어로 요청합니다.

```
파일 업로드 후 Gemini가 내용을 분석해주는 Agent 컴포넌트를 만들어줘.
src/lib/gemini.ts 의 callGemini 함수를 사용하고,
로딩 스피너와 오류 메시지도 화면에 표시해줘.
```

오류가 나면 오류 메시지를 그대로 붙여넣으면 됩니다:

```
이런 오류가 났어: [오류 메시지 붙여넣기]
고쳐줘.
```

---

## 프로젝트 구조

```
src/
├── components/          # 실습 중 만드는 컴포넌트
├── lib/
│   └── gemini.ts        # Gemini API 헬퍼 (callGemini, analyzeWithGemini)
└── styles/
    ├── _variables.scss  # SCSS 변수
    └── index.scss       # 글로벌 스타일
```

## Gemini API 헬퍼 사용법

```typescript
import { callGemini, analyzeWithGemini } from '@/lib/gemini'

// 단순 텍스트 생성
const result = await callGemini('한 줄로 요약해줘: ...')

// 파일 내용 분석
const result = await analyzeWithGemini('초과근로 여부를 판단해줘', fileContent)
```

## 기술 스택

| 항목 | 버전 |
| --- | --- |
| React | 19 |
| TypeScript | 5.8 |
| Vite | 6 |
| SCSS (Sass) | 1.89 |
| Zustand | 5 |

## 경로 별칭

`@/` 는 `src/` 디렉터리를 가리킵니다.

```ts
import { callGemini } from '@/lib/gemini'
import '@/styles/index.scss'
```

## 기타 명령어

```bash
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # 린트 검사
```
