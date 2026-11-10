"""Central place for all settings.

Values come from environment variables (or a local `.env` file), so the same
code runs on your laptop and on a server without edits.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ATHLETEX AI API"
    app_version: str = "0.1.0"
    environment: str = "development"  # development | testing | production
    api_prefix: str = "/api/v1"

    # Origins (websites) allowed to call this API from a browser.
    # In .env write it as a JSON list: ["http://localhost:3000"]
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    """Create Settings once and reuse it (reading the .env file is not free)."""
    return Settings()
