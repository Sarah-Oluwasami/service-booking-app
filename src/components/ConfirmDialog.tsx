import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { Button } from './Button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Themed confirmation dialog. Used instead of the native Alert, whose look
 * can't be styled to match the app (and which has no buttons on web).
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  icon = 'trash-outline',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Animated.View entering={FadeIn.duration(150)} style={{ flex: 1 }}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-6"
          onPress={loading ? undefined : onCancel}
          accessibilityLabel="Close dialog"
        >
          {/* Inner Pressable stops taps on the card from closing the dialog */}
          <Pressable className="w-full max-w-sm" onPress={() => {}}>
            <Animated.View entering={ZoomIn.duration(200)}>
              <View className="items-center rounded-3xl bg-white p-6" accessibilityRole="alert">
                <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                  <Ionicons name={icon} size={26} color="#800020" />
                </View>
                <Text className="mb-2 text-center text-lg font-bold text-ink-900">{title}</Text>
                <Text className="mb-6 text-center text-sm leading-5 text-ink-500">{message}</Text>

                <View className="w-full flex-row">
                  <Button
                    title={cancelLabel}
                    variant="secondary"
                    onPress={onCancel}
                    disabled={loading}
                    className="mr-3 flex-1"
                  />
                  <Button
                    title={confirmLabel}
                    onPress={onConfirm}
                    loading={loading}
                    className="flex-1"
                  />
                </View>
              </View>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}
