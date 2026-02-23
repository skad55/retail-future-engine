from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    DATABASE_URL: str = "sqlite:///./rfe.db"

    JWT_SECRET: str = "change-me-now"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_MINUTES: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()