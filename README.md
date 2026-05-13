# PopPK/ER Evidence Review Agent — Full Product Version

This repository is a full-stack prototype for a clinical pharmacology / pharmacometrics evidence review agent.

It is designed to read PopPK/ER reports, dose justification text, simulation results, and regulatory Q&A drafts, then help users check whether the package is complete, internally consistent, appropriately qualified, and ready for regulatory discussion.

## Product scope

The agent is a cautious reviewer, not a modeling engine.

It can:

- Accept pasted text and uploaded PDF / DOCX / Excel / CSV / TXT / MD files
- Extract text and table previews from uploaded files
- Retrieve internal review knowledge from a small local RAG knowledge base
- Call an OpenAI-compatible LLM API from the backend only
- Return a structured review report
- Export Word and PDF review reports
- Generate regulatory-style questions and suggested wording

It does not:

- Refit NONMEM / nlmixr / mrgsolve models
- Validate final dose decisions
- Replace qualified pharmacometrician or clinical pharmacology judgment
- Guarantee regulatory acceptability

## Repository structure

```txt
poppk_er_full_product/
  frontend/              # Next.js frontend
  backend/               # FastAPI backend
    data/knowledge_base/ # Local RAG source documents
    outputs/             # Generated Word/PDF reports
    uploads/             # Optional upload workspace
  docker-compose.yml
  render.yaml
  README.md
```

## Local development

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env`:

```bash
LLM_API_KEY=your_api_key
LLM_BASE_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4.1-mini
ALLOWED_ORIGINS=http://localhost:3000
APP_BASE_URL=http://localhost:8000
```

Start the backend:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Check:

```bash
curl http://localhost:8000/health
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open:

```txt
http://localhost:3000
```

## DeepSeek configuration

Backend `.env`:

```bash
LLM_API_KEY=your_deepseek_key
LLM_BASE_URL=https://api.deepseek.com/chat/completions
LLM_MODEL=deepseek-chat
ALLOWED_ORIGINS=http://localhost:3000
```

## API endpoints

### `GET /health`

Returns backend health status.

### `POST /api/review`

JSON text-only review.

```json
{
  "reviewType": "Full package review",
  "text": "Population PK analysis..."
}
```

### `POST /api/review-files`

Multipart form-data review with optional uploaded files.

Fields:

- `reviewType`: review type string
- `text`: optional pasted text
- `files`: one or more PDF / DOCX / Excel / CSV / TXT / MD files

### `GET /api/download/{filename}`

Downloads generated Word or PDF reports.

## RAG knowledge base

The backend uses a simple TF-IDF retrieval layer over Markdown files in:

```txt
backend/data/knowledge_base/
```

To add knowledge, add more `.md` files, for example:

- `poppk_er_review_checklist.md`
- `regulatory_questions.md`
- `adc_clinical_pharmacology.md`

Then restart the backend.

## Exported reports

When a review is generated, the backend creates:

- `.docx` report via `python-docx`
- `.pdf` report via `reportlab`

Files are stored in:

```txt
backend/outputs/
```

The frontend displays download links.

## Tests

```bash
cd backend
pytest
```

## GitHub + deployment overview

GitHub stores the code. The frontend and backend need to be deployed to platforms that can run web services.

Recommended simple deployment:

- Frontend: Vercel
- Backend: Render
- Source code: GitHub

GitHub Pages is not suitable for this full product because GitHub Pages only serves static frontend content and cannot run the FastAPI backend.

## Deploy backend to Render

1. Push this repository to GitHub.
2. Go to Render and create a new Web Service.
3. Connect the GitHub repository.
4. Use these settings:

```txt
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

5. Add environment variables:

```txt
LLM_API_KEY=your_api_key
LLM_BASE_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4.1-mini
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
APP_BASE_URL=https://your-render-backend.onrender.com
```

6. Deploy and confirm:

```txt
https://your-render-backend.onrender.com/health
```

## Deploy frontend to Vercel

1. Go to Vercel.
2. Import the GitHub repository.
3. Set the project root to:

```txt
frontend
```

4. Add environment variable:

```txt
NEXT_PUBLIC_API_BASE_URL=https://your-render-backend.onrender.com
```

5. Deploy.

## Important production hardening checklist

Before real use with confidential clinical data:

- Add authentication
- Add user-level access control
- Add file size limits and antivirus scanning
- Add request logging without storing sensitive content
- Add encryption-at-rest for uploaded files and generated reports
- Add automatic deletion of uploaded and generated files
- Add rate limits
- Add audit trails
- Add explicit human expert review disclaimer
- Use a private VPC or enterprise deployment for confidential sponsor materials

## Development notes

The current backend assumes OpenAI-compatible chat completions. For Claude direct API, add a separate `llm_client` branch for Anthropic's Messages API.

The current RAG layer is deliberately simple and local. For production, replace it with a proper vector database such as PostgreSQL pgvector, Chroma, Pinecone, or Weaviate.
