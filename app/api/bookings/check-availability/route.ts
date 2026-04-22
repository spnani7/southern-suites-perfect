import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hotelSlug = searchParams.get('hotelSlug');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  if (!hotelSlug || !checkIn || !checkOut) {
    return NextResponse.json({ availability: {} });
  }

  try {
    // Get inventory
    const { data: inventory } = await supabaseAdmin
      .from('room_inventory')
      .select('room_id, total_rooms')
      .eq('hotel_slug', hotelSlug);

    // Get booked rooms for overlapping dates
    const { data: booked } = await supabaseAdmin
      .from('room_availability')
      .select('room_id, rooms_count')
      .eq('hotel_slug', hotelSlug)
      .lt('check_in', checkOut)
      .gt('check_out', checkIn);

    // Calculate booked count per room
    const bookedCount: Record<string, number> = {};
    booked?.forEach((b: { room_id: string; rooms_count: number }) => {
      bookedCount[b.room_id] = (bookedCount[b.room_id] || 0) + (b.rooms_count || 1);
    });

    // Calculate available rooms
    const availability: Record<string, { total: number; booked: number; available: number }> = {};
    inventory?.forEach((inv: { room_id: string; total_rooms: number }) => {
      const booked = bookedCount[inv.room_id] || 0;
      availability[inv.room_id] = {
        total: inv.total_rooms,
        booked,
        available: Math.max(0, inv.total_rooms - booked),
      };
    });

    return NextResponse.json({ availability });
  } catch {
    return NextResponse.json({ availability: {} });
  }
}
