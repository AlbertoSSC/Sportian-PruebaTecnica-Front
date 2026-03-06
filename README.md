# EAFC Ratings

Frontend technical test — React + TypeScript + Material UI.

Web application that consumes the EA Sports FC API to display a player list with ratings, infinite scroll, offline cache, and a detail view.

---

## Quick start

```bash
npm install
npm run dev
npm run test
npm run build
```

---

## Architecture

### Folder structure

```
src/
├── api/
│   ├── players.api.ts
│   └── players.cache.ts        # localStorage cache with TTL
├── common/
│   ├── constants/
│   ├── hooks/
│   │   ├── use-players.hook.ts              # useInfiniteQuery + pagination
│   │   ├── use-intersection-observer.hook.ts
│   │   └── use-debounce.hook.ts
│   ├── types/
│   └── utils/                  # Pure helper functions
├── core/
│   ├── theme/                  # MUI theme
│   └── providers/
├── pods/                       # Feature modules
│   ├── player-list/
│   │   ├── components/
│   │   ├── player-list.container.tsx
│   │   └── player-list.component.tsx
│   └── player-detail/
│       ├── components/
│       ├── player-detail.container.tsx
│       └── player-detail.component.tsx
├── scenes/                     # Pages / routes
│   └── home.scene.tsx
└── test/
    ├── mocks/
    └── unit/
```

### Pattern: scenes / pods / container / component

- **Scene**: maps to a route. Orchestrates pods.
- **Pod**: self-contained feature module. All code for a feature lives here.
- **Container**: owns state, custom hooks and callbacks. Renders no UI of its own.
- **Component**: pure render with `memo`. Receives everything via props, unaware of data source.

---

## Technical decisions

### TanStack Query v5 — `useInfiniteQuery`

- `queryKey: [PLAYERS_QUERY_KEY, search]` — each search term has its own independent cache entry
- `staleTime: 5 min` — no re-fetch when navigating within the session
- Automatic request deduplication
- Mutually exclusive states (`isLoading`, `isError`, `isFetchingNextPage`) — no inconsistent flags

### Infinite scroll with Intersection Observer

`useIntersectionObserver` with `rootMargin: "300px"` — the sentinel (a 1px div at the end of the list) triggers the next page **before** the user reaches the bottom, eliminating any visible wait. Double guard against duplicate calls: `enabled` disables the observer while fetching, and `handleFetchNext` checks `!isFetchingNextPage` before calling `fetchNextPage()`.

### Two-layer cache strategy

| Layer     | Technology     | Scope                   | TTL            |
| --------- | -------------- | ----------------------- | -------------- |
| In-memory | TanStack Query | Active session          | 15 min (stale) |
| Disk      | localStorage   | Cross-session / offline | 1 hour         |

`players.cache.ts` persists each page by `offset + query`. If `fetch` fails (network down) or the server returns an error, cached data is served. On write, if localStorage is full, expired entries are cleared and the write is retried before silently discarding.

### Client-side search validation

Before firing any request:

- `length < 3` → warns "Enter at least 3 characters", no fetch
- Contains numbers → warns "Search cannot contain numbers", no fetch
- `debouncedSearch` at 300ms — avoids a request on every keystroke

If the server returns a 400 with `validationErrors[]`, the first message is parsed and shown inline.

### MUI v7 — dark theme

Color palette inspired by EA FC.
`shape.borderRadius: 10` applied globally — `borderRadius: 1.5` in sx translates to `15px`.
Global overrides for `MuiCard`, `MuiChip` and `MuiTextField`.

---

## UI state modelling

| State               | Flag                   | Component                     |
| ------------------- | ---------------------- | ----------------------------- |
| Initial loading     | `isLoading`            | `PlayerListSkeletonComponent` |
| Error               | `isError`              | `Alert` + Retry button        |
| Empty               | `players.length === 0` | `PlayerEmptyStateComponent`   |
| Success             | `players.length > 0`   | `PlayerCardComponent` grid    |
| Incremental loading | `isFetchingNextPage`   | Inline `CircularProgress`     |
| All loaded          | `!hasNextPage`         | "All players loaded" Chip     |

Loading/error/success states are rendered via early returns inside an IIFE in the JSX — mutually exclusive.

---

## Pagination

The API accepts `offset` and `limit`.
`getNextPageParam` computes the next offset by summing all already-downloaded items across pages. Returns `undefined` when `fetched >= totalItems`, setting `hasNextPage = false` and stopping the infinite scroll.

```
GET https://drop-api.ea.com/rating/ea-sports-fc?locale=es&offset=0&limit=25
GET https://drop-api.ea.com/rating/ea-sports-fc?locale=es&offset=25&limit=25
...
```

---

## Testing

**Vitest** + **React Testing Library** + **MSW v2** (intercepts `fetch` at network level).

```bash
npm run test
```

Coverage:

- Pure functions (`player.utils`)
- `PlayerCardComponent` — render, interaction, commonName
- `PlayerDetailComponent` — drawer render, subcomponents
- `PlayerListContainer` — loading, success, error, retry, search
- `usePlayers` hook — isLoading, players, totalItems, hasNextPage

---

## Trade-offs and future improvements

| Area              | Current state            | Future improvement                                                           |
| ----------------- | ------------------------ | ---------------------------------------------------------------------------- |
| Virtualisation    | Full DOM                 | `@tanstack/react-virtual`                                                    |
| Filters           | Name search only         | Position, league, nationality                                                |
| Player comparison | Not implemented          | Compare stats between two or more players                                    |
| Error boundary    | No global error boundary | `ErrorBoundary` wrapping the provider tree to catch unexpected render errors |
| E2E tests         | None                     | Playwright against the real app                                              |
