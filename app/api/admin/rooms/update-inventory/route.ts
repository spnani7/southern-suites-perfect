import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { roomId, hotelSlug, totalRooms } = await req.json();
  try {
    const { error } = await supabaseAdmin
      .from('room_inventory')
      .upsert({ room_id: roomId, hotel_slug: hotelSlug, total_rooms: totalRooms, updated_at: new Date().toISOString() }, { onConflict: 'room_id' });
    if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
