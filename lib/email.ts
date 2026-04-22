import { Resend } from 'resend';
import { formatCurrency, formatDate } from './utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmationEmail(booking: {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  hotelName: string;
  hotelPhone: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  roomPrice: number;
  taxes: number;
  totalAmount: number;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; background: #f9f5ed; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e8e0cc; }
  .header { background: #0a0a0a; padding: 32px; text-align: center; }
  .header h1 { color: #c9a84c; font-family: Georgia, serif; font-size: 22px; margin: 0 0 4px; letter-spacing: 0.1em; }
  .header p { color: rgba(255,255,255,0.5); font-size: 11px; margin: 0; letter-spacing: 0.15em; text-transform: uppercase; }
  .badge { background: #c9a84c; color: #0a0a0a; text-align: center; padding: 12px; font-size: 13px; letter-spacing: 0.05em; }
  .body { padding: 32px; }
  .greeting { font-size: 16px; color: #1a1209; margin-bottom: 24px; font-family: Georgia, serif; }
  .booking-id { background: #f9f5ed; border: 1px solid #e8e0cc; padding: 16px; text-align: center; margin-bottom: 24px; }
  .booking-id-label { font-size: 10px; color: #b8963e; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 6px; }
  .booking-id-val { font-size: 24px; color: #1a1209; font-family: Georgia, serif; letter-spacing: 0.1em; }
  .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #b8963e; border-bottom: 1px solid #e8e0cc; padding-bottom: 8px; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  td { padding: 8px 0; font-size: 13px; border-bottom: 0.5px solid #f0ebe0; }
  td:first-child { color: #6b6b6b; width: 45%; }
  td:last-child { color: #1a1209; font-weight: normal; text-align: right; }
  .total-row td { font-size: 15px; font-family: Georgia, serif; border-bottom: none; padding-top: 12px; }
  .footer { background: #0a0a0a; padding: 24px; text-align: center; }
  .footer p { color: rgba(255,255,255,0.35); font-size: 11px; line-height: 1.7; margin: 0; }
  .footer a { color: #c9a84c; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Southern Suites</h1>
    <p>Hotels &amp; Resorts · Booking Confirmation</p>
  </div>
  <div class="badge">✓ &nbsp; Your booking is confirmed</div>
  <div class="body">
    <p class="greeting">Dear ${booking.guestName},</p>
    <p style="color:#6b6b6b;font-size:13px;line-height:1.7;margin-bottom:24px;">
      Thank you for choosing Hotel Southern Suites. Your reservation has been confirmed and we look forward to welcoming you.
    </p>
    <div class="booking-id">
      <div class="booking-id-label">Booking Reference</div>
      <div class="booking-id-val">${booking.bookingId}</div>
    </div>
    <div class="section-title">Stay Details</div>
    <table>
      <tr><td>Property</td><td>${booking.hotelName}</td></tr>
      <tr><td>Room</td><td>${booking.roomName}</td></tr>
      <tr><td>Check-in</td><td>${formatDate(booking.checkIn)} · 12:00 PM</td></tr>
      <tr><td>Check-out</td><td>${formatDate(booking.checkOut)} · 11:00 AM</td></tr>
      <tr><td>Duration</td><td>${booking.nights} Night${booking.nights > 1 ? 's' : ''}</td></tr>
      <tr><td>Guests</td><td>${booking.guests} Guest${booking.guests > 1 ? 's' : ''}</td></tr>
    </table>
    <div class="section-title">Payment Summary</div>
    <table>
      <tr><td>Room Rate (per night)</td><td>${formatCurrency(booking.roomPrice)}</td></tr>
      <tr><td>Subtotal (${booking.nights} nights)</td><td>${formatCurrency(booking.roomPrice * booking.nights)}</td></tr>
      <tr><td>Taxes &amp; Fees (12% GST)</td><td>${formatCurrency(booking.taxes)}</td></tr>
      <tr class="total-row"><td><strong>Total Paid</strong></td><td><strong>${formatCurrency(booking.totalAmount)}</strong></td></tr>
    </table>
    <div class="section-title">Hotel Contact</div>
    <table>
      <tr><td>Property Phone</td><td>${booking.hotelPhone}</td></tr>
      <tr><td>WhatsApp</td><td>+91 96181 38686</td></tr>
    </table>
    <p style="color:#6b6b6b;font-size:12px;line-height:1.7;margin-top:24px;padding-top:16px;border-top:1px solid #e8e0cc;">
      Please present this confirmation (or your Booking ID) at check-in. Check-in time is 12:00 PM and check-out is 11:00 AM. Same-day check-in is available.
    </p>
  </div>
  <div class="footer">
    <p>Hotel Southern Suites · Hotels &amp; Resorts<br>
    9 Properties across Andhra Pradesh &amp; Telangana<br>
    <a href="https://southernsuites.com">southernsuites.com</a></p>
  </div>
</div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'bookings@southernsuites.com',
      to: booking.guestEmail,
      subject: `Booking Confirmed — ${booking.bookingId} | ${booking.hotelName}`,
      html,
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
}
