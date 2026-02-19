import { defineStore } from 'pinia';
import type { TicketKind } from '@/types/ticket';

interface AuthState {
  userId: number | null;
  username: string | null;
  hasTodayActiveTicket: boolean;
  todayActiveTicketType: TicketKind | null;
}

const bc = new BroadcastChannel('auth');

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    userId: (() => {
      const value = localStorage.getItem('userId');
      if (!value) {
        return null;
      }
      const parsed = Number(value);
      return Number.isNaN(parsed) ? null : parsed;
    })(),
    username: localStorage.getItem('username'),
    hasTodayActiveTicket: localStorage.getItem('hasTodayActiveTicket') === 'true',
    todayActiveTicketType: (localStorage.getItem('todayActiveTicketType') as TicketKind | null) ?? null,
  }),

  actions: {
    setAuthUser(user: { userId: number; username: string }) {
      const safeUsername = user.username ?? "";
      localStorage.setItem('userId', String(user.userId));
      localStorage.setItem('username', safeUsername);
      this.userId = user.userId;
      this.username = safeUsername;
    },

    setTodayActiveTicket(payload: { hasTodayActiveTicket: boolean; todayActiveTicketType: TicketKind | null }) {
      localStorage.setItem('hasTodayActiveTicket', String(payload.hasTodayActiveTicket));
      if (payload.todayActiveTicketType) {
        localStorage.setItem('todayActiveTicketType', payload.todayActiveTicketType);
      } else {
        localStorage.removeItem('todayActiveTicketType');
      }
      this.hasTodayActiveTicket = payload.hasTodayActiveTicket;
      this.todayActiveTicketType = payload.todayActiveTicketType;
    },

    logout() {
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('hasTodayActiveTicket');
      localStorage.removeItem('todayActiveTicketType');
      this.userId = null;
      this.username = null;
      this.hasTodayActiveTicket = false;
      this.todayActiveTicketType = null;
      bc.postMessage({ type: 'LOGOUT' });
    },
  },
});
