import { NextResponse } from 'next/server';
import { hasSupabaseConfig } from '@/lib/supabase-admin';
export async function GET() { return NextResponse.json({ ok: true, app: 'BookFlow Beauty', backend: hasSupabaseConfig() ? 'configured' : 'demo-mode' }); }
