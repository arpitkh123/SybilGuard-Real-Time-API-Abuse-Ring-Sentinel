from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import ValidationError
import json
from datetime import datetime

from app.models.schemas import IncomingTraffic, AnomalyResult
from app.ml_engine.feature_extractor import feature_extractor
from app.ml_engine.isolation_forest import anomaly_detector

router = APIRouter()

# --- Connection Manager for UI Dashboards ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass # Ignore broken pipes if a user closes the browser

manager = ConnectionManager()

# --- Endpoint 1: The UI Dashboard ---
@router.websocket("/ws/dashboard")
async def dashboard_stream(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep the connection alive
            await websocket.receive_text() 
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- Endpoint 2: The Traffic Ingestion Engine ---
@router.websocket("/ws/traffic")
async def traffic_stream(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            raw_data = await websocket.receive_text()
            
            try:
                parsed_data = json.loads(raw_data)
                
                if "network_telemetry" in parsed_data and "timestamp" in parsed_data["network_telemetry"]:
                    parsed_data["network_telemetry"]["timestamp"] = datetime.fromisoformat(parsed_data["network_telemetry"]["timestamp"])
                    
                traffic = IncomingTraffic(**parsed_data)
                features = feature_extractor.extract_features(traffic)
                anomaly_detector.add_to_buffer(features)
                evaluation = anomaly_detector.evaluate_request(features)
                
                mitigation_action = "ALLOW"
                if evaluation["is_anomalous"]:
                    mitigation_action = "BLOCK_IP" 
                
                result = AnomalyResult(
                    transaction_id=traffic.payment_payload.transaction_id,
                    is_anomalous=evaluation["is_anomalous"],
                    anomaly_score=evaluation["score"],
                    mitigation_action=mitigation_action
                )
                
                # 1. Send decision back to the simulator script
                await websocket.send_json(result.model_dump())
                
                # 2. BROADCAST decision live to the frontend UI!
                await manager.broadcast(result.model_dump())
                
            except ValidationError as e:
                await websocket.send_json({"error": "Invalid traffic schema", "details": e.errors()})
            except json.JSONDecodeError:
                await websocket.send_json({"error": "Invalid JSON format"})

    except WebSocketDisconnect:
        print("Traffic simulation disconnected.")