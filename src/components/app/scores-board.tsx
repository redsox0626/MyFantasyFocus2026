import { Badge } from "@/components/ui/badge";
import { formatScore } from "@/lib/fantasy/status";
import type { MatchupScore } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

export function ScoresBoard({ matchups }: { matchups: MatchupScore[] }) {
  if (!matchups.length) {
    return (
      <section className="rounded-2xl bg-elevated px-4 py-10 text-center shadow-border">
        <p className="text-sm text-muted">No matchups yet. Analyze lineups to see live scores.</p>
      </section>
    );
  }

  return (
    <div className="space-y-3">
      {matchups.map((m) => {
        const opp = m.oppTeam;
        const mineLead = m.status === "winning";
        const theirsLead = m.status === "losing";
        const hasProjections = m.myTeam.projected != null && opp?.projected != null;
        const mineFavored = hasProjections && m.myTeam.projected! > opp!.projected!;
        const theirsFavored = hasProjections && opp!.projected! > m.myTeam.projected!;
        return (
          <article key={m.id} className="rounded-2xl bg-elevated p-3 shadow-border sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="truncate text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{m.leagueName}</p>
              <Badge variant="muted">{m.platform === "espn" ? "ESPN" : "Sleeper"}</Badge>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className={cn("min-w-0 rounded-xl px-3 py-2.5", mineLead ? "bg-mine text-mine-fg" : "bg-surface")}>
                <p className="truncate font-display text-base font-semibold tracking-tight">{m.myTeam.name}</p>
                <p className="font-mono text-[10px] tracking-wide opacity-70">{m.myTeam.abbrev}</p>
                <p className="mt-1 font-display text-2xl font-semibold tabular-nums leading-none">
                  {formatScore(m.myTeam.score)}
                </p>
                {m.myTeam.projected != null ? (
                  <p className="mt-1 text-[10px] tabular-nums opacity-70">Proj {formatScore(m.myTeam.projected)}</p>
                ) : null}
                {mineFavored ? (
                  <Badge variant={mineLead ? "default" : "mine"} className="mt-1">
                    Favored
                  </Badge>
                ) : null}
              </div>
              <span className="text-xs font-medium text-muted">vs</span>
              <div
                className={cn(
                  "min-w-0 rounded-xl px-3 py-2.5 text-right",
                  theirsLead ? "bg-theirs text-theirs-fg" : "bg-surface",
                )}
              >
                <p className="truncate font-display text-base font-semibold tracking-tight">{opp?.name ?? "Bye"}</p>
                <p className="font-mono text-[10px] tracking-wide opacity-70">{opp?.abbrev ?? "—"}</p>
                <p className="mt-1 font-display text-2xl font-semibold tabular-nums leading-none">
                  {opp ? formatScore(opp.score) : "—"}
                </p>
                {opp?.projected != null ? (
                  <p className="mt-1 text-[10px] tabular-nums opacity-70">Proj {formatScore(opp.projected)}</p>
                ) : null}
                {theirsFavored ? (
                  <Badge variant={theirsLead ? "default" : "theirs"} className="mt-1">
                    Favored
                  </Badge>
                ) : null}
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted">
              {m.status === "winning"
                ? "You’re ahead"
                : m.status === "losing"
                  ? "You’re behind"
                  : m.status === "tied"
                    ? "Tied"
                    : "Waiting on kickoff"}
            </p>
          </article>
        );
      })}
    </div>
  );
}
