import { create } from 'zustand';

import { loadBookings, saveBookings } from '../services/bookingStorage';
import { Booking } from '../types';

type NewBooking = Omit<Booking, 'id' | 'createdAt'>;

interface BookingState {
  bookings: Booking[];
  isHydrated: boolean;
  /** Loads saved bookings from AsyncStorage once, when the app starts. */
  hydrate: () => Promise<void>;
  addBooking: (booking: NewBooking) => Promise<Booking>;
  deleteBooking: (id: string) => Promise<void>;
  /** True if this user already has a booking with this provider at the same date and time. */
  hasConflict: (userEmail: string, providerId: number, date: string, time: string) => boolean;
}

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Keeps bookings in date and time order, soonest first. */
const sortBookings = (bookings: Booking[]) =>
  [...bookings].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isHydrated: false,

  hydrate: async () => {
    if (get().isHydrated) return;
    try {
      const saved = await loadBookings();
      set({ bookings: sortBookings(saved), isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },

  addBooking: async (input) => {
    const booking: Booking = { ...input, id: createId(), createdAt: new Date().toISOString() };
    const bookings = sortBookings([...get().bookings, booking]);
    await saveBookings(bookings);
    set({ bookings });
    return booking;
  },

  deleteBooking: async (id) => {
    const bookings = get().bookings.filter((booking) => booking.id !== id);
    await saveBookings(bookings);
    set({ bookings });
  },

  hasConflict: (userEmail, providerId, date, time) =>
    get().bookings.some(
      (booking) =>
        booking.userEmail === userEmail &&
        booking.providerId === providerId &&
        booking.date === date &&
        booking.time === time,
    ),
}));
