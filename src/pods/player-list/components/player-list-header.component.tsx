import { Box, Typography, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface PlayerListHeaderProps {
  search: string;
  totalItems: number;
  resultCount: number;
  searchError?: string;
  onSearchChange: (value: string) => void;
}

export function PlayerListHeaderComponent({
  search,
  totalItems,
  resultCount,
  searchError,
  onSearchChange,
}: PlayerListHeaderProps) {
  return (
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
        <Typography variant="h4" component="h1" color="primary" fontWeight={700}>
          EAFC Ratings
        </Typography>
        {totalItems > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {search !== ""
              ? `${totalItems.toLocaleString()} player${resultCount !== 1 ? "s" : ""} found`
              : `${totalItems.toLocaleString()} players`}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
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
        {search && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => onSearchChange("")}
            sx={{ height: "stretch", whiteSpace: "nowrap" }}
          >
            Show all
          </Button>
        )}
      </Box>
    </Box>
  );
}
