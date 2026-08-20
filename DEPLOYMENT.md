# Google Cloud–First Deployment & Infrastructure Guide

**FocusMatrix — Adaptive GATE Exam Study Engine**  
*Built for Google Cloud Run, Cloud Firestore, and Secret Manager.*

---

## 🏛️ Target Architecture

```
GitHub Repository
       ↓
Google Cloud Build (Containerized Build)
       │
       ├── Google Cloud Run (https://focusmatrix-*.run.app)
       │      └── Node.js Express server + Responsive Web Application
       │
       ├── Cloud Firestore (Native GCP Mode)
       │      └── Persistent user study plans, SPI scores & GATE question tracking
       │
       ├── Secret Manager & Environment Config
       │      └── Secure server-side API keys & environment parameters
       │
       └── IAM & Service Account
              └── Default Compute Service Account with roles/datastore.user
```

---

## 📋 Prerequisites

1. A **Google Cloud Platform (GCP)** Account with an active project.
2. A web browser to access the Google Cloud Console or Google Cloud Shell.

---

## 🚀 Deployment (Choose Your Preferred Method)

### Method 1: 1-Command Deploy via Google Cloud Shell *(Recommended for Hackathon)*

Google Cloud Shell comes with `gcloud`, `git`, and `docker` pre-installed in the browser.

1. Open **[Google Cloud Shell](https://shell.cloud.google.com/)**.
2. Clone your GitHub repository and enter the directory:
   ```bash
   git clone <YOUR_GITHUB_REPOSITORY_URL>
   cd <REPOSITORY_NAME>
   ```
3. Enable the required Google Cloud APIs:
   ```bash
   gcloud services enable run.googleapis.com firestore.googleapis.com cloudbuild.googleapis.com
   ```
4. Create the Firestore database in your project (if not already created):
   ```bash
   gcloud firestore databases create --location=us-central1
   ```
5. Deploy directly to Google Cloud Run:
   ```bash
   gcloud run deploy focusmatrix \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --port 8080
   ```
6. **🎉 Live URL**: The deployment output will print your live URL:
   ```
   Service [focusmatrix] revision [focusmatrix-00001-xxx] has been deployed and is serving 100 percent of traffic.
   Service URL: https://focusmatrix-xxxx-uc.a.run.app
   ```

---

### Method 2: Deploy from Local Machine with `gcloud` CLI

If you have the Google Cloud SDK installed locally:

```bash
# 1. Login to your GCP account
gcloud auth login

# 2. Set your active GCP project
gcloud config set project <YOUR_GCP_PROJECT_ID>

# 3. Enable APIs
gcloud services enable run.googleapis.com firestore.googleapis.com cloudbuild.googleapis.com

# 4. Deploy source to Cloud Run
gcloud run deploy focusmatrix --source . --region us-central1 --allow-unauthenticated --port 8080
```

---

### Method 3: Automated Cloud Build CI/CD

Using the included [`cloudbuild.yaml`](cloudbuild.yaml):

```bash
gcloud builds submit --config cloudbuild.yaml
```

---

## 🔒 Security & Best Practices

- **Zero Client-Side Secrets**: All API routes and AI endpoints execute on the Cloud Run backend (`/api/assistant/chat`).
- **IAM-based Authentication**: Cloud Run accesses Cloud Firestore via Application Default Credentials (ADC) automatically. No service account key JSON files need to be generated or committed.
- **Port Management**: Cloud Run automatically injects `PORT=8080`, and the Express server binds to `0.0.0.0:$PORT`.

---

## 🧪 Local Testing & Verification

Run the application locally:

```bash
# 1. Install dependencies
npm install

# 2. Start the local server
npm start
```

Visit **http://localhost:8080** in your browser.

- Health Endpoint: `http://localhost:8080/api/health`
- Materials API: `http://localhost:8080/api/materials`
- Subjects API: `http://localhost:8080/api/subjects`
