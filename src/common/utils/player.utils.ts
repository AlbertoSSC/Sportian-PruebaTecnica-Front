import type { Player } from '@/common/types';

export function getPlayerDisplayName(player: Player): string {
  return player.commonName ?? `${player.firstName} ${player.lastName}`.trim();
}

export function getStatColor(value: number): string {
  if (value >= 85) return '#2ecc71';
  if (value >= 70) return '#f39c12';
  if (value >= 55) return '#e67e22';
  return '#e74c3c';
}
