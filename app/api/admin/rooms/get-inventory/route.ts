import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data } = await supabaseAdmin.from('room_inventory').select('room_id, total_rooms');
    const inventory: Record<string, number> = {};
    data?.forEach((r: { room_id: string; total_rooms: number }) => { inventory[r.room_id] = r.total_rooms; });
    return NextResponse.json({ inventory });
  } catch {
    return NextResponse.json({ inventory: {} });
  }
}
