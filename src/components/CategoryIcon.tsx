import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { ServiceCategory } from '../types';
import { CATEGORY_META } from '../utils/categories';

interface CategoryIconProps {
  category: ServiceCategory;
  size?: 'sm' | 'lg';
}

export function CategoryIcon({ category, size = 'sm' }: CategoryIconProps) {
  const meta = CATEGORY_META[category];
  const box = size === 'lg' ? 'h-16 w-16 rounded-2xl' : 'h-12 w-12 rounded-xl';

  return (
    <View className={`items-center justify-center ${box} ${meta.bg}`}>
      <Ionicons name={meta.icon} size={size === 'lg' ? 30 : 22} color={meta.color} />
    </View>
  );
}
