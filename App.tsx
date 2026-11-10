import './global.css';

import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';
import { useBookingStore } from './src/store/bookingStore';

export default function App() {
  const hydrate = useBookingStore((s) => s.hydrate);

  // Load saved bookings from AsyncStorage once on startup.
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
