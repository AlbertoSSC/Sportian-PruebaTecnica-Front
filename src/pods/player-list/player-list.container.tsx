import { useState, useCallback } from "react";
import { usePlayers, useIntersectionObserver, useDebounce } from '@/common/hooks';
import { PlayerListComponent } from './player-list.component';
import type { Player } from '@/common/types';

const MIN_SEARCH_LENGTH = 3;
const HAS_NUMBERS_RE = /\d/;

export function PlayerListContainer() {
  const [search, setSearch] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const searchError: string | undefined = (() => {
    if (debouncedSearch.length === 0) return undefined;
    if (HAS_NUMBERS_RE.test(debouncedSearch)) return "Search cannot contain numbers";
    if (debouncedSearch.length < MIN_SEARCH_LENGTH) return "Enter at least 3 characters to search";
    return undefined;
  })();

  const activeQuery = searchError ? '' : debouncedSearch;

  const {
    players,
    totalItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = usePlayers(activeQuery);

  const handleFetchNext = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { targetRef } = useIntersectionObserver({
    onIntersect: handleFetchNext,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  return (
    <PlayerListComponent
      players={players}
      totalItems={totalItems}
      search={search}
      onSearchChange={setSearch}
      searchError={searchError}
      isLoading={isLoading}
      isError={isError}
      error={error}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage ?? false}
      onRetry={refetch}
      loaderRef={targetRef}
      selectedPlayer={selectedPlayer}
      onSelectPlayer={setSelectedPlayer}
    />
  );
}
