from __future__ import annotations

from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from config import get_settings
from file_parser import combine_materials, extract_text_from_upload
from review_service import generate_review

settings = get_settings()
app = FastAPI(title="PopPK/ER Evidence Review Agent API", version="1.0.0")

origins = [origin.strip() for origin in settings.allowed_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = Path(__file__).parent / "outputs"

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

@app.post("/api/review")
async def review_json(request: Request):
    data = await request.json()
    text = data.get("text", "")
    review_type = data.get("reviewType", "Full package review")
    if not isinstance(text, str) or not text.strip():
        raise HTTPException(status_code=400, detail="Missing review text.")
    try:
        return await generate_review(review_type, text, export_docx=True, export_pdf=True)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

@app.post("/api/review-files")
async def review_files(
    reviewType: str = Form("Full package review"),
    text: str = Form(""),
    files: Optional[List[UploadFile]] = File(None),
):
    extracted = []
    for file in files or []:
        extracted.append(await extract_text_from_upload(file))
    material = combine_materials(text, extracted)
    if not material:
        raise HTTPException(status_code=400, detail="No text or files were provided.")
    try:
        result = await generate_review(reviewType, material, export_docx=True, export_pdf=True)
        result["inputSummary"] = {
            "pastedTextChars": len(text or ""),
            "fileCount": len(files or []),
            "materialChars": len(material),
        }
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

@app.get("/api/download/{filename}")
def download_file(filename: str):
    path = OUTPUT_DIR / filename
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=404, detail="File not found.")
    return FileResponse(path, filename=filename)
