
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { CONTRACT_STATUS, LISTING_STATUS } from '@/lib/constants';
import { reviewSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const decisionMap = {
    approved: {
      listingStatus: LISTING_STATUS.PUBLISHED,
      contractStatus: CONTRACT_STATUS.APPROVED,
    },
    rejected: {
      listingStatus: LISTING_STATUS.REJECTED,
      contractStatus: CONTRACT_STATUS.REJECTED,
    },
    need_more_info: {
      listingStatus: LISTING_STATUS.DRAFT,
      contractStatus: CONTRACT_STATUS.NEED_MORE_INFO,
    },
  } as const;

  const target = decisionMap[parsed.data.decision];

  const { error: contractError } = await supabaseAdmin
    .from('contracts')
    .update({
      review_status: target.contractStatus,
      reviewer_admin_id: auth.user.id,
      review_notes: parsed.data.notes,
      reviewed_at: new Date().toISOString(),
    })
    .eq('listing_id', parsed.data.listingId);

  if (contractError) {
    return NextResponse.json({ error: contractError.message }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('listings')
    .update({
      listing_status: target.listingStatus,
      contract_status: target.contractStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.listingId)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listing: data });
}
