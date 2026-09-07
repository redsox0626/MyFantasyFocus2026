import type { Position, TimeSlot } from "./types";

export const SEASON_YEAR = 2026;
export const SEASON_START_LABEL = "Wednesday, Sept 9, 2026";

export const TIME_SLOTS: TimeSlot[] = [
  "All",
  "Wednesday",
  "Thursday",
  "International",
  "Sunday Early",
  "Sunday Late",
  "Sunday Night",
  "Monday Night",
];

export const KICKOFF_WINDOWS: TimeSlot[] = TIME_SLOTS.filter((s) => s !== "All");

export const POSITION_ORDER: Position[] = ["QB", "RB", "WR", "TE", "K", "DEF", "DL", "LB", "DB"];

export const POSITION_LABEL: Record<string, string> = {
  QB: "Quarterbacks",
  RB: "Running backs",
  WR: "Wide receivers",
  TE: "Tight ends",
  K: "Kickers",
  DEF: "Defenses",
  DL: "Defensive line",
  LB: "Linebackers",
  DB: "Defensive backs",
};

export const IDP_POSITIONS = new Set([
  "DL",
  "LB",
  "DB",
  "IDP",
  "DT",
  "DE",
  "NT",
  "OLB",
  "ILB",
  "MLB",
  "CB",
  "S",
  "FS",
  "SS",
  "NB",
]);

export function isIdpPosition(position: string | undefined | null): boolean {
  return IDP_POSITIONS.has((position || "").toUpperCase());
}

/** ESPN fantasy lineupSlotId → position. Bench/IR excluded by caller. */
export const ESPN_SLOT_POSITION: Record<number, string> = {
  0: "QB",
  1: "QB",
  2: "RB",
  3: "RB",
  4: "WR",
  5: "WR",
  6: "TE",
  7: "FLEX",
  8: "DL",
  9: "DL",
  10: "LB",
  11: "DL",
  12: "DB",
  13: "DB",
  14: "DB",
  15: "LB",
  16: "DEF",
  17: "K",
  23: "FLEX",
  25: "RB",
};

/** ESPN player.defaultPositionId */
export const ESPN_DEFAULT_POSITION: Record<number, string> = {
  1: "QB",
  2: "RB",
  3: "WR",
  4: "TE",
  5: "K",
  6: "DL",
  7: "LB",
  8: "DB",
  9: "DL",
  10: "LB",
  11: "LB",
  12: "DB",
  13: "DB",
  14: "DB",
  15: "DL",
  16: "DEF",
  17: "K",
};

export const ESPN_BENCH_SLOTS = new Set([20, 21, 24]);

/** ESPN proTeamId — original map was missing BAL (33). */
export const ESPN_PRO_TEAM: Record<number, string> = {
  0: "FA",
  1: "ATL",
  2: "BUF",
  3: "CHI",
  4: "CIN",
  5: "CLE",
  6: "DAL",
  7: "DEN",
  8: "DET",
  9: "GB",
  10: "TEN",
  11: "IND",
  12: "KC",
  13: "LV",
  14: "LAR",
  15: "MIA",
  16: "MIN",
  17: "NE",
  18: "NO",
  19: "NYG",
  20: "NYJ",
  21: "PHI",
  22: "ARI",
  23: "PIT",
  24: "LAC",
  25: "SF",
  26: "SEA",
  27: "TB",
  28: "WSH",
  29: "CAR",
  30: "JAX",
  33: "BAL",
  34: "HOU",
};

export function normalizeNflTeam(abbr: string | undefined | null): string {
  if (!abbr) return "FA";
  const t = abbr.toUpperCase().trim();
  const map: Record<string, string> = {
    JAC: "JAX",
    JAX: "JAX",
    WAS: "WSH",
    WSH: "WSH",
    LA: "LAR",
    STL: "LAR",
    SD: "LAC",
    OAK: "LV",
  };
  return map[t] ?? t;
}

export function formatPlayerName(first: string, last: string): { full: string; short: string } {
  const f = (first || "").trim();
  const l = (last || "").trim();
  const short = f ? `${f[0]}. ${l}` : l || "Unknown";
  return { full: `${f} ${l}`.trim() || "Unknown", short };
}

export function sleeperAvatarUrl(avatar?: string | null, size: "thumb" | "full" = "thumb"): string | null {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  return size === "thumb"
    ? `https://sleepercdn.com/avatars/thumbs/${avatar}`
    : `https://sleepercdn.com/avatars/${avatar}`;
}

export { abbreviateTeamName } from "./names";
