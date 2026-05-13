from __future__ import annotations

from typing import Any

from exporters import create_docx, create_pdf
from llm_client import call_llm
from prompts import build_review_prompt
from rag import SimpleRAG

FALLBACK_REVIEW = {
    "readiness": "Major revision needed",
    "executiveSummary": "The evidence package can be discussed, but it is not yet strong enough for a confident regulatory-facing conclusion. Key gaps include incomplete model evidence, underdeveloped simulation assumptions, and possible overstatement of dose conclusions.",
    "issues": [
        {"severity": "Major", "title": "Evidence chain is incomplete", "detail": "The submitted material does not fully connect model assumptions, exposure metrics, exposure-response findings, and dose decision language.", "action": "Add a clear evidence-chain summary linking PopPK, ER, simulation, and benefit-risk interpretation."},
        {"severity": "Major", "title": "Regulatory uncertainty is under-described", "detail": "The package does not clearly distinguish supported conclusions from extrapolations or assumptions.", "action": "Add a limitations section and specify where additional simulations or sensitivity analyses are needed."},
    ],
    "checklist": [
        {"item": "PopPK model evidence", "status": "Partial"},
        {"item": "ER rationale", "status": "Partial"},
        {"item": "Simulation design", "status": "Partial"},
        {"item": "Dose justification", "status": "Overstated"},
    ],
    "regulatoryQuestions": [
        "What evidence supports the proposed dose in the target population?",
        "Were simulations conducted within the observed clinical exposure range?",
        "Which exposure metric was selected and why?",
    ],
    "additionalAnalyses": [
        "Provide exposure simulations by clinically relevant subgroup.",
        "Add observed-versus-simulated exposure overlap plots.",
        "Add sensitivity analyses for key ER conclusions.",
    ],
    "suggestedLanguage": "The current model-informed evidence supports further discussion of the proposed dose; however, the conclusion should be qualified by the available exposure range, simulation assumptions, and uncertainty in subgroup extrapolation.",
    "beginnerExplanation": "The agent checks whether the report has enough evidence to support the dose conclusion. It does not rerun the model or decide the final dose.",
}

def normalize_review(review: dict[str, Any]) -> dict[str, Any]:
    safe = review if isinstance(review, dict) else {}
    return {
        "readiness": safe.get("readiness") or FALLBACK_REVIEW["readiness"],
        "executiveSummary": safe.get("executiveSummary") or FALLBACK_REVIEW["executiveSummary"],
        "issues": safe.get("issues") if isinstance(safe.get("issues"), list) and safe.get("issues") else FALLBACK_REVIEW["issues"],
        "checklist": safe.get("checklist") if isinstance(safe.get("checklist"), list) and safe.get("checklist") else FALLBACK_REVIEW["checklist"],
        "regulatoryQuestions": safe.get("regulatoryQuestions") if isinstance(safe.get("regulatoryQuestions"), list) and safe.get("regulatoryQuestions") else FALLBACK_REVIEW["regulatoryQuestions"],
        "additionalAnalyses": safe.get("additionalAnalyses") if isinstance(safe.get("additionalAnalyses"), list) and safe.get("additionalAnalyses") else FALLBACK_REVIEW["additionalAnalyses"],
        "suggestedLanguage": safe.get("suggestedLanguage") or FALLBACK_REVIEW["suggestedLanguage"],
        "beginnerExplanation": safe.get("beginnerExplanation") or FALLBACK_REVIEW["beginnerExplanation"],
    }

async def generate_review(review_type: str, material: str, export_docx: bool = True, export_pdf: bool = True) -> dict[str, Any]:
    rag = SimpleRAG()
    context = rag.retrieve(f"{review_type}\n{material[:3000]}")
    prompt = build_review_prompt(review_type, material, context)
    raw_review = await call_llm(prompt)
    review = normalize_review(raw_review)
    exports = {}
    if export_docx:
        exports["docx"] = create_docx(review)
    if export_pdf:
        exports["pdf"] = create_pdf(review)
    return {"review": review, "exports": exports, "ragContextUsed": bool(context)}
