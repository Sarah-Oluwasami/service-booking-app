import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';

import { BookingScreen } from '../screens/BookingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { ServiceDetailsScreen } from '../screens/ServiceDetailsScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: '#800020', background: '#F1F5F9' },
};

function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  return (
    <Pressable
      onPress={logout}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Log out"
      style={{ marginRight: 16 }}
    >
      <Ionicons name="log-out-outline" size={22} color="#334155" />
    </Pressable>
  );
}

function MainTabs() {
  const bookingCount = useBookingStore((s) => s.bookings.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#800020',
        tabBarInactiveTintColor: '#94A3B8',
        headerTitleStyle: { fontWeight: '700', color: '#0F172A' },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#F1F5F9' },
        headerRight: () => <LogoutButton />,
        tabBarIcon: ({ color, size, focused }) => {
          const name =
            route.name === 'Services'
              ? focused
                ? 'grid'
                : 'grid-outline'
              : focused
                ? 'calendar'
                : 'calendar-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Services" component={ServicesScreen} options={{ title: 'Services' }} />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          title: 'My Bookings',
          tabBarBadge: bookingCount > 0 ? bookingCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#800020' },
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Logged-out users only see Login. Once `user` is set, React Navigation swaps
 * to the app screens, so there is no way to go "back" to Login after signing in.
 */
export function RootNavigator() {
  const user = useAuthStore((s) => s.user);

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: '#0F172A',
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F1F5F9' },
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="ServiceDetails"
              component={ServiceDetailsScreen}
              options={{ title: 'Service Details' }}
            />
            <Stack.Screen
              name="Booking"
              component={BookingScreen}
              options={{ title: 'Book Service' }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
