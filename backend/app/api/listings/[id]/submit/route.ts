
import { NextResponse } from 'next/server';
import { requireUser } from '../../../../../lib/auth';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';
import { CONTRACT_STATUS, LISTING_STATUS } from '../../../../../lib/constants';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const { id } = await params;

  const { data: listing, error: listingError } = await supabaseAdmin
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('landlord_id', auth.user.id)
    .single();

  if (listingError || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  const { data: photos } = await supabaseAdmin
    .from('listing_photos')
    .select('id')
    .eq('listing_id', id)
    .limit(1);

  const { data: contract } = await supabaseAdmin
    .from('contracts')
    .select('id')
    .eq('listing_id', id)
    .limit(1)
    .maybeSingle();

  if (!photos?.length) {
    return NextResponse.json({ error: 'At least one room photo is required' }, { status: 400 });
  }

  if (!contract) {
    return NextResponse.json({ error: 'StuWerk contract upload is required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('listings')
    .update({
      listing_status: LISTING_STATUS.PENDING_REVIEW,
      contract_status: CONTRACT_STATUS.PENDING,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listing: data });
}
