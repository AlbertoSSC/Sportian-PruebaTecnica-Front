import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchPlayers } from "@/api";
import type { Player } from "@/common/types";

export const PLAYERS_QUERY_KEY = "players" as const;
const STALE_TIME_MS = 15 * 60 * 1000;

export function usePlayers(search = "") {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: [PLAYERS_QUERY_KEY, search],
    queryFn: ({ pageParam }) =>
      fetchPlayers({ offset: pageParam as number, query: search || undefined }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.reduce((acc, p) => acc + p.items.length, 0);
      return fetched < lastPage.totalItems ? fetched : undefined;
    },
    staleTime: STALE_TIME_MS,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
    }),
  });

  const players: Player[] = data?.pages.flatMap((page) => page.items) ?? [];
  const totalItems = data?.pages[0]?.totalItems ?? 0;

  return {
    players,
    totalItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  };
}

// export type UsePlayersReturn = ReturnType<typeof usePlayers>;
