import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { hotelSlug, imageUrl } = await req.json();

    // Extract file path from URL
    const urlParts = imageUrl.split('/hotel-images/');
    const filePath = urlParts[1];

    if (filePath) {
      await supabaseAdmin.storage.from('hotel-images').remove([filePath]);
    }

    // Remove from hotel_settings
    const { data: existing } = await supabaseAdmin
      .from('hotel_settings')
      .select('images')
      .eq('hotel_slug', hotelSlug)
      .single();

    const currentImages: string[] = existing?.images || [];
    const newImages = currentImages.filter((img: string) => img !== imageUrl);

    await supabaseAdmin
      .from('hotel_settings')
      .upsert({
        hotel_slug: hotelSlug,
        images: newImages,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'hotel_slug' });

    return NextResponse.json({ success: true, images: newImages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
