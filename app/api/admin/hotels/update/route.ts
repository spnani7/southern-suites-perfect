import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { hotelSlug, ...data } = body;

  try {
    const { error } = await supabaseAdmin
      .from('hotel_settings')
      .upsert({
        hotel_slug: hotelSlug,
        hotel_name: data.name,
        custom_description: data.description,
        announcement: JSON.stringify({
          phone: data.phone,
          maps_link: data.maps_link,
          amenities: data.amenities,
          highlights: data.highlights,
          rooms: data.rooms,
        }),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'hotel_slug' });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
