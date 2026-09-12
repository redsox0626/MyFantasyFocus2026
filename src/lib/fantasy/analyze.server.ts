import bundledSchedule from "../../data/nfl_2026_schedule.json";
import { SEASON_YEAR, normalizeNflTeam } from "./constants";
import { analyzeEspnMatchup, loadEspnLeague } from "./espn.server";
import { applyLiveStatus, fetchLiveSnapshot, liveTeamsFromSchedule } from "./live.server";
import { identityKey } from "./names";
import { classifySlot, findGameForTeam, kickoffLabel } from "./schedule";
import {
  collectSleeperStarts,
  findSleeperIdByName,
  getNflState,
  getSleeperPlayers,
  getWeekPlayerPoints,
  getWeekPlayerProjections,
  sleeperPlayerInfo,
} from "./sleeper.server";
import type { PlayerPoints } from "./sleeper.server";
import type {
  AnalysisResult,
  BootstrapData,
  EspnTeam,
  FantasyTeamTag,
  MatchupScore,
  MatchupStatus,
  NflGame,
  Player,
  Platform,
} from "./types";

const schedule: NflGame[] = bundledSchedule as NflGame[];

export async function bootstrapFantasy(): Promise<BootstrapData> {
  const state = await getNflState();
  const week = state.week || 1;
  const snap = await fetchLiveSnapshot(week);
  const withStatus = applyLiveStatus(schedule, snap, week);
  const liveTeams = snap.liveTeams.length ? snap.liveTeams : liveTeamsFromSchedule(withStatus, week);
  return { state, schedule: withStatus, liveTeams, redZoneTeams: snap.redZoneTeams };
}

export async function espnTeams(input: {
  leagueId: string;
  espn_s2?: string;
  swid?: string;
}): Promise<{ teams: EspnTeam[]; year: number; fallback: boolean }> {
  return loadEspnLeague(input);
}

type StartAcc = {
  id: string;
  name: string;
  playerNameOnly: string;
  position: string;
  nflTeam: string;
  tags: FantasyTeamTag[];
  platform: Set<Platform>;
};

function emptyAcc(seed: Omit<StartAcc, "tags" | "platform">): StartAcc {
  return { ...seed, tags: [], platform: new Set() };
}

function tagKey(tag: FantasyTeamTag): string {
  return `${tag.matchupId}|${tag.side}|${tag.abbrev}`;
}

function mergeTags(into: FantasyTeamTag[], extra: FantasyTeamTag[]) {
  const seen = new Set(into.map(tagKey));
  for (const tag of extra) {
    const k = tagKey(tag);
    if (seen.has(k)) continue;
    seen.add(k);
    into.push(tag);
  }
}

function toPlayers(
  map: Map<string, StartAcc>,
  counts: Map<string, number>,
  week: number,
  points: Map<string, PlayerPoints>,
): Player[] {
  const list: Player[] = [];
  for (const [id, acc] of map) {
    const count = counts.get(id) || 0;
    const game = findGameForTeam(schedule, week, acc.nflTeam);
    const slot = game ? classifySlot(game) : acc.nflTeam && acc.nflTeam !== "FA" ? "Bye" : "Unknown";
    const platforms = [...acc.platform].filter((p) => p !== "both") as Platform[];
    const platform: Platform =
      platforms.includes("espn") && platforms.includes("sleeper") ? "both" : platforms[0] || "sleeper";
    const myCount = acc.tags.filter((t) => t.side === "mine").length;
    const oppCount = acc.tags.filter((t) => t.side === "theirs").length;
    const pts = points.get(id);
    list.push({
      id,
      name: acc.playerNameOnly,
      playerNameOnly: acc.playerNameOnly,
      position: acc.position,
      teamAbbr: acc.tags.map((t) => t.abbrev).filter(Boolean).join(","),
      nflTeam: acc.nflTeam,
      count: count > 1 ? count : 0,
      platform,
      myCount: myCount || undefined,
      oppCount: oppCount || undefined,
      kickoff: game ? kickoffLabel(game.start_time) : slot === "Bye" ? "Bye" : undefined,
      slot,
      tags: acc.tags,
      stdPts: pts?.std,
      pprPts: pts?.ppr,
      qb4ptPts: pts?.std,
      qb6ptPts: pts ? pts.std + 2 * pts.passTd : undefined,
    });
  }
  return list;
}

function mergeStart(map: Map<string, StartAcc>, start: StartAcc, counts: Map<string, number>) {
  const existing = map.get(start.id);
  counts.set(start.id, (counts.get(start.id) || 0) + 1);
  if (!existing) {
    map.set(start.id, start);
    return;
  }
  mergeTags(existing.tags, start.tags);
  for (const p of start.platform) existing.platform.add(p);
  if (existing.nflTeam === "FA" && start.nflTeam !== "FA") existing.nflTeam = start.nflTeam;
  if (existing.position === "UNKNOWN" && start.position !== "UNKNOWN") existing.position = start.position;
}

function accIdentity(acc: StartAcc): string {
  return identityKey(acc.name || acc.playerNameOnly, acc.position);
}

function mergeWithin(map: Map<string, StartAcc>, counts: Map<string, number>) {
  const byKey = new Map<string, string>();
  for (const [id, acc] of [...map.entries()]) {
    const key = accIdentity(acc);
    const canonical = byKey.get(key);
    if (!canonical) {
      byKey.set(key, id);
      continue;
    }
    if (canonical === id) continue;
    const target = map.get(canonical);
    if (!target) continue;
    mergeTags(target.tags, acc.tags);
    for (const p of acc.platform) target.platform.add(p);
    if (target.nflTeam === "FA" && acc.nflTeam !== "FA") target.nflTeam = acc.nflTeam;
    if (target.position === "UNKNOWN" && acc.position !== "UNKNOWN") target.position = acc.position;
    if (canonical.startsWith("espn-") && !id.startsWith("espn-")) {
      map.set(id, target);
      target.id = id;
      counts.set(id, (counts.get(id) || 0) + (counts.get(canonical) || 0));
      counts.delete(canonical);
      map.delete(canonical);
      byKey.set(key, id);
    } else {
      counts.set(canonical, (counts.get(canonical) || 0) + (counts.get(id) || 0));
      counts.delete(id);
      map.delete(id);
    }
  }
}

function alignMaps(
  myMap: Map<string, StartAcc>,
  oppMap: Map<string, StartAcc>,
  myCounts: Map<string, number>,
  oppCounts: Map<string, number>,
) {
  mergeWithin(myMap, myCounts);
  mergeWithin(oppMap, oppCounts);
  const myByKey = new Map<string, string>();
  for (const [id, acc] of myMap) myByKey.set(accIdentity(acc), id);
  for (const [id, acc] of [...oppMap.entries()]) {
    const key = accIdentity(acc);
    const mine = myByKey.get(key);
    if (!mine || mine === id) continue;
    const target = myMap.get(mine);
    if (!target) continue;
    if (oppMap.has(mine)) {
      const existing = oppMap.get(mine)!;
      mergeTags(existing.tags, acc.tags);
      for (const p of acc.platform) existing.platform.add(p);
      oppCounts.set(mine, (oppCounts.get(mine) || 0) + (oppCounts.get(id) || 0));
      oppCounts.delete(id);
      oppMap.delete(id);
    } else {
      acc.id = mine;
      oppMap.set(mine, acc);
      oppCounts.set(mine, oppCounts.get(id) || 0);
      oppCounts.delete(id);
      oppMap.delete(id);
    }
  }
}

function statusFromScores(my: number, opp: number | null): MatchupStatus {
  if (opp == null) return "pending";
  if (my === 0 && opp === 0) return "pending";
  if (my > opp) return "winning";
  if (my < opp) return "losing";
  return "tied";
}

export async function analyzeLineups(input: {
  platform: Platform;
  week: number;
  sleeperUsernames?: string;
  sleeperAccounts?: { username: string; leagueIds?: string[] | null }[];
  espn?: { leagueId: string; teamId?: string; espn_s2?: string; swid?: string }[];
}): Promise<AnalysisResult> {
  const state = await getNflState();
  const week = Math.max(1, Math.min(18, Number(input.week) || state.week || 1));
  const season = state.season || String(SEASON_YEAR);
  const warnings: string[] = [];
  let sleeperLeagues = 0;
  let espnUsed = false;
  let usedSeason: string | number = season;
  let fallback = false;

  const myMap = new Map<string, StartAcc>();
  const oppMap = new Map<string, StartAcc>();
  const myCounts = new Map<string, number>();
  const oppCounts = new Map<string, number>();
  const matchups: MatchupScore[] = [];
  const projections = await getWeekPlayerProjections(season, week);
  // Summed per matchup id as starters are attributed to my/opp side below,
  // then applied to each MatchupScore's team totals in a final pass.
  const projTotals = new Map<string, { my: number; opp: number }>();
  function addProjected(matchupId: string, side: "my" | "opp", playerId: string) {
    const p = projections.get(playerId);
    if (!p) return;
    const cur = projTotals.get(matchupId) || { my: 0, opp: 0 };
    cur[side] += p.ppr;
    projTotals.set(matchupId, cur);
  }

  const wantSleeper = input.platform === "sleeper" || input.platform === "both";
  const wantEspn = input.platform === "espn" || input.platform === "both";

  if (wantSleeper) {
    const accounts =
      input.sleeperAccounts && input.sleeperAccounts.length
        ? input.sleeperAccounts
        : (input.sleeperUsernames || "")
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
            .map((username) => ({ username, leagueIds: null as string[] | null }));
    if (!accounts.length) {
      if (input.platform === "sleeper") {
        throw new Error("Add at least one Sleeper username.");
      }
    } else {
      const dict = await getSleeperPlayers();
      const collected = await collectSleeperStarts(accounts, week, season);
      sleeperLeagues = collected.leaguesUsed;
      warnings.push(...collected.warnings);
      for (const row of collected.matchups) {
        matchups.push({
          ...row,
          platform: "sleeper",
          status: statusFromScores(row.myTeam.score, row.oppTeam?.score ?? null),
        });
      }
      for (const s of collected.myStarts) {
        const info = sleeperPlayerInfo(s.playerId, dict);
        addProjected(s.matchupId, "my", s.playerId);
        mergeStart(
          myMap,
          {
            ...emptyAcc({
              id: s.playerId,
              name: info.full,
              playerNameOnly: info.short,
              position: info.position,
              nflTeam: info.nflTeam,
            }),
            tags: [
              {
                abbrev: s.fantasyAbbrev,
                name: s.fantasyName,
                side: "mine",
                platform: "sleeper",
                matchupId: s.matchupId,
              },
            ],
            platform: new Set(["sleeper"]),
          },
          myCounts,
        );
      }
      for (const s of collected.oppStarts) {
        const info = sleeperPlayerInfo(s.playerId, dict);
        addProjected(s.matchupId, "opp", s.playerId);
        mergeStart(
          oppMap,
          {
            ...emptyAcc({
              id: s.playerId,
              name: info.full,
              playerNameOnly: info.short,
              position: info.position,
              nflTeam: info.nflTeam,
            }),
            tags: [
              {
                abbrev: s.fantasyAbbrev,
                name: s.fantasyName,
                side: "theirs",
                platform: "sleeper",
                matchupId: s.matchupId,
              },
            ],
            platform: new Set(["sleeper"]),
          },
          oppCounts,
        );
      }
    }
  }

  if (wantEspn) {
    const leagues = input.espn || [];
    if (!leagues.length) {
      if (input.platform === "espn") throw new Error("Connect an ESPN league first.");
    } else {
      let dict: Record<string, any> | null = null;
      try {
        dict = await getSleeperPlayers();
      } catch {
        dict = null;
      }
      for (const league of leagues) {
        if (!league?.leagueId) continue;
        try {
          const espn = await analyzeEspnMatchup({
            leagueId: league.leagueId,
            teamId: league.teamId,
            week,
            espn_s2: league.espn_s2,
            swid: league.swid,
            year: Number(season),
          });
          espnUsed = true;
          usedSeason = espn.year;
          fallback = fallback || espn.fallback;
          if (espn.fallback) {
            warnings.push(`ESPN league ${league.leagueId} had no ${season} data yet — showing ${espn.year} instead.`);
          }
          // Scope the matchup id by league so two ESPN leagues never collide
          // on the same raw ESPN matchup number.
          const matchupId = `espn-${league.leagueId}-${espn.matchup.id}`;
          matchups.push({
            ...espn.matchup,
            id: matchupId,
            platform: "espn",
            status: statusFromScores(espn.matchup.myTeam.score, espn.matchup.oppTeam?.score ?? null),
          });
          const addEspn = (
            starters: typeof espn.user.starters,
            target: Map<string, StartAcc>,
            counts: Map<string, number>,
            side: "mine" | "theirs",
          ) => {
            for (const s of starters) {
              const sleeperId = dict ? findSleeperIdByName(s.name, s.position, dict) : null;
              const id = sleeperId || `espn-${league.leagueId}-${s.id}`;
              if (sleeperId) addProjected(matchupId, side === "mine" ? "my" : "opp", sleeperId);
              mergeStart(
                target,
                {
                  ...emptyAcc({
                    id,
                    name: s.name,
                    playerNameOnly: s.shortName,
                    position: s.position,
                    nflTeam: normalizeNflTeam(s.nflTeam),
                  }),
                  tags: [
                    {
                      abbrev: s.fantasyAbbrev,
                      name: s.fantasyTeamName,
                      side,
                      platform: "espn",
                      matchupId,
                    },
                  ],
                  platform: new Set(["espn"]),
                },
                counts,
              );
            }
          };
          addEspn(espn.user.starters, myMap, myCounts, "mine");
          if (espn.opponent) addEspn(espn.opponent.starters, oppMap, oppCounts, "theirs");
          else warnings.push(`No ESPN opponent found for league ${league.leagueId} this week (bye or unmatched).`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : `ESPN league ${league.leagueId} analysis failed.`;
          if (input.platform === "espn" && leagues.length === 1) throw err;
          warnings.push(msg);
        }
      }
    }
  }

  for (const m of matchups) {
    const t = projTotals.get(m.id);
    if (!t) continue;
    m.myTeam.projected = Math.round(t.my * 10) / 10;
    if (m.oppTeam) m.oppTeam.projected = Math.round(t.opp * 10) / 10;
  }

  alignMaps(myMap, oppMap, myCounts, oppCounts);

  const overlapIds = new Set([...myMap.keys()].filter((id) => oppMap.has(id)));
  const overlapMap = new Map<string, StartAcc>();
  const overlapCounts = new Map<string, number>();

  for (const id of overlapIds) {
    const mine = myMap.get(id)!;
    const theirs = oppMap.get(id)!;
    const merged: StartAcc = {
      ...emptyAcc({
        id,
        name: mine.name,
        playerNameOnly: mine.playerNameOnly,
        position: mine.position !== "UNKNOWN" ? mine.position : theirs.position,
        nflTeam: mine.nflTeam !== "FA" ? mine.nflTeam : theirs.nflTeam,
      }),
      tags: [],
      platform: new Set([...mine.platform, ...theirs.platform]),
    };
    mergeTags(merged.tags, mine.tags);
    mergeTags(merged.tags, theirs.tags);
    overlapMap.set(id, merged);
    overlapCounts.set(id, (myCounts.get(id) || 0) + (oppCounts.get(id) || 0));
    myMap.delete(id);
    oppMap.delete(id);
  }

  if (!myMap.size && !oppMap.size && !overlapMap.size) {
    throw new Error(
      sleeperLeagues === 0 && !espnUsed
        ? "No lineups found. Check the username / league ID, or wait until lineups lock for this week."
        : "No starters found for this week. Managers may not have set lineups yet.",
    );
  }

  const snap = await fetchLiveSnapshot(week);
  const withStatus = applyLiveStatus(schedule, snap, week);
  const liveTeams = snap.liveTeams.length ? snap.liveTeams : liveTeamsFromSchedule(withStatus, week);
  const points = await getWeekPlayerPoints(season, week);

  return {
    my: toPlayers(myMap, myCounts, week, points),
    opponent: toPlayers(oppMap, oppCounts, week, points),
    overlap: toPlayers(overlapMap, overlapCounts, week, points),
    matchups,
    meta: {
      week,
      season,
      usedSeason,
      fallback,
      sleeperLeagues,
      espnUsed,
      warnings,
      liveTeams,
      redZoneTeams: snap.redZoneTeams,
    },
  };
}
