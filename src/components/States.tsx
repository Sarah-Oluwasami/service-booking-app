import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Button } from './Button';

interface MessageStateProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'error';
}

/** Used for empty lists, empty search results and load errors. */
export function MessageState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  tone = 'neutral',
}: MessageStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View
        className={`mb-4 h-20 w-20 items-center justify-center rounded-full ${
          tone === 'error' ? 'bg-red-50' : 'bg-brand-50'
        }`}
      >
        <Ionicons name={icon} size={36} color={tone === 'error' ? '#EF4444' : '#800020'} />
      </View>
      <Text className="mb-2 text-center text-lg font-semibold text-ink-900">{title}</Text>
      <Text className="mb-6 text-center text-sm leading-5 text-ink-500">{message}</Text>
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} variant="secondary" className="px-8" />
      ) : null}
    </View>
  );
}

/** Pulsing placeholder card shown while services are loading. */
export function SkeletonCard() {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={animatedStyle}>
      <View className="mb-3 flex-row items-center rounded-2xl bg-white p-4">
        <View className="h-12 w-12 rounded-xl bg-ink-100" />
        <View className="ml-3 flex-1">
          <View className="mb-2 h-4 w-2/3 rounded bg-ink-100" />
          <View className="mb-2 h-3 w-1/2 rounded bg-ink-100" />
          <View className="h-3 w-1/3 rounded bg-ink-100" />
        </View>
      </View>
    </Animated.View>
  );
}
