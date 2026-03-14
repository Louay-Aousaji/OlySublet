import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { CONTRACT_STATUS, PRIVATE_CONTRACT_BUCKET } from '@/lib/constants';

export async function POST(req: Request) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const listingId = formData.get('listingId') as string | null;

  if (!file || !listingId) {
    return NextResponse.json({ error: 'file and listingId are required' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const path = ${auth.user.id}/${listingId}/${Date.now()}-${file.name};

  const { error: uploadError } = await supabaseAdmin.storage
    .from(PRIVATE_CONTRACT_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('contracts')
    .upsert({
      listing_id: listingId,
      landlord_id: auth.user.id,
      storage_path: path,
      file_name: file.name,
      review_status: CONTRACT_STATUS.PENDING,
      uploaded_at: new Date().toISOString(),
    }, { onConflict: 'listing_id' })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabaseAdmin
    .from('listings')
    .update({ contract_status: CONTRACT_STATUS.PENDING })
    .eq('id', listingId);

  return NextResponse.json({ contract: data }, { status: 201 });
}

