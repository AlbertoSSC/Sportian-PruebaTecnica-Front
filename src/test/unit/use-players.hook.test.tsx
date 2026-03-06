import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePlayers } from "@/common/hooks";
import { mockPlayer } from "@/test/mocks/player.mocks";

const { mockFetchPlayers } = vi.hoisted(() => ({
  mockFetchPlayers: vi.fn(),
}));

// Mock the API
vi.mock("../../api/players.api", () => ({
  fetchPlayers: mockFetchPlayers,
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("usePlayers", () => {
  beforeEach(() => {
    mockFetchPlayers.mockResolvedValue({ items: [mockPlayer], totalItems: 1 });
  });

  it("returns players after loading", async () => {
    const { result } = renderHook(() => usePlayers(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.players).toHaveLength(1);
    expect(result.current.players[0].firstName).toBe("Lionel");
  });

  it("exposes totalItems", async () => {
    const { result } = renderHook(() => usePlayers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.totalItems).toBe(1);
  });

  it("hasNextPage is false when all items are loaded", async () => {
    const { result } = renderHook(() => usePlayers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
  });

  it("starts with isLoading true", () => {
    const { result } = renderHook(() => usePlayers(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });
});
