export type UserRole = 'student' | 'admin';

export type ListingSection = 'Bungalow' | 'Hochhaus A' | 'Hochhaus B' | 'WG';
export type RoomType = 'Einzelapartement' | 'WG room';
export type PricingType = 'Per month' | 'Per night';

export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'rejected'
  | 'archived';

export type ContractStatus =
  | 'missing'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'need_more_info';

export interface ListingInput {
  title: string;
  description: string;
  section: ListingSection;
  roomType: RoomType;
  pricingType: PricingType;
  price: number;
  availableFrom: string;
  availableUntil: string;
  roomSize: string;
  furnished: string;
}
