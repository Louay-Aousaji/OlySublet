import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { PUBLIC_PHOTO_BUCKET } from '@/lib/constants';

export async function POST(req: Request) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const listingId = formData.get('listingId') as string | null;
  const orderIndex = Number(formData.get('orderIndex') ?? 0);

  if (!file || !listingId) {
    return NextResponse.json({ error: 'file and listingId are required' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const path = `${auth.user.id}/${listingId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(PUBLIC_PHOTO_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(PUBLIC_PHOTO_BUCKET)
    .getPublicUrl(path);

  const { data, error } = await supabaseAdmin
    .from('listing_photos')
    .insert({
      listing_id: listingId,
      url: publicUrlData.publicUrl,
      storage_path: path,
      order_index: orderIndex,
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ photo: data }, { status: 201 });
}
