import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePlayers } from '@/common/hooks';

// Mock the API
vi.mock('../../api/players.api', () => ({
  fetchPlayers: vi.fn().mockResolvedValue({
    items: [
      {
        id: 1,
        rank: 1,
        overallRating: 91,
        firstName: 'Erling',
        lastName: 'Haaland',
        commonName: null,
        position: { id: '25', shortLabel: 'DC', label: 'Delantero centro', positionType: { id: 'attack', name: 'Atacar' } },
        stats: { pac: { value: 89, diff: 0 }, sho: { value: 93, diff: 0 }, pas: { value: 65, diff: 0 }, dri: { value: 80, diff: 0 }, def: { value: 45, diff: 0 }, phy: { value: 88, diff: 0 } },
      },
    ],
    totalItems: 1,
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('usePlayers', () => {
  it('returns players after loading', async () => {
    const { result } = renderHook(() => usePlayers(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.players).toHaveLength(1);
    expect(result.current.players[0].firstName).toBe('Erling');
  });

  it('exposes totalItems', async () => {
    const { result } = renderHook(() => usePlayers(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.totalItems).toBe(1);
  });

  it('hasNextPage is false when all items are loaded', async () => {
    const { result } = renderHook(() => usePlayers(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('starts with isLoading true', () => {
    const { result } = renderHook(() => usePlayers(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });
});
