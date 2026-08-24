from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Application Config
    PROJECT_NAME: str = "SybilGuard Real-Time Sentinel"
    VERSION: str = "1.0.0"
    
    # Anomaly Detection Settings
    ISOLATION_FOREST_ESTIMATORS: int = 100
    CONTAMINATION_RATE: float = 0.05  # Assume 5% of traffic is the abuse ring
    BATCH_WINDOW_SIZE: int = 50       # Number of requests to analyze in a batch
    
    # Mitigation & Financial Metric Settings
    FALSE_POSITIVE_COST_INR: int = 2500  # Penalty for blocking a real transaction
    FRAUD_SAVINGS_INR: int = 1500        # Money saved by blocking a BIN attack
    
    class Config:
        env_file = ".env"

settings = Settings()