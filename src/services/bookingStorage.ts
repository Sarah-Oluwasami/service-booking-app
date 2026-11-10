import AsyncStorage from '@react-native-async-storage/async-storage';

import { Booking } from '../types';

const STORAGE_KEY = '@servicebook/bookings';

/** Reads all saved bookings from AsyncStorage. Returns [] if nothing is saved or the data is unreadable. */
export async function loadBookings(): Promise<Booking[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
}

/** Overwrites the saved bookings in AsyncStorage. */
export async function saveBookings(bookings: Booking[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}
