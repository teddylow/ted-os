# TED OS Zoho Mapping

This file gives coding agents the canonical Zoho-to-TED OS mapping.

## Module API Names

| TED OS Domain | Zoho Module | API Name |
|---|---|---|
| Student | Contacts | `Contacts` |
| Application | Deals | `Deals` |
| Visa Case | Visa Applications | `Visa_Applications` |
| University | Accounts / Institutions | `Accounts` |
| Commission Record | Products | `Products` |
| Task | Tasks | `Tasks` |
| Accommodation | Accommodations | `Accommodations` |
| Flight | Flights | `Flight_and_Arrival` |

## Application / Deals Fields

Important fields identified from TEDvisory CRM:

- `id`
- `Owner`
- `Contact_Name`
- `Student_Applicant_ID`
- `Account_Name`
- `Country`
- `Course_Title`
- `Degree_Entry_Level`
- `Program`
- `Qualification_Title`
- `Intake_Month`
- `Intake_Year`
- `Start_Date`
- `End_Date`
- `Stage`
- `Pipeline`
- `Priority`
- `Closing_Date`
- `Offer_Acceptance_Deadline`
- `Submission_Date`
- `Tuition_Fee`
- `Currency`
- `Application_Fee`
- `Scholarships`
- `Portal_Link`
- `Username`
- `Password`
- `Offer_Attachment`
- `Record_Image`
- `Lead_Source`
- `Priority_Level`
- `Next_Task_Due_Date`
- `Last_Note_Added_On`
- `Last_Email_Sent_On`

## Important Finance Rule

Do not use `Expected_Revenue` for TED OS finance or commission.

`Expected_Revenue` is Zoho Analytics / CRM forecasting only.

## Student Grouping

Applications must be grouped by:

```text
Deal.Contact_Name.id
```

Do not group by applicant ID because `Student_Applicant_ID` belongs to each application, not the student.

## Product / Commission Mapping

Zoho `Products` are displayed as `Commission Records` in TED OS.

Products are created only after a Deal becomes `Closed Won` and Director approves product creation.
