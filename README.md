# ResumeLens

A friendly resume review workspace built with Next.js App Router, TypeScript, Tailwind CSS, Radix/shadcn-style UI primitives, Framer Motion, Recharts, and React-PDF.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dashboard is the default screen; `/welcome` and `/auth` contain the public landing and account flows.

## Mock API

Typed request and response models and mock functions live in [`src/lib/api.ts`](src/lib/api.ts). `getDashboardData()` and `analyzeResume(file)` are the boundary to replace with calls to the Express API. Keep their return types stable to avoid changing the screen components. The current auth form is a front-end demo and does not create an account or persist credentials.

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
