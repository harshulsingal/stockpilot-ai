from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "StockPilot AI"

    OPENAI_API_KEY: str
    NEWS_API_KEY: str
    SECRET_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env"
    )


settings = Settings()