from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentRequest(BaseModel):
    transaction_id: str
    card_bin: str
    amount: float
    currency: str = "INR"

class TelemetryMetadata(BaseModel):
    ip_address: str
    asn: str
    user_agent: str
    timestamp: datetime
    # We will calculate jitter in the feature extractor, 
    # but the raw timestamp is critical here.

class IncomingTraffic(BaseModel):
    payment_payload: PaymentRequest
    network_telemetry: TelemetryMetadata

class AnomalyResult(BaseModel):
    transaction_id: str
    is_anomalous: bool
    anomaly_score: float
    mitigation_action: str  # e.g., "ALLOW", "BLOCK_IP", "CHALLENGE_3DS"