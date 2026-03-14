import { NextResponse } from 'next/server';
import { getServerSupabase } from './supabaseServer';
import { supabaseAdmin } from './supabaseAdmin';

export async function requireUser() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return { error: NextResponse.json({ error: 'Profile not found' }, { status: 404 }) };
  }

  return { user, profile };
}

export async function requireAdmin() {
  const result = await requireUser();
  if ('error' in result) return result;

  if (result.profile.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return result;
}
