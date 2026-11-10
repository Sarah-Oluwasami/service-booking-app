import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Provider } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface ProviderCardProps {
  provider: Provider;
  index: number;
  onViewDetails: (provider: Provider) => void;
}

function ProviderCardBase({ provider, index, onViewDetails }: ProviderCardProps) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 60).duration(350)}>
      <View className="mb-3 rounded-2xl bg-white p-4 shadow-sm">
        <View className="flex-row items-start">
          <CategoryIcon category={provider.category} />

          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-ink-900" numberOfLines={1}>
              {provider.name}
            </Text>
            <Text className="mt-0.5 text-sm text-ink-500" numberOfLines={1}>
              {provider.companyName}
            </Text>

            <View className="mt-2 flex-row flex-wrap items-center">
              <View className="mr-2 rounded-full bg-brand-50 px-2.5 py-1">
                <Text className="text-xs font-medium text-brand-700">{provider.category}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={14} color="#64748B" />
                <Text className="ml-1 text-xs text-ink-500">{provider.city}</Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text className="ml-1 text-xs font-semibold text-ink-700">{provider.rating}</Text>
          </View>
        </View>

        <Pressable
          onPress={() => onViewDetails(provider)}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${provider.name}`}
          className="mt-4 h-10 flex-row items-center justify-center rounded-xl bg-brand-50 active:bg-brand-100"
        >
          <Text className="mr-1 text-sm font-semibold text-brand-700">View Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#66001A" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

export const ProviderCard = memo(ProviderCardBase);
