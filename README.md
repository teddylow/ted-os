# TED OS

TED OS is TEDvisory's internal operating system built on top of Zoho CRM.

## Purpose

TED OS turns Zoho CRM into a student-first education agency command centre. Zoho remains the database and automation engine; TED OS becomes the clean operational interface for counsellors, visa support, finance, and management.

## Current Version

**TED OS Widget v2**

### Current capabilities

- Zoho CRM Widget for the homepage dashboard
- Reads live Deals data from Zoho CRM
- Student-first cards using Contact Name
- Admissions, Offer, CAS / COE, Visa and Approved queues
- Smart urgency scoring
- Counsellor workload summary
- Search and filters
- Stage snapshot
- Debug log for Zoho SDK troubleshooting

## Project Structure

```text
ted-os/
├── widget/
│   └── src/
│       ├── index.html
│       ├── style.css
│       └── app.js
├── docs/
│   └── ROADMAP.md
├── releases/
│   └── v2/
│       └── README.md
├── assets/
├── .gitignore
└── README.md
```

## Zoho Deployment

To deploy the current widget:

1. Zip the files inside `widget/src`.
2. Go to Zoho CRM → Setup → Developer Space → Widgets.
3. Upload the ZIP.
4. Set `index.html` as the entry file.
5. Add the widget to the Zoho CRM homepage dashboard.

## Direction

TED OS will eventually include:

- Student 360 view
- Admissions workspace
- Visa workspace
- Finance dashboard
- AI assistant
- Student portal
- Parent portal
- Management analytics
