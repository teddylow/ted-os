import type { StudentCase, ZohoDeal, ZohoLookup } from '../types/crm';
import { bucketForStage } from './stageMapping';

function lookupName(value: ZohoLookup | undefined, fallback: string): string {
  return value?.name || fallback;
}

function daysBetween(dateString?: string | null): number | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function daysUntil(dateString?: string | null): number | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function countryFlag(country?: string): string {
  const map: Record<string, string> = {
    'United Kingdom': '🇬🇧',
    UK: '🇬🇧',
    Australia: '🇦🇺',
    'New Zealand': '🇳🇿',
    Canada: '🇨🇦',
    USA: '🇺🇸',
    Malaysia: '🇲🇾',
    Singapore: '🇸🇬',
    Ireland: '🇮🇪',
  };

  return country ? map[country] || '🌐' : '🌐';
}

function urgencyFor(deal: ZohoDeal): StudentCase['urgency'] {
  const reasons: string[] = [];
  let score = 0;

  const stage = deal.Stage || '';
  const bucket = bucketForStage(stage);
  const stageAge = daysBetween(deal.Stage_Modified_Time || deal.Modified_Time || deal.Created_Time);
  const lastActivityAge = daysBetween(deal.Last_Activity_Time || deal.Modified_Time);
  const startCountdown = daysUntil(deal.Start_Date);

  if (deal.Priority === true) {
    score += 35;
    reasons.push('Marked priority');
  }

  if (stage === 'Pending Offer (8 weeks passed)') {
    score += 45;
    reasons.push('Offer pending over 8 weeks');
  } else if (stage === 'Pending Offer (3 weeks passed)') {
    score += 30;
    reasons.push('Offer pending over 3 weeks');
  }

  if (bucket === 'cas' && stageAge !== null && stageAge >= 7) {
    score += 25;
    reasons.push(`CAS requested ${stageAge} days ago`);
  }

  if (bucket === 'applications' && stageAge !== null && stageAge >= 14) {
    score += 18;
    reasons.push(`Application stage for ${stageAge} days`);
  }

  if (lastActivityAge !== null && lastActivityAge >= 7 && !['won', 'lost'].includes(bucket)) {
    score += 18;
    reasons.push(`No recent activity for ${lastActivityAge} days`);
  }

  if (startCountdown !== null && startCountdown >= 0 && startCountdown <= 60 && !['won', 'lost'].includes(bucket)) {
    score += 25;
    reasons.push(`Intake starts in ${startCountdown} days`);
  }

  if (score >= 70) return { score, level: 'Critical', color: 'red', reasons };
  if (score >= 40) return { score, level: 'High', color: 'orange', reasons };
  if (score >= 20) return { score, level: 'Watch', color: 'yellow', reasons };
  return { score, level: 'On track', color: 'green', reasons };
}

export function normalizeDeal(deal: ZohoDeal): StudentCase {
  const stage = deal.Stage || 'Unknown';
  const intake = [deal.Intake_Month, deal.Intake_Year].filter(Boolean).join(' ') || 'No intake';
  const urgency = urgencyFor(deal);
  const healthScore = Math.max(0, Math.min(100, 100 - urgency.score));

  return {
    id: deal.id,
    student: lookupName(deal.Contact_Name, 'Unknown student'),
    university: lookupName(deal.Account_Name, 'No institution'),
    owner: lookupName(deal.Owner, 'Unassigned'),
    course: deal.Course_Title || deal.Program || deal.Deal_Name || 'No course',
    country: deal.Country || '—',
    flag: countryFlag(deal.Country),
    intake,
    stage,
    bucket: bucketForStage(stage),
    stageAge: daysBetween(deal.Stage_Modified_Time || deal.Modified_Time || deal.Created_Time),
    startCountdown: daysUntil(deal.Start_Date),
    healthScore,
    urgency,
    raw: deal,
  };
}
