import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .pipe(z.email({ message: 'Enter a valid email address' })),
  password: z.string().min(1, 'Password is required'),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const bookingSchema = z.object({
  date: z.string().min(1, 'Please choose a date'),
  time: z.string().min(1, 'Please choose a time'),
  notes: z.string().trim().max(200, 'Notes can be at most 200 characters'),
});

export type BookingForm = z.infer<typeof bookingSchema>;

/** Converts a Zod error into a { field: message } map for showing inline errors. */
export function fieldErrors<T extends string>(error: z.ZodError): Partial<Record<T, string>> {
  const result: Partial<Record<T, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as T | undefined;
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
}
