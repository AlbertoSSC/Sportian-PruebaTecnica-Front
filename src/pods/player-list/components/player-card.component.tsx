import { memo } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import type { Player } from "@/common/types";
import { getPlayerDisplayName, getStatColor } from "@/common/utils";

interface PlayerCardComponentProps {
  player: Player;
  onClick: () => void;
}

const MAIN_STATS = ["pac", "sho", "pas", "dri", "def", "phy"];
const STAT_LABELS: Record<string, string> = {
  pac: "PAC",
  sho: "SHO",
  pas: "PAS",
  dri: "DRI",
  def: "DEF",
  phy: "PHY",
};

export const PlayerCardComponent = memo(function PlayerCardComponent({
  player,
  onClick,
}: PlayerCardComponentProps) {
  const displayName = getPlayerDisplayName(player);

  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea onClick={onClick} sx={{ height: "100%", p: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <Avatar
              src={player.avatarUrl}
              alt={displayName}
              sx={{
                width: 56,
                height: 56,
                border: "2px solid",
                borderColor: "primary.main",
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="h5"
                  component="span"
                  color="primary"
                  sx={{ fontWeight: 700, lineHeight: 1 }}
                >
                  {player.overallRating}
                </Typography>
                <Chip
                  label={player.position.shortLabel}
                  size="small"
                  sx={{
                    bgcolor: "secondary.dark",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    height: 20,
                    "& .MuiChip-label": { px: 0.5 },
                  }}
                />
              </Box>
              <Typography
                variant="subtitle1"
                noWrap
                sx={{ fontWeight: 600, mt: 0.25 }}
              >
                {displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {player.team.label}
              </Typography>
            </Box>
            <Avatar
              src={player.nationality.imageUrl}
              alt={player.nationality.label}
              variant="square"
              sx={{ width: 24, height: 16, borderRadius: 0.5 }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            {MAIN_STATS.map((stat) => {
              const val = player.stats[stat]?.value ?? 0;
              return (
                <Box key={stat} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      fontWeight: 700,
                      color: getStatColor(val),
                      fontSize: "0.8rem",
                    }}
                  >
                    {val}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.6rem" }}
                  >
                    {STAT_LABELS[stat]}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});
