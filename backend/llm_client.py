from __future__ import annotations

import json
import re
from typing import Any

import httpx

from config import get_settings
from prompts import SYSTEM_PROMPT

def extract_json(text: str) -> str:
    trimmed = text.strip()
    if trimmed.startswith("{") and trimmed.endswith("}"):
        return trimmed
    match = re.search(r"\{[\s\S]*\}", trimmed)
    return match.group(0) if match else ""

async def call_llm(prompt: str) -> dict[str, Any]:
    settings = get_settings()
    if not settings.llm_api_key:
        raise RuntimeError("Missing LLM_API_KEY on the server.")

    payload = {
        "model": settings.llm_model,
        "temperature": 0.1,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    }

    async with httpx.AsyncClient(timeout=90) as client:
        response = await client.post(
            settings.llm_base_url,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {settings.llm_api_key}",
            },
            json=payload,
        )

    try:
        data = response.json()
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"LLM returned non-JSON response with status {response.status_code}.") from exc

    if response.status_code >= 400:
        message = data.get("error", {}).get("message") if isinstance(data.get("error"), dict) else data.get("error")
        raise RuntimeError(message or f"LLM request failed with status {response.status_code}.")

    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    json_text = extract_json(content)
    if not json_text:
        raise RuntimeError("LLM did not return valid JSON.")
    return json.loads(json_text)
