'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Loader2, Wifi, WifiOff } from 'lucide-react';
import Aurora from '@/components/aurora/Aurora';
import { sendContact, sendChatMessage, getChatMessages } from '@/lib/api';
import { CHAT_LIMITS } from '@/lib/chatLimits';

interface Message {
    id: string;
    name: string;
    message: string;
    timestamp: string;
    is_own?: boolean;
}

const POLL_INTERVAL = 3000; // polling setiap 3 detik

export default function ChatRoom() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [isNameSet, setIsNameSet] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSectionVisible, setIsSectionVisible] = useState(false);
    const [auroraReady, setAuroraReady] = useState(false);
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const lastTimestampRef = useRef<string | null>(null);
    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const myNameRef = useRef<string>('');

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSectionVisible(entry.isIntersecting);
                if (entry.isIntersecting) {
                    setAuroraReady(true);
                }
            },
            { rootMargin: '250px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Auto scroll container internal chat ke pesan terbaru (tanpa menggeser scroll halaman utama)
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    // Cek user name di localStorage
    useEffect(() => {
        const savedName = localStorage.getItem('chat_user_name');
        if (savedName) {
            setUserName(savedName);
            myNameRef.current = savedName;
            setIsNameSet(true);
        }
    }, []);

    // Fungsi untuk ambil semua pesan dari server
    const fetchMessages = useCallback(async (isInitial = false) => {
        try {
            const res = await getChatMessages();
            const data: Message[] = res.data?.data ?? [];
            setIsShared(Boolean(res.data?.shared));

            if (data.length > 0) {
                const myName = myNameRef.current;
                const newMsgs = data.map((m) => ({
                    ...m,
                    is_own: myName ? m.name === myName : false,
                }));

                if (isInitial) {
                    setMessages(newMsgs);
                } else {
                    setMessages((prev) => {
                        // Hapus pesan temp jika pesan yang sama sudah tiba dari server
                        const cleanPrev = prev.filter(
                            (m) =>
                                !m.id.startsWith('temp-') ||
                                !newMsgs.some((n) => n.name === m.name && n.message === m.message)
                        );
                        const existingIds = new Set(cleanPrev.map((m) => m.id));
                        const uniqueNew = newMsgs.filter((m) => !existingIds.has(m.id));
                        return [...cleanPrev, ...uniqueNew];
                    });
                }
                lastTimestampRef.current = data[data.length - 1].timestamp;
            } else if (isInitial) {
                setMessages([]);
            }
            setIsConnected(true);
        } catch {
            setIsConnected(false);
        } finally {
            if (isInitial) setIsInitialLoading(false);
        }
    }, []);

    // Load awal + polling hanya saat section terlihat (hemat request di Vercel)
    useEffect(() => {
        if (!isSectionVisible) return;

        fetchMessages(true);

        pollIntervalRef.current = setInterval(() => {
            fetchMessages(false);
        }, POLL_INTERVAL);

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [fetchMessages, isSectionVisible]);

    // Set nama pengguna
    const handleSetName = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim()) {
            const trimmedName = userName.trim();
            setUserName(trimmedName);
            myNameRef.current = trimmedName;
            setIsNameSet(true);
            localStorage.setItem('chat_user_name', trimmedName);

            // Re-flag pesan yang sudah ada sebagai milik sendiri atau tidak
            setMessages((prev) =>
                prev.map((m) => ({
                    ...m,
                    is_own: m.name === trimmedName,
                }))
            );
        }
    };

    // Kirim pesan
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !userName.trim() || isSending) return;

        setIsSending(true);
        const messageText = newMessage.trim();
        const senderName = userName.trim();
        setNewMessage('');

        // Optimistic update: tampilkan pesan langsung dengan ID temporary
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: Message = {
            id: tempId,
            name: senderName,
            message: messageText,
            timestamp: new Date().toISOString(),
            is_own: true,
        };
        setMessages((prev) => [...prev, optimisticMsg]);

        try {
            const res = await sendChatMessage({
                name: senderName,
                message: messageText,
            });

            // Ganti ID temporary dengan ID asli dari server
            const serverData = res.data?.data;
            if (serverData && serverData.id) {
                const realId = String(serverData.id);
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === tempId
                            ? {
                                  ...m,
                                  id: realId,
                                  timestamp: serverData.timestamp || m.timestamp,
                              }
                            : m
                    )
                );
            }

            // Polling singkat untuk sinkronisasi
            setTimeout(() => fetchMessages(false), 500);
        } catch {
            // Jika gagal, hapus pesan temporary dan kembalikan isi teks
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
            setNewMessage(messageText);
        } finally {
            setIsSending(false);
        }
    };

    const handleChangeName = () => {
        setIsNameSet(false);
        setUserName('');
        myNameRef.current = '';
        localStorage.removeItem('chat_user_name');
        // Reset semua flag is_own
        setMessages((prev) => prev.map((m) => ({ ...m, is_own: false })));
    };

    return (
        <section ref={sectionRef} className="py-16 md:py-20 px-4 bg-navy-950 relative overflow-hidden">
            {auroraReady && (
                <Aurora
                    colorStops={['#061222', '#123249', '#2D5B75']}
                    speed={0.5}
                    blend={0.5}
                    amplitude={0.8}
                />
            )}

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-8"
                >
                    <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-3">
                        Get In Touch
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Let's Work{' '}
                        <span className="text-gradient">Together</span>
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full mx-auto mt-3" />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* LEFT: Chat Room */}
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="bg-navy-800/80 rounded-2xl border border-navy-700 backdrop-blur-sm overflow-hidden flex flex-col hover:border-blue-500/30 transition-all duration-500 shadow-xl">
                            {/* Chat Header */}
                            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-navy-700 bg-navy-800/60">
                                <div className="flex items-center gap-2">
                                    {isConnected ? (
                                        <Wifi size={13} className="text-green-400" />
                                    ) : (
                                        <WifiOff size={13} className="text-red-400 animate-pulse" />
                                    )}
                                    <span className="text-white font-medium text-sm">
                                        Public Chat Room
                                    </span>
                                    <span className={`text-[10px] ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                                        ● {isConnected ? (isShared ? 'Live' : 'Local') : 'Offline'}
                                    </span>
                                </div>
                                <span className="text-[10px] text-gray-500 hidden sm:inline">
                                    Maks {CHAT_LIMITS.maxMessageLength} karakter · {CHAT_LIMITS.maxMessages} pesan terakhir
                                </span>
                            </div>

                            {/* Set Name Banner */}
                            {!isNameSet ? (
                                <div className="px-4 md:px-5 py-3 border-b border-navy-700/50 bg-blue-500/5">
                                    <form onSubmit={handleSetName} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="Masukkan nama untuk bergabung..."
                                            className="flex-1 px-3 py-2 bg-navy-900/80 border border-navy-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors duration-300"
                                            maxLength={CHAT_LIMITS.maxNameLength}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 whitespace-nowrap"
                                        >
                                            Join
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="px-4 md:px-5 py-2 border-b border-navy-700/50 flex items-center justify-between bg-navy-800/40">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                            <User size={13} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium leading-none">{userName}</p>
                                            <p className="text-[10px] text-green-400 mt-0.5">● Online</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleChangeName}
                                        className="text-xs text-gray-500 hover:text-red-400 transition-colors duration-300 px-2 py-1 rounded hover:bg-red-400/10"
                                    >
                                        Ganti nama
                                    </button>
                                </div>
                            )}

                            {/* Messages Area */}
                            <div ref={chatBoxRef} className="h-[260px] sm:h-[320px] md:h-[400px] overflow-y-auto p-3 md:p-4 space-y-2.5 scroll-smooth">
                                {isInitialLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center space-y-2">
                                            <Loader2 size={24} className="animate-spin text-blue-400 mx-auto" />
                                            <p className="text-gray-500 text-xs">Memuat pesan...</p>
                                        </div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center space-y-2">
                                            <div className="text-3xl">💬</div>
                                            <p className="text-gray-500 text-sm">Belum ada pesan.</p>
                                            <p className="text-gray-600 text-xs">Jadilah yang pertama memulai percakapan!</p>
                                        </div>
                                    </div>
                                ) : (
                                    <AnimatePresence initial={false}>
                                        {messages.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{ duration: 0.2 }}
                                                className={`flex ${msg.is_own ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                                                        msg.is_own
                                                            ? 'bg-blue-500/25 border border-blue-500/40 rounded-br-sm'
                                                            : 'bg-navy-700/60 border border-navy-600/60 rounded-bl-sm'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className={`text-[10px] font-semibold ${msg.is_own ? 'text-blue-300' : 'text-cyan-400'}`}>
                                                            {msg.is_own ? 'You' : msg.name}
                                                        </span>
                                                        <span className="text-[9px] text-gray-500">
                                                            {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                    </div>
                                                    <p className="text-white text-sm leading-relaxed break-words">
                                                        {msg.message}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="px-3 md:px-4 py-3 border-t border-navy-700 bg-navy-800/40">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value.slice(0, CHAT_LIMITS.maxMessageLength))}
                                            placeholder={isNameSet ? 'Ketik pesan singkat...' : 'Set nama dulu untuk chat'}
                                            disabled={!isNameSet || isSending}
                                            maxLength={CHAT_LIMITS.maxMessageLength}
                                            className="w-full px-3 py-2 pr-12 bg-navy-900/80 border border-navy-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e as React.FormEvent);
                                                }
                                            }}
                                        />
                                        {isNameSet && (
                                            <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] tabular-nums ${
                                                newMessage.length >= CHAT_LIMITS.maxMessageLength
                                                    ? 'text-amber-400'
                                                    : 'text-gray-500'
                                            }`}>
                                                {newMessage.length}/{CHAT_LIMITS.maxMessageLength}
                                            </span>
                                        )}
                                    </div>
                                    <motion.button
                                        type="submit"
                                        disabled={!isNameSet || isSending || !newMessage.trim()}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {isSending ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Send size={16} />
                                        )}
                                    </motion.button>
                                </form>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 28, rotateX: 12 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="bg-navy-800/80 rounded-2xl p-6 md:p-8 border border-navy-700 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-500 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-1">Contact Form</h3>
                            <p className="text-sm text-gray-400 mb-6">
                                Pesan masuk langsung ke email saya (bukan chat publik)
                            </p>
                            <ContactForm />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ============================================
// COMPONENT: Contact Form
// ============================================
function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');
        setErrorMessage('');

        try {
            await sendContact({
                name: formData.name,
                email: formData.email,
                subject: formData.subject || 'Contact Form Message',
                message: formData.message,
            });
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error: unknown) {
            setStatus('error');
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            setErrorMessage(
                err.response?.data?.message ||
                    err.message ||
                    'Gagal mengirim pesan. Silakan coba lagi.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400 text-sm"
                    >
                        <span>✓</span>
                        <span>Pesan berhasil dikirim ke email saya!</span>
                    </motion.div>
                )}
                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2 text-red-400 text-sm"
                    >
                        <span className="shrink-0">✗</span>
                        <span className="leading-relaxed">{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nama</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Nama kamu"
                        className="w-full px-4 py-2.5 bg-navy-900/80 border border-navy-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="kamu@email.com"
                        className="w-full px-4 py-2.5 bg-navy-900/80 border border-navy-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Subjek</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Topik pesan"
                        className="w-full px-4 py-2.5 bg-navy-900/80 border border-navy-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Pesan</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Tuliskan pesanmu..."
                        className="w-full px-4 py-2.5 bg-navy-900/80 border border-navy-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors duration-300 resize-none"
                    />
                </div>

                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Mengirim...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Kirim Pesan
                        </>
                    )}
                </motion.button>
            </form>
        </>
    );
}