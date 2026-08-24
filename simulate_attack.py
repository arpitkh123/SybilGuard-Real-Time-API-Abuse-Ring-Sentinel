import asyncio
import websockets
import json
import random
from datetime import datetime, timezone

async def run_simulation():
    uri = "ws://127.0.0.1:8000/ws/traffic"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("🔗 Connected to SybilGuard Engine")
            print("🚀 Generating Normal Traffic Baseline (50 requests)...")
            
            # PHASE 1: Normal Human Traffic
            # Humans buy random things, take time between clicks (high jitter), from different networks.
            for i in range(50):
                payload = {
                    "payment_payload": {
                        "transaction_id": f"txn_human_{i}",
                        "card_bin": str(random.randint(400000, 499999)),
                        "amount": round(random.uniform(500.0, 5000.0), 2),
                    },
                    "network_telemetry": {
                        "ip_address": f"192.168.1.{random.randint(1, 255)}",
                        "asn": f"AS{random.randint(1000, 9999)}", # Lots of different networks
                        "user_agent": "Mozilla/5.0",
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    }
                }
                
                await websocket.send(json.dumps(payload))
                response = await websocket.recv()
                result = json.loads(response)
                
                # We expect these to be ALLOWED since the model is training
                print(f"Normal Request {i+1} -> Action: {result['mitigation_action']} | Score: {result['anomaly_score']:.2f}")
                
                # Simulate human speed (random delays)
                await asyncio.sleep(random.uniform(0.1, 0.5))

            print("\n🚨 BASELINE ESTABLISHED. INJECTING BOTNET ATTACK! 🚨\n")
            
            # PHASE 2: Botnet BIN Attack (Card Testing)
            # Botnets fire rapidly from a single compromised network, testing low values.
            for i in range(20):
                payload = {
                    "payment_payload": {
                        "transaction_id": f"txn_bot_{i}",
                        "card_bin": str(random.randint(500000, 599999)),
                        "amount": 1.00,  # Classic card testing amount
                    },
                    "network_telemetry": {
                        "ip_address": f"10.0.0.{random.randint(1, 255)}",
                        "asn": "AS666", # Single compromised network
                        "user_agent": "curl/7.68.0",
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    }
                }
                
                await websocket.send(json.dumps(payload))
                response = await websocket.recv()
                result = json.loads(response)
                
                if result['is_anomalous']:
                    print(f"🛑 BLOCKED: Botnet Request {i+1} | Score: {result['anomaly_score']:.2f}")
                else:
                    print(f"⚠️ MISSED: Botnet Request {i+1} | Score: {result['anomaly_score']:.2f}")
                
                # Simulate bot speed (very fast, low jitter)
                await asyncio.sleep(0.01)

    except websockets.exceptions.ConnectionClosedError:
        print("❌ Connection to server lost.")
    except ConnectionRefusedError:
        print("❌ Could not connect. Is the Uvicorn server running?")

if __name__ == "__main__":
    asyncio.run(run_simulation())