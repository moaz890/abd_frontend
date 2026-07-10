/**
 * lib/leadLabels.ts — display labels for lead enum values.
 * Imported by dashboard to render human-readable lead field values.
 * Phase 16 / referenced by dashboard in Phase 34.
 */

import type { WorkSector, ServiceDuration, LeadState } from './types';

export const WORK_SECTOR_LABELS: Record<WorkSector, string> = {
  government:             'قطاع حكومي',
  private_company:        'شركة خاصة',
  private_establishment:  'منشأة خاصة',
  retired:                'متقاعد',
};

export const SERVICE_DURATION_LABELS: Record<ServiceDuration, string> = {
  less_than_3_months: 'أقل من 3 أشهر',
  more_than_3_months: 'أكثر من 3 أشهر',
};

export const STATE_LABELS: Record<LeadState, string> = {
  citizen:  'مواطن سعودي',
  resident: 'مقيم',
};
