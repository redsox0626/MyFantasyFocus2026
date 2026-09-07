import { normalizeNflTeam } from "./constants";
import type { NflGame, TimeSlot } from "./types";

const ET = "America/New_York";

export function gameDateInEt(iso: string): Date {
  const utc = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(utc);
  const grab = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  return new Date(
    Number(grab("year")),
    Number(grab("month")) - 1,
    Number(grab("day")),
    Number(grab("hour")),
    Number(grab("minute")),
  );
}

export function classifySlot(game: NflGame): TimeSlot {
  const country = (game.country || "USA").toUpperCase();
  const international = country !== "USA" && country !== "UNITED STATES" && country !== "";
  if (international) return "International";

  const d = gameDateInEt(game.start_time);
  const day = d.getDay();
  const hour = d.getHours() + d.getMinutes() / 60;

  if (day === 3) return "Wednesday";
  if (day === 4) return "Thursday";
  if (day === 5 || day === 6) return "International";
  if (day === 0) {
    if (hour < 15) return "Sunday Early";
    if (hour < 19) return "Sunday Late";
    return "Sunday Night";
  }
  if (day === 1) return "Monday Night";
  if (day === 2) return "Wednesday";
  return "International";
}

export function kickoffLabel(iso: string): string {
  const utc = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(utc);
}

export function findGameForTeam(schedule: NflGame[], week: number, nflTeam: string): NflGame | undefined {
  const team = normalizeNflTeam(nflTeam);
  return schedule.find(
    (g) =>
      g.week === week &&
      (normalizeNflTeam(g.home_team) === team || normalizeNflTeam(g.away_team) === team),
  );
}

export function opponentOf(game: NflGame, nflTeam: string): string {
  const team = normalizeNflTeam(nflTeam);
  return normalizeNflTeam(game.home_team) === team ? game.away_team : game.home_team;
}

export function teamsInSlot(schedule: NflGame[], week: number, slot: TimeSlot): Set<string> {
  const teams = new Set<string>();
  if (slot === "All") return teams;
  for (const game of schedule) {
    if (game.week !== week) continue;
    if (classifySlot(game) !== slot) continue;
    teams.add(normalizeNflTeam(game.home_team));
    teams.add(normalizeNflTeam(game.away_team));
  }
  return teams;
}
