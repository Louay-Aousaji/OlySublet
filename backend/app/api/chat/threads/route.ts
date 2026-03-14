import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const { data, error } = await supabaseAdmin
    .from('chat_threads')
    .select('*')
    .or(`landlord_id.eq.${auth.user.id},tenant_id.eq.${auth.user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ threads: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const { listingId } = await req.json();

  const { data: listing, error: listingError } = await supabaseAdmin
    .from('listings')
    .select('id, landlord_id, listing_status')
    .eq('id', listingId)
    .single();

  if (listingError || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  if (listing.landlord_id === auth.user.id) {
    return NextResponse.json({ error: 'Cannot open tenant chat with your own listing' }, { status: 400 });
  }

  const { data: existing } = await supabaseAdmin
    .from('chat_threads')
    .select('*')
    .eq('listing_id', listingId)
    .eq('tenant_id', auth.user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ thread: existing });
  }

  const { data, error } = await supabaseAdmin
    .from('chat_threads')
    .insert({
      listing_id: listingId,
      landlord_id: listing.landlord_id,
      tenant_id: auth.user.id,
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ thread: data }, { status: 201 });
}
