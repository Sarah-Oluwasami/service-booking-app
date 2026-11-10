import { create } from 'zustand';

import { fetchProviders } from '../api/providers';
import { Provider } from '../types';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface ProvidersState {
  providers: Provider[];
  status: Status;
  error: string | null;
  isRefreshing: boolean;
  /** When the list was last loaded successfully (ms timestamp). */
  lastUpdated: number | null;
  /** Loads providers. `refresh` keeps the current list on screen while reloading (pull to refresh). */
  load: (options?: { refresh?: boolean }) => Promise<void>;
  getById: (id: number) => Provider | undefined;
}

export const useProvidersStore = create<ProvidersState>((set, get) => ({
  providers: [],
  status: 'idle',
  error: null,
  isRefreshing: false,
  lastUpdated: null,

  load: async ({ refresh = false } = {}) => {
    if (refresh) {
      set({ isRefreshing: true, error: null });
    } else {
      set({ status: 'loading', error: null });
    }

    try {
      // On pull to refresh, keep the spinner up for at least 700ms so the user
      // can see the refresh happened, even if the request is very fast.
      const [providers] = await Promise.all([
        fetchProviders(),
        refresh ? new Promise((resolve) => setTimeout(resolve, 700)) : Promise.resolve(),
      ]);
      set({ providers, status: 'success', isRefreshing: false, lastUpdated: Date.now() });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      set({
        status: get().providers.length > 0 ? 'success' : 'error',
        error: message,
        isRefreshing: false,
      });
    }
  },

  getById: (id) => get().providers.find((provider) => provider.id === id),
}));
