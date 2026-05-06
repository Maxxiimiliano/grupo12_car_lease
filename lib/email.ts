import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ReservationEmailData {
  to: string;
  customerName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  reservationId: string;
}

export async function sendReservationConfirmation(data: ReservationEmailData) {
  const { to, customerName, vehicleName, startDate, endDate, totalPrice, reservationId } = data;

  await resend.emails.send({
    from: "CarLease <onboarding@resend.dev>",
    to,
    subject: "✅ Reserva confirmada – CarLease",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;">
        <h1 style="color:#2563eb;font-size:24px;margin-bottom:8px;">¡Reserva confirmada!</h1>
        <p style="color:#4b5563;margin-bottom:24px;">Hola ${customerName}, tu pago ha sido procesado correctamente.</p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:24px;">
          <h2 style="font-size:18px;color:#111827;margin:0 0 16px;">${vehicleName}</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#6b7280;padding:6px 0;">Fecha de recogida</td>
              <td style="color:#111827;font-weight:600;text-align:right;">${startDate}</td>
            </tr>
            <tr>
              <td style="color:#6b7280;padding:6px 0;">Fecha de devolución</td>
              <td style="color:#111827;font-weight:600;text-align:right;">${endDate}</td>
            </tr>
            <tr style="border-top:1px solid #e5e7eb;">
              <td style="color:#6b7280;padding:12px 0 6px;">Total pagado</td>
              <td style="color:#2563eb;font-weight:700;font-size:20px;text-align:right;">${totalPrice}</td>
            </tr>
          </table>
        </div>

        <p style="color:#6b7280;font-size:14px;">Nº de reserva: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;">${reservationId}</code></p>

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-reservations"
           style="display:inline-block;margin-top:24px;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
          Ver mis reservas
        </a>

        <p style="color:#9ca3af;font-size:12px;margin-top:32px;">CarLease · DAM Grupo 12</p>
      </div>
    `,
  });
}
