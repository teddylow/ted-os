# TED OS Coding Standards

## Stack

Recommended stack for v3 foundation:

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Styling: CSS modules or Tailwind-compatible utility structure
- Source of truth: Zoho CRM through TED OS API

## Architecture Rules

1. Frontend must not call Zoho directly.
2. All Zoho calls go through TED OS API.
3. Zoho field mapping lives in the API/data layer.
4. Frontend uses TED OS domain names: Student, Application, University, Commission Record.
5. Business logic should not be duplicated between frontend and backend.
6. Finance and commission logic must be backend-owned.
7. Production write actions require explicit human confirmation.

## TypeScript Rules

- Use explicit domain types.
- Avoid `any` unless wrapping raw Zoho payloads.
- Normalize Zoho payloads into TED OS objects before returning API responses.
- Use narrow role unions: `director`, `counsellor`, `admissions`.

## API Rules

Recommended API pattern:

```text
GET /api/health
GET /api/students
GET /api/students/:id
GET /api/students/:id/applications
GET /api/students/:id/visa
GET /api/students/:id/timeline
GET /api/dashboard/director
GET /api/command/search?q=
```

## UI Rules

- Prioritize operational clarity over decorative UI.
- Every screen should answer a business question.
- Use status badges for stages and case health.
- Keep Director finance data hidden from Counsellor and Admissions roles.
- Command Palette must be accessible with Cmd+K / Ctrl+K.

## Security Rules

- Never commit `.env`.
- Never expose Zoho secrets in frontend code.
- Store tokens only server-side.
- Use Sandbox by default during development.
- Treat Production writes as sensitive actions.
