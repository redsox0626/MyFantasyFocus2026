import { Siren } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { tagForm } from "@/lib/fantasy/status";
import type { MatchupScore, Player } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

// Receptions don't factor into these positions' scoring, so a separate PPR
// figure is redundant — QBs rarely catch passes, and DEF/DL/LB/DB are
// scored on tackles/turnovers, not receptions.
export const NO_PPR_POSITIONS = new Set(["QB", "DEF", "DL", "LB", "DB"]);

export function overlapTone(player: Player): "mine" | "theirs" | "shared" {
  const my = player.myCount || 0;
  const opp = player.oppCount || 0;
  if (my > opp) return "mine";
  if (opp > my) return "theirs";
  return "shared";
}

export function PlayerCard({
  player,
  overlap,
  matchups,
  redZone,
  large,
}: {
  player: Player;
  overlap?: boolean;
  matchups: MatchupScore[];
  redZone?: boolean;
  large?: boolean;
}) {
  const tone = overlap ? overlapTone(player) : undefined;
  const tags = player.tags?.length
    ? player.tags
    : (player.teamAbbr || "")
        .split(",")
        .filter(Boolean)
        .map((abbrev) => ({
          abbrev,
          name: abbrev,
          side: "mine" as const,
          platform: "sleeper" as const,
          matchupId: "",
        }));
  return (
    <article
      className={cn(
        "bg-surface shadow-border",
        large ? "rounded-xl px-5 py-4" : "rounded-lg px-3 py-3",
        tone === "mine" && "bg-mine-wash",
        tone === "theirs" && "bg-theirs-wash",
        tone === "shared" && "bg-shared-wash",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className={cn("flex items-center", large ? "gap-3" : "gap-2")}>
            <p className={cn("truncate font-medium text-fg", large ? "text-2xl" : "text-sm")}>
              {player.playerNameOnly}
            </p>
            {player.count > 1 ? (
              <Badge variant={tone ?? "muted"} className={cn("shrink-0", large && "px-2.5 py-1 text-sm")}>
                ×{player.count}
              </Badge>
            ) : null}
            {redZone ? (
              <span
                title="In the red zone"
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full bg-theirs font-semibold uppercase tracking-wide text-theirs-fg",
                  large ? "gap-1.5 px-3 py-1.5 text-sm" : "gap-0.5 px-1.5 py-0.5 text-[10px]",
                )}
              >
                <Siren className={large ? "size-5 animate-pulse" : "size-3 animate-pulse"} />
                RZ
              </span>
            ) : null}
          </div>
          <p className={cn("truncate text-muted tabular-nums", large ? "mt-1 text-base" : "mt-0.5 text-xs")}>
            {player.nflTeam}
            {player.kickoff ? ` · ${player.kickoff}` : ""}
          </p>
        </div>
        {player.position === "QB" ? (
          player.qb4ptPts != null || player.qb6ptPts != null ? (
            <div className={cn("flex shrink-0 items-start", large ? "gap-4" : "gap-2.5")}>
              <div className="flex flex-col items-center leading-none">
                <span className={cn("font-semibold text-fg tabular-nums", large ? "text-4xl" : "text-lg")}>
                  {(player.qb4ptPts ?? 0).toFixed(1)}
                </span>
                <span className={cn("uppercase tracking-wide text-muted", large ? "mt-1 text-sm" : "mt-0.5 text-[10px]")}>
                  4pt
                </span>
              </div>
              <div className="flex flex-col items-center leading-none">
                <span className={cn("font-semibold text-fg tabular-nums", large ? "text-4xl" : "text-lg")}>
                  {(player.qb6ptPts ?? 0).toFixed(1)}
                </span>
                <span className={cn("uppercase tracking-wide text-muted", large ? "mt-1 text-sm" : "mt-0.5 text-[10px]")}>
                  6pt
                </span>
              </div>
            </div>
          ) : null
        ) : player.stdPts != null || player.pprPts != null ? (
          <div className={cn("flex shrink-0 items-start", large ? "gap-4" : "gap-2.5")}>
            <div className="flex flex-col items-center leading-none">
              <span className={cn("font-semibold text-fg tabular-nums", large ? "text-4xl" : "text-lg")}>
                {(player.stdPts ?? 0).toFixed(1)}
              </span>
              <span className={cn("uppercase tracking-wide text-muted", large ? "mt-1 text-sm" : "mt-0.5 text-[10px]")}>
                Std.
              </span>
            </div>
            {!NO_PPR_POSITIONS.has(player.position) ? (
              <div className="flex flex-col items-center leading-none">
                <span className={cn("font-semibold text-fg tabular-nums", large ? "text-4xl" : "text-lg")}>
                  {(player.pprPts ?? 0).toFixed(1)}
                </span>
                <span className={cn("uppercase tracking-wide text-muted", large ? "mt-1 text-sm" : "mt-0.5 text-[10px]")}>
                  PPR
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {tags.length > 0 ? (
        <div className={cn("flex flex-wrap", large ? "mt-3 gap-2" : "mt-2 gap-1")}>
          {tags.map((tag) => {
            const status = matchups.length && tag.side === "mine" ? tagForm(tag, matchups) : undefined;
            return (
              <span
                key={`${tag.matchupId}-${tag.side}-${tag.abbrev}`}
                title={tag.name}
                className={cn(
                  "rounded-md leading-snug",
                  large ? "px-3 py-1.5 text-base" : "px-1.5 py-0.5 text-[11px]",
                  overlap && tag.side === "mine" && "bg-mine text-mine-fg",
                  overlap && tag.side === "theirs" && "bg-theirs text-theirs-fg",
                  (!overlap || (tag.side !== "mine" && tag.side !== "theirs")) && "bg-subtle text-muted",
                  status === "winning" && "shadow-win",
                  status === "losing" && "shadow-lose",
                )}
              >
                {tag.name}
              </span>
            );
          })}
        </div>
      ) : null}
    </article>
  );
}
