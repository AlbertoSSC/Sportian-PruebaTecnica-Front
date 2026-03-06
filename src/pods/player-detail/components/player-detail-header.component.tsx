import type { Player } from "@/common/types";
import { getPlayerDisplayName } from "@/common/utils";

import { Avatar, Box, Chip, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface PlayerDetailHeaderProps {
  player: Player;
  onClose: () => void;
}

export function PlayerDetailHeader({
  player,
  onClose,
}: PlayerDetailHeaderProps) {
  return (
    <Box
      sx={{
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        p: 3,
        position: "relative",
      }}
    >
      <IconButton
        onClick={onClose}
        size="small"
        sx={{ position: "absolute", top: 12, right: 12 }}
      >
        <CloseIcon />
      </IconButton>

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box>
          <Avatar
            src={player.avatarUrl}
            alt={getPlayerDisplayName(player)}
            sx={{
              width: 96,
              height: 96,
              border: "3px solid",
              borderColor: "primary.main",
            }}
          />
        </Box>

        <Box sx={{ flex: 1, pt: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              variant="h4"
              color="primary"
              fontWeight={700}
              lineHeight={1}
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
              }}
            />
          </Box>

          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            {getPlayerDisplayName(player)}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {player.team.label} · {player.leagueName}
          </Typography>

          <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
            <Avatar
              src={player.nationality.imageUrl}
              variant="square"
              sx={{
                width: 28,
                height: 20,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {player.nationality.label}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
