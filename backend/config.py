from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    llm_api_key: str = ""
    llm_base_url: str = "https://api.openai.com/v1/chat/completions"
    llm_model: str = "gpt-4.1-mini"
    allowed_origins: str = "http://localhost:3000"
    max_upload_mb: int = 20
    app_base_url: str = "http://localhost:8000"

    class Config:
        env_file = ".env"
        env_prefix = ""
        extra = "ignore"

@lru_cache
def get_settings() -> Settings:
    return Settings()
