# TED OS Environments

TED OS will use separate environments so development and testing never risk production student data.

## Environment Strategy

```text
Local Development
      │
      ▼
Zoho Sandbox
      │
      ▼
Production Zoho CRM
```

## Environments

| Environment | Purpose | Zoho Target | Write Access |
|---|---|---|---|
| Local | Developer machine testing | Sandbox | Yes |
| Sandbox | User acceptance testing | Zoho Sandbox | Yes |
| Production | Live TEDvisory operation | Production Zoho CRM | Controlled |

## Sandbox Rules

1. All new features must be tested against Zoho Sandbox first.
2. TED OS may write to Sandbox during development.
3. TED OS must not write to Production until explicitly approved.
4. Product creation, stage updates, visa updates, and automation tests must happen in Sandbox first.
5. Sandbox data can be reset or modified for testing.

## Production Rules

1. Production is the live system of record.
2. Production write operations must be deliberate and logged.
3. Finance-related writes require Director-level permission.
4. Product / Commission Record creation is Director-only.
5. AI should never write directly to Production without human confirmation.

## Environment Variables

TED OS should support environment-specific configuration.

```env
TED_ENV=local
ZOHO_ENV=sandbox
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
ZOHO_ACCOUNTS_DOMAIN=https://accounts.zoho.com
ZOHO_API_DOMAIN=https://www.zohoapis.com
PORT=8787
VITE_TED_API_URL=http://localhost:8787
```

## Required Modes

### Development Mode

Used by developers and administrators.

Features:

- Raw Zoho response viewer
- Field mapping inspector
- API error viewer
- Sandbox/Production indicator
- Test write actions

### Staff Mode

Used by TEDvisory team members.

Features:

- Student 360
- Applications
- Visa
- Tasks
- Documents
- AI drafting

No raw Zoho technical details should be visible.

### Director Mode

Used by Director.

Features:

- Finance
- Commission
- Product approval queue
- Business KPIs
- Morning Brief
- Admin settings

## Deployment Principle

Every feature should move through this path:

```text
Develop locally
↓
Test with Zoho Sandbox
↓
User acceptance testing
↓
Production approval
↓
Deploy to Production
```
