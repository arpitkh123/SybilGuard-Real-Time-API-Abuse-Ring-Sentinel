# SybilGuard: Real-Time API Abuse-Ring Sentinel

**Razorpay AI Buildathon | Track 02: AI Risk Manager**
**Author:** Arpit

## 🎯 The Problem: Card Testing Sinkholes
Fraud rings utilize distributed botnets to execute BIN attacks (card testing) via high-volume, low-value transactions. Because these botnets continuously rotate IPs and device fingerprints, traditional static ML models fail to catch them in time, resulting in degraded API performance and downstream processing costs.

## 🚀 The Solution
SybilGuard operates at the network and protocol layer. Instead of waiting for a transaction payload to be evaluated, it ingests API traffic in real-time via WebSockets and extracts metadata (request jitter, ASN velocity). It uses an **Isolation Forest** model to dynamically cluster and isolate the anomalous spikes that represent coordinated abuse rings, executing a strict **defense-only** mitigation strategy.

## 🏗️ Architecture & Stack
- **Ingestion:** Python / FastAPI / WebSockets for real-time traffic simulation.
- **Feature Extraction:** Temporal analysis and request jitter calculation.
- **AI/ML Core:** Scikit-learn (Isolation Forest) for dynamic anomaly clustering.
- **Agentic Mitigation:** Bounded LLM rules engine to issue deterministic blocking commands.

## 📉 Core Metrics (Honest Evaluation)
*Metrics will be populated upon final model testing.*
- **Precision / Recall:** Evaluated on a held-out test set of simulated botnet traffic.
- **False-Positive Cost:** Dashboard tracks the financial delta between blocking a legitimate transaction vs. stopping the abuse ring.

## 🛠️ How to Run Locally
*(Instructions to be added during Step 2: Environment Setup)*

## 🚨 What Broke at 2 AM (And How I Fixed It)
*(To be completed during development: This section will detail a hard technical failure, such as managing the Global Interpreter Lock (GIL) during real-time feature extraction or handling memory leaks in WebSocket connections.)*