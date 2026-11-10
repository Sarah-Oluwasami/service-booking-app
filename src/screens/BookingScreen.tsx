import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { CategoryIcon } from '../components/CategoryIcon';
import { MessageState } from '../components/States';
import { TextField } from '../components/TextField';
import { RootStackScreenProps } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { useProvidersStore } from '../store/providersStore';
import { formatNaira } from '../utils/categories';
import { formatTime, TIME_SLOTS, upcomingDates } from '../utils/dates';
import { bookingSchema, BookingForm, fieldErrors } from '../validation/schemas';

type Errors = Partial<Record<keyof BookingForm | 'form', string>>;

const NOTES_LIMIT = 200;

export function BookingScreen({ route, navigation }: RootStackScreenProps<'Booking'>) {
  const provider = useProvidersStore((s) => s.getById(route.params.providerId));
  const user = useAuthStore((s) => s.user);
  const addBooking = useBookingStore((s) => s.addBooking);
  const hasConflict = useBookingStore((s) => s.hasConflict);

  const dates = useMemo(() => upcomingDates(14), []);
  const [form, setForm] = useState<BookingForm>({ date: '', time: '', notes: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  if (!provider || !user) {
    return (
      <MessageState
        tone="error"
        icon="alert-circle-outline"
        title="Service not found"
        message="This provider is no longer available."
        actionLabel="Go back"
        onAction={() => navigation.goBack()}
      />
    );
  }

  const update = (field: keyof BookingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
  };

  const handleSubmit = async () => {
    const result = bookingSchema.safeParse(form);
    if (!result.success) {
      setErrors(fieldErrors<keyof BookingForm>(result.error));
      return;
    }

    if (hasConflict(user.email, provider.id, result.data.date, result.data.time)) {
      setErrors({ form: 'You already have a booking with this provider at that date and time.' });
      return;
    }

    setSaving(true);
    try {
      await addBooking({
        userEmail: user.email,
        providerId: provider.id,
        providerName: provider.name,
        serviceName: provider.category,
        date: result.data.date,
        time: result.data.time,
        notes: result.data.notes,
      });
      // Return to the tabs and show the new booking.
      navigation.popTo('Main', { screen: 'MyBookings' });
    } catch {
      setErrors({ form: 'Could not save your booking. Please try again.' });
      setSaving(false);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-ink-100">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView contentContainerClassName="p-4 pb-6" keyboardShouldPersistTaps="handled">
          {/* Selected service */}
          <Animated.View entering={FadeInDown.duration(350)}>
            <Text className="mb-2 text-sm font-medium text-ink-700">Selected service</Text>
            <View className="mb-5 flex-row items-center rounded-2xl bg-white p-4">
              <CategoryIcon category={provider.category} />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-ink-900">{provider.category}</Text>
                <Text className="text-sm text-ink-500" numberOfLines={1}>
                  {provider.name} · {provider.companyName}
                </Text>
              </View>
              <Text className="text-sm font-semibold text-brand-700">
                {formatNaira(provider.priceFrom)}
              </Text>
            </View>
          </Animated.View>

          {/* Date */}
          <Animated.View entering={FadeInDown.delay(80).duration(350)}>
            <Text className="mb-2 text-sm font-medium text-ink-700">Date</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-4"
              contentContainerClassName="px-4"
            >
              {dates.map((d) => {
                const active = form.date === d.iso;
                return (
                  <Pressable
                    key={d.iso}
                    onPress={() => update('date', d.iso)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`${d.weekday} ${d.day} ${d.month}`}
                    className={`mr-2 w-16 items-center rounded-2xl border py-3 ${
                      active ? 'border-brand-600 bg-brand-600' : 'border-ink-300 bg-white'
                    }`}
                  >
                    <Text className={`text-xs ${active ? 'text-brand-100' : 'text-ink-500'}`}>
                      {d.weekday}
                    </Text>
                    <Text
                      className={`my-0.5 text-lg font-bold ${active ? 'text-white' : 'text-ink-900'}`}
                    >
                      {d.day}
                    </Text>
                    <Text className={`text-xs ${active ? 'text-brand-100' : 'text-ink-500'}`}>
                      {d.month}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            {errors.date ? <Text className="mt-1.5 text-sm text-red-500">{errors.date}</Text> : null}
          </Animated.View>

          {/* Time */}
          <Animated.View entering={FadeInDown.delay(160).duration(350)}>
            <Text className="mb-2 mt-5 text-sm font-medium text-ink-700">Time</Text>
            <View className="flex-row flex-wrap">
              {TIME_SLOTS.map((slot) => {
                const active = form.time === slot;
                return (
                  <Pressable
                    key={slot}
                    onPress={() => update('time', slot)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    className={`mb-2 mr-2 rounded-xl border px-3 py-2 ${
                      active ? 'border-brand-600 bg-brand-600' : 'border-ink-300 bg-white'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${active ? 'text-white' : 'text-ink-700'}`}
                    >
                      {formatTime(slot)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.time ? <Text className="mt-0.5 text-sm text-red-500">{errors.time}</Text> : null}
          </Animated.View>

          {/* Notes */}
          <Animated.View entering={FadeInDown.delay(240).duration(350)} className="mt-5">
            <TextField
              label="Notes (optional)"
              placeholder="e.g. Gate code, parking details or what needs fixing"
              multiline
              maxLength={NOTES_LIMIT}
              value={form.notes}
              onChangeText={(v) => update('notes', v)}
              error={errors.notes}
              hint={`${form.notes.length}/${NOTES_LIMIT}`}
            />
          </Animated.View>

          {errors.form ? (
            <View className="rounded-xl bg-red-50 p-3">
              <Text className="text-sm text-red-600">{errors.form}</Text>
            </View>
          ) : null}
        </ScrollView>

        <View className="border-t border-ink-300/50 bg-white px-4 pb-2 pt-3">
          <Button title="Confirm Booking" onPress={handleSubmit} loading={saving} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
