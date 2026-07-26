import { NextResponse } from 'next/server';
import {
  appendChatMessage,
  CHAT_LIMITS,
  getChatMode,
  listChatMessages,
} from '@/lib/chatStore';

export async function GET() {
  try {
    const { messages, shared } = await listChatMessages();
    return NextResponse.json({
      success: true,
      data: messages,
      shared,
      mode: getChatMode(),
      limits: CHAT_LIMITS,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Gagal memuat pesan' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || '');
    const message = String(body.message || '');

    if (!name.trim() || !message.trim()) {
      return NextResponse.json(
        { error: 'Nama dan pesan wajib diisi' },
        { status: 400 }
      );
    }

    if (message.trim().length > CHAT_LIMITS.maxMessageLength) {
      return NextResponse.json(
        {
          error: `Pesan maksimal ${CHAT_LIMITS.maxMessageLength} karakter`,
        },
        { status: 400 }
      );
    }

    const { message: newMsg, shared } = await appendChatMessage({ name, message });

    return NextResponse.json({
      success: true,
      data: newMsg,
      shared,
      mode: getChatMode(),
      limits: CHAT_LIMITS,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal mengirim pesan';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
