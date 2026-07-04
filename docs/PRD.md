# TED OS Product Requirements Document

## Product Vision

TED OS is the operating system for TEDvisory. Zoho CRM remains the system of record, while TED OS becomes the daily work platform for students, applications, visa operations, finance, commission tracking, and AI-assisted case management.

## Core Principle

One student should feel like one workspace, even when the underlying data lives across multiple Zoho modules.

## Primary Users

### Director

- Full system access
- Finance and commission visibility
- Closed Won to Product approval queue
- Business KPIs
- Staff performance
- AI Director Brief

### Counsellor

- Student 360
- Applications
- Visa visibility
- Documents
- Tasks
- AI drafting and summaries

### Admissions

- Applications
- University liaison
- Offer/CAS/COE workflow
- Visa coordination
- Documents

## Core Data Model

```text
Student = Zoho Contact
University Application = Zoho Deal
Visa Case = Visa_Applications
Product = Created only after Closed Won
Commission Revenue = TEDvisory commission income, not tuition fee
```

## Business Rules

1. Students are grouped by `Contact_Name.id`.
2. `Student_Applicant_ID` belongs to each application/deal.
3. A Deal can become `Closed Won` only when the application is successful.
4. Products are created only after a Deal becomes `Closed Won`.
5. Only the Director creates or approves Products.
6. Open Deals contribute to Forecast Commission.
7. Products contribute to Confirmed Commission.
8. Closed Lost Deals contribute RM 0.
9. Finance is Director-only.
10. Zoho CRM remains the database; TED OS is the working interface.

## Milestones

### v3.0 Foundation

- Clean monorepo structure
- Live Zoho API
- Student 360
- Roles and permissions
- Documentation

### v3.1 Student Workspace

- Student profile
- Multiple applications
- Visa panel
- Document checklist
- Timeline
- AI summary placeholder

### v3.2 Admissions and Visa

- Admissions Kanban
- Visa workspace
- CAS/COE tracking

### v3.3 Director and Finance

- Forecast commission
- Product approval queue
- Confirmed commission
- Outstanding commission

### v3.4 AI Copilot

- Student case summaries
- WhatsApp drafts
- Email drafts
- Daily Director Brief
