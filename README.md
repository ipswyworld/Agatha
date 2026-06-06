# Project Agatha: Super-Sovereign AI Security Ecosystem

Project Agatha is an autonomous, bicameral cybersecurity platform designed for sovereign infrastructure protection and proactive threat neutralization. It operates on a dual-logic system inspired by the Greek concepts of **Agathos** (The Guardian) and **Kakos** (The Shadow), orchestrated by a central AI **Brain**.

Agatha is not just a toolset; it is a self-evolving intelligence that trains, battles, and learns 24/7.

---

## 🏛 Architecture Overview

### 🛡 Agathos (Blue Team - The Guardian)
Located in `agatha-agathos/`, this module contains **500 Pillars of Defense**.
- **Post-Quantum Cryptography (PQC):** Secures data against future quantum threats using ML-KEM.
- **Autonomous Forensics:** Generates cryptographically signed "Evidence Packages" (JSON) for every security event.
- **Self-Healing Infrastructure:** Real-time kernel integrity monitoring and automated patch deployment.
- **Ethics Pillar:** A hard-coded "Bicameral Circuit Breaker" that prevents the system from violating ethical or legal boundaries.

### 🌑 Kakos (Red Team - The Shadow)
Located in `agatha-kakos/`, this is a high-performance **Rust-based** offensive engine featuring **500 Shadows of Infiltration**.
- **Zero-Day Synthesis:** AI-driven vulnerability discovery and exploitation.
- **Recursive Infiltration:** Asynchronous crawling and subversion of network targets.
- **Polymorphic Mutation:** Evades EDR/XDR by mutating malware signatures in real-time.
- **Honeypot De-cloaking:** Detects deceptive targets before mission execution.

### 🧠 The Brain (The Orchestrator)
The central intelligence unit that manages mission logic, swarms, and the system's "Neural Dashboard."
- **SLM Reasoning:** Uses Small Language Models (Microsoft Phi-3) for offline local reasoning.
- **Model Context Protocol (MCP):** Allows Agatha to be used as a tool by other AI agents.
- **Bicameral Debate:** Forces Agathos and Kakos agents to debate high-risk actions before execution.

---

## 📚 The Library (Super-Sovereign Learning)

The core of Agatha's evolution is **The Library**, a 24/7 autonomous learning engine:
- **The Archives:** Ingests live global security data (CVEs/Zero-Days).
- **The Curriculum:** Targeted training curation based on global threats and internal weaknesses.
- **The Proving Grounds:** 24/7 adversarial self-play (Red vs. Blue) in simulated "Digital Twin" environments.
- **The Forge:** Permanently bakes experience into neural weights via LoRA fine-tuning.

---

## 🚀 Command Reference

### 1. 🦾 The Learning Engine (Start the 24/7 Evolution)
To launch the full self-learning ecosystem (Gyms, War Room, and Ingestion):
```powershell
python agatha-brain/library/the_librarian.py
```

### 2. 🛡 Agathos Operations
To run a manual defensive audit or start the reporting engine:
```powershell
python agatha-agathos/guardian_core.py
```

### 🌑 Kakos Operations
To execute an offensive shadow or run the crawler (Requires Authorization Token):
```bash
# List available shadows
cargo run --manifest-path agatha-kakos/Cargo.toml -- --list

# Execute a specific shadow (Simulation Mode)
cargo run --manifest-path agatha-kakos/Cargo.toml -- --shadow "Evasive Infiltration" --mock

# Start a reconnaissance crawl
cargo run --manifest-path agatha-kakos/Cargo.toml -- --url "http://target.onion"
```

### 🧠 Brain & Dashboard
To start the Neural Dashboard (Web UI):
```bash
cd agatha-bridge
npm run dev
```

To start the MCP Server for agent integration:
```powershell
python agatha-mcp-server.py
```

---

## 🛠 Core Technologies
- **Languages:** Python (Brain/Defense), Rust (Offense), TypeScript (Dashboard).
- **AI Models:** Microsoft Phi-3-mini-4k-instruct (Fine-tuned via LoRA).
- **Cryptography:** ML-KEM (Post-Quantum), AES-256 (Malware Vault).
- **Frameworks:** Next.js (Dashboard), Tokio/Reqwest (Rust Engine), PyTorch (The Forge).

---

## ⚠️ Disclaimer
Project Agatha is a sovereign research project. Unauthorized use against systems you do not own is illegal. The system's **Ethical Heat** governor is active by default to prevent unauthorized offensive escalation.
