
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { messageSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const threadId = req.nextUrl.searchParams.get('threadId');
  if (!threadId) {
    return NextResponse.json({ error: 'threadId is required' }, { status: 400 });
  }

  const { data: thread } = await supabaseAdmin
    .from('chat_threads')
    .select('*')
    .eq('id', threadId)
    .or(landlord_id.eq.${auth.user.id},tenant_id.eq.${auth.user.id})
    .single();

  if (!thread) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from('chat_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('sent_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const body = await req.json();
  const parsed = messageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: thread } = await supabaseAdmin
    .from('chat_threads')
    .select('*')
    .eq('id', parsed.data.threadId)
    .or(landlord_id.eq.${auth.user.id},tenant_id.eq.${auth.user.id})
    .single();

  if (!thread) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from('chat_messages')
    .insert({
      thread_id: parsed.data.threadId,
      sender_id: auth.user.id,
      text: parsed.data.text,
      sent_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: data }, { status: 201 });
}
