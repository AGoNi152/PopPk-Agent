from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import List

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

@dataclass
class Chunk:
    source: str
    text: str

class SimpleRAG:
    def __init__(self, knowledge_dir: str = "data/knowledge_base") -> None:
        self.knowledge_dir = Path(__file__).parent / knowledge_dir
        self.chunks: List[Chunk] = []
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.matrix = None
        self.load()

    def load(self) -> None:
        texts = []
        chunks: List[Chunk] = []
        if self.knowledge_dir.exists():
            for path in sorted(self.knowledge_dir.glob("*.md")):
                raw = path.read_text(encoding="utf-8")
                for chunk in split_text(raw, max_chars=1400):
                    chunks.append(Chunk(source=path.name, text=chunk))
                    texts.append(chunk)
        self.chunks = chunks
        self.matrix = self.vectorizer.fit_transform(texts) if texts else None

    def retrieve(self, query: str, k: int = 6) -> str:
        if not self.chunks or self.matrix is None or not query.strip():
            return ""
        query_vector = self.vectorizer.transform([query])
        scores = cosine_similarity(query_vector, self.matrix).flatten()
        ranked = scores.argsort()[::-1][:k]
        results = []
        for index in ranked:
            if scores[index] <= 0:
                continue
            chunk = self.chunks[int(index)]
            results.append(f"Source: {chunk.source}\n{chunk.text}")
        return "\n\n".join(results)

def split_text(text: str, max_chars: int = 1400) -> list[str]:
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks = []
    current = ""
    for paragraph in paragraphs:
        if len(current) + len(paragraph) + 2 <= max_chars:
            current = f"{current}\n\n{paragraph}".strip()
        else:
            if current:
                chunks.append(current)
            current = paragraph[:max_chars]
    if current:
        chunks.append(current)
    return chunks
