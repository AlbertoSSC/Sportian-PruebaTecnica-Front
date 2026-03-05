import React, { memo } from "react";

import type { Player } from "@/common/types";
import { PlayerDetailContainer } from "@/pods/player-detail";
import {
  PlayerCardComponent,
  PlayerListSkeletonComponent,
  PlayerEmptyStateComponent,
} from "./components";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Button,
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            color="primary"
            fontWeight={700}
          >
            EAFC Ratings
          </Typography>
          {totalItems > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {totalItems.toLocaleString()} players total
              {search &&
                ` · ${players.length} result${players.length !== 1 ? "s" : ""}`}
            </Typography>
          )}
        </Box>
        <TextField
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search player..."
          sx={{ minWidth: 260 }}
          helperText={searchError}
          slotProps={{
            formHelperText: { sx: { color: "warning.main" } },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {isLoading && <PlayerListSkeletonComponent />}

      {isError && !isLoading && (
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
            {(error as Error)?.message ??
              "Error loading players. Check your connection."}
          </Alert>
        </Box>
      )}

      {!isLoading && !isError && players.length === 0 && (
        <PlayerEmptyStateComponent hasSearch={!!search} />
      )}

      {!isLoading && !isError && players.length > 0 && (
        <Grid container spacing={2}>
          {players.map((player) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={player.id}>
              <PlayerCardComponent
                player={player}
                onClick={() => onSelectPlayer(player)}
              />
            </Grid>
          ))}
        </Grid>
      )}

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
