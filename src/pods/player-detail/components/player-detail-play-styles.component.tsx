import { Box, Chip, Typography, type SxProps, type Theme } from "@mui/material";

import type { PlayerAbility } from "@/common/types";

interface PlayerDetailPlayStylesProps {
  abilities: PlayerAbility[];
  labelSx?: SxProps<Theme>;
}

export function PlayerDetailPlayStyles({
  abilities,
  labelSx,
}: PlayerDetailPlayStylesProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={labelSx}>
        Play Styles
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {abilities.map((ability) => (
          <Chip
            key={ability.id}
            label={ability.label}
            size="small"
            variant="outlined"
            color={ability.type.id === "playStylePlus" ? "primary" : "default"}
            title={ability.description}
          />
        ))}
      </Box>
    </Box>
  );
}
