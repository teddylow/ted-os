# TED OS Architecture

## Architecture Principle

TED OS is the experience and intelligence layer for TEDvisory. Zoho CRM remains the system of record.

```text
TED OS Dashboard
      │
      ▼
TED OS API / Data Layer
      │
      ├── Zoho CRM
      ├── AI Services
      ├── Email / WhatsApp integrations
      ├── File storage
      └── Future finance systems
```

The dashboard must not contain Zoho-specific business logic. Zoho field mappings live in the API/data layer.

## Core Layers

### 1. Dashboard

The staff-facing application.

Primary areas:

- Director Centre
- Student 360
- Admissions Workspace
- Visa Workspace
- University 360
- Finance / Commission
- Command Palette
- AI Copilot

### 2. TED OS API

The backend service that hides Zoho complexity from the frontend.

Responsibilities:

- OAuth token handling
- Zoho API calls
- Data normalization
- Permission enforcement
- Student 360 aggregation
- Commission calculations
- AI context preparation

### 3. TED Data Layer

A domain layer that maps Zoho records into TED OS objects.

```text
Zoho Contact           → Student
Zoho Deal              → Application
Visa_Applications      → Visa Case
Accounts               → University
Products               → Commission Record
Tasks                  → Task
Accommodations         → Accommodation
Flight_and_Arrival     → Flight
```

### 4. AI Layer

TED AI should not be a generic chatbot. It should operate on structured TED OS data.

Examples:

- Summarise student case
- Suggest next action
- Draft WhatsApp
- Draft university email
- Identify overdue visa cases
- Identify Closed Won deals waiting for Product creation

## Student 360 Aggregation

When opening a student, the API should fetch and combine:

- `Contacts`
- `Deals`
- `Visa_Applications`
- `Products`
- `Tasks`
- `Accommodations`
- `Flight_and_Arrival`
- Attachments and Notes where available

Into:

```ts
type Student360 = {
  student: Student;
  applications: Application[];
  visaCases: VisaCase[];
  commissionRecords: CommissionRecord[];
  tasks: Task[];
  accommodations: Accommodation[];
  flights: Flight[];
  timeline: TimelineEvent[];
  health: CaseHealth;
}
```

## Role-Based Access

| Area | Director | Counsellor | Admissions |
|---|---:|---:|---:|
| Dashboard | Yes | Yes | Yes |
| Student 360 | Yes | Yes | Yes |
| Applications | Yes | Yes | Yes |
| Visa | Yes | Yes | Yes |
| Documents | Yes | Yes | Yes |
| AI | Yes | Yes | Yes |
| Finance | Yes | No | No |
| Commission | Yes | No | No |
| Product Creation | Yes | No | No |
| Settings | Yes | No | No |

## Command Palette

The Command Palette is a primary navigation and action layer.

Shortcut:

- macOS: `Cmd + K`
- Windows: `Ctrl + K`

Providers:

- Student provider
- University provider
- Application provider
- Visa provider
- Finance provider
- AI provider
- Settings provider

Each module registers its own searchable commands.

## Development Direction

TED OS should be built as a modular monorepo:

```text
apps/
  api/
  dashboard/
  parent-portal/
packages/
  types/
  ui/
  shared/
  ai/
docs/
```

This keeps the system maintainable as TED OS grows into a full operating platform.
