import { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./App.scss";
import Scenario01 from "./components/Scenario01";
import Scenario02 from "./components/Scenario02";
import Scenario03 from "./components/Scenario03";

interface Step {
  label: string;
  goal: string;
  tip: string;
}

interface Scenario {
  id: string;
  number: string;
  title: string;
  desc: string;
  tags: string[];
  steps: Step[];
}

const scenarios: Scenario[] = [
  {
    id: "01",
    number: "01",
    title: "보고서 작성 자동화",
    desc: "HR 데이터와 수기 데이터를 비교·검증해 초과근로 보고서 초안을 자동 생성합니다.",
    tags: ["HR", "근태", "보고서"],
    steps: [
      {
        label: "M1 · Agent 화면 만들기",
        goal: "Agent가 어떤 일을 하는지 설명하는 첫 화면을 만듭니다.",
        tip: '예시: "HR 시스템 데이터와 수기 입력 데이터를 비교해 초과근로 보고서를 만들어주는 Agent 화면을 만들어줘. 파일 업로드 영역 2개와 결과 출력 영역을 포함해줘."',
      },
      {
        label: "M2 · 파일 업로드 추가",
        goal: "파일을 올리면 파일명이 표시되고, 두 파일이 모두 있어야 분석 버튼이 활성화됩니다.",
        tip: '예시: "파일 두 개를 업로드하는 기능을 추가해줘. 두 파일이 모두 선택돼야 분석 시작 버튼이 활성화되게 해줘."',
      },
      {
        label: "M3 · 로직 구현",
        goal: "분석 시작 버튼을 누르면 Gemini가 두 파일을 비교해 불일치 목록과 보고서 초안을 작성합니다.",
        tip: '예시: "분석 시작 버튼을 누르면 Gemini에게 두 파일을 비교 분석해달라고 요청하고, 결과를 불일치 목록과 보고서 초안으로 나눠서 보여줘."',
      },
      {
        label: "M4 · 진행 단계 시각화",
        goal: "파일 읽기 → 데이터 대조 → 이상 탐지 → 보고서 생성, 4단계가 순서대로 표시됩니다.",
        tip: '예시: "분석 과정을 4단계로 나눠서 단계별로 체크 아이콘이 채워지는 진행 표시를 추가해줘."',
      },
      {
        label: "M4-B · Agent 사고 과정 표시",
        goal: "각 단계에서 Agent가 어떤 판단을 하는지 실시간 로그로 보여줍니다.",
        tip: '예시: "각 단계마다 Agent가 지금 뭘 하고 있는지 짧은 설명이 로그처럼 아래로 쌓이게 해줘. 자동 스크롤도 넣어줘."',
      },
      {
        label: "M5 · 담당자 검토 단계",
        goal: "보고서 초안은 담당자 확인 후에만 복사할 수 있습니다.",
        tip: '예시: "보고서 아래에 검토 완료 버튼을 추가해줘. 누르기 전엔 주황색 경고 배너, 누른 후엔 초록색으로 바뀌고 복사 버튼이 나타나게 해줘."',
      },
    ],
  },
  {
    id: "02",
    number: "02",
    title: "이메일 작성 자동화",
    desc: "파일을 업로드하면 핵심 정보를 추출해 메일 초안과 회의 일정 제안을 자동 생성합니다.",
    tags: ["협업", "커뮤니케이션", "메일"],
    steps: [
      {
        label: "M1 · Agent 화면 만들기",
        goal: "파일 업로드, 수신자·목적 입력, 결과 출력 영역이 있는 첫 화면을 만듭니다.",
        tip: '예시: "PDF나 엑셀을 올리면 메일 초안과 회의 일정을 만들어주는 Agent 화면을 만들어줘. 파일 업로드, 수신자 이름 입력, 메일 목적 선택, 결과 영역 3개를 포함해줘."',
      },
      {
        label: "M2 · 파일 업로드와 옵션 입력",
        goal: "여러 파일을 올리고 수신자 이름, 메일 목적을 선택할 수 있습니다.",
        tip: '예시: "파일을 여러 개 올리면 태그로 목록이 표시되게 해줘. 수신자 이름 입력과 메일 목적 선택(자료 공유 / 협조 요청 / 결재 요청) 기능도 추가해줘."',
      },
      {
        label: "M3 · 로직 구현",
        goal: "Agent 실행 버튼을 누르면 Gemini가 파일을 분석해 요약표, 메일 초안, 일정 제안을 작성합니다.",
        tip: '예시: "Agent 실행 버튼을 누르면 Gemini에게 파일을 분석하고 요약표, 메일 초안, 회의 일정 3가지를 만들어달라고 요청해줘. 메일 목적에 따라 톤이 달라지게 해줘."',
      },
      {
        label: "M4 · 진행 단계 시각화",
        goal: "파일 분석 → 요약표 생성 → 메일 초안 작성 → 일정 제안, 4단계가 탭과 함께 표시됩니다.",
        tip: '예시: "분석 과정을 4단계 인디케이터로 보여주고, 결과를 요약표 / 메일 초안 / 일정 제안 탭으로 나눠줘."',
      },
      {
        label: "M4-B · Agent 사고 과정 표시",
        goal: "각 단계에서 Agent의 판단 과정이 실시간 로그로 표시됩니다.",
        tip: '예시: "각 단계마다 Agent가 어떤 작업을 하는지 로그가 쌓이게 해줘. 메일 목적에 따라 3단계 로그 내용이 달라지면 더 좋아."',
      },
      {
        label: "M5 · Gmail 발송 & 일정 등록",
        goal: "담당자 승인 후 실제로 Gmail을 발송하고 Google Calendar에 일정을 만듭니다.",
        tip: '예시: "메일 초안 탭에 수신자 이메일 입력 필드와 Gmail 발송 버튼을 추가해줘. 일정 제안 탭에는 3가지 안 중 하나를 선택해서 캘린더에 등록하는 버튼도 넣어줘."',
      },
    ],
  },
  {
    id: "03",
    number: "03",
    title: "KPI 분석 자동화",
    desc: "지점별 KPI를 분석해 미달 지점을 탐지하고 시각화 리포트와 Google Chat 공지를 생성합니다.",
    tags: ["KPI", "CXI", "Google Chat"],
    steps: [
      {
        label: "M1 · Agent 화면 만들기",
        goal: "파일 업로드, 미달 기준 입력, 결과 출력 영역이 있는 첫 화면을 만듭니다.",
        tip: '예시: "KPI 파일을 분석해 미달 지점 목록과 Google Chat 공지를 만들어주는 Agent 화면을 만들어줘. 파일 업로드, 미달 기준 입력, 결과 영역 3개를 포함해줘."',
      },
      {
        label: "M2 · 파일 업로드와 분석 기준 입력",
        goal: "KPI 파일을 올리고 미달 기준 %와 분석 항목을 선택할 수 있습니다.",
        tip: '예시: "KPI 파일 업로드 버튼과 미달 기준 % 입력(기본값 90), 분석 항목 체크박스를 추가해줘."',
      },
      {
        label: "M3 · 로직 구현",
        goal: "Agent 실행 버튼을 누르면 Gemini가 미달 지점 분석, 차트 데이터, 공지 초안을 작성합니다.",
        tip: '예시: "Agent 실행 버튼을 누르면 Gemini에게 KPI 데이터를 분석하고 미달 지점 목록, 차트 데이터, Google Chat 공지 초안을 만들어달라고 요청해줘."',
      },
      {
        label: "M4 · 진행 단계 시각화",
        goal: "데이터 정제 → 달성률 계산 → 미달 탐지 → 공지 생성, 4단계와 탭이 표시됩니다.",
        tip: '예시: "4단계 인디케이터를 추가하고, 결과를 미달 지점 목록 / KPI 차트 / 공지 초안 탭으로 나눠줘. 미달 지점 수를 상단에 배지로 보여줘."',
      },
      {
        label: "M4-B · Agent 사고 과정 표시",
        goal: "각 단계에서 Agent의 분석 기준과 판단이 실시간 로그로 표시됩니다.",
        tip: '예시: "각 단계마다 Agent가 어떤 기준으로 계산하는지 로그가 쌓이게 해줘. 실제 설정한 미달 기준 %가 로그 텍스트에 반영되면 더 좋아."',
      },
      {
        label: "M5 · Google Chat 발송",
        goal: "담당자가 공지 초안을 검토하고 승인하면 Google Chat에 실제로 발송됩니다.",
        tip: '예시: "공지 초안 탭에 내용을 수정할 수 있는 텍스트 박스와 승인 후 Google Chat에 발송하는 버튼을 추가해줘. 발송 성공 시 초록 배너로 바뀌게 해줘."',
      },
    ],
  },
];

/* ── 메인 ── */
function HomePage() {
  const navigate = useNavigate();
  return (
    <main className="app">
      <header className="app__header">
        <p className="app__label">한진 바이브 코딩 실습</p>
        <h1 className="app__title">AI Agent 만들기</h1>
        <p className="app__subtitle">
          Gemini와 대화하며 업무 자동화 Agent를 직접 만들어봅니다.
          <br />
          아래 시나리오 중 하나를 선택해 실습을 시작하세요.
        </p>
      </header>

      <section className="app__scenarios">
        {scenarios.map((s) => (
          <article
            key={s.id}
            className="scenario-card"
            onClick={() => navigate(`/scenario/${s.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && navigate(`/scenario/${s.id}`)
            }
          >
            <span className="scenario-card__number">{s.number}</span>
            <h2 className="scenario-card__title">{s.title}</h2>
            <p className="scenario-card__desc">{s.desc}</p>
            <div className="scenario-card__tags">
              {s.tags.map((tag) => (
                <span key={tag} className="scenario-card__tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="scenario-card__cta">시작하기 →</div>
          </article>
        ))}
      </section>

      <footer className="app__footer">
        <p>Gemini와 함께 시나리오를 진행하세요.</p>
      </footer>
    </main>
  );
}

/* ── 시나리오 소개 페이지 ── */
function ScenarioIntroPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scenario = scenarios.find((s) => s.id === id);

  if (!scenario) return null;

  return (
    <main className="intro-page">
      <button className="intro-page__back" onClick={() => navigate("/")}>
        ← 처음으로
      </button>

      <div className="intro-page__body">
        <span className="intro-page__number">{scenario.number}</span>
        <h1 className="intro-page__title">{scenario.title}</h1>
        <p className="intro-page__desc">{scenario.desc}</p>

        <ul className="intro-page__step-list">
          {scenario.steps.map((step, i) => (
            <li key={i} className="intro-page__step-item">
              <span className="intro-page__step-idx">{i + 1}</span>
              <span className="intro-page__step-label">{step.label}</span>
            </li>
          ))}
        </ul>

        <button
          className="intro-page__start-btn"
          onClick={() => navigate(`/scenario/${id}/practice`)}
        >
          실습 진행하기 →
        </button>
      </div>
    </main>
  );
}

/* ── 실습 가이드 페이지 ── */
function ScenarioGuidePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scenario = scenarios.find((s) => s.id === id);
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!scenario) return null;

  const step = scenario.steps[activeStep];

  function copyTip() {
    navigator.clipboard.writeText(step.tip).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="guide-page">
      {/* 좌측 가이드 패널 */}
      <div className="guide-panel">
        <nav className="guide-nav">
          <button className="guide-nav__back" onClick={() => navigate("/")}>
            ← 처음으로
          </button>
          <div className="guide-nav__title">
            {scenario.number} · {scenario.title}
          </div>
          <ol className="guide-nav__list">
            {scenario.steps.map((s, i) => (
              <li key={i}>
                <button
                  className={`guide-nav__item ${activeStep === i ? "active" : ""}`}
                  onClick={() => {
                    setActiveStep(i);
                    setCopied(false);
                  }}
                >
                  <span className="guide-nav__item-idx">{i + 1}</span>
                  <span className="guide-nav__item-label">{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <main className="guide-content">
          <div className="guide-content__step-badge">
            STEP {activeStep + 1} / {scenario.steps.length}
          </div>
          <h2 className="guide-content__label">{step.label}</h2>
          <p className="guide-content__goal">{step.goal}</p>

          <div className="guide-content__tip-box">
            <p className="guide-content__tip-title">💡 프롬프트 예시</p>
            <p className="guide-content__tip-hint">
              그대로 붙여넣기보다 직접 내 말로 써보세요.
            </p>
            <p className="guide-content__tip-text">{step.tip}</p>
            <button
              className={`guide-content__copy ${copied ? "copied" : ""}`}
              onClick={copyTip}
            >
              {copied ? "✓ 복사됨" : "예시 복사"}
            </button>
          </div>

          <div className="guide-content__nav-btns">
            {activeStep > 0 && (
              <button
                className="guide-content__prev"
                onClick={() => {
                  setActiveStep(activeStep - 1);
                  setCopied(false);
                }}
              >
                ← 이전
              </button>
            )}
            {activeStep < scenario.steps.length - 1 && (
              <button
                className="guide-content__next"
                onClick={() => {
                  setActiveStep(activeStep + 1);
                  setCopied(false);
                }}
              >
                다음 →
              </button>
            )}
          </div>
        </main>
      </div>

      {/* 우측 실습 패널 */}
      <div className="guide-preview">
        <div className="guide-preview__header">
          <span className="guide-preview__label">실습 화면</span>
          <span className="guide-preview__hint">
            Gemini가 만들어주는 화면이 여기에 표시됩니다
          </span>
        </div>
        <div className="guide-preview__content">
          {id === "01" && <Scenario01 />}
          {id === "02" && <Scenario02 />}
          {id === "03" && <Scenario03 />}
        </div>
      </div>
    </div>
  );
}

/* ── 라우터 ── */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scenario/:id" element={<ScenarioIntroPage />} />
      <Route path="/scenario/:id/practice" element={<ScenarioGuidePage />} />
    </Routes>
  );
}
