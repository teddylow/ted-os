import type { CaseBucket } from '../types/crm';

export const APPLICATION_STAGES = [
  'Preparing Documents',
  'Admissions',
  'Submitted',
  'Submitted (TOP University)',
  'Pending Offer (3 weeks passed)',
  'Pending Offer (8 weeks passed)',
  'Conditional Offer',
  'Unconditional Offer',
  'Conditional - Accepted (Insurance)',
  'Unconditional - Accepted (Insurance)',
  'Conditional - Accepted (Firm)',
  'Unconditional - Accepted (Firm)',
  'DEFER',
  'Request CAS',
  'Closed Won',
  'Closed Lost',
];

export const VISA_STAGES = [
  'New',
  'In Progress',
  'On Hold - No Questionnaire',
  'On Hold - No CAS',
  'On Hold - Insufficient Info',
  'Return to Applicant (Unsatisfied State)',
  'Ready for Checking',
  'Done Checking',
  'Payment Instruction',
  'Submitted Online',
  'Submitted Biometrics',
  'Invite to Submit Passport',
  'Passport Ready',
  'Visa Approved',
  'Visa Rejected',
];

export const STAGE_BUCKETS: Record<Exclude<CaseBucket, 'urgent' | 'other'>, string[]> = {
  applications: [
    'Preparing Documents',
    'Admissions',
    'Submitted',
    'Submitted (TOP University)',
  ],
  offer: [
    'Pending Offer (3 weeks passed)',
    'Pending Offer (8 weeks passed)',
    'Conditional Offer',
    'Unconditional Offer',
  ],
  accepted: [
    'Conditional - Accepted (Insurance)',
    'Unconditional - Accepted (Insurance)',
    'Conditional - Accepted (Firm)',
    'Unconditional - Accepted (Firm)',
  ],
  cas: ['Request CAS'],
  visa: [],
  won: ['Closed Won'],
  lost: ['Closed Lost', 'DEFER'],
};

export function bucketForStage(stage?: string): CaseBucket {
  if (!stage) return 'other';

  for (const [bucket, stages] of Object.entries(STAGE_BUCKETS)) {
    if (stages.includes(stage)) {
      return bucket as CaseBucket;
    }
  }

  return 'other';
}

export function progressForStage(stage?: string): number {
  const progress: Record<string, number> = {
    'Preparing Documents': 12,
    Admissions: 20,
    Submitted: 32,
    'Submitted (TOP University)': 32,
    'Pending Offer (3 weeks passed)': 42,
    'Pending Offer (8 weeks passed)': 42,
    'Conditional Offer': 52,
    'Unconditional Offer': 60,
    'Conditional - Accepted (Insurance)': 64,
    'Unconditional - Accepted (Insurance)': 68,
    'Conditional - Accepted (Firm)': 72,
    'Unconditional - Accepted (Firm)': 76,
    'Request CAS': 82,
    'Closed Won': 100,
  };

  return progress[stage || ''] ?? 10;
}
