import { CHAT_LIMITS } from '@/lib/chatLimits';

export type ChatMessage = {
  id: string;
  name: string;
  message: string;
  timestamp: string;
};

export { CHAT_LIMITS };

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg-1',
  name: 'Andi Ranreng S.',
  message: 'Halo! Selamat datang di Chat Room. Tinggalkan salam singkat — maks 200 karakter.',
  timestamp: new Date(0).toISOString(),
};

const REDIS_KEY = 'portfolio:chat:messages';

function hasRedis() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function redisCommand<T = unknown>(command: (string | number)[]): Promise<T> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Redis error: ${res.status}`);
  }

  const json = await res.json();
  return json.result as T;
}

/** Fallback lokal (hanya 1 instance — cocok untuk dev tanpa Redis) */
let memoryMessages: ChatMessage[] | null = null;

function getMemoryStore(): ChatMessage[] {
  if (!memoryMessages) {
    memoryMessages = [{ ...WELCOME_MESSAGE, timestamp: new Date().toISOString() }];
  }
  return memoryMessages;
}

export async function listChatMessages(): Promise<{
  messages: ChatMessage[];
  shared: boolean;
}> {
  if (hasRedis()) {
    const raw = await redisCommand<string | null>(['GET', REDIS_KEY]);
    if (!raw) {
      const seed = [{ ...WELCOME_MESSAGE, timestamp: new Date().toISOString() }];
      await redisCommand(['SET', REDIS_KEY, JSON.stringify(seed)]);
      return { messages: seed, shared: true };
    }
    const parsed = JSON.parse(raw) as ChatMessage[];
    return { messages: Array.isArray(parsed) ? parsed : [], shared: true };
  }

  return { messages: getMemoryStore(), shared: false };
}

export async function appendChatMessage(input: {
  name: string;
  message: string;
}): Promise<{ message: ChatMessage; shared: boolean }> {
  const name = input.name.trim().slice(0, CHAT_LIMITS.maxNameLength);
  const message = input.message.trim().slice(0, CHAT_LIMITS.maxMessageLength);

  if (!name || !message) {
    throw new Error('Nama dan pesan wajib diisi');
  }

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    message,
    timestamp: new Date().toISOString(),
  };

  if (hasRedis()) {
    const { messages } = await listChatMessages();
    const next = [...messages, newMsg].slice(-CHAT_LIMITS.maxMessages);
    await redisCommand(['SET', REDIS_KEY, JSON.stringify(next)]);
    return { message: newMsg, shared: true };
  }

  const store = getMemoryStore();
  store.push(newMsg);
  if (store.length > CHAT_LIMITS.maxMessages) {
    memoryMessages = store.slice(-CHAT_LIMITS.maxMessages);
  }
  return { message: newMsg, shared: false };
}

export function getChatMode() {
  return hasRedis() ? 'shared' : 'memory';
}
