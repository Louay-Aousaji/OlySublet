import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { LISTING_STATUS } from '@/lib/constants';

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { data, error } = await supabaseAdmin
    .from('admin_listing_review_view')
    .select('*')
    .eq('listing_status', LISTING_STATUS.PENDING_REVIEW)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listings: data });
}
