export const PUBLIC_PHOTO_BUCKET = 'listing-photos';
export const PRIVATE_CONTRACT_BUCKET = 'stuwerk-contracts';

export const LISTING_STATUS = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
} as const;

export const CONTRACT_STATUS = {
  MISSING: 'missing',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEED_MORE_INFO: 'need_more_info',
} as const;

export const USER_ROLE = {
  STUDENT: 'student',
  ADMIN: 'admin',
} as const;
