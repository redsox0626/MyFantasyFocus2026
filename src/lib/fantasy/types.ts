export type Platform = "sleeper" | "espn" | "both";

export type TimeSlot =
  | "All"
  | "Wednesday"
  | "Thursday"
  | "International"
  | "Sunday Early"
  | "Sunday Late"
  | "Sunday Night"
  | "Monday Night";

export type TimeFilter = "Live" | TimeSlot;

export type Position = "QB" | "RB" | "WR" | "TE" | "K" | "DEF" | "DL" | "LB" | "DB" | "FLEX" | "UNKNOWN";

export type GameStatus = "pre" | "in" | "post";

export type MatchupStatus = "winning" | "losing" | "tied" | "pending";

export interface NflGame {
  week: number;
  id: string;
  start_time: string;
  home_team: string;
  away_team: string;
  name: string;
  venue?: string;
  city?: string;
  country?: string;
  detail?: string;
  status?: GameStatus;
  displayClock?: string;
}

export interface FantasyTeamTag {
  abbrev: string;
  name: string;
  side: "mine" | "theirs";
  platform: "sleeper" | "espn";
  matchupId: string;
}

export interface MatchupScore {
  id: string;
  platform: "sleeper" | "espn";
  leagueName: string;
  myTeam: { name: string; abbrev: string; score: number; projected?: number };
  oppTeam: { name: string; abbrev: string; score: number; projected?: number } | null;
  status: MatchupStatus;
}

export interface Player {
  id: string;
  name: string;
  playerNameOnly: string;
  position: string;
  teamAbbr: string;
  nflTeam: string;
  count: number;
  platform: Platform;
  myCount?: number;
  oppCount?: number;
  kickoff?: string;
  slot?: TimeSlot | "Bye" | "Unknown";
  tags?: FantasyTeamTag[];
  stdPts?: number;
  pprPts?: number;
}

export interface EspnCredentials {
  espn_s2: string;
  swid: string;
  leagueId: string;
  teamId?: string;
}

export interface EspnConnection {
  creds: EspnCredentials;
  teams: EspnTeam[];
}

export interface EspnTeam {
  id: number;
  name: string;
  abbrev: string;
}

export interface NflState {
  week: number;
  season: string;
  seasonType: string;
  seasonStartDate: string;
  displayWeek: number;
}

export interface AnalysisMeta {
  week: number;
  season: string;
  usedSeason?: string | number;
  fallback?: boolean;
  sleeperLeagues: number;
  espnUsed: boolean;
  warnings: string[];
  liveTeams: string[];
  redZoneTeams: string[];
}

export interface AnalysisResult {
  my: Player[];
  opponent: Player[];
  overlap: Player[];
  matchups: MatchupScore[];
  meta: AnalysisMeta;
}

export interface BootstrapData {
  state: NflState;
  schedule: NflGame[];
  liveTeams: string[];
  redZoneTeams: string[];
}

export interface SleeperLeagueInfo {
  id: string;
  name: string;
  avatar: string | null;
  size: number;
}

export interface SleeperUserLookup {
  found: boolean;
  query: string;
  username: string;
  userId?: string;
  displayName?: string;
  avatar?: string | null;
  leagues: SleeperLeagueInfo[];
}

export interface SleeperAccount {
  username: string;
  userId?: string;
  displayName?: string;
  avatar?: string | null;
  /** Explicit league allow-list. `null` / omitted = every league for this user. */
  leagueIds?: string[] | null;
  leagues?: SleeperLeagueInfo[];
  missing?: boolean;
}

export interface SleeperRecent {
  username: string;
  displayName?: string;
  avatar?: string | null;
}
