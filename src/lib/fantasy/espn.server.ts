import {
  ESPN_BENCH_SLOTS,
  ESPN_DEFAULT_POSITION,
  ESPN_PRO_TEAM,
  ESPN_SLOT_POSITION,
  SEASON_YEAR,
  formatPlayerName,
  normalizeNflTeam,
} from "./constants";
import { abbreviateTeamName } from "./names";
import type { EspnTeam } from "./types";

const ESPN_API_BASE = "https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl";

export type EspnStarter = {
  id: string;
  name: string;
  shortName: string;
  position: string;
  slotId: number;
  nflTeam: string;
  fantasyTeamName: string;
  fantasyAbbrev: string;
};

export type EspnMatchupRow = {
  id: string;
  leagueName: string;
  myTeam: { name: string; abbrev: string; score: number };
  oppTeam: { name: string; abbrev: string; score: number } | null;
};

type EspnFetchResult =
  | { ok: true; data: any; year: number }
  | { ok: false; error: string; status?: number };

function cookieHeader(espn_s2?: string, swid?: string): string {
  const s2 = (espn_s2 || "").trim();
  const id = (swid || "").trim();
  if (!s2 && !id) return "";
  const s2Val = s2.replace(/^espn_s2=/i, "");
  const swidVal = id.replace(/^swid=/i, "");
  const parts: string[] = [];
  if (s2Val) parts.push(`espn_s2=${s2Val}`);
  if (swidVal) parts.push(`SWID=${swidVal}`);
  if (swidVal) parts.push(`swid=${swidVal}`);
  return parts.join("; ");
}

async function espnGet(url: string, cookies: string): Promise<EspnFetchResult> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Referer: "https://fantasy.espn.com/",
    Origin: "https://fantasy.espn.com",
    "X-Requested-With": "XMLHttpRequest",
  };
  if (cookies) headers.Cookie = cookies;

  try {
    const response = await fetch(url, { method: "GET", headers, redirect: "manual" });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location") || "";
      return {
        ok: false,
        status: response.status,
        error: location.includes("login")
          ? "This ESPN league looks private. Add espn_s2 and SWID cookies from a logged-in browser."
          : `ESPN redirected the request (${response.status}).`,
      };
    }
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error:
          response.status === 401 || response.status === 403
            ? "ESPN denied access. Public leagues need only a league ID; private leagues need both cookies."
            : `ESPN returned ${response.status}.`,
      };
    }
    const data = await response.json();
    return { ok: true, data, year: 0 };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "ESPN request failed" };
  }
}

async function fetchLeague(opts: {
  leagueId: string;
  year: number;
  cookies: string;
  views: string[];
  week?: number;
}): Promise<EspnFetchResult> {
  const views = opts.views.map((v) => `view=${encodeURIComponent(v)}`).join("&");
  const scoring = opts.week != null ? `&scoringPeriodId=${opts.week}` : "";
  const primary = `${ESPN_API_BASE}/seasons/${opts.year}/segments/0/leagues/${opts.leagueId}?${views}${scoring}`;
  let result = await espnGet(primary, opts.cookies);
  if (!result.ok && (!opts.cookies || result.status === 301 || result.status === 302)) {
    const alt = `${ESPN_API_BASE}/leagueHistory/${opts.leagueId}?seasonId=${opts.year}&${views}${scoring}`;
    result = await espnGet(alt, opts.cookies);
  }
  if (result.ok) result.year = opts.year;
  return result;
}

async function fetchWithYearFallback(opts: {
  leagueId: string;
  cookies: string;
  views: string[];
  week?: number;
  year?: number;
}): Promise<EspnFetchResult> {
  const preferred = opts.year ?? SEASON_YEAR;
  const years = [preferred, preferred - 1, preferred - 2].filter((y, i, a) => a.indexOf(y) === i);
  let last: EspnFetchResult | null = null;
  for (const year of years) {
    const result = await fetchLeague({ ...opts, year });
    last = result;
    if (result.ok) return result;
  }
  return last ?? { ok: false, error: "ESPN league not found." };
}

function teamName(team: any): string {
  return team?.name || `${team?.location ?? ""} ${team?.nickname ?? ""}`.trim() || "Team";
}

function teamAbbrev(team: any): string {
  if (team?.abbrev) return String(team.abbrev).toUpperCase().slice(0, 6);
  return abbreviateTeamName(teamName(team));
}

function sideScore(side: any): number {
  const live = Number(side?.totalPointsLive);
  if (Number.isFinite(live) && live > 0) return live;
  const applied = Number(side?.rosterForCurrentScoringPeriod?.appliedStatTotal);
  if (Number.isFinite(applied) && applied > 0) return applied;
  const total = Number(side?.totalPoints);
  return Number.isFinite(total) ? total : 0;
}

export function extractEspnTeams(data: any): EspnTeam[] {
  const teams = Array.isArray(data?.teams) ? data.teams : [];
  return teams.map((t: any) => ({
    id: Number(t.id),
    name: teamName(t),
    abbrev: teamAbbrev(t),
  }));
}

function actualPosition(entry: any): string {
  const slotId = Number(entry?.lineupSlotId);
  const player = entry?.playerPoolEntry?.player;
  const fromPlayer = player?.defaultPositionId != null ? ESPN_DEFAULT_POSITION[player.defaultPositionId] : undefined;
  const fromSlot = ESPN_SLOT_POSITION[slotId];
  if (fromSlot === "FLEX") return fromPlayer || "FLEX";
  return fromPlayer || fromSlot || "UNKNOWN";
}

export function extractStarters(team: any): EspnStarter[] {
  const fantasyTeamName = teamName(team);
  const fantasyAbbrev = teamAbbrev(team);
  const entries: any[] = team?.roster?.entries || [];
  const starters: EspnStarter[] = [];
  for (const entry of entries) {
    const slotId = Number(entry?.lineupSlotId);
    if (ESPN_BENCH_SLOTS.has(slotId)) continue;
    const player = entry?.playerPoolEntry?.player;
    if (!player) continue;
    const { full, short } = formatPlayerName(player.firstName || "", player.lastName || "");
    const nflTeam = normalizeNflTeam(ESPN_PRO_TEAM[player.proTeamId] || "FA");
    starters.push({
      id: String(player.id),
      name: full,
      shortName: short,
      position: actualPosition(entry),
      slotId,
      nflTeam,
      fantasyTeamName,
      fantasyAbbrev,
    });
  }
  return starters;
}

export async function loadEspnLeague(opts: {
  leagueId: string;
  espn_s2?: string;
  swid?: string;
  year?: number;
}): Promise<{ teams: EspnTeam[]; year: number; fallback: boolean }> {
  const cookies = cookieHeader(opts.espn_s2, opts.swid);
  const result = await fetchWithYearFallback({
    leagueId: opts.leagueId,
    cookies,
    views: ["mTeam"],
    year: opts.year,
  });
  if (!result.ok) {
    throw new Error(result.error);
  }
  return {
    teams: extractEspnTeams(result.data),
    year: result.year,
    fallback: result.year !== (opts.year ?? SEASON_YEAR),
  };
}

export async function analyzeEspnMatchup(opts: {
  leagueId: string;
  teamId?: string;
  week: number;
  espn_s2?: string;
  swid?: string;
  year?: number;
}): Promise<{
  year: number;
  fallback: boolean;
  user: { id: number; name: string; abbrev: string; starters: EspnStarter[] };
  opponent: { id: number; name: string; abbrev: string; starters: EspnStarter[] } | null;
  matchup: EspnMatchupRow;
}> {
  const cookies = cookieHeader(opts.espn_s2, opts.swid);
  const result = await fetchWithYearFallback({
    leagueId: opts.leagueId,
    cookies,
    views: ["mMatchup", "mRoster", "mTeam", "mScoreboard"],
    week: opts.week,
    year: opts.year,
  });
  if (!result.ok) throw new Error(result.error);
  const data = result.data;
  const teams: any[] = data.teams || [];
  if (!teams.length) throw new Error("ESPN returned no teams for this league.");

  const userTeam = opts.teamId
    ? teams.find((t) => String(t.id) === String(opts.teamId))
    : teams[0];
  if (!userTeam) throw new Error(`ESPN team ${opts.teamId} was not found in this league.`);

  let opponentTeam: any | null = null;
  const schedule: any[] = data.schedule || [];
  const matchup = schedule.find(
    (m) =>
      Number(m.matchupPeriodId) === Number(opts.week) &&
      (m.home?.teamId === userTeam.id || m.away?.teamId === userTeam.id),
  );
  let myScore = 0;
  let oppScore: number | null = null;
  if (matchup) {
    const userIsHome = matchup.home?.teamId === userTeam.id;
    const mySide = userIsHome ? matchup.home : matchup.away;
    const oppSide = userIsHome ? matchup.away : matchup.home;
    myScore = sideScore(mySide);
    const oppId = oppSide?.teamId;
    opponentTeam = teams.find((t) => t.id === oppId) ?? null;
    if (opponentTeam) oppScore = sideScore(oppSide);
  }

  const userName = teamName(userTeam);
  const userAbbrev = teamAbbrev(userTeam);
  const oppName = opponentTeam ? teamName(opponentTeam) : "Opponent";
  const oppAbbrev = opponentTeam ? teamAbbrev(opponentTeam) : "OPP";
  const leagueName = data.settings?.name || data.settings?.nameSettings?.name || `ESPN ${opts.leagueId}`;

  return {
    year: result.year,
    fallback: result.year !== (opts.year ?? SEASON_YEAR),
    user: {
      id: userTeam.id,
      name: userName,
      abbrev: userAbbrev,
      starters: extractStarters(userTeam),
    },
    opponent: opponentTeam
      ? {
          id: opponentTeam.id,
          name: oppName,
          abbrev: oppAbbrev,
          starters: extractStarters(opponentTeam),
        }
      : null,
    matchup: {
      id: `espn:${opts.leagueId}:${opts.week}`,
      leagueName,
      myTeam: { name: userName, abbrev: userAbbrev, score: myScore },
      oppTeam: opponentTeam ? { name: oppName, abbrev: oppAbbrev, score: oppScore ?? 0 } : null,
    },
  };
}
