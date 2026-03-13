import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from('listings_public_view')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  return NextResponse.json({ listing: data });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();

  const { data: listing, error: listingError } = await supabaseAdmin
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('landlord_id', auth.user.id)
    .single();

  if (listingError || !listing) {
    return NextResponse.json({ error: 'Listing not found or forbidden' }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from('listings')
    .update({
      ...body,
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
