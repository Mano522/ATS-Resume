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
