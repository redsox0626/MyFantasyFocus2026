import { Badge } from "@/components/ui/badge";
import { tagForm } from "@/lib/fantasy/status";
import type { MatchupScore, Player } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

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
}: {
  player: Player;
  overlap?: boolean;
  matchups: MatchupScore[];
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
          </div>
          <p className="mt-0.5 truncate text-xs text-muted tabular-nums">
            {player.nflTeam}
            {player.kickoff ? ` · ${player.kickoff}` : ""}
          </p>
        </div>
        {player.stdPts != null || player.pprPts != null ? (
          <p className="shrink-0 pt-0.5 text-xs font-medium text-fg tabular-nums">
            {(player.stdPts ?? 0).toFixed(1)}/{(player.pprPts ?? 0).toFixed(1)}
          </p>
        ) : null}
      </div>
      {tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => {
            const status = matchups.length ? tagForm(tag, matchups) : undefined;
            return (
              <span
                key={`${tag.matchupId}-${tag.side}-${tag.abbrev}`}
                title={tag.name}
                className={cn(
                  "rounded-md px-1.5 py-0.5 font-mono text-[10px] tracking-wide",
                  overlap && tag.side === "mine" && "bg-mine text-mine-fg",
                  overlap && tag.side === "theirs" && "bg-theirs text-theirs-fg",
                  (!overlap || (tag.side !== "mine" && tag.side !== "theirs")) && "bg-subtle text-muted",
                  status === "winning" && "shadow-win",
                  status === "losing" && "shadow-lose",
                )}
              >
                {tag.abbrev}
              </span>
            );
          })}
        </div>
      ) : null}
    </article>
  );
}
