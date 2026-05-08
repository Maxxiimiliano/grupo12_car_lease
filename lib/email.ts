import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface VisitRequestData {
  vehicleName: string;
  vehicleId: string;
  officeName: string;
  officeAddress: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  message?: string;
}

export async function sendVisitRequest(data: VisitRequestData) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@carlease.es";
  const vehicleUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sale/${data.vehicleId}`;

  await resend.emails.send({
    from: "CarLease <onboarding@resend.dev>",
    to: adminEmail,
    replyTo: data.customerEmail,
    subject: `🚗 Solicitud de visita – ${data.vehicleName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;">
        <h1 style="color:#16a34a;font-size:22px;margin-bottom:8px;">Nueva solicitud de visita</h1>
        <p style="color:#4b5563;margin-bottom:24px;">Un cliente quiere visitar el vehículo <strong>${data.vehicleName}</strong>.</p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:20px;">
          <h2 style="font-size:16px;color:#111827;margin:0 0 12px;">Datos del cliente</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="color:#6b7280;padding:4px 0;">Nombre</td><td style="font-weight:600;text-align:right;">${data.customerName}</td></tr>
            <tr><td style="color:#6b7280;padding:4px 0;">Email</td><td style="font-weight:600;text-align:right;">${data.customerEmail}</td></tr>
            <tr><td style="color:#6b7280;padding:4px 0;">Teléfono</td><td style="font-weight:600;text-align:right;">${data.customerPhone}</td></tr>
            <tr><td style="color:#6b7280;padding:4px 0;">Fecha preferida</td><td style="font-weight:600;text-align:right;">${data.preferredDate}</td></tr>
          </table>
        </div>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;margin-bottom:20px;">
          <h2 style="font-size:16px;color:#111827;margin:0 0 12px;">Oficina de visita</h2>
          <p style="margin:0;color:#374151;">${data.officeName}</p>
          <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">${data.officeAddress}</p>
        </div>

        ${data.message ? `<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px;margin-bottom:20px;"><p style="margin:0;font-size:14px;color:#374151;font-style:italic;">"${data.message}"</p></div>` : ""}

        <a href="${vehicleUrl}" style="display:inline-block;padding:10px 20px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Ver vehículo</a>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">CarLease · DAM Grupo 12</p>
      </div>
    `,
  });

  await resend.emails.send({
    from: "CarLease <onboarding@resend.dev>",
    to: data.customerEmail,
    subject: "✅ Solicitud de visita recibida – CarLease",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;">
        <h1 style="color:#16a34a;font-size:22px;margin-bottom:8px;">¡Solicitud recibida!</h1>
        <p style="color:#4b5563;margin-bottom:24px;">Hola ${data.customerName}, hemos recibido tu solicitud para visitar el <strong>${data.vehicleName}</strong>.</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;">
          <p style="margin:0;color:#374151;">📍 <strong>${data.officeName}</strong></p>
          <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">${data.officeAddress}</p>
          <p style="margin:12px 0 0;color:#374151;">📅 Fecha preferida: <strong>${data.preferredDate}</strong></p>
        </div>
        <p style="color:#6b7280;margin-top:20px;font-size:14px;">Nuestro equipo se pondrá en contacto contigo para confirmar la cita. Responde a este email si tienes alguna pregunta.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:32px;">CarLease · DAM Grupo 12</p>
      </div>
    `,
  });
}

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
