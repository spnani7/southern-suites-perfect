import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const hotelSlug = formData.get('hotelSlug') as string;

    if (!file || !hotelSlug) {
      return NextResponse.json({ error: 'Missing file or hotelSlug' }, { status: 400 });
    }

    const ext = file.name.split('.').pop();
    const fileName = `${hotelSlug}/${Date.now()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabaseAdmin.storage
      .from('hotel-images')
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('hotel-images')
      .getPublicUrl(fileName);

    // Save image URL to hotel_settings
    const { data: existing } = await supabaseAdmin
      .from('hotel_settings')
      .select('images, hotel_slug')
      .eq('hotel_slug', hotelSlug)
      .single();

    const currentImages: string[] = existing?.images || [];
    const newImages = [...currentImages, urlData.publicUrl];

    await supabaseAdmin
      .from('hotel_settings')
      .upsert({
        hotel_slug: hotelSlug,
        images: newImages,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'hotel_slug' });

    return NextResponse.json({ success: true, url: urlData.publicUrl, images: newImages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
