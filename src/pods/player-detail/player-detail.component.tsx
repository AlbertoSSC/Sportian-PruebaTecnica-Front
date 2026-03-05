import { memo } from "react";

import type { Player } from "@/common/types";
import {
  PlayerDetailHeader,
  PlayerDetailPositions,
  PlayerDetailInfo,
  PlayerDetailPlayStyles,
  PlayerStatsComponent,
} from "./components";

import { Drawer, Box, Divider } from "@mui/material";

interface PlayerDetailComponentProps {
  player: Player | null;
  open: boolean;
  onClose: () => void;
}

const SECTION_LABEL_SX = {
  textTransform: "uppercase" as const,
  letterSpacing: 1,
  display: "block",
  mb: 1.5,
};

export const PlayerDetailComponent = memo(function PlayerDetailComponent({
  player,
  open,
  onClose,
}: PlayerDetailComponentProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100vw", sm: 420 },
            backgroundImage: "none",
          },
        },
      }}
    >
      {player && (
        <Box>
          <PlayerDetailHeader player={player} onClose={onClose} />

          <Box sx={{ p: 2.5 }}>
            <PlayerDetailPositions
              position={player.position}
              alternatePositions={player.alternatePositions}
              labelSx={SECTION_LABEL_SX}
            />

            <Divider sx={{ mb: 2 }} />

            <PlayerStatsComponent
              stats={player.stats}
              labelSx={SECTION_LABEL_SX}
            />

            <Divider sx={{ my: 2 }} />

            <PlayerDetailInfo player={player} labelSx={SECTION_LABEL_SX} />

            <Divider sx={{ my: 2 }} />

            <PlayerDetailPlayStyles
              abilities={player.playerAbilities}
              labelSx={SECTION_LABEL_SX}
            />
          </Box>
        </Box>
      )}
    </Drawer>
  );
});
