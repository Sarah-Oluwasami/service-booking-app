import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

import { ServiceCategory } from '../types';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface CategoryMeta {
  icon: IconName;
  /** Tailwind classes for the icon badge background */
  bg: string;
  /** Hex colour for the icon (vector icons need a colour value, not a class) */
  color: string;
}

export const CATEGORY_META: Record<ServiceCategory, CategoryMeta> = {
  'Car Wash': { icon: 'car-sport-outline', bg: 'bg-brand-50', color: '#800020' },
  Cleaning: { icon: 'sparkles-outline', bg: 'bg-brand-50', color: '#800020' },
  Plumbing: { icon: 'water-outline', bg: 'bg-brand-50', color: '#800020' },
  Laundry: { icon: 'shirt-outline', bg: 'bg-brand-50', color: '#800020' },
  Electrician: { icon: 'flash-outline', bg: 'bg-brand-50', color: '#800020' },
};

/** 15000 -> "₦15,000" */
export function formatNaira(amount: number): string {
  return `₦${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}
