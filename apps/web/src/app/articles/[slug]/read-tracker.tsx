'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/shared/stores/auth.store';
import { api } from '@/shared/lib/api';

interface Props {
  articleId: string;
}

export function ReadTracker({ articleId }: Props) {
  const { user } = useAuthStore();
  const startRef = useRef<number>(Date.now());
  const sentRef = useRef(false);

  useEffect(() => {
    if (!user) return;

    startRef.current = Date.now();
    sentRef.current = false;

    function send() {
      if (sentRef.current || !user) return;
      sentRef.current = true;

      const timeSpent = Math.round((Date.now() - startRef.current) / 1000);

      // Considera concluído se o usuário chegou perto do fim da página
      const scrolled =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight * 0.8;

      // sendBeacon garante envio mesmo em beforeunload
      const url = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/recommendations/track/${articleId}`;
      const body = JSON.stringify({ timeSpent, completed: scrolled });
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        // sendBeacon não suporta auth headers — fallback para fetch keep-alive
        if (token) {
          fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body,
            keepalive: true,
          }).catch(() => null);
        } else {
          navigator.sendBeacon(url, blob);
        }
      } else {
        api
          .post(`/recommendations/track/${articleId}`, { timeSpent, completed: scrolled })
          .catch(() => null);
      }
    }

    window.addEventListener('beforeunload', send);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') send();
    });

    return () => {
      window.removeEventListener('beforeunload', send);
      send();
    };
  }, [articleId, user]);

  return null;
}
