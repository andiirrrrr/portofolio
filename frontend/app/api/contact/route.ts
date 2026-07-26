import { NextResponse } from 'next/server';

/**
 * Endpoint lokal untuk menyimpan kontak ke Laravel admin.
 * Di Vercel/production, Contact Form mengirim lewat FormSubmit langsung dari browser
 * (FormSubmit menolak request dari server/API route).
 */
async function sendViaLaravel(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const apiBase =
    process.env.CONTACT_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:8000/api/v1';

  const res = await fetch(`${apiBase}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(4000),
  });

  if (!res.ok) {
    throw new Error('Laravel contact endpoint failed');
  }

  return res.json();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const subject = String(body.subject || 'Contact Form Message').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Nama, email, dan pesan wajib diisi' },
        { status: 400 }
      );
    }

    const data = await sendViaLaravel({ name, email, subject, message });

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim!',
      data,
      channel: 'laravel',
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Gagal mengirim pesan';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
