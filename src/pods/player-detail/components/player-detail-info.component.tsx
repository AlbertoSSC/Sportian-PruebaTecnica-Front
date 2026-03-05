import type { ReactNode } from "react";

import { Box, Grid, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import type { Player } from "@/common/types";

interface PlayerDetailInfoProps {
  player: Player;
  labelSx?: SxProps<Theme>;
}

const MAX_STARS = 5;

function Stars({ count }: { count: number }) {
  return (
    <Box sx={{ display: "flex" }}>
      {Array.from({ length: MAX_STARS }, (_, i) =>
        i < count ? (
          <StarIcon key={i} sx={{ fontSize: 16, color: "warning.main" }} />
        ) : (
          <StarBorderIcon
            key={i}
            sx={{ fontSize: 16, color: "text.disabled" }}
          />
        ),
      )}
    </Box>
  );
}

export function PlayerDetailInfo({ player, labelSx }: PlayerDetailInfoProps) {
  const { height, weight, skillMoves, weakFootAbility, preferredFoot } = player;

  const fields: { label: string; value: ReactNode }[] = [
    { label: "Height", value: `${height} cm` },
    { label: "Weight", value: `${weight} kg` },
    { label: "Skill Moves", value: <Stars count={skillMoves} /> },
    { label: "Weak Foot", value: <Stars count={weakFootAbility} /> },
    { label: "Preferred Foot", value: preferredFoot === 1 ? "Right" : "Left" },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={labelSx}>
        Details
      </Typography>

      <Grid container spacing={1}>
        {fields.map(({ label, value }) => (
          <Grid size={6} key={label}>
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.04)",
                borderRadius: 1.5,
                p: 1.5,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                {label}
              </Typography>
              <Box sx={{ mt: 0.25, fontWeight: 600, typography: "body2" }}>
                {value}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
