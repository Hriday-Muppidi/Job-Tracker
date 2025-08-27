## Job Application Tracker

Monorepo containing a production-ready Job Application Tracker with interview prep.

### Tech Stack
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT
- Frontend: React (Vite), TypeScript, Tailwind CSS, React Router
- Storage: Local FS by default, S3-ready
- Notifications: Email via SMTP (Nodemailer) or console fallback
- Containerization: Docker + docker-compose

### Quick Start (Docker)
1. Copy environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
2. Edit `backend/.env` and `frontend/.env` as needed.
3. Start services:
```bash
docker compose up --build
```
4. Backend API at `http://localhost:4000` and Frontend at `http://localhost:5173` (or the mapped port in compose).

### Local Development (without Docker)
Prereqs: Node 18+, npm, PostgreSQL 14+
```bash
# Backend
cd backend
npm install
npx prisma migrate dev --name init
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
```

### Primary Features
- Authentication: Register, Login, Password Reset (email link)
- Job Applications: CRUD, file attachments (resume/cover letter)
- Status Updates: Inline notes and optional follow-up dates
- Interview Prep: AI-generated questions, skills, and 7-day schedule
- CSV Export and Calendar endpoints

### Environment
- See `backend/.env.example` and `frontend/.env.example` for settings.
  - Optional `OPENAI_API_KEY` enables real AI prep; otherwise a rule-based stub is used.

### Deployment
- Production images built via `docker compose build`.
- Backend runs migrations on start if `RUN_MIGRATIONS_ON_START=true`.
- Frontend is built and served via Nginx.

# Job-Tracker
Job tracker website using cursor
