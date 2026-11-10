import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { CategoryIcon } from '../components/CategoryIcon';
import { MessageState } from '../components/States';
import { RootStackScreenProps } from '../navigation/types';
import { useProvidersStore } from '../store/providersStore';
import { formatNaira } from '../utils/categories';

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start py-3">
      <View className="h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
        <Ionicons name={icon} size={18} color="#800020" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-xs text-ink-500">{label}</Text>
        <Text className="mt-0.5 text-sm font-medium text-ink-900">{value}</Text>
      </View>
    </View>
  );
}

export function ServiceDetailsScreen({ route, navigation }: RootStackScreenProps<'ServiceDetails'>) {
  const provider = useProvidersStore((s) => s.getById(route.params.providerId));

  if (!provider) {
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

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-ink-100">
      <ScrollView contentContainerClassName="p-4 pb-6">
        <Animated.View entering={FadeInDown.duration(400)}>
          <View className="items-center rounded-2xl bg-white p-6">
            <CategoryIcon category={provider.category} size="lg" />
            <Text className="mt-4 text-center text-xl font-bold text-ink-900">{provider.name}</Text>
            <Text className="mt-1 text-center text-sm text-ink-500">{provider.companyName}</Text>

            <View className="mt-4 flex-row">
              <View className="mr-2 rounded-full bg-brand-50 px-3 py-1">
                <Text className="text-xs font-medium text-brand-700">{provider.category}</Text>
              </View>
              <View className="flex-row items-center rounded-full bg-amber-50 px-3 py-1">
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text className="ml-1 text-xs font-medium text-amber-700">{provider.rating}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View className="mt-4 rounded-2xl bg-white p-5">
            <Text className="mb-2 text-base font-semibold text-ink-900">About this service</Text>
            <Text className="text-sm leading-6 text-ink-700">{provider.description}</Text>
            <Text className="mt-3 text-sm italic text-ink-500">"{provider.catchPhrase}"</Text>
            <View className="mt-4 flex-row items-baseline">
              <Text className="text-xs text-ink-500">Starting from </Text>
              <Text className="text-lg font-bold text-brand-700">
                {formatNaira(provider.priceFrom)}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View className="mt-4 rounded-2xl bg-white px-5 py-2">
            <InfoRow icon="business-outline" label="Company" value={provider.companyName} />
            <View className="h-px bg-ink-100" />
            <InfoRow icon="call-outline" label="Phone" value={provider.phone} />
            <View className="h-px bg-ink-100" />
            <InfoRow icon="location-outline" label="Address" value={provider.address} />
            <View className="h-px bg-ink-100" />
            <InfoRow icon="mail-outline" label="Email" value={provider.email.toLowerCase()} />
          </View>
        </Animated.View>
      </ScrollView>

      <View className="border-t border-ink-300/50 bg-white px-4 pb-2 pt-3">
        <Button
          title="Book Service"
          onPress={() => navigation.navigate('Booking', { providerId: provider.id })}
        />
      </View>
    </SafeAreaView>
  );
}
