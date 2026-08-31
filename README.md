# 🛡️ SybilGuard: Real-Time API Abuse-Ring Sentinel

**Razorpay AI Buildathon | Track 02: AI Risk Manager** **Author:** Arpit & Avi

> **SybilGuard** is an autonomous, network-layer AI risk manager designed to detect, explain, and mitigate coordinated card-testing botnets in real-time, enforcing strict bounded defense protocols to maximize merchant revenue.

---

## 🎯 The Problem: Card Testing Sinkholes
Fraud rings utilize highly distributed botnets to execute BIN attacks (card testing) via high-volume, low-value transactions. Because these botnets continuously rotate IP addresses and device fingerprints, traditional static ML models fail to catch them in time. This results in degraded API performance, high false-positive rates, and massive downstream processing costs for merchants.

## 🚀 The Solution
SybilGuard operates at the ingestion and protocol layer. Instead of waiting for a transaction payload to hit the ledger, it ingests API traffic in real-time via WebSockets and extracts network metadata (request jitter, ASN velocity). 

It utilizes an **Isolation Forest** model to dynamically cluster and isolate the anomalous spikes that represent coordinated abuse rings. Crucially, SybilGuard executes a strict **defense-only** mitigation strategy, ensuring every blocked action is mathematically justified, bounded, and fully transparent via our Explainable AI (XAI) Audit Trail.

---

## ✨ Key Platform Features

* ⚡ **Live Telemetry Dashboard:** Real-time ingestion feed tracking ML decisions, inference latency, and Net Margin Recovered.
* 📈 **Dynamic Decision Boundary Visualization:** Live interactive charting (Recharts) plotting normal traffic baselines vs. anomaly spikes in real-time.
* 🔍 **XAI Decision Inspector (Explainability Audit):** A dedicated audit trail that breaks down the exact temporal jitter and ASN velocity vectors that caused the Isolation Forest to drop a specific payload.
* 🌍 **Global Threat Geo-Radar:** A live, mathematically distributed threat map tracking anomalous traffic origins across global Autonomous System Numbers (ASNs).
* 📄 **Executive Threat Summary:** One-click, fully formatted PDF export detailing system health, mitigation ratios, and autonomous AI recommendations for SecOps teams.
* 💥 **In-Browser Attack Simulator:** Built-in stress-testing tool that fires hundreds of randomized botnet payloads directly to the WebSocket ingestion engine to demonstrate live scale and latency capabilities.

---

## 🏗️ Architecture & Tech Stack

**Frontend (The Command Center)**
* **React + Vite:** Ultra-fast UI rendering and state management.
* **Tailwind CSS:** Custom *Midnight Slate & Neon* enterprise aesthetic.
* **Recharts:** Low-latency data visualization for the ML decision boundaries.

**Backend (The Intelligence Engine)**
* **Python / FastAPI:** High-throughput backend for serving the AI model.
* **WebSockets:** Full-duplex, bi-directional streams for zero-latency telemetry.
* **Scikit-learn (Isolation Forest):** Unsupervised anomaly detection for temporal and spatial clustering.

---

## 🛠️ How to Run Locally

To test the full suite, you will need two terminal instances to run the ingestion engine and the UI concurrently.

### 1. Start the AI Backend Engine
```bash
# Navigate to the root folder
cd SybilGuard-Real-Time-API-Abuse-Ring-Sentinel

# Activate the virtual environment
.\venv\Scripts\activate

# Boot up the FastAPI WebSocket server
uvicorn app.main:app --reload