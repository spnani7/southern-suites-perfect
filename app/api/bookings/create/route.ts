import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendBookingConfirmationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const bookingData = {
    booking_id: body.bookingId,
    hotel_id: body.hotelId,
    hotel_name: body.hotelName,
    hotel_slug: body.hotelSlug,
    room_id: body.roomId,
    room_name: body.roomName,
    guest_name: body.guestName,
    guest_email: body.guestEmail,
    guest_phone: body.guestPhone,
    check_in: body.checkIn,
    check_out: body.checkOut,
    nights: body.nights,
    guests: body.guests,
    room_price: body.roomPrice,
    taxes: body.taxes,
    total_amount: body.totalAmount,
    payment_status: body.razorpayPaymentId === 'DEMO_PAYMENT' ? 'pending' : 'paid',
    booking_status: body.razorpayPaymentId === 'DEMO_PAYMENT' ? 'pending' : 'confirmed',
    razorpay_order_id: body.razorpayOrderId,
    razorpay_payment_id: body.razorpayPaymentId,
    special_requests: body.specialRequests,
  };

  try {
    // Save booking
    const { error } = await supabaseAdmin.from('bookings').insert([bookingData]);
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Save room availability
    await supabaseAdmin.from('room_availability').insert([{
      room_id: body.roomId,
      hotel_slug: body.hotelSlug,
      booking_id: body.bookingId,
      check_in: body.checkIn,
      check_out: body.checkOut,
    }]);

    // Send confirmation email
    sendBookingConfirmationEmail({
      bookingId: body.bookingId,
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      hotelName: body.hotelName,
      hotelPhone: body.hotelPhone || '',
      roomName: body.roomName,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      nights: body.nights,
      guests: body.guests,
      roomPrice: body.roomPrice,
      taxes: body.taxes,
      totalAmount: body.totalAmount,
    }).catch(console.error);

    return NextResponse.json({ success: true, bookingId: body.bookingId });
  } catch (err) {
    console.error('Booking creation error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
