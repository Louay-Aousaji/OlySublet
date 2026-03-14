import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { listingSchema } from '../../../lib/validation';
import { CONTRACT_STATUS, LISTING_STATUS } from '../../../lib/constants';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('listings_public_view')
    .select('*')
    .eq('listing_status', LISTING_STATUS.PUBLISHED)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listings: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const body = await req.json();
  const parsed = listingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('listings')
    .insert({
      landlord_id: auth.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      section: parsed.data.section,
      room_type: parsed.data.roomType,
      pricing_type: parsed.data.pricingType,
      price: parsed.data.price,
      available_from: parsed.data.availableFrom,
      available_until: parsed.data.availableUntil,
      room_size: parsed.data.roomSize,
      furnished: parsed.data.furnished,
      listing_status: LISTING_STATUS.DRAFT,
      contract_status: CONTRACT_STATUS.MISSING,
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listing: data }, { status: 201 });
}
