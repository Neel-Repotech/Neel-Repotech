import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
export function hasSupabaseConfig() { return Boolean(url && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && service); }
export function createAdminSupabase() {
  if (!url || !service) throw new Error('Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  return createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
}
