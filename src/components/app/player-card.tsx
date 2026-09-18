import { Siren } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { tagForm } from "@/lib/fantasy/status";
import type { MatchupScore, Player } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

// Receptions don't factor into these positions' scoring, so a separate PPR
// figure is redundant — QBs rarely catch passes, and DEF/DL/LB/DB are
// scored on tackles/turnovers, not receptions.
const NO_PPR_POSITIONS = new Set(["QB", "DEF", "DL", "LB", "DB"]);

function overlapTone(player: Player): "mine" | "theirs" | "shared" {
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
}: {
  player: Player;
  overlap?: boolean;
  matchups: MatchupScore[];
  redZone?: boolean;
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
        "rounded-lg bg-surface px-3 py-3 shadow-border",
        tone === "mine" && "bg-mine-wash",
        tone === "theirs" && "bg-theirs-wash",
        tone === "shared" && "bg-shared-wash",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-fg">{player.playerNameOnly}</p>
            {player.count > 1 ? (
              <Badge variant={tone ?? "muted"} className="shrink-0">
                ×{player.count}
              </Badge>
            ) : null}
            {redZone ? (
              <span
                title="In the red zone"
                className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-theirs px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-theirs-fg"
              >
                <Siren className="size-3 animate-pulse" />
                RZ
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted tabular-nums">
            {player.nflTeam}
            {player.kickoff ? ` · ${player.kickoff}` : ""}
          </p>
        </div>
        {player.position === "QB" ? (
          player.qb4ptPts != null || player.qb6ptPts != null ? (
            <div className="flex shrink-0 items-start gap-2.5">
              <div className="flex flex-col items-center leading-none">
                <span className="text-lg font-semibold text-fg tabular-nums">{(player.qb4ptPts ?? 0).toFixed(1)}</span>
                <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">4pt</span>
              </div>
              <div className="flex flex-col items-center leading-none">
                <span className="text-lg font-semibold text-fg tabular-nums">{(player.qb6ptPts ?? 0).toFixed(1)}</span>
                <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">6pt</span>
              </div>
            </div>
          ) : null
        ) : player.stdPts != null || player.pprPts != null ? (
          <div className="flex shrink-0 items-start gap-2.5">
            <div className="flex flex-col items-center leading-none">
              <span className="text-lg font-semibold text-fg tabular-nums">{(player.stdPts ?? 0).toFixed(1)}</span>
              <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">Std.</span>
            </div>
            {!NO_PPR_POSITIONS.has(player.position) ? (
              <div className="flex flex-col items-center leading-none">
                <span className="text-lg font-semibold text-fg tabular-nums">{(player.pprPts ?? 0).toFixed(1)}</span>
                <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">PPR</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => {
            const status = matchups.length && tag.side === "mine" ? tagForm(tag, matchups) : undefined;
            return (
              <span
                key={`${tag.matchupId}-${tag.side}-${tag.abbrev}`}
                title={tag.name}
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[11px] leading-snug",
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
