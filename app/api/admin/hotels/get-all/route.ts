import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hotel_settings')
      .select('*');

    if (error) return NextResponse.json({});

    const result: Record<string, object> = {};
    data?.forEach((row: { hotel_slug: string; hotel_name: string; custom_description: string; announcement: string }) => {
      let extra: Record<string, unknown> = {};
      try { extra = JSON.parse(row.announcement || '{}'); } catch {}
      result[row.hotel_slug] = {
        name: row.hotel_name,
        description: row.custom_description,
        ...extra,
      };
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({});
  }
}
