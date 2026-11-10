import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: Variant;
  loading?: boolean;
  className?: string;
}

const CONTAINER: Record<Variant, string> = {
  primary: 'bg-brand-600 active:bg-brand-700',
  secondary: 'bg-brand-50 active:bg-brand-100',
  danger: 'bg-red-50 active:bg-red-100',
};

const LABEL: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-brand-700',
  danger: 'text-red-600',
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={`h-12 flex-row items-center justify-center rounded-xl px-5 ${CONTAINER[variant]} ${
        isDisabled ? 'opacity-60' : ''
      } ${className}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#800020'} />
      ) : (
        <Text className={`text-base font-semibold ${LABEL[variant]}`}>{title}</Text>
      )}
    </Pressable>
  );
}
