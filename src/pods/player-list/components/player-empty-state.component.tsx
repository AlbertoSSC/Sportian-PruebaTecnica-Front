import { Box, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import SportsIcon from '@mui/icons-material/Sports';

interface PlayerEmptyStateComponentProps {
  hasSearch: boolean;
}

export function PlayerEmptyStateComponent({ hasSearch }: PlayerEmptyStateComponentProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 10,
        gap: 2,
        color: 'text.secondary',
      }}
    >
      {hasSearch ? (
        <SearchOffIcon sx={{ fontSize: 64, opacity: 0.4 }} />
      ) : (
        <SportsIcon sx={{ fontSize: 64, opacity: 0.4 }} />
      )}
      <Typography variant="h6" color="text.secondary">
        {hasSearch ? 'No players found' : 'No players available'}
      </Typography>
      <Typography variant="body2" color="text.disabled">
        {hasSearch
          ? 'Try a different name or clear the search'
          : 'Check your connection and try again'}
      </Typography>
    </Box>
  );
}
