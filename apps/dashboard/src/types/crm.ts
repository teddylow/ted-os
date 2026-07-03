export type ZohoLookup = {
  id?: string;
  name?: string;
  email?: string;
};

export type ZohoDeal = {
  id: string;
  Deal_Name?: string;
  Contact_Name?: ZohoLookup;
  Account_Name?: ZohoLookup;
  Owner?: ZohoLookup;
  Stage?: string;
  Country?: string;
  Course_Title?: string;
  Program?: string;
  Intake_Month?: string;
  Intake_Year?: string;
  Start_Date?: string;
  End_Date?: string;
  Stage_Modified_Time?: string;
  Last_Activity_Time?: string;
  Modified_Time?: string;
  Created_Time?: string;
  Priority?: boolean;
  Priority_Level?: string | null;
  Zia_Score?: number | null;
  Request?: string | null;
  Email?: string | null;
  Mobile?: string | null;
  Student_Applicant_ID?: string | null;
  Student_Type?: string | null;
  Degree_Entry_Level?: string | null;
  Tuition_Fee?: string | null;
  Amount?: number | null;
  Expected_Revenue?: number | null;
  Scholarships?: number | null;
  Submission_Date?: string | null;
  Offer_Acceptance_Deadline?: string | null;
  Condition?: string | null;
  Remarks?: string | null;
  Description?: string | null;
  Portal?: string | null;
  Username?: string | null;
  Password?: string | null;
  Course_Link?: string | null;
  To_Sub_Agent?: string | null;
  Sub_Agent?: string | null;
  Offer_Attachment?: Array<{
    file_Name?: string;
    file_Size?: string;
    extn?: string;
  }> | null;
};

export type VisaCase = {
  id: string;
  student: string;
  country: string;
  visaType: string;
  stage: string;
  owner: string;
  daysInStage: number;
};

export type CaseBucket =
  | 'urgent'
  | 'applications'
  | 'offer'
  | 'accepted'
  | 'cas'
  | 'visa'
  | 'won'
  | 'lost'
  | 'other';

export type StudentCase = {
  id: string;
  student: string;
  university: string;
  owner: string;
  course: string;
  country: string;
  flag: string;
  intake: string;
  stage: string;
  bucket: CaseBucket;
  stageAge: number | null;
  startCountdown: number | null;
  healthScore: number;
  urgency: {
    score: number;
    level: 'Critical' | 'High' | 'Watch' | 'On track';
    color: 'red' | 'orange' | 'yellow' | 'green';
    reasons: string[];
  };
  raw: ZohoDeal;
};

export type Workspace = 'dashboard' | 'students' | 'admissions' | 'visa' | 'finance' | 'documents' | 'ai';
