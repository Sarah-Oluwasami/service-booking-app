export const SERVICE_CATEGORIES = [
  'Car Wash',
  'Cleaning',
  'Plumbing',
  'Laundry',
  'Electrician',
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

/** A service provider, mapped from a JSONPlaceholder user. */
export interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  companyName: string;
  catchPhrase: string;
  category: ServiceCategory;
  description: string;
  city: string;
  address: string;
  rating: number;
  priceFrom: number;
}

export interface Booking {
  id: string;
  /** Email of the user who made the booking, so each user only sees their own. */
  userEmail: string;
  providerId: number;
  providerName: string;
  serviceName: ServiceCategory;
  /** ISO date, e.g. 2026-11-12 */
  date: string;
  /** 24-hour time, e.g. 14:30 */
  time: string;
  notes: string;
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
}
