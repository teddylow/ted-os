# TED OS AI Project Context

TED OS is the operating system for TEDvisory, an education agency managing overseas study applications, visa workflows, accommodation, flights, commission records, and AI-assisted case management.

## Product Vision

Zoho CRM remains the system of record. TED OS becomes the daily working platform.

## Core Principle

One student should feel like one workspace, even when data lives across multiple Zoho modules.

## Primary Users

- Director: Teddy Low
- Counsellor
- Admissions

## Current Development Priority

Build a working v3 foundation connected to Zoho Sandbox:

1. Student 360
2. Command Palette
3. Director Dashboard
4. Admissions Workspace
5. Visa Workspace
6. Commission Centre

## Key Business Terminology

Use TED OS business language, not Zoho module language:

| Zoho | TED OS |
|---|---|
| Contacts | Students |
| Deals | Applications |
| Accounts | Universities |
| Products | Commission Records |
| Visa_Applications | Visa Cases |

## Non-Negotiable Rules

- Student = Contact.
- Application = Deal.
- University = Account.
- Commission Record = Product.
- Products are created only after Closed Won.
- Finance is Director-only.
- Do not use Zoho `Expected_Revenue` for TED OS commission or finance.
- Revenue in TED OS means TEDvisory commission income.
- TED OS should connect to Zoho Sandbox first before Production.
