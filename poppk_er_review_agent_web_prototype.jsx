import React, { useMemo, useState } from "react";

const sampleText = `Population PK analysis indicated that body weight was a statistically significant covariate on clearance. However, no dose adjustment is recommended across all body weight groups. Exposure-response analysis showed no clear relationship between exposure and efficacy or safety. Simulations were conducted for the proposed 1200 mg Q3W regimen and suggested adequate exposure in the overall population.`;

const reviewTypes = [
  "Full package review",
  "PopPK report review",
  "Exposure-response review",
  "Dose justification review",
  "Simulation review",
  "Regulatory Q&A review",
];

const issueData = [
  {
    severity: "Critical",
    title: "Dose conclusion may be stronger than the evidence supports",
    detail:
      "The text states that no dose adjustment is needed across all body-weight groups, but it does not show exposure distributions by body-weight category or whether high-weight patients remain within the clinically relevant exposure range.",
    action:
      "Add body-weight stratified simulations and compare predicted exposure with the observed exposure range supporting efficacy and safety.",
  },
  {
    severity: "Major",
    title: "Covariate effect is not translated into clinical relevance",
    detail:
      "Body weight is identified as a statistically significant covariate on clearance, but the magnitude of exposure reduction and its clinical meaning are not described.",
    action:
      "Report median and 5th/95th percentile exposure by body-weight group and discuss whether differences are clinically meaningful.",
  },
  {
    severity: "Major",
    title: "Exposure-response conclusion is underdeveloped",
    detail:
      "The statement that no clear exposure-response relationship was observed may be acceptable, but the endpoint, exposure metric, model type, covariates, and event counts are not specified.",
    action:
      "Clarify whether Cmax, AUC, or Ctrough was used; describe the ER model and provide uncertainty intervals.",
  },
  {
    severity: "Minor",
    title: "Simulation design lacks target-population detail",
    detail:
      "The simulated population is not described. It is unclear whether demographics, disease status, albumin, renal/hepatic function, and body-weight distribution match the intended target population.",
    action:
      "Add a simulation design table listing covariate distributions, number of simulated subjects, dose regimens, and uncertainty propagation.",
  },
];

const checklist = [
  { item: "Data source and analysis set", status: "Missing detail" },
  { item: "Structural model summary", status: "Partial" },
  { item: "Covariate model", status: "Partial" },
  { item: "Model diagnostics / VPC", status: "Not shown" },
  { item: "Exposure metrics", status: "Not specified" },
  { item: "ER efficacy analysis", status: "Partial" },
  { item: "ER safety analysis", status: "Partial" },
  { item: "Simulation assumptions", status: "Partial" },
  { item: "Dose justification", status: "Overstated" },
  { item: "Regulatory Q&A readiness", status: "Needs work" },
];

const regQuestions = [
  "How do you justify no dose adjustment in high body-weight patients given the effect of body weight on clearance?",
  "Which exposure metric was used for exposure-response analysis, and why was it selected?",
  "Were simulated exposures within the observed exposure range from clinical studies?",
  "How was parameter uncertainty propagated into dose simulations?",
  "What evidence supports the claim that exposure differences are not clinically meaningful?",
];

const suggestedText = `Although body weight was identified as a covariate on clearance, the clinical relevance of this effect should be interpreted using model-based exposure simulations across body-weight categories. To support a no-dose-adjustment conclusion, predicted exposure distributions in high-body-weight patients should be shown to remain within the observed exposure range associated with clinical benefit and acceptable safety. If exposure in patients above the upper bound of the observed body-weight distribution is extrapolated, this limitation should be explicitly acknowledged.`;

const badgeToneClasses = {
  critical: "bg-red-100 text-red-700 border-red-200",
  major: "bg-orange-100 text-orange-700 border-orange-200",
  minor: "bg-blue-100 text-blue-700 border-blue-200",
  ready: "bg-green-100 text-green-700 border-green-200",
  default: "bg-slate-100 text-slate-700 border-slate-200",
};

const iconMap = {
  shield: "◇",
  upload: "↑",
  clipboard: "▤",
  alert: "!",
  check: "✓",
  help: "?",
  file: "§",
  flask: "⚗",
  wand: "✦",
  test: "T",
};

function Badge({ children, tone = "default" }) {
  const toneClass = badgeToneClasses[tone] || badgeToneClasses.default;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${toneClass}`}>
      {children}
    </span>
  );
}

function IconMark({ type }) {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full text-sm font-bold text-slate-700">
      {iconMap[type] || "•"}
    </span>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="rounded-2xl bg-slate-100 p-2">
        <IconMark type={icon} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[2rem] border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function Button({ children, variant = "solid", disabled = false, onClick, className = "" }) {
  const variantClass =
    variant === "outline"
      ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      : "border border-slate-900 bg-slate-900 text-white hover:bg-slate-800";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition ${variantClass} ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

function getIssueTone(severity) {
  if (severity === "Critical") return "critical";
  if (severity === "Major") return "major";
  if (severity === "Minor") return "minor";
  return "default";
}

function getReadiness(wordCount) {
  if (wordCount < 20) return "Input too short for full review";
  if (wordCount < 50) return "Preliminary review only";
  return "Major revision needed";
}

function countWords(value) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function runSelfTests() {
  const tests = [
    {
      name: "Empty input returns zero words",
      pass: countWords("   ") === 0,
    },
    {
      name: "Short input readiness is guarded",
      pass: getReadiness(0) === "Input too short for full review",
    },
    {
      name: "Medium input readiness is preliminary",
      pass: getReadiness(25) === "Preliminary review only",
    },
    {
      name: "Long input readiness requests major revision",
      pass: getReadiness(60) === "Major revision needed",
    },
    {
      name: "Critical issue maps to critical tone",
      pass: getIssueTone("Critical") === "critical",
    },
    {
      name: "Unknown issue severity maps to default tone",
      pass: getIssueTone("Unknown") === "default",
    },
  ];

  return tests;
}

export default function PopPKReviewAgentPrototype() {
  const [text, setText] = useState(sampleText);
  const [reviewType, setReviewType] = useState(reviewTypes[0]);
  const [hasRun, setHasRun] = useState(true);

  const wordCount = useMemo(() => countWords(text), [text]);
  const readiness = useMemo(() => getReadiness(wordCount), [wordCount]);
  const tests = useMemo(() => runSelfTests(), []);
  const passedTests = tests.filter((test) => test.pass).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
                <IconMark type="shield" />
                Clinical Pharmacology / Pharmacometrics Review Agent
              </div>
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
                PopPK/ER Evidence Review Agent
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                Upload or paste PopPK/ER reports, dose justification text, simulation summaries, or regulatory Q&A drafts. The agent reviews scientific completeness, internal consistency, overstatement risk, and likely regulatory questions.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone="ready">Reviewer-style output</Badge>
                <Badge>Not a model builder</Badge>
                <Badge>Not a dose decision tool</Badge>
              </div>
            </div>
            <Card className="bg-slate-50 shadow-none">
              <CardContent className="p-5">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Hard constraint</h3>
                <p className="text-sm leading-6 text-slate-700">
                  This agent must behave as a cautious senior reviewer. It should identify gaps, uncertainty, over-extrapolation, and regulatory risk. It must not claim to refit models, validate final dose selection, or replace qualified clinical pharmacology judgment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardContent className="p-6">
              <SectionTitle icon="upload" title="Input materials" subtitle="Prototype mode: paste text to preview the review workflow." />

              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="review-type">
                Review type
              </label>
              <select
                id="review-type"
                value={reviewType}
                onChange={(event) => setReviewType(event.target.value)}
                className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-slate-400"
              >
                {reviewTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="report-text">
                Report / justification text
              </label>
              <textarea
                id="report-text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                className="min-h-[280px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 outline-none focus:border-slate-400"
                placeholder="Paste PopPK report, ER analysis, dose justification, simulation summary, or regulatory Q&A draft here..."
              />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">Approx. {wordCount} words</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => setText(sampleText)}>
                    Load sample
                  </Button>
                  <Button onClick={() => setHasRun(true)} disabled={wordCount === 0}>
                    <span className="mr-2"><IconMark type="wand" /></span> Run review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <SectionTitle icon="clipboard" title="Review output" subtitle="This is the expected product experience before connecting the backend LLM." />

              {!hasRun ? (
                <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                  Paste material and run review to see output.
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-3xl border border-orange-200 bg-orange-50 p-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-orange-900">Decision-readiness rating</h3>
                      <Badge tone="major">{readiness}</Badge>
                    </div>
                    <p className="text-sm leading-6 text-orange-900/80">
                      The current {reviewType.toLowerCase()} may support further discussion, but it is not yet strong enough for a confident no-dose-adjustment conclusion. The main gap is the translation of statistically significant covariate effects into clinically interpretable exposure and outcome evidence.
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-3xl border border-red-100 bg-red-50 p-4">
                      <p className="text-2xl font-bold text-red-700">1</p>
                      <p className="text-xs font-medium text-red-700">Critical</p>
                    </div>
                    <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4">
                      <p className="text-2xl font-bold text-orange-700">2</p>
                      <p className="text-xs font-medium text-orange-700">Major</p>
                    </div>
                    <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-2xl font-bold text-blue-700">1</p>
                      <p className="text-xs font-medium text-blue-700">Minor</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-2xl font-bold text-slate-700">5</p>
                      <p className="text-xs font-medium text-slate-700">Reg questions</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {hasRun ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <SectionTitle icon="alert" title="Issue tracker" subtitle="Severity, rationale, and recommended action." />
                <div className="space-y-4">
                  {issueData.map((issue) => (
                    <div key={issue.title} className="rounded-3xl border border-slate-200 p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge tone={getIssueTone(issue.severity)}>{issue.severity}</Badge>
                        <h3 className="font-semibold text-slate-950">{issue.title}</h3>
                      </div>
                      <p className="mb-3 text-sm leading-6 text-slate-600">{issue.detail}</p>
                      <div className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                        <span className="font-semibold">Recommended action: </span>
                        {issue.action}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <SectionTitle icon="check" title="Completeness checklist" subtitle="Prototype checklist for PopPK/ER package readiness." />
                  <div className="overflow-hidden rounded-3xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <tbody>
                        {checklist.map((row, index) => (
                          <tr key={row.item} className={index !== checklist.length - 1 ? "border-b border-slate-100" : ""}>
                            <td className="p-3 font-medium text-slate-700">{row.item}</td>
                            <td className="p-3 text-slate-500">{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <SectionTitle icon="help" title="Potential regulatory questions" subtitle="Questions likely to be raised by FDA/EMA/NMPA-style reviewers." />
                  <ol className="space-y-3">
                    {regQuestions.map((question, index) => (
                      <li key={question} className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-500 shadow-sm">
                          {index + 1}
                        </span>
                        {question}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}

        {hasRun ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <Card>
              <CardContent className="p-6">
                <SectionTitle icon="file" title="Suggested regulatory-style language" subtitle="Draft language users can adapt after expert review." />
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  {suggestedText}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <SectionTitle icon="flask" title="Beginner explanation" subtitle="Designed for users who are not PopPK experts." />
                <p className="text-sm leading-7 text-slate-600">
                  A statistically significant covariate does not automatically require dose adjustment. The key question is whether the exposure change is clinically meaningful. For body weight, the reviewer expects to see predicted exposure by weight group and whether high-weight patients still fall within the exposure range associated with benefit and acceptable safety.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <div className="mt-6">
          <Card>
            <CardContent className="p-6">
              <SectionTitle icon="test" title="Self-tests" subtitle="Basic runtime checks for helper logic in this prototype." />
              <div className="mb-3 flex items-center gap-2">
                <Badge tone={passedTests === tests.length ? "ready" : "critical"}>
                  {passedTests}/{tests.length} passed
                </Badge>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {tests.map((test) => (
                  <div key={test.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-700">{test.name}</span>
                    <span className={test.pass ? "font-semibold text-green-700" : "font-semibold text-red-700"}>
                      {test.pass ? "PASS" : "FAIL"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
