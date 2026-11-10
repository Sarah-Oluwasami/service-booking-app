import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { Booking } from '../types';
import { formatDate, formatTime, isPast } from '../utils/dates';
import { CategoryIcon } from './CategoryIcon';

interface BookingCardProps {
  booking: Booking;
  index: number;
  onDelete: (booking: Booking) => void;
}

function BookingCardBase({ booking, index, onDelete }: BookingCardProps) {
  const past = isPast(booking.date);

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 60).duration(350)}
      exiting={FadeOut.duration(200)}
      layout={LinearTransition}
    >
      <View className={`mb-3 rounded-2xl bg-white p-4 shadow-sm ${past ? 'opacity-70' : ''}`}>
        <View className="flex-row items-start">
          <CategoryIcon category={booking.serviceName} />

          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="text-base font-semibold text-ink-900">{booking.serviceName}</Text>
              {past ? (
                <View className="ml-2 rounded-full bg-ink-100 px-2 py-0.5">
                  <Text className="text-[10px] font-medium text-ink-500">Past</Text>
                </View>
              ) : null}
            </View>
            <Text className="mt-0.5 text-sm text-ink-500" numberOfLines={1}>
              with {booking.providerName}
            </Text>
          </View>

          <Pressable
            onPress={() => onDelete(booking)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${booking.serviceName} booking`}
            className="h-9 w-9 items-center justify-center rounded-full bg-red-50 active:bg-red-100"
          >
            <Ionicons name="trash-outline" size={18} color="#DC2626" />
          </Pressable>
        </View>

        <View className="mt-4 flex-row rounded-xl bg-ink-100 px-3 py-2.5">
          <View className="flex-1 flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#334155" />
            <Text className="ml-2 text-sm text-ink-700">{formatDate(booking.date)}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#334155" />
            <Text className="ml-2 text-sm text-ink-700">{formatTime(booking.time)}</Text>
          </View>
        </View>

        {booking.notes ? (
          <View className="mt-3 flex-row">
            <Ionicons name="document-text-outline" size={16} color="#64748B" />
            <Text className="ml-2 flex-1 text-sm leading-5 text-ink-500">{booking.notes}</Text>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

export const BookingCard = memo(BookingCardBase);
