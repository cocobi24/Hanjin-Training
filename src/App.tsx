import "./App.scss";

const scenarios = [
  {
    number: "01",
    title: "보고서 작성 자동화",
    desc: "HR 데이터와 수기 데이터를 비교·검증해 초과근로 보고서 초안을 자동 생성합니다.",
    agent: "OvertimeReportAgent",
    tags: ["HR", "근태", "보고서"],
  },
  {
    number: "02",
    title: "이메일 작성 자동화",
    desc: "엑셀에서 데이터를 추출하고 메일 초안과 일정을 생성합니다.",
    agent: "MailDraftAgent",
    tags: ["협업", "커뮤니케이션", "메일"],
  },
  {
    number: "03",
    title: "KPI 분석 자동화",
    desc: "지점별 KPI를 분석해 미달 지점을 탐지하고 시각화 리포트와 공지사항 초안을 생성합니다.",
    agent: "KpiAnalysisAgent",
    tags: ["KPI", "CXI", "Google Chat"],
  },
];

function App() {
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
          <article key={s.number} className="scenario-card">
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
            <div className="scenario-card__agent">
              <code>{s.agent}</code>
            </div>
          </article>
        ))}
      </section>

      <footer className="app__footer">
        <p>Gemini와 함께 시나리오를 진행하세요.</p>
      </footer>
    </main>
  );
}

export default App;
