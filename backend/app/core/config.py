from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    COHERE_API_KEY:str
    SUPABASE_URL:str
    SUPABASE_KEY:str
    mode_config=SettingsConfigDict(env_file=".env", env_file_encoding="utf-8"
                                   )
settings=Settings()


