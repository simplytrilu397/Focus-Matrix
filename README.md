# FocusMatrix — Adaptive GATE Exam Study Engine

[![Google Cloud Run](https://img.shields.io/badge/Google%20Cloud-Cloud%20Run-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![Cloud Firestore](https://img.shields.io/badge/Google%20Cloud-Firestore-FFCA28?logo=firebase&logoColor=black)](https://cloud.google.com/firestore)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Hackathon Submission**: A Google Cloud–native, containerized web application built on **Google Cloud Run** with **Cloud Firestore** for adaptive GATE & semester exam study optimization.

---

## 🌟 Key Features

1. **⚡ Subject Priority Index (SPI) Engine**:
   - Proprietary algorithm dynamically balancing **Concept Weakness (35%)**, **GATE Exam Weightage (35%)**, and **Urgency/Exam Runway (30%)** to eliminate study panic.
   - Interactive SVG radial gauge and breakdown metrics.

2. **🧠 Official GATE CS Curriculum & PYQ Solver**:
   - Comprehensive materials for:
     - 📐 **Engineering Mathematics** (Calculus, Linear Algebra, Probability, Differential Equations)
     - 💻 **Data Structures & Algorithms** (Master Theorem, Tree Traversals, Shortest Paths)
     - ⚡ **Operating Systems** (Virtual Memory, Multi-level Paging, TLB EMAT)
     - 🗄️ **Database Management Systems** (Normalization, BCNF/3NF, B+ Trees)
     - 🌐 **Computer Networks** (IPv4 Subnetting, TCP Flow & Congestion)
     - 🧠 **General Aptitude** (Work & Time, Quantitative & Logical Reasoning)
   - Embedded formula cheat sheets, instant verification, and step-by-step master solutions.

3. **☁️ Google Cloud–Native Backend & Storage**:
   - **Google Cloud Run (`*.run.app`)**: Containerized Express backend serving responsive UI and secure REST APIs (`0.0.0.0:8080`).
   - **Cloud Firestore**: Server-side real-time persistence with IAM / Application Default Credentials.
   - **Zero Exposed Keys**: AI study coach endpoints routed securely through Cloud Run.

4. **🏠 Sprint & Habit Architecture**:
   - 25-minute Pomodoro Focus Sprint timer with completion audio synthesizer.
   - Daily progress tracking and 1-click Focus Topic pinning.

---

## 🏛️ Architecture Overview

```
GitHub Repository
       ↓
Google Cloud Build (Containerized Build)
       │
       ├── Google Cloud Run (https://focusmatrix-*.run.app)
       │      └── Node.js Express server + Responsive Web Application
       │
       ├── Cloud Firestore (Native GCP)
       │      └── Persistent user study plans, SPI scores & GATE question tracking
       │
       ├── Secret Manager & Environment Config
       │      └── Secure server-side API keys & environment parameters
       │
       └── IAM & Service Account
              └── Default Compute Service Account with roles/datastore.user
```

---

## 🚀 Live Deployment Options

### Option A: Free Deployment via Render (Zero Credit Card Required)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Go to [https://render.com/](https://render.com/) and sign in with GitHub.
2. Click **New +** → **Web Service**.
3. Select your repository (`Focus-Matrix`).
4. Set:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`
5. Click **Create Web Service** to get your public `https://<service-name>.onrender.com` URL.

---

### Option B: Quick Deployment to Google Cloud Run

For detailed instructions, see **[DEPLOYMENT.md](DEPLOYMENT.md)**.


### 1-Command Deploy via Google Cloud Shell:

```bash
# 1. Enable Google Cloud APIs
gcloud services enable run.googleapis.com firestore.googleapis.com cloudbuild.googleapis.com

# 2. Deploy to Cloud Run
gcloud run deploy focusmatrix \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local server
npm start
```

Open **http://localhost:8080** in your browser.
