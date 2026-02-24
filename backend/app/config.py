from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    API_PREFIX: str = "/api"

    # Environment: dev | prod
    ENV: str = Field(default="dev")

    # DB
    DATABASE_URL: str = Field(default="sqlite:///./rfe.db")

    # CORS
    # Example: "http://localhost:3000,http://127.0.0.1:3000"
    CORS_ORIGINS: str = Field(default="http://localhost:3000")

    # JWT
    # In dev: fallback allowed if ENV=dev
    # In prod: must be explicitly set
    JWT_SECRET: str | None = None
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_MINUTES: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"

    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


settings = Settings()

# Hardening: do not allow weak/default secrets in prod
if settings.ENV.lower() != "dev":
    if not settings.JWT_SECRET or settings.JWT_SECRET.strip() in ("change-me-now", "changeme", "secret"):
        raise RuntimeError("JWT_SECRET must be set to a strong value when ENV is not 'dev'.")

# Dev fallback
if settings.ENV.lower() == "dev" and (not settings.JWT_SECRET or settings.JWT_SECRET.strip() == ""):
    settings.JWT_SECRET = "dev-only-unsafe-secret"