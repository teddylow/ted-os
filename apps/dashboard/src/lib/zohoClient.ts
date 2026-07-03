import type { VisaCase, ZohoDeal } from '../types/crm';
import { mockDeals, mockVisaCases } from './mockData';

declare global {
  interface Window {
    ZOHO?: any;
  }
}

export async function loadZohoDeals(): Promise<ZohoDeal[]> {
  const zoho = window.ZOHO;

  if (!zoho?.CRM?.API?.getAllRecords) {
    return mockDeals;
  }

  const allDeals: ZohoDeal[] = [];

  for (let page = 1; page <= 4; page += 1) {
    const response = await zoho.CRM.API.getAllRecords({
      Entity: 'Deals',
      sort_order: 'desc',
      sort_by: 'Modified_Time',
      page,
      per_page: 200,
    });

    const rows = response?.data || [];
    allDeals.push(...rows);

    if (rows.length < 200) break;
  }

  return allDeals;
}

export async function loadVisaCases(): Promise<VisaCase[]> {
  // Placeholder for Sprint 4: connect to the actual Visa Applications module API.
  return mockVisaCases;
}

export async function initializeZohoApp(): Promise<void> {
  const zoho = window.ZOHO;

  if (!zoho?.embeddedApp?.init) {
    return;
  }

  await zoho.embeddedApp.init();
}

export function openZohoDeal(recordId: string): void {
  const zoho = window.ZOHO;

  try {
    if (zoho?.CRM?.UI?.Record?.open) {
      zoho.CRM.UI.Record.open({ Entity: 'Deals', RecordID: recordId });
      return;
    }
  } catch (error) {
    console.warn('Unable to open Zoho record through SDK', error);
  }

  window.open(`/crm/org/current/tab/Potentials/${recordId}`, '_blank');
}
