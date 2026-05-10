# LayerHealth

> An AI-powered ABHA-linked healthcare workflow system designed to streamline patient intake, automate documentation, and optimize hospital operations through intelligent queue management and real-time clinical decision support.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-black)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

LayerHealth is a full-stack MVP designed to address critical gaps in hospital workflow efficiency:

- **Patient Intake Automation**: ABHA-style digital ID lookup with auto-populated patient records
- **Smart Documentation**: AI-assisted clinical summaries, discharge notes, and treatment plans
- **Real-Time Queue Management**: Live visibility and predictive wait-time estimation
- **Dual-Role Interface**: Separate workflows optimized for patients and healthcare providers
- **Secure Access Control**: Consent-based data access with CORS-protected API boundaries

Built as a demonstration of how multi-agent AI orchestration can reduce administrative burden and improve patient outcomes in resource-constrained healthcare settings.

---

## Features

### Patient Module
- ✅ ABHA digital ID entry (with QR scan simulation)
- ✅ Auto-fetched patient profile with medical history, allergies, and vitals
- ✅ Real-time queue status and position tracking
- ✅ Medication reminders and prescription schedule
- ✅ Medical history timeline view
- ✅ Follow-up appointment tracking

### Doctor Module
- ✅ Live patient queue with urgency prioritization
- ✅ AI-generated clinical summaries from patient context
- ✅ One-click document generation (clinical notes, discharge summary, treatment plan)
- ✅ Vitals dashboard and allergy/chronic condition highlights
- ✅ Multi-stage AI processing pipeline with transparency indicators
- ✅ Queue insights (avg wait time, peak load prediction, AI suggestions)
- ✅ Persistent doctor notes saved to patient digital record

### System Features
- ✅ CORS-protected REST API with flexible origin allowlist
- ✅ Real-time data synchronization (2-second polling)
- ✅ Simulated multi-agent orchestration (Patient Agent → Documentation Agent → Queue Agent)
- ✅ Local storage based session persistence
- ✅ Responsive, accessibility-friendly UI
- ✅ Production-ready error handling and validation

---

## Tech Stack

### Frontend
- **Framework**: React 18+ (Vite)
- **Styling**: CSS3 with CSS variables and glassmorphism design
- **Icons**: Lucide React
- **Routing**: React Router v6
- **HTTP Client**: Fetch API (native)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: JSON file-based (db.json) – easily swappable to PostgreSQL/MongoDB
- **CORS**: Dynamic origin validation with regex-based local dev support
- **Deployment**: PM2, Vercel, or Render

### DevTools
- **Build**: Vite
- **Package Manager**: npm
- **Linting**: ESLint
- **Version Control**: Git

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Vite + React)                   │
├─────────────────────────────────────────────────────────────┤
│  Home → Patient Flow (ABHA → Queue) / Doctor Flow (Queue)  │
│  Uses: Lucide Icons, React Router, LocalStorage             │
└──────────────┬──────────────────────────────────────────────┘
               │ REST API (fetch)
               │ (CORS-protected)
               │
┌──────────────▼──────────────────────────────────────────────┐
│                 BACKEND (Express.js)                        │
├──────────────────────────────────────────────────────────────┤
│  GET  /api/patient/:id        → Patient Profile Fetch      │
│  POST /api/queue/add           → Queue Enrollment          │
│  GET  /api/queue               → Live Queue Status         │
│  POST /api/queue/next          → Consultation Handoff      │
│  POST /api/ai/summary          → AI Clinical Summary       │
│  POST /api/ai/report           → AI Report Interpretation  │
├──────────────────────────────────────────────────────────────┤
│  Data Layer: db.json (patients[], queue[])                 │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Patient Intake**: Patient enters ABHA ID → Backend queries db.json → Structured profile returned
2. **Queue Enrollment**: Patient confirms data → Queue entry created with auto-generated wait time
3. **Doctor View**: Doctor selects patient → AI pipeline triggers (3-stage orchestration)
4. **Documentation**: Doctor generates notes → Saved to patient history via localStorage + backend
5. **Queue Advance**: Doctor clicks "Next" → Current patient removed, next patient loaded

---

## Project Structure

```
WITCHHUNT/
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Role selection (Patient / Doctor)
│   │   │   ├── AbhaEntry.jsx        # Patient ABHA intake & verification
│   │   │   ├── PatientDashboard.jsx # Patient queue & reminders view
│   │   │   └── DoctorDashboard.jsx  # Doctor workspace & queue management
│   │   ├── components/              # Reusable UI components (future)
│   │   ├── assets/                  # Static images & icons
│   │   ├── App.jsx                  # Router & layout
│   │   ├── main.jsx                 # React entry point
│   │   ├── index.css                # Global styles
│   │   └── App.css                  # App-specific styles
│   ├── public/                      # Static files
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint rules
│   ├── package.json                 # Frontend dependencies
│   └── README.md                    # Client-specific docs
│
├── server/                          # Express Backend
│   ├── index.js                     # Main Express app (70 lines)
│   ├── db.json                      # Patient & queue data
│   └── package.json                 # Backend dependencies
│
├── package.json                     # Root workspace (monorepo style)
├── LICENSE                          # MIT License
└── README.md                        # This file

```

---

## Installation

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn
- Git

### Clone & Setup

```bash
# Clone repository
git clone <repository-url>
cd WITCHHUNT

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Return to root
cd ..
```

### Environment Setup (Optional)

Create a `.env` file in the `server/` directory:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## Running Locally

### Start Backend Server

```bash
cd server
npm start
```

Expected output:
```
Server running on port 5000
```

The backend will:
- Listen on `http://localhost:5000`
- Serve REST API endpoints
- Accept requests from any `localhost:*` origin

### Start Frontend (in a new terminal)

```bash
cd client
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173
➜  press h to show help
```

### Access the Application

Open your browser and navigate to:
- **Patient Flow**: `http://localhost:5173/abha`
- **Doctor Dashboard**: `http://localhost:5173/doctor/dashboard`
- **Home**: `http://localhost:5173`

### Test ABHA IDs

Use these credentials for testing:
- `ABHA-01` (Eleanor Vance, 42F, AB Negative)
- `ABHA-02` (Rahul Sharma, 45M, O Positive)

---

## API Endpoints

All endpoints are JSON-based and require `Content-Type: application/json`.

### Patient Endpoints

#### Get Patient by ID
```http
GET /api/patient/:id

Example:
GET http://localhost:5000/api/patient/ABHA-01

Response (200):
{
  "id": "ABHA-01",
  "name": "Eleanor Vance",
  "age": 42,
  "gender": "Female",
  "bloodGroup": "AB Negative",
  "status": "Active",
  "history": [
    {
      "condition": "Type 2 Diabetes",
      "details": "Diagnosed 2018. Management: Metformin 500mg"
    }
  ],
  "allergies": ["Penicillin - Anaphylaxis response documented in 2021"],
  "vitals": {
    "bloodPressure": "120/82",
    "heartRate": "72 bpm",
    "spO2": "98%"
  }
}
```

### Queue Endpoints

#### Add Patient to Queue
```http
POST /api/queue/add
Content-Type: application/json

Request:
{
  "patientId": "ABHA-01",
  "department": "General Consultation"
}

Response (201):
{
  "message": "Added to queue",
  "queueItem": {
    "id": "Q-1704067200000",
    "patientId": "ABHA-01",
    "patientName": "Eleanor Vance",
    "department": "General Consultation",
    "status": "Waiting",
    "waitTimeEstimated": 15,
    "joinedAt": "2024-01-01T10:00:00.000Z"
  },
  "position": 1
}
```

#### Get Live Queue
```http
GET /api/queue

Response (200):
[
  {
    "id": "Q-1704067200000",
    "patientId": "ABHA-01",
    "patientName": "Eleanor Vance",
    "status": "Waiting",
    "waitTimeEstimated": 15,
    "joinedAt": "2024-01-01T10:00:00.000Z"
  }
]
```

#### Advance Queue (Doctor clicks "Next")
```http
POST /api/queue/next

Response (200):
{
  "message": "Eleanor Vance moved to consultation",
  "removedPatient": { ... },
  "queueLength": 0
}
```

### AI Endpoints (Mock)

#### Generate Clinical Summary
```http
POST /api/ai/summary
Content-Type: application/json

Request:
{
  "patientId": "ABHA-01"
}

Response (200):
{
  "summary": "Patient shows positive response to previous treatments...",
  "confidence": "94%"
}
```

#### Explain Medical Report
```http
POST /api/ai/report
Content-Type: application/json

Request:
{
  "reportText": "Hemoglobin: 10.5 g/dL (Low)"
}

Response (200):
{
  "original": "Hemoglobin: 10.5 g/dL (Low)",
  "explanation": "AI Explanation: Your report indicates mild iron deficiency anemia..."
}
```

---

## Usage Guide

### Patient Workflow

1. **Home Page**: Select "Patient Simulator"
2. **ABHA Entry**: Enter or use preset ABHA ID (e.g., `ABHA-01`)
3. **Verify**: Review auto-populated data (history, allergies, vitals)
4. **Check-In**: Click "Confirm & Check-in" to join queue
5. **Dashboard**: View queue position, reminders, prescriptions, and history
6. **Queue Updates**: Position refreshes every 2 seconds

### Doctor Workflow

1. **Home Page**: Select "Doctor Dashboard"
2. **Queue View**: See all waiting patients with urgency indicators
3. **Select Patient**: Click on a patient to view their full context
4. **Process Visit**: Click "🚀 Process Full Visit" to trigger AI pipeline
5. **Generate Documents**: Choose document type (clinical notes, discharge summary, treatment plan)
6. **Save Notes**: Doctor notes are saved to patient record
7. **Next Patient**: Click "✓ Next Patient" to advance queue

---

## Deployment

### Heroku / Render (Recommended for MVP)

#### Backend Deployment

1. **Render.com**:
   ```bash
   # Push to Render
   git push origin main
   
   # Set environment variable in dashboard
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

2. **Vercel** (backend):
   ```bash
   # Deploy as serverless function
   vercel --prod
   ```

#### Frontend Deployment

1. **Vercel** (Recommended):
   ```bash
   cd client
   npm run build
   vercel --prod
   ```

2. **Netlify**:
   ```bash
   cd client
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Docker Deployment

Create `docker-compose.yml` at root:

```yaml
version: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      FRONTEND_URL: http://frontend:3000
    
  frontend:
    build: ./client
    ports:
      - "3000:80"
    depends_on:
      - backend
```

Then run:
```bash
docker-compose up --build
```

---

## Roadmap

### Phase 1: ABDM Compliance (Months 1-2)
- [ ] Real ABDM gateway integration (OAuth 2.0 consent flow)
- [ ] Encrypted FHIR-compliant data exchange
- [ ] Audit logging and consent tracking
- [ ] Role-based access control (RBAC)

### Phase 2: EHR Interoperability (Months 2-4)
- [ ] FHIR-compliant data models
- [ ] Hospital HIS/EHR adapters (HL7, proprietary APIs)
- [ ] Configurable integration connectors
- [ ] Data validation and reconciliation

### Phase 3: AI & ML Enhancement (Months 4-6)
- [ ] ML-powered wait-time prediction
- [ ] Triage scoring with clinical validation
- [ ] Automated discharge note generation (GPT/LLM backend)
- [ ] Feedback loops and model retraining

### Phase 4: Scale & Resilience (Months 6+)
- [ ] Offline-first mode for low-connectivity areas
- [ ] Multilingual UI (Hindi, Tamil, Telugu, etc.)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and hospital dashboards
- [ ] Real-time collaboration features

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** changes: `git commit -m "Add feature description"`
4. **Push** to branch: `git push origin feature/your-feature`
5. **Submit** a pull request

### Code Standards
- Use ESLint for linting
- Follow React hooks best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test features locally before submitting PR

---

## Troubleshooting

### CORS Errors
**Issue**: `Access-Control-Allow-Origin header missing`

**Solution**: Ensure backend is running and CORS middleware includes your frontend origin:
```javascript
// In server/index.js
const isLocalDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');
```

### Patient Not Found
**Issue**: `404 Patient not found`

**Solution**: Use test IDs only:
- `ABHA-01` or `ABHA-02`

To add custom patients, edit `server/db.json` and restart the backend.

### Port Already in Use
**Issue**: `Error: listen EADDRINUSE :::5000`

**Solution**: Kill the process or use a different port:
```bash
# Linux/Mac
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

---

## Performance Considerations

- **Frontend**: Vite HMR for fast development feedback
- **Backend**: Express middleware optimized for lightweight JSON payloads
- **Database**: JSON file storage sufficient for MVP; migrate to PostgreSQL for production
- **Queue**: 2-second polling is acceptable for demo; use WebSockets for real-time at scale

---

## Security Notes

⚠️ **MVP Security**: This is a demonstration MVP. Before production deployment:
- [ ] Implement HTTPS/TLS
- [ ] Add authentication (JWT/OAuth 2.0)
- [ ] Encrypt sensitive data (PII, medical records)
- [ ] Implement audit logging
- [ ] Add rate limiting and DDoS protection
- [ ] Validate and sanitize all user inputs
- [ ] Use environment variables for secrets

---

## License

This project is licensed under the **MIT License** – see [LICENSE](LICENSE) file for details.

---

## Contact & Support

- **Author**: Development Team
- **Email**: support@layerhealth.io
- **GitHub Issues**: [Report bugs here](../../issues)
- **Documentation**: Full API docs available at `/docs` (coming soon)

---

## Acknowledgments

- ABHA (Ayushman Bharat Health Account) initiative
- ABDM (Ayushman Bharat Digital Mission)
- Healthcare workflow optimization research community
- All contributors and early testers

---

**Made with ❤️ to transform healthcare workflows in India and beyond.**
