import React from "react";
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/core/theme";
import { PlayerListContainer } from "@/pods/player-list";
import { server } from "@/test/mocks/server";
import { mockPlayer } from "@/test/mocks/player.mocks";
import { http, HttpResponse } from "msw";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </QueryClientProvider>
    );
  };
}

describe("PlayerListContainer", () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    localStorage.clear();
  });
  afterAll(() => server.close());

  it("shows skeleton while loading", () => {
    render(<PlayerListContainer />, { wrapper: createWrapper() });
    expect(screen.getByTestId("player-list-skeleton")).toBeInTheDocument();
    expect(screen.queryByText("Lionel Messi")).not.toBeInTheDocument();
  });

  it("renders players after loading", async () => {
    render(<PlayerListContainer />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText("Lionel Messi")).toBeInTheDocument();
    });
  });

  it("shows total count", async () => {
    render(<PlayerListContainer />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText(/100 players/i)).toBeInTheDocument();
    });
  });

  it("filters players by search", async () => {
    const user = userEvent.setup();
    render(<PlayerListContainer />, { wrapper: createWrapper() });

    await waitFor(() => screen.getByText("Lionel Messi"));

    const input = screen.getByPlaceholderText("Search player...");
    await user.type(input, "xyz_no_match");

    // waitFor polls until the 300ms debounce fires and the filter updates
    await waitFor(
      () => {
        expect(screen.queryByText("Lionel Messi")).not.toBeInTheDocument();
        expect(screen.getByText("No players found")).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it("shows error state when API fails", async () => {
    server.use(
      http.get("https://drop-api.ea.com/rating/ea-sports-fc", () => {
        return HttpResponse.error();
      }),
    );

    render(<PlayerListContainer />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows retry button on error", async () => {
    server.use(
      http.get("https://drop-api.ea.com/rating/ea-sports-fc", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    render(<PlayerListContainer />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Retry")).toBeInTheDocument();
    });
  });

  it("loads next page when sentinel becomes visible", async () => {
    const mockPlayer2 = {
      ...mockPlayer,
      id: 20801,
      firstName: "Cristiano",
      lastName: "Ronaldo",
    };

    server.use(
      http.get("https://drop-api.ea.com/rating/ea-sports-fc", ({ request }) => {
        const offset = Number(
          new URL(request.url).searchParams.get("offset") ?? 0,
        );
        if (offset === 0) {
          return HttpResponse.json({ items: [mockPlayer], totalItems: 2 });
        }
        return HttpResponse.json({ items: [mockPlayer2], totalItems: 2 });
      }),
    );

    let observerCallback: IntersectionObserverCallback | null = null;
    class MockIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe(el: Element) {
        observerCallback?.(
          [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }
      disconnect() {}
      unobserve() {}
    }
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    render(<PlayerListContainer />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Lionel Messi")).toBeInTheDocument();
      expect(screen.getByText("Cristiano Ronaldo")).toBeInTheDocument();
    });

    vi.unstubAllGlobals();
  });
});
