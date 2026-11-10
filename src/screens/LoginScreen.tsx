import { Ionicons } from '@expo/vector-icons';
import { ComponentRef, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { useAuthStore } from '../store/authStore';
import { fieldErrors, LoginForm, loginSchema } from '../validation/schemas';

type Errors = Partial<Record<keyof LoginForm, string>>;

export function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const isSubmitting = useAuthStore((s) => s.isSubmitting);

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);

  const validate = (values: LoginForm): Errors => {
    const result = loginSchema.safeParse(values);
    return result.success ? {} : fieldErrors<keyof LoginForm>(result.error);
  };

  // After the first submit attempt, errors update as the user types.
  const update = (field: keyof LoginForm, value: string) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await login(form.email, form.password);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInUp.duration(500)}>
            <View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-brand-600">
              <Ionicons name="construct-outline" size={30} color="#FFFFFF" />
            </View>
            <Text className="text-3xl font-bold text-ink-900">Welcome back</Text>
            <Text className="mb-8 mt-2 text-base text-ink-500">
              Sign in to book trusted home and car services near you.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150).duration(500)}>
            <TextField
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              returnKeyType="next"
              value={form.email}
              onChangeText={(v) => update('email', v)}
              onSubmitEditing={() => passwordRef.current?.focus()}
              error={errors.email}
            />

            <TextField
              ref={passwordRef}
              label="Password"
              icon="lock-closed-outline"
              placeholder="Enter your password"
              secureToggle
              autoCapitalize="none"
              autoComplete="password"
              returnKeyType="done"
              value={form.password}
              onChangeText={(v) => update('password', v)}
              onSubmitEditing={handleSubmit}
              error={errors.password}
            />

            <Button
              title="Sign In"
              onPress={handleSubmit}
              loading={isSubmitting}
              className="mt-2"
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
