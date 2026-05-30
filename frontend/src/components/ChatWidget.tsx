'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronUp, Home, MessageCircle, MoreVertical, Send, X } from 'lucide-react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'home' | 'chat'>('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed bottom-[88px] right-4 z-[65] flex flex-col items-end gap-2">
      {open ? (
        <>
          <div className="w-[340px] max-w-[calc(100vw-2rem)]">
            <div className="rounded-2xl shadow-2xl overflow-hidden bg-white border border-[#E8E8E8]">
              <div className="relative px-5 pt-5 pb-16 bg-[var(--navbar-color)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center">
                    <MessageCircle size={18} className="text-white" />
                  </div>
                  <button type="button" className="p-1 text-white/80 hover:text-white" aria-label="Menu">
                    <MoreVertical size={18} />
                  </button>
                </div>
                <p className="text-white text-lg font-normal font-body leading-tight">Hi there</p>
                <p className="text-white/95 text-sm font-body mt-1">Welcome to our website. Ask us anything.</p>
              </div>

              <div className="-mt-10 mx-4 mb-4 relative z-10">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 bg-white rounded-xl shadow-md border border-[#E8E8E8] px-4 py-4 hover:shadow-lg transition-shadow"
                >
                  <div>
                    <p className="font-normal text-[#0A0A0A] text-sm font-body">Chat with us</p>
                    <p className="text-xs text-[#999999] font-body mt-0.5">We typically reply within a few minutes.</p>
                  </div>
                  <span
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-[var(--navbar-color)]"
                  >
                    <Send size={16} className="text-white ml-0.5" />
                  </span>
                </Link>
              </div>

              <div className="flex border-t border-[#E8E8E8] px-2 pb-1">
                <button
                  type="button"
                  onClick={() => setTab('home')}
                  className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-body ${tab === 'home' ? 'text-[var(--color-heading)] font-medium' : 'text-[#999999]'}`}
                >
                  <Home size={20} />
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('chat');
                    window.location.href = '/contact';
                  }}
                  className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-body ${tab === 'chat' ? 'text-[var(--color-heading)] font-medium' : 'text-[#999999]'}`}
                >
                  <MessageCircle size={20} />
                  Chat
                </button>
              </div>
            </div>
          </div>

          {showScrollTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className="w-11 h-11 rounded-full shadow-lg flex items-center justify-center text-white hover:brightness-105 transition-all bg-[var(--navbar-color)]"
              aria-label="Scroll to top"
            >
              <ChevronUp size={22} strokeWidth={2.5} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-14 h-14 flex items-center justify-center rounded-full shadow-lg text-white hover:brightness-110 transition-all bg-[var(--navbar-color)]"
            aria-label="Close chat"
          >
            <X size={24} />
          </button>
        </>
      ) : (
        <>
          {showScrollTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className="w-11 h-11 rounded-full shadow-lg flex items-center justify-center text-white hover:brightness-105 transition-all bg-[var(--navbar-color)]"
              aria-label="Scroll to top"
            >
              <ChevronUp size={22} strokeWidth={2.5} />
            </button>
          )}
          <div className="bg-white text-[#0A0A0A] text-xs font-body px-3 py-2 rounded-lg shadow-md border border-[#E8E8E8] whitespace-nowrap">
            Chat with us
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform bg-[var(--navbar-color)]"
            aria-label="Open chat"
          >
            <MessageCircle size={26} />
          </button>
        </>
      )}
    </div>
  );
}
