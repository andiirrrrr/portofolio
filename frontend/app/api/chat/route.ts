import { NextResponse } from 'next/server';

// Memory store publik untuk pesan chat room terpusat (dapat diakses oleh HP, Laptop, dan semua pengunjung Vercel)
let chatMessages: Array<{ id: string; name: string; message: string; timestamp: string }> = [
  {
    id: 'welcome-msg-1',
    name: 'Andi Ranreng S.',
    message: 'Halo! Selamat datang di Chat Room portofolio saya. Silakan tinggalkan pesan atau salam di sini!',
    timestamp: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: chatMessages,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, message } = body;

    if (!name || !message) {
      return NextResponse.json({ error: 'Nama dan pesan wajib diisi' }, { status: 400 });
    }

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    chatMessages.push(newMsg);

    // Simpan maksimal 100 pesan terakhir
    if (chatMessages.length > 100) {
      chatMessages = chatMessages.slice(-100);
    }

    return NextResponse.json({
      success: true,
      data: newMsg,
    });
  } catch {
    return NextResponse.json({ error: 'Gagal mengirim pesan' }, { status: 500 });
  }
}
