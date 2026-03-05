import type { Player } from '@/common/types';
import { PlayerDetailComponent } from './player-detail.component';

interface PlayerDetailContainerProps {
  player: Player | null;
  onClose: () => void;
}

export function PlayerDetailContainer({ player, onClose }: PlayerDetailContainerProps) {
  return (
    <PlayerDetailComponent
      player={player}
      open={player !== null}
      onClose={onClose}
    />
  );
}
