import type { PlayerStats } from "@/common/types";
import { getStatColor } from "@/common/utils";

import {
  Box,
  Typography,
  LinearProgress,
  type SxProps,
  type Theme,
} from "@mui/material";

interface PlayerStatsComponentProps {
  stats: PlayerStats;
  labelSx?: SxProps<Theme>;
}

const STAT_GROUPS = [
  {
    title: "Pace",
    overallKey: "pac",
    stats: [
      { key: "acceleration", label: "Acceleration" },
      { key: "sprintSpeed", label: "Sprint Speed" },
    ],
  },
  {
    title: "Shooting",
    overallKey: "sho",
    stats: [
      { key: "positioning", label: "Positioning" },
      { key: "finishing", label: "Finishing" },
      { key: "shotPower", label: "Shot Power" },
      { key: "longShots", label: "Long Shots" },
      { key: "volleys", label: "Volleys" },
      { key: "penalties", label: "Penalties" },
    ],
  },
  {
    title: "Passing",
    overallKey: "pas",
    stats: [
      { key: "vision", label: "Vision" },
      { key: "crossing", label: "Crossing" },
      { key: "freeKickAccuracy", label: "Free Kick Accuracy" },
      { key: "shortPassing", label: "Short Passing" },
      { key: "longPassing", label: "Long Passing" },
      { key: "curve", label: "Curve" },
    ],
  },
  {
    title: "Dribbling",
    overallKey: "dri",
    stats: [
      { key: "agility", label: "Agility" },
      { key: "balance", label: "Balance" },
      { key: "reactions", label: "Reactions" },
      { key: "ballControl", label: "Ball Control" },
      { key: "dribbling", label: "Dribbling" },
      { key: "composure", label: "Composure" },
    ],
  },
  {
    title: "Defending",
    overallKey: "def",
    stats: [
      { key: "interceptions", label: "Interceptions" },
      { key: "headingAccuracy", label: "Heading Accuracy" },
      { key: "defensiveAwareness", label: "Def Awareness" },
      { key: "standingTackle", label: "Standing Tackle" },
      { key: "slidingTackle", label: "Sliding Tackle" },
    ],
  },
  {
    title: "Physicality",
    overallKey: "phy",
    stats: [
      { key: "jumping", label: "Jumping" },
      { key: "stamina", label: "Stamina" },
      { key: "strength", label: "Strength" },
      { key: "aggression", label: "Aggression" },
    ],
  },
];

export function PlayerStatsComponent({
  stats,
  labelSx,
}: PlayerStatsComponentProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={labelSx}>
        Key Stats
      </Typography>

      <Box sx={{ gap: 2, mt: 1, display: "flex", flexDirection: "column" }}>
        {STAT_GROUPS.map((group) => {
          const overall = stats[group.overallKey]?.value ?? 0;
          const overallColor = getStatColor(overall);
          return (
            <Box
              key={group.title}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  mb: 0.75,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  fontSize={16}
                  color="text.primary"
                >
                  {group.title}
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  fontSize={18}
                  sx={{ color: overallColor }}
                >
                  {overall}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                {group.stats.map(({ key, label }) => {
                  const val = stats[key]?.value ?? 0;
                  const color = getStatColor(val);
                  return (
                    <Box
                      key={key}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ flex: 1, minWidth: 0 }}
                        noWrap
                      >
                        {label}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={val}
                        sx={{
                          width: 60,
                          flexShrink: 0,
                          height: 5,
                          borderRadius: 3,
                          bgcolor: "rgba(255,255,255,0.08)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: color,
                            borderRadius: 3,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        sx={{
                          width: 24,
                          textAlign: "right",
                          color,
                          flexShrink: 0,
                        }}
                      >
                        {val}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
