import { Box, Chip, Typography, type SxProps, type Theme } from "@mui/material";
import type { PlayerPosition } from "@/common/types";

interface PlayerDetailPositionsProps {
  position: PlayerPosition;
  alternatePositions: PlayerPosition[] | null;
  labelSx?: SxProps<Theme>;
}

export function PlayerDetailPositions({
  position,
  alternatePositions,
  labelSx,
}: PlayerDetailPositionsProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={labelSx}>
        Position
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
        <Chip
          label={position.label}
          size="small"
          color="primary"
          variant="outlined"
        />
        {alternatePositions?.map((pos) => (
          <Chip
            key={pos.id}
            label={pos.label}
            size="small"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
}
