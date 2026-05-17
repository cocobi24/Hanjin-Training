# Hanjin Training

React + TypeScript + SCSS + Zustand + Vite 보일러플레이트

## 기술 스택

- **React 19** — UI 라이브러리
- **TypeScript** — 정적 타입
- **SCSS (Sass)** — 스타일링
- **Zustand** — 경량 전역 상태 관리
- **Vite** — 빌드 도구

## 프로젝트 구조

```
src/
├── App.tsx              # 루트 컴포넌트
├── App.scss
├── main.tsx             # 엔트리 포인트
└── styles/
    ├── _variables.scss  # SCSS 변수
    └── index.scss       # 글로벌 스타일
```

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 경로 별칭

`@/` 는 `src/` 디렉터리를 가리킵니다.

```ts
import App from '@/App'
import '@/styles/index.scss'
```
