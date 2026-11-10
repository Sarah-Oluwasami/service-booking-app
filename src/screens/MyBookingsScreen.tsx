import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { BookingCard } from '../components/BookingCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { MessageState } from '../components/States';
import { TabScreenProps } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { Booking } from '../types';
import { formatDate, formatTime } from '../utils/dates';

export function MyBookingsScreen({ navigation }: TabScreenProps<'MyBookings'>) {
  const userEmail = useAuthStore((s) => s.user?.email);
  const allBookings = useBookingStore((s) => s.bookings);
  // Only show the logged-in user's bookings.
  const bookings = useMemo(
    () => allBookings.filter((booking) => booking.userEmail === userEmail),
    [allBookings, userEmail],
  );
  const isHydrated = useBookingStore((s) => s.isHydrated);
  const deleteBooking = useBookingStore((s) => s.deleteBooking);

  // The booking waiting for delete confirmation (null = dialog closed).
  const [pendingDelete, setPendingDelete] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback((booking: Booking) => setPendingDelete(booking), []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteBooking(pendingDelete.id);
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: Booking; index: number }) => (
      <BookingCard booking={item} index={index} onDelete={handleDelete} />
    ),
    [handleDelete],
  );

  if (!isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-ink-100">
        <ActivityIndicator color="#800020" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-ink-100">
      <FlatList
        className="flex-1"
        contentContainerClassName="flex-grow px-4 pb-6 pt-4"
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          bookings.length > 0 ? (
            <Text className="mb-3 text-sm text-ink-500">
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}, soonest first
            </Text>
          ) : undefined
        }
        ListEmptyComponent={
          <MessageState
            icon="calendar-outline"
            title="No bookings yet"
            message="When you book a service, it will show up here."
            actionLabel="Browse services"
            onAction={() => navigation.navigate('Services')}
          />
        }
      />

      <ConfirmDialog
        visible={pendingDelete !== null}
        title="Delete booking?"
        message={
          pendingDelete
            ? `${pendingDelete.serviceName} with ${pendingDelete.providerName} on ${formatDate(
                pendingDelete.date,
              )} at ${formatTime(pendingDelete.time)} will be removed.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </View>
  );
}
