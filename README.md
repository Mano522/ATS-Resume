# ResumeLens

A friendly resume review workspace built with Next.js App Router, TypeScript, Tailwind CSS, Radix/shadcn-style UI primitives, Framer Motion, Recharts, and React-PDF.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dashboard is the default screen; `/welcome` and `/auth` contain the public landing and account flows.

## Backend API

The app uses Next.js Route Handlers for its backend:

- `GET /api/dashboard` returns the dashboard response shape. Its current records are sample data in `src/lib/api.ts`.
- `POST /api/analyze` accepts `{ "resumeText": "...", "category": "INFORMATION-TECHNOLOGY" }` and returns the analysis response shape. It checks common resume sections and length, and computes role fit from the included dataset profiles. Resume text is processed for the request and is not stored.

The analysis uses transparent heuristics and dataset reference scores; it does not call an AI service. The current auth form is still a front-end demo and does not create accounts or persist credentials. The client functions in [`src/lib/api.ts`](src/lib/api.ts) keep the response types stable for the UI.

## Dataset-backed role fit

The Skills view uses the [batuhanmtl/job_resume_fit dataset](https://huggingface.co/datasets/batuhanmtl/job_resume_fit) to compare resume skills with its 23 job categories. Scores are calibrated from the dataset's `ai_match_score` by observed skill-coverage bucket; they are illustrative references, not hiring predictions.

To regenerate the minimized profiles after updating the source dataset:

```bash
python3 -m pip install -r requirements.txt
python3 scripts/build_fit_profiles.py
```

The build script streams the source and writes only job categories, required skill names, coverage-bucket averages, and sample counts to `src/lib/job-fit-profiles.json`; resume text, job descriptions, and row IDs are not included. The dataset metadata lists its license as `other`; review the dataset's terms before distributing or using derived data commercially.

## Main routes

- `/` Dashboard, upload, analysis results, career tools, reports, analytics, and settings.
- `/welcome` Landing page.
- `/auth` Register, sign in, and password reset states.

## Checks

```bash
npm run lint
npm run build
```
# ATS-Resume
# ATS-Resume
