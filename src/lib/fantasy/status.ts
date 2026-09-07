import type { FantasyTeamTag, MatchupScore, MatchupStatus } from "./types";

export function tagForm(tag: FantasyTeamTag, matchups: MatchupScore[]): MatchupStatus {
  const matchup = matchups.find((m) => m.id === tag.matchupId);
  if (!matchup || matchup.status === "pending" || matchup.status === "tied") return matchup?.status ?? "pending";
  if (tag.side === "mine") return matchup.status;
  return matchup.status === "winning" ? "losing" : "winning";
}

export function cardForm(
  tags: FantasyTeamTag[] | undefined,
  matchups: MatchupScore[],
): "winning" | "losing" | "mixed" | undefined {
  if (!tags?.length) return undefined;
  const forms = tags.map((t) => tagForm(t, matchups)).filter((s): s is "winning" | "losing" => s === "winning" || s === "losing");
  if (!forms.length) return undefined;
  if (forms.every((s) => s === "winning")) return "winning";
  if (forms.every((s) => s === "losing")) return "losing";
  return "mixed";
}

export function formatScore(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return n.toFixed(n % 1 === 0 ? 0 : 1);
}
