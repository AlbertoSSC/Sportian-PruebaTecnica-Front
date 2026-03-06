import React, { memo } from "react";

import type { Player } from "@/common/types";
import { PlayerDetailContainer } from "@/pods/player-detail";
import {
  PlayerCardComponent,
  PlayerListSkeletonComponent,
  PlayerEmptyStateComponent,
  PlayerListHeaderComponent,
} from "./components";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
} from "@mui/material";

interface PlayerListComponentProps {
  players: Player[];
  totalItems: number;
  search: string;
  onSearchChange: (value: string) => void;
  searchError?: string;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onRetry: () => void;
  loaderRef: React.RefObject<HTMLDivElement | null>;
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player | null) => void;
}

export const PlayerListComponent = memo(function PlayerListComponent({
  players,
  totalItems,
  search,
  onSearchChange,
  searchError,
  isLoading,
  isError,
  error,
  isFetchingNextPage,
  hasNextPage,
  onRetry,
  loaderRef,
  selectedPlayer,
  onSelectPlayer,
}: PlayerListComponentProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PlayerListHeaderComponent
        search={search}
        totalItems={totalItems}
        resultCount={players.length}
        searchError={searchError}
        onSearchChange={onSearchChange}
      />

      {(() => {
        if (isLoading) return <PlayerListSkeletonComponent />;

        if (isError)
          return (
            <Box sx={{ my: 4, textAlign: "center" }}>
              <Alert
                severity="error"
                sx={{ mb: 2, maxWidth: 600, mx: "auto" }}
                action={
                  <Button color="inherit" size="small" onClick={onRetry}>
                    Retry
                  </Button>
                }
              >
                {error?.message ??
                  "Error loading players. Check your connection."}
              </Alert>
            </Box>
          );

        if (players.length === 0)
          return <PlayerEmptyStateComponent hasSearch={!!search} />;

        return (
          <Grid container spacing={2}>
            {players.map((player) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={player.id}>
                <PlayerCardComponent
                  player={player}
                  onSelect={onSelectPlayer}
                />
              </Grid>
            ))}
          </Grid>
        );
      })()}

      {/* Infinite scroll sentinel */}
      <Box ref={loaderRef} sx={{ height: 1, mt: 2 }} />
      {isFetchingNextPage && (
        <Box
          sx={{ display: "flex", justifyContent: "center", py: 4, gap: 1.5 }}
        >
          <CircularProgress size={24} color="primary" />
          <Typography variant="body2" color="text.secondary">
            Loading more players...
          </Typography>
        </Box>
      )}

      {!hasNextPage && !isLoading && players.length > 0 && !search && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Chip
            label={`All players loaded (${players.length})`}
            variant="outlined"
          />
        </Box>
      )}

      <PlayerDetailContainer
        player={selectedPlayer}
        onClose={() => onSelectPlayer(null)}
      />
    </Container>
  );
});
