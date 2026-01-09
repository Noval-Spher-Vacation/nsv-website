import { z } from "zod";

export const influencerRequestSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  instagram_handle: z.string().optional(),
  youtube_channel: z.string().optional(),
  audience_size: z.number().int().positive().optional(),
  niche: z.string().optional(),
  preferred_destinations: z.string().optional(),
  payout_preference: z.string().optional(),
  payout_details: z.string().optional(),
  message: z.string().optional(),
});

export const createInfluencerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  social_handles: z.object({
    instagram: z.string().optional(),
    youtube: z.string().optional(),
  }).optional(),
  commission_type: z.enum(["percent", "fixed"]),
  commission_value: z.number().min(0),
  attribution_window_days: z.number().int().min(1).default(30),
  payout_preference: z.string().optional(),
  payout_details: z.string().optional(),
});

export const updateInfluencerSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  social_handles: z.object({
    instagram: z.string().optional(),
    youtube: z.string().optional(),
  }).optional(),
  status: z.enum(["active", "paused"]).optional(),
  commission_type: z.enum(["percent", "fixed"]).optional(),
  commission_value: z.number().min(0).optional(),
  attribution_window_days: z.number().int().min(1).optional(),
  payout_preference: z.string().optional(),
  payout_details: z.string().optional(),
});

export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "NSV-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function calculateCommission(
  influencer: any,
  orderAmount: number
): Promise<number> {
  if (influencer.commission_type === "percent") {
    return (orderAmount * influencer.commission_value) / 100;
  } else {
    return influencer.commission_value;
  }
}
