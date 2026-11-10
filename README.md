# ATHLETEX AI

Cricket bowling analysis and talent discovery for athletes without access to academies.
Independent project. Not affiliated with BCCI, ICC, or any sporting body.

## Structure

- `backend/`   Python API (FastAPI). Rules, data, later the AI worker.
- `frontend/`  Website (Next.js + TypeScript). What athletes and recruiters see.
- `scripts/`   Helper scripts (environment check).
- `docs/`      Plans and notes.

## Run it (two terminals)

Terminal 1, backend:

    cd backend
    python3 -m venv .venv
    source .venv/bin/activate          # Windows: .venv\Scripts\activate
    pip install -r requirements-dev.txt
    cp .env.example .env               # Windows: copy .env.example .env
    uvicorn app.main:app --reload --port 8000

Terminal 2, frontend:

    cd frontend
    npm install
    cp .env.example .env.local         # Windows: copy .env.example .env.local
    npm run dev

Open http://localhost:3000 and the page should say "Connected".

## Test

    cd backend && pytest
    cd frontend && npm run lint && npm run build
