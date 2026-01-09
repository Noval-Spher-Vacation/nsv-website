import { Context } from "hono";
import { z } from "zod";

// Lead stage types
export type LeadStage = 
  | 'New'
  | 'Yet To Talk'
  | 'Followup'
  | 'Hot'
  | 'Proposal Presented'
  | 'Converted'
  | 'Cold'
  | 'Lost'
  | 'Duplicate';

export type ActivityType = 
  | 'call'
  | 'whatsapp'
  | 'email'
  | 'note'
  | 'status_change'
  | 'followup_scheduled'
  | 'converted';

// Validation schemas
export const createLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.string().default('website'),
  destination_interest: z.string().optional(),
  budget_range: z.string().optional(),
  travel_month: z.string().optional(),
  pax_count: z.number().optional(),
  notes: z.string().optional(),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_content: z.string().optional(),
});

export const updateLeadSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  stage: z.enum([
    'New', 'Yet To Talk', 'Followup', 'Hot', 
    'Proposal Presented', 'Converted', 'Cold', 'Lost', 'Duplicate'
  ]).optional(),
  assigned_to_user_id: z.string().optional(),
  next_followup_at: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  travel_start_date: z.string().optional(),
  travel_end_date: z.string().optional(),
  destination_interest: z.string().optional(),
  budget_range: z.string().optional(),
  pax_count: z.number().optional(),
});

export const createActivitySchema = z.object({
  type: z.enum(['call', 'whatsapp', 'email', 'note', 'status_change', 'followup_scheduled', 'converted']),
  payload: z.record(z.any()).optional(),
});

// Helper functions
export function getLeadStageColor(stage: LeadStage): string {
  const colors: Record<LeadStage, string> = {
    'New': '#3B82F6',
    'Yet To Talk': '#8B5CF6',
    'Followup': '#F59E0B',
    'Hot': '#EF4444',
    'Proposal Presented': '#10B981',
    'Converted': '#059669',
    'Cold': '#6B7280',
    'Lost': '#DC2626',
    'Duplicate': '#9CA3AF',
  };
  return colors[stage] || '#6B7280';
}

export function calculateFollowupBucket(followupDate: string | null): string | null {
  if (!followupDate) return null;
  
  const now = new Date();
  const followup = new Date(followupDate);
  const diffMs = followup.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  if (diffDays <= 7) return 'next_7_days';
  if (diffDays <= 30) return 'next_30_days';
  
  return 'later';
}

export async function logActivity(
  c: Context,
  leadId: number,
  type: ActivityType,
  payload: any,
  userId: string
) {
  await c.env.DB.prepare(
    `INSERT INTO lead_activities (lead_id, type, payload, created_by_user_id)
     VALUES (?, ?, ?, ?)`
  )
    .bind(leadId, type, JSON.stringify(payload), userId)
    .run();
}

export async function logAudit(
  c: Context,
  userId: string,
  action: string,
  entityType: string,
  entityId: string | number,
  changes: any
) {
  await c.env.DB.prepare(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes)
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(userId, action, entityType, String(entityId), JSON.stringify(changes))
    .run();
}
