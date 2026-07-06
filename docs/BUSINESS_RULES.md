# TEDvisory Business Rules

This document defines the operating rules TED OS must follow.

## Core Object Mapping

| TED OS Term | Zoho Module | API Name |
|---|---|---|
| Student | Contacts | `Contacts` |
| Application | Applications / Deals | `Deals` |
| Visa Case | Visa Applications | `Visa_Applications` |
| University | Institutions | `Accounts` |
| Commission Record | Products | `Products` |
| Task | Tasks | `Tasks` |
| Accommodation | Accommodations | `Accommodations` |
| Flight | Flights | `Flight_and_Arrival` |

## Student Rules

1. Student = Zoho Contact.
2. Student grouping key = `Contact_Name.id` on Deals.
3. One student can have multiple applications.
4. Student 360 must display all records related to one Contact.
5. Staff should not need to know which Zoho module contains the information.

## Application Rules

1. Application = Zoho Deal.
2. The displayed TED OS name should be `Application`, not `Deal`.
3. `Student_Applicant_ID` belongs to the application/deal.
4. Applications are grouped under the student.
5. Closed Lost applications contribute zero commission.
6. Closed Won applications enter the Director Product Approval Queue.

## Product / Commission Rules

1. Zoho `Products` should be displayed in TED OS as `Commission Records`.
2. Product is created only after an application/deal becomes `Closed Won`.
3. Only the Director creates or approves Products.
4. Products represent confirmed commission records.
5. Products should not be assumed to exist for open applications.
6. Finance is Director-only.

## Revenue Rules

1. Revenue in TED OS means TEDvisory commission income.
2. Revenue does not mean student tuition fee.
3. Tuition Fee is an input for estimation.
4. Forecast Commission comes from open applications/deals.
5. Confirmed Commission comes from Products.
6. Commission Received should be tracked separately from Confirmed Commission.
7. Outstanding Commission = Confirmed Commission - Received Commission.

## Forecast Commission Rules

For open applications:

```text
Forecast Commission = Tuition Fee × Estimated Commission Rate
```

If a confirmed expected commission field exists on the application, use that field first.

If commission rate is unknown, TED OS may use a default estimate but must label it as estimated.

## Confirmed Commission Rules

For Closed Won applications:

```text
Confirmed Commission = Product / Commission Record value
```

The Product should include:

- Student
- University
- Application
- Course
- Intake
- Tuition Fee
- Commission Rate
- Expected Commission
- Currency
- Payment Status

## Role Rules

### Director

Can access:

- All modules
- Finance
- Commission
- Product approval
- Reports
- Settings
- AI Director Brief

### Counsellor

Can access:

- Student 360
- Applications
- Visa visibility
- Documents
- Tasks
- AI drafting

Cannot access:

- Finance
- Commission reports
- Product approval

### Admissions

Can access:

- Applications
- Visa
- Documents
- Tasks
- University liaison workflow
- AI drafting

Cannot access:

- Finance
- Commission reports
- Product approval

## Case Health Rules

TED OS should calculate student case health based on operational risk.

Possible risk factors:

- No follow-up in 7 days
- Pending offer for more than 21 days
- CAS not requested after offer acceptance
- Visa not started near intake deadline
- Missing key documents
- Closed Won without Product
- Unresolved task overdue

Suggested bands:

- Green: 0–29 = Healthy
- Amber: 30–59 = Needs Attention
- Red: 60+ = Critical

## Command Palette Rules

The Command Palette should support:

- Search students
- Search universities
- Search applications
- Search visa cases
- Search commission records
- Create task
- Draft WhatsApp
- Draft email
- Open Zoho record
- Show Closed Won awaiting Product creation

## Naming Rules

TED OS should use TEDvisory business language instead of Zoho terminology.

| Zoho Term | TED OS Term |
|---|---|
| Contacts | Students |
| Deals | Applications |
| Accounts | Universities |
| Products | Commission Records |
| Visa_Applications | Visa Cases |
