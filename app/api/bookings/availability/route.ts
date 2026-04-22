import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hotelSlug = searchParams.get('hotelSlug');
  const roomId = searchParams.get('roomId');

  if (!hotelSlug) return NextResponse.json({ bookedDates: [] });

  try {
    const query = supabaseAdmin
      .from('room_availability')
      .select('room_id, check_in, check_out')
      .eq('hotel_slug', hotelSlug);

    if (roomId) query.eq('room_id', roomId);

    const { data } = await query;

    return NextResponse.json({ availability: data || [] });
  } catch {
    return NextResponse.json({ availability: [] });
  }
}
