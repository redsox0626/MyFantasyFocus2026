import { normalizeNflTeam } from "./constants";
import type { GameStatus, NflGame } from "./types";

const SCOREBOARD = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

export type LiveSnapshot = {
  byTeam: Record<string, GameStatus>;
  liveTeams: string[];
};

let cache: { key: string; at: number; snap: LiveSnapshot } | null = null;
const TTL_MS = 30_000;

function inferStatus(startIso: string, now = Date.now()): GameStatus {
  const start = new Date(startIso).getTime();
  if (!Number.isFinite(start)) return "pre";
  if (now < start) return "pre";
  if (now < start + 3.5 * 60 * 60 * 1000) return "in";
  return "post";
}

export async function fetchLiveSnapshot(week?: number): Promise<LiveSnapshot> {
  const key = String(week ?? "current");
  const now = Date.now();
  if (cache && cache.key === key && now - cache.at < TTL_MS) return cache.snap;

  const url = week != null ? `${SCOREBOARD}?week=${week}&seasontype=2` : SCOREBOARD;
  const byTeam: Record<string, GameStatus> = {};
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const data = (await res.json()) as {
        events?: Array<{
          date?: string;
          competitions?: Array<{
            status?: { type?: { state?: string } };
            competitors?: Array<{ team?: { abbreviation?: string } }>;
          }>;
        }>;
      };
      for (const event of data.events || []) {
        const comp = event.competitions?.[0];
        const state = (comp?.status?.type?.state || "pre").toLowerCase();
        const status: GameStatus = state === "in" || state === "post" || state === "pre" ? state : inferStatus(event.date || "");
        for (const c of comp?.competitors || []) {
          const team = normalizeNflTeam(c.team?.abbreviation);
          if (team && team !== "FA") byTeam[team] = status;
        }
      }
    }
  } catch {
    /* scoreboard is best-effort */
  }

  const liveTeams = Object.entries(byTeam)
    .filter(([, s]) => s === "in")
    .map(([t]) => t);
  const snap = { byTeam, liveTeams };
  cache = { key, at: now, snap };
  return snap;
}

export function applyLiveStatus(schedule: NflGame[], snap: LiveSnapshot, week: number): NflGame[] {
  return schedule.map((game) => {
    if (game.week !== week) return game;
    const home = normalizeNflTeam(game.home_team);
    const away = normalizeNflTeam(game.away_team);
    const status = snap.byTeam[home] || snap.byTeam[away] || inferStatus(game.start_time);
    return { ...game, status };
  });
}

export function liveTeamsFromSchedule(schedule: NflGame[], week: number): string[] {
  const teams = new Set<string>();
  for (const game of schedule) {
    if (game.week !== week) continue;
    const status = game.status || inferStatus(game.start_time);
    if (status !== "in") continue;
    teams.add(normalizeNflTeam(game.home_team));
    teams.add(normalizeNflTeam(game.away_team));
  }
  return [...teams];
}
