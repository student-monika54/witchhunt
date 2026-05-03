# CareFlow AI

CareFlow AI is a full-stack demo healthcare workflow app with:
- Patient check-in via ABHA ID simulation
- Live queue updates for patients and doctors
- Doctor-side patient processing and AI summary simulation
- Local JSON-backed API for quick prototyping

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Data: server/db.json (file-based demo storage)

## Project Structure

- client: React app
- server: Express API
- package.json (root): convenience scripts to run client and server together

## Local Development

Prerequisites:
- Node.js 18+

Install all dependencies:

1. Root
2. Client
3. Server

Commands:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

Run both frontend and backend from root:

```bash
npm run dev
```

Default local URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Environment Variables

Frontend uses one variable:

- VITE_API_BASE_URL: backend base URL

Behavior:
- In development, if unset, frontend falls back to http://localhost:5000.
- In production, set it to your deployed backend URL.

Example:

```env
VITE_API_BASE_URL=https://careflow-ai-api.onrender.com
```

## Deploy on Render

Deploy backend and frontend as separate services.

### 1) Backend (Web Service)

Create a new Web Service in Render:
- Root Directory: server
- Build Command: npm install
- Start Command: npm start
- Runtime: Node

Backend will expose APIs like:
- GET /api/patient/:id
- GET /api/queue
- POST /api/queue/add
- POST /api/queue/next
- POST /api/ai/summary

After deploy, note backend URL, for example:
- https://careflow-ai-api.onrender.com

### 2) Frontend (Static Site)

Create a new Static Site in Render:
- Root Directory: client
- Build Command: npm install && npm run build
- Publish Directory: dist

Set environment variable in frontend service:
- VITE_API_BASE_URL = your backend URL

Example:
- VITE_API_BASE_URL=https://careflow-ai-api.onrender.com

## Important Production Note

This project currently stores data in server/db.json. That is fine for demos, but for reliable production persistence you should move queue and patient updates to a real database (for example PostgreSQL on Render).

## Useful Scripts

Root:
- npm run dev: run client and server together
- npm run client: run client only
- npm run server: run server only

Client:
- npm run dev
- npm run build
- npm run preview

Server:
- npm run dev
- npm start
