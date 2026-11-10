import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';

import { ProviderCard } from '../components/ProviderCard';
import { SINGLE_LINE_STYLE } from '../components/TextField';
import { MessageState, SkeletonCard } from '../components/States';
import { TabScreenProps } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { useProvidersStore } from '../store/providersStore';
import { Provider, SERVICE_CATEGORIES, ServiceCategory } from '../types';

type Filter = 'All' | ServiceCategory;

/** 1731265440000 -> "8:04:05 PM" (seconds included so each refresh visibly changes it) */
function formatClock(timestamp: number): string {
  const d = new Date(timestamp);
  const h = d.getHours();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${h >= 12 ? 'PM' : 'AM'}`;
}
const FILTERS: Filter[] = ['All', ...SERVICE_CATEGORIES];

export function ServicesScreen({ navigation }: TabScreenProps<'Services'>) {
  const user = useAuthStore((s) => s.user);
  const { providers, status, error, isRefreshing, lastUpdated, load } = useProvidersStore();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  useEffect(() => {
    if (status === 'idle') load();
  }, [status, load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return providers.filter((p) => {
      const matchesFilter = filter === 'All' || p.category === filter;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.companyName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [providers, query, filter]);

  const openDetails = useCallback(
    (provider: Provider) => navigation.navigate('ServiceDetails', { providerId: provider.id }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Provider; index: number }) => (
      <ProviderCard provider={item} index={index} onViewDetails={openDetails} />
    ),
    [openDetails],
  );

  const header = (
    <View>
      <Text className="text-sm text-ink-500">Hello, {user?.name ?? 'there'}</Text>
      <Text className="mb-4 mt-1 text-2xl font-bold text-ink-900">What do you need today?</Text>

      <View className="mb-3 h-12 flex-row items-center rounded-xl border border-ink-300 bg-white px-3">
        <Ionicons name="search-outline" size={18} color="#94A3B8" />
        <TextInput
          style={[SINGLE_LINE_STYLE, { marginLeft: 8 }]}
          placeholder="Search by name, company or city"
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search services"
        />
        {query ? (
          <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-4 mb-4"
        contentContainerClassName="px-4"
      >
        {FILTERS.map((item) => {
          const active = item === filter;
          return (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              className={`mr-2 rounded-full border px-4 py-2 ${
                active ? 'border-brand-600 bg-brand-600' : 'border-ink-300 bg-white'
              }`}
            >
              <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-ink-700'}`}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {status === 'success' ? (
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-xs text-ink-500">
            {filtered.length} {filtered.length === 1 ? 'provider' : 'providers'}
            {query || filter !== 'All'
              ? filtered.length === 1
                ? ' matches your search'
                : ' match your search'
              : ''}
          </Text>
          {lastUpdated ? (
            <Text className="text-xs text-ink-500">Updated {formatClock(lastUpdated)}</Text>
          ) : null}
        </View>
      ) : null}

      {error && providers.length > 0 ? (
        <View className="mb-3 flex-row items-center rounded-xl bg-amber-50 p-3">
          <Ionicons name="warning-outline" size={16} color="#B45309" />
          <Text className="ml-2 flex-1 text-xs text-amber-800">
            Couldn't refresh. Showing the last loaded list.
          </Text>
        </View>
      ) : null}
    </View>
  );

  // First load: skeleton cards.
  if (status === 'idle' || status === 'loading') {
    return (
      <View className="flex-1 bg-ink-100 px-4 pt-4">
        {header}
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </View>
    );
  }

  // First load failed and there is nothing to show.
  if (status === 'error') {
    return (
      <View className="flex-1 bg-ink-100">
        <MessageState
          tone="error"
          icon="cloud-offline-outline"
          title="Couldn't load services"
          message={error ?? 'Please check your internet connection and try again.'}
          actionLabel="Try again"
          onAction={() => load()}
        />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-ink-100"
      contentContainerClassName="flex-grow px-4 pb-6 pt-4"
      data={filtered}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={header}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <MessageState
          icon="search-outline"
          title="No services found"
          message="Try a different search term or category."
          actionLabel="Clear filters"
          onAction={() => {
            setQuery('');
            setFilter('All');
          }}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => load({ refresh: true })}
          tintColor="#800020"
          colors={['#800020']}
        />
      }
    />
  );
}
