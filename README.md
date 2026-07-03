# TED OS

TED OS is TEDvisory's internal operating system built on top of Zoho CRM.

## v1.0.0 Prototype

This version introduces the complete TED OS operating interface:

- Dashboard
- Student 360
- Admissions Board
- Visa Board
- Finance Overview
- Documents Centre
- AI Copilot shell

Zoho CRM remains the system of record. TED OS is the experience layer.

## Local Development

```bash
cd apps/dashboard
npm install
npm run dev
```

## Build

```bash
cd apps/dashboard
npm run build
```

## Product Principle

One student should feel like one workspace, even when the underlying data lives across multiple Zoho modules.
