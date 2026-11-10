# Service Booking App

A React Native app for booking home and car services. You log in, browse providers, check their details, book a date and time, and manage your bookings.

Built with Expo, TypeScript, NativeWind, React Navigation, Zustand, AsyncStorage and Zod.

## Setup

You'll need Node 20+ and the Expo Go app on your phone (or an iOS simulator / Android emulator).

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` for the iOS simulator / `a` for Android.

If styles look off after pulling changes, clear the cache with `npx expo start -c`.

## Architecture

```
src/
  api/          fetching providers from JSONPlaceholder
  services/     AsyncStorage helpers for bookings
  store/        Zustand stores (auth, providers, bookings)
  navigation/   stack + bottom tabs
  screens/      Login, Services, Service Details, Booking, My Bookings
  components/   shared UI (buttons, inputs, cards, dialog, loading/empty states)
  validation/   Zod schemas for the login and booking forms
  utils/        date formatting, category icons
```

Screens handle the UI, and the stores hold the state and logic. I went with Zustand instead of Context because components only re-render when the slice of state they use changes, and there's no provider setup to manage.

The API call and AsyncStorage access each live in their own file, so the screens never talk to the network or storage directly. Swapping JSONPlaceholder for a real backend would only mean changing `api/providers.ts`.

Navigation switches on login state: when you're logged out you only see the Login screen, and once you log in you get the tabs (Services, My Bookings) plus the details and booking screens. That way you can't go back to Login after signing in.

Bookings are loaded from AsyncStorage when the app starts and saved again on every add or delete.

**Extras:** search, category filter, pull to refresh, Zod validation, skeleton loading, empty states and list animations with Reanimated.

## Assumptions

- Login is mocked. Any valid email and password works, and the session isn't saved, so you'll need to log in again after restarting the app (your bookings are still there).
- JSONPlaceholder only returns users, so I treat each user as a service provider. The category, description, rating and price are generated from the user's id, so the same provider always shows the same details.
- You can book from tomorrow up to 14 days ahead, in 30-minute slots between 8:00 AM and 5:30 PM. Notes are optional (max 200 characters).
- You can't book the same provider twice for the same date and time.
- Bookings are stored on the device and linked to the email you logged in with, so each user only sees their own bookings.
