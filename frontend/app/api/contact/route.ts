import { NextResponse } from 'next/server';
import initialData from '@/lib/initialData.json';

const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL ||
  (initialData.profile as { email?: string })?.email ||
  '';

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

async function sendViaFormSubmit(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!CONTACT_EMAIL) {
    throw new Error('CONTACT_EMAIL belum dikonfigurasi');
  }

  const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      _subject: `[Portfolio] ${payload.subject}`,
      message: payload.message,
      _template: 'table',
    }),
    signal: AbortSignal.timeout(10000),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.success === 'false' || data.success === false) {
    throw new Error(data.message || 'FormSubmit gagal mengirim pesan');
  }

  return data;
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

    const payload = { name, email, subject, message };

    // Localhost / custom API: simpan ke Laravel admin bila tersedia
    const preferLaravel =
      process.env.CONTACT_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NODE_ENV === 'development';

    if (preferLaravel) {
      try {
        const data = await sendViaLaravel(payload);
        return NextResponse.json({
          success: true,
          message: 'Pesan berhasil dikirim!',
          data,
          channel: 'laravel',
        });
      } catch {
        // Fallback ke email bila Laravel lokal tidak jalan
      }
    }

    await sendViaFormSubmit(payload);

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim ke email!',
      channel: 'email',
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Gagal mengirim pesan';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
