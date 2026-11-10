import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, ComponentRef, Ref, useState } from 'react';
import { Platform, Pressable, Text, TextInput, TextInputProps, TextStyle, View } from 'react-native';

/**
 * Font size is set without a line height on purpose: on iOS, a TextInput with a
 * lineHeight clips letters that hang below the line (g, j, p, y).
 * Single-line inputs also stretch to the full height of their field (see
 * SINGLE_LINE_STYLE), so iOS has room for those letters and centres the text.
 * On web, the browser focus outline is removed because the border shows focus.
 */
export const INPUT_STYLE: TextStyle = {
  flex: 1,
  fontSize: 16,
  color: '#0F172A',
  paddingVertical: 0,
  includeFontPadding: false,
  // 'none' works on web but isn't in React Native's types, hence the cast.
  ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : {}),
};

/** Fills the field's full height instead of shrinking to the text. */
export const SINGLE_LINE_STYLE: TextStyle = { ...INPUT_STYLE, alignSelf: 'stretch', height: '100%' };

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  /** Shows an eye toggle for password fields. */
  secureToggle?: boolean;
  hint?: string;
  /** React 19 passes refs as a normal prop, so no forwardRef is needed. */
  ref?: Ref<ComponentRef<typeof TextInput>>;
}

export function TextField({
  label,
  error,
  icon,
  secureToggle,
  hint,
  multiline,
  onFocus,
  onBlur,
  ref,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const borderClass = error ? 'border-red-400' : focused ? 'border-brand-500' : 'border-ink-300';

  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-sm font-medium text-ink-700">{label}</Text>
      <View
        className={`flex-row rounded-xl border bg-white px-3 ${borderClass} ${
          multiline ? 'min-h-[96px] items-start py-3' : 'h-12 items-center'
        }`}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? '#800020' : '#94A3B8'}
            style={{ marginRight: 8 }}
          />
        ) : null}
        <TextInput
          ref={ref}
          style={multiline ? INPUT_STYLE : SINGLE_LINE_STYLE}
          placeholderTextColor="#94A3B8"
          secureTextEntry={secureToggle ? hidden : rest.secureTextEntry}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {secureToggle ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color="#64748B" />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className="mt-1 text-sm text-red-500">{error}</Text>
      ) : hint ? (
        <Text className="mt-1 text-xs text-ink-500">{hint}</Text>
      ) : null}
    </View>
  );
}
