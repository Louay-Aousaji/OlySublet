import { z } from 'zod';

export const listingSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  section: z.enum(['Bungalow', 'Hochhaus A', 'Hochhaus B', 'WG']),
  roomType: z.enum(['Einzelapartement', 'WG room']),
  pricingType: z.enum(['Per month', 'Per night']),
  price: z.number().positive(),
  availableFrom: z.string().min(1),
  availableUntil: z.string().min(1),
  roomSize: z.string().min(1),
  furnished: z.string().min(1),
});

export const reviewSchema = z.object({
  listingId: z.string().uuid(),
  decision: z.enum(['approved', 'rejected', 'need_more_info']),
  notes: z.string().optional().default(''),
});

export const messageSchema = z.object({
  threadId: z.string().uuid(),
  text: z.string().min(1).max(2000),
});
