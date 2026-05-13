"use client";

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

const fallbackReview = {
  readiness: "Major revision needed",
  executiveSummary: "The package may support further discussion, but it is not yet strong enough for a confident no-dose-adjustment conclusion. The main gap is the translation of statistically significant covariate effects into clinically interpretable exposure and outcome evidence.",
  issues: [
    { severity: "Critical", title: "Dose conclusion may be stronger than the evidence supports", detail: "The text states that no dose adjustment is needed across all body-weight groups, but it does not show exposure distributions by body-weight category or whether high-weight patients remain within the clinically relevant exposure range.", action: "Add body-weight stratified simulations and compare predicted exposure with the observed exposure range supporting efficacy and safety." },
    { severity: "Major", title: "Covariate effect is not translated into clinical relevance", detail: "Body weight is identified as a statistically significant covariate on clearance, but the magnitude of exposure reduction and its clinical meaning are not described.", action: "Report median and 5th/95th percentile exposure by body-weight group and discuss whether differences are clinically meaningful." },
  ],
  checklist: [
    { item: "Data source and analysis set", status: "Missing detail" },
    { item: "Structural model summary", status: "Partial" },
    { item: "Covariate model", status: "Partial" },
    { item: "Model diagnostics / VPC", status: "Not shown" },
  ],
  regulatoryQuestions: [
    "How do you justify no dose adjustment in high body-weight patients given the effect of body weight on clearance?",
    "Which exposure metric was used for exposure-response analysis, and why was it selected?",
  ],
  additionalAnalyses: [
    "Provide body-weight stratified exposure simulations with median and 5th/95th percentiles.",
    "Overlay simulated exposure distributions with observed exposure ranges supporting efficacy and safety.",
  ],
  suggestedLanguage: "Although body weight was identified as a covariate on clearance, the clinical relevance of this effect should be interpreted using model-based exposure simulations across body-weight categories.",
  beginnerExplanation: "A statistically significant covariate does not automatically require dose adjustment. The key question is whether the exposure change is clinically meaningful.",
};

const iconMap = { shield: "◇", upload: "↑", clipboard: "▤", alert: "!", check: "✓", help: "?", file: "§", flask: "⚗", wand: "✦", list: "≡", lock: "●", download: "↓" };
const badgeToneClasses = { critical: "bg-red-100 text-red-700 border-red-200", major: "bg-orange-100 text-orange-700 border-orange-200", minor: "bg-blue-100 text-blue-700 border-blue-200", ready: "bg-green-100 text-green-700 border-green-200", default: "bg-slate-100 text-slate-700 border-slate-200" };

function Badge({ children, tone = "default" }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${badgeToneClasses[tone] || badgeToneClasses.default}`}>{children}</span>;
}

function IconMark({ type }) {
  return <span className="flex h-5 w-5 items-center justify-center rounded-full text-sm font-bold text-slate-700">{iconMap[type] || "•"}</span>;
}

function SectionTitle({ icon, title, subtitle }) {
  return <div className="mb-4 flex items-start gap-3"><div className="rounded-2xl bg-slate-100 p-2"><IconMark type={icon} /></div><div><h2 className="text-lg font-semibold text-slate-950">{title}</h2>{subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}</div></div>;
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[2rem] border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function Button({ children, variant = "solid", disabled = false, onClick, className = "" }) {
  const variantClass = variant === "outline" ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : "border border-slate-900 bg-slate-900 text-white hover:bg-slate-800";
  return <button type="button" onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition ${variantClass} ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}>{children}</button>;
}

function getIssueTone(severity) {
  if (severity === "Critical") return "critical";
  if (severity === "Major") return "major";
  if (severity === "Minor") return "minor";
  return "default";
}

function countWords(value) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function normalizeReview(value) {
  const safe = value && typeof value === "object" ? value : {};
  return {
    readiness: typeof safe.readiness === "string" ? safe.readiness : fallbackReview.readiness,
    executiveSummary: typeof safe.executiveSummary === "string" ? safe.executiveSummary : fallbackReview.executiveSummary,
    issues: Array.isArray(safe.issues) && safe.issues.length ? safe.issues : fallbackReview.issues,
    checklist: Array.isArray(safe.checklist) && safe.checklist.length ? safe.checklist : fallbackReview.checklist,
    regulatoryQuestions: Array.isArray(safe.regulatoryQuestions) && safe.regulatoryQuestions.length ? safe.regulatoryQuestions : fallbackReview.regulatoryQuestions,
    additionalAnalyses: Array.isArray(safe.additionalAnalyses) && safe.additionalAnalyses.length ? safe.additionalAnalyses : fallbackReview.additionalAnalyses,
    suggestedLanguage: typeof safe.suggestedLanguage === "string" ? safe.suggestedLanguage : fallbackReview.suggestedLanguage,
    beginnerExplanation: typeof safe.beginnerExplanation === "string" ? safe.beginnerExplanation : fallbackReview.beginnerExplanation,
  };
}

function countIssues(issues, severity) {
  return issues.filter((issue) => issue.severity === severity).length;
}

const API_BASE_URL = "https://hangup-shrunk-fanfare.ngrok-free.dev";

function makeDownloadUrl(filename) {
  return `${API_BASE_URL}/api/download/${filename}`;
}

export default function Home() {
  const [text, setText] = useState(sampleText);
  const [reviewType, setReviewType] = useState(reviewTypes[0]);
  const [files, setFiles] = useState([]);
  const [review, setReview] = useState(fallbackReview);
  const [exports, setExports] = useState({});
  const [inputSummary, setInputSummary] = useState(null);
  const [source, setSource] = useState("Demo fallback");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  const wordCount = useMemo(() => countWords(text), [text]);
  const criticalCount = countIssues(review.issues, "Critical");
  const majorCount = countIssues(review.issues, "Major");
  const minorCount = countIssues(review.issues, "Minor");

  async function runReview() {
    setHasRun(true);
    setError("");
    setIsLoading(true);
    setExports({});
    setInputSummary(null);
    try {
      const form = new FormData();
      form.append("reviewType", reviewType);
      form.append("text", text);
      files.forEach((file) => form.append("files", file));
      const response = await fetch(`${API_BASE_URL}/api/review-files`, { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.detail || data?.error || `Backend request failed with status ${response.status}`);
      setReview(normalizeReview(data.review || data));
      setExports(data.exports || {});
      setInputSummary(data.inputSummary || null);
      setSource("FastAPI backend with RAG and export");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown backend error");
      setReview(fallbackReview);
      setSource("Demo fallback after backend error");
    } finally {
      setIsLoading(false);
    }
  }

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 text-slate-900 md:p-8"><div className="mx-auto max-w-7xl">
    <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"><div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8"><div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600"><IconMark type="shield" />Clinical Pharmacology / Pharmacometrics Review Agent</div><h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">PopPK/ER Evidence Review Agent</h1><p className="max-w-3xl text-base leading-7 text-slate-600 md:text-lg">Upload PDF, Word, Excel, CSV, or paste PopPK/ER text. The FastAPI backend extracts material, retrieves review knowledge, calls your server-side LLM API, and exports Word/PDF reports.</p><div className="mt-5 flex flex-wrap gap-2"><Badge tone="ready">FastAPI backend</Badge><Badge>File parsing</Badge><Badge>RAG knowledge base</Badge><Badge>Word/PDF export</Badge></div></div><Card className="bg-slate-50 shadow-none"><CardContent className="p-5"><h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Security model</h3><p className="text-sm leading-6 text-slate-700">The browser never receives your LLM API key. The frontend calls the FastAPI backend, and the backend reads API keys from server-side environment variables.</p></CardContent></Card></div></div>
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"><Card><CardContent className="p-6"><SectionTitle icon="upload" title="Input materials" subtitle="Paste text and/or upload files for review." /><label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="review-type">Review type</label><select id="review-type" value={reviewType} onChange={(event) => setReviewType(event.target.value)} className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400">{reviewTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select><label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="files">Upload PDF / Word / Excel / CSV</label><input id="files" type="file" multiple accept=".pdf,.docx,.xlsx,.xls,.csv,.txt,.md" onChange={(event) => setFiles(Array.from(event.target.files || []))} className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />{files.length ? <div className="mb-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">{files.length} file(s) selected: {files.map((file) => file.name).join(", ")}</div> : null}<label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="report-text">Optional pasted text</label><textarea id="report-text" value={text} onChange={(event) => setText(event.target.value)} className="min-h-[320px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 outline-none focus:border-slate-400" placeholder="Paste PopPK report, ER analysis, dose justification, simulation summary, or regulatory Q&A draft here..." /><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500">Approx. {wordCount} pasted words</p><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setText(sampleText)}>Load sample</Button><Button onClick={runReview} disabled={(wordCount === 0 && files.length === 0) || isLoading}><span className="mr-2"><IconMark type="wand" /></span>{isLoading ? "Reviewing..." : "Run review"}</Button></div></div></CardContent></Card>
    <div className="space-y-6"><Card><CardContent className="p-6"><SectionTitle icon="clipboard" title="Review output" subtitle={`Source: ${source}`} />{error ? <div className="mb-4 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">Backend error: {error}. Showing fallback demo result.</div> : null}{!hasRun ? <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">Upload material and run review to see output.</div> : <div className="space-y-5"><div className="rounded-3xl border border-orange-200 bg-orange-50 p-5"><div className="mb-2 flex items-center justify-between gap-3"><h3 className="font-semibold text-orange-900">Decision-readiness rating</h3><Badge tone="major">{review.readiness}</Badge></div><p className="text-sm leading-6 text-orange-900/80">{review.executiveSummary}</p></div><div className="grid gap-3 md:grid-cols-4"><div className="rounded-3xl border border-red-100 bg-red-50 p-4"><p className="text-2xl font-bold text-red-700">{criticalCount}</p><p className="text-xs font-medium text-red-700">Critical</p></div><div className="rounded-3xl border border-orange-100 bg-orange-50 p-4"><p className="text-2xl font-bold text-orange-700">{majorCount}</p><p className="text-xs font-medium text-orange-700">Major</p></div><div className="rounded-3xl border border-blue-100 bg-blue-50 p-4"><p className="text-2xl font-bold text-blue-700">{minorCount}</p><p className="text-xs font-medium text-blue-700">Minor</p></div><div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><p className="text-2xl font-bold text-slate-700">{review.regulatoryQuestions.length}</p><p className="text-xs font-medium text-slate-700">Reg questions</p></div></div>{exports.docx || exports.pdf ? <div className="flex flex-wrap gap-2">{exports.docx ? <a className="inline-flex items-center rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white" href={makeDownloadUrl(exports.docx)} target="_blank"><span className="mr-2"><IconMark type="download" /></span>Download Word</a> : null}{exports.pdf ? <a className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700" href={makeDownloadUrl(exports.pdf)} target="_blank"><span className="mr-2"><IconMark type="download" /></span>Download PDF</a> : null}</div> : null}</div>}</CardContent></Card></div></div>
    {hasRun ? <div className="mt-6 grid gap-6 xl:grid-cols-2"><Card><CardContent className="p-6"><SectionTitle icon="alert" title="Issue tracker" subtitle="Severity, rationale, and recommended action." /><div className="space-y-4">{review.issues.map((issue, index) => <div key={`${issue.title}-${index}`} className="rounded-3xl border border-slate-200 p-4"><div className="mb-2 flex flex-wrap items-center gap-2"><Badge tone={getIssueTone(issue.severity)}>{issue.severity || "Issue"}</Badge><h3 className="font-semibold text-slate-950">{issue.title}</h3></div><p className="mb-3 text-sm leading-6 text-slate-600">{issue.detail}</p><div className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700"><span className="font-semibold">Recommended action: </span>{issue.action}</div></div>)}</div></CardContent></Card><div className="space-y-6"><Card><CardContent className="p-6"><SectionTitle icon="check" title="Completeness checklist" subtitle="PopPK/ER package readiness." /><div className="overflow-hidden rounded-3xl border border-slate-200"><table className="w-full text-left text-sm"><tbody>{review.checklist.map((row, index) => <tr key={`${row.item}-${index}`} className={index !== review.checklist.length - 1 ? "border-b border-slate-100" : ""}><td className="p-3 font-medium text-slate-700">{row.item}</td><td className="p-3 text-slate-500">{row.status}</td></tr>)}</tbody></table></div></CardContent></Card><Card><CardContent className="p-6"><SectionTitle icon="help" title="Potential regulatory questions" subtitle="Likely FDA/EMA/NMPA-style questions." /><ol className="space-y-3">{review.regulatoryQuestions.map((question, index) => <li key={`${question}-${index}`} className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-500 shadow-sm">{index + 1}</span>{question}</li>)}</ol></CardContent></Card><Card><CardContent className="p-6"><SectionTitle icon="list" title="Recommended additional analyses" subtitle="Analyses that could strengthen the evidence package." /><ul className="space-y-3">{review.additionalAnalyses.map((item, index) => <li key={`${item}-${index}`} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></CardContent></Card></div></div> : null}
    {hasRun ? <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]"><Card><CardContent className="p-6"><SectionTitle icon="file" title="Suggested regulatory-style language" subtitle="Draft language users can adapt after expert review." /><div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">{review.suggestedLanguage}</div></CardContent></Card><Card><CardContent className="p-6"><SectionTitle icon="flask" title="Beginner explanation" subtitle="Designed for users who are not PopPK experts." /><p className="text-sm leading-7 text-slate-600">{review.beginnerExplanation}</p></CardContent></Card></div> : null}
  </div></div>;
}
