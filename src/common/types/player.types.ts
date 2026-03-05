export interface StatValue {
  value: number;
  diff: number;
}

export interface PlayerPosition {
  id: string;
  shortLabel: string;
  label: string;
  positionType: {
    id: string;
    name: string;
  };
}

export interface PlayerNationality {
  id: number;
  label: string;
  imageUrl: string;
}

export interface PlayerTeam {
  id: number;
  label: string;
  imageUrl: string;
  isPopular: boolean;
}

export interface PlayerAbility {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
  type: {
    id: string;
    label: string;
  };
}

export interface PlayerStats {
  pac: StatValue;
  sho: StatValue;
  pas: StatValue;
  dri: StatValue;
  def: StatValue;
  phy: StatValue;
  acceleration: StatValue;
  sprintSpeed: StatValue;
  finishing: StatValue;
  shotPower: StatValue;
  longShots: StatValue;
  positioning: StatValue;
  shortPassing: StatValue;
  longPassing: StatValue;
  vision: StatValue;
  crossing: StatValue;
  dribbling: StatValue;
  ballControl: StatValue;
  stamina: StatValue;
  strength: StatValue;
  aggression: StatValue;
  interceptions: StatValue;
  defensiveAwareness: StatValue;
  slidingTackle: StatValue;
  standingTackle: StatValue;
  gkDiving: StatValue;
  gkHandling: StatValue;
  gkKicking: StatValue;
  gkPositioning: StatValue;
  gkReflexes: StatValue;
  [key: string]: StatValue;
}

export interface Player {
  id: number;
  rank: number;
  overallRating: number;
  firstName: string;
  lastName: string;
  commonName: string | null;
  birthdate: string;
  height: number;
  weight: number;
  skillMoves: number;
  weakFootAbility: number;
  preferredFoot: number;
  leagueName: string;
  avatarUrl: string;
  shieldUrl: string;
  alternatePositions: PlayerPosition[] | null;
  playerAbilities: PlayerAbility[];
  gender: { id: number; label: string };
  nationality: PlayerNationality;
  team: PlayerTeam;
  position: PlayerPosition;
  stats: PlayerStats;
}

export interface PlayersApiResponse {
  items: Player[];
  totalItems: number;
}
