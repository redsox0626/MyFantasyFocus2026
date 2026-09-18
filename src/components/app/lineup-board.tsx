import { useState } from "react";
import { PlayerCard } from "@/components/app/player-card";
import { normalizeNflTeam, POSITION_LABEL, POSITION_ORDER } from "@/lib/fantasy/constants";
import type { MatchupScore, Player } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

function groupByPosition(players: Player[]) {
  const known = new Set<string>(POSITION_ORDER);
  const groups = POSITION_ORDER.map((pos) => ({
    pos,
    players: players.filter((p) => p.position === pos),
  })).filter((g) => g.players.length > 0);
  const extra = players.filter((p) => !known.has(p.position));
  if (extra.length) groups.push({ pos: "IDP" as (typeof POSITION_ORDER)[number], players: extra });
  return groups;
}

function Column({
  title,
  hint,
  players,
  tone,
  overlap,
  matchups,
  redZoneTeams,
}: {
  title: string;
  hint: string;
  players: Player[];
  tone: "mine" | "shared" | "theirs";
  overlap?: boolean;
  matchups: MatchupScore[];
  redZoneTeams: Set<string>;
}) {
  const groups = groupByPosition(players);
  return (
    <section className="flex min-w-0 flex-1 flex-col rounded-2xl bg-elevated p-3 shadow-border">
      <header
        className={cn(
          "flex items-center justify-between rounded-xl px-3 py-2.5",
          tone === "mine" && "bg-mine text-mine-fg",
          tone === "theirs" && "bg-theirs text-theirs-fg",
          tone === "shared" && "bg-shared text-shared-fg",
        )}
      >
        <div>
          <h2 className="font-display text-lg font-semibold leading-tight tracking-tight">{title}</h2>
          <p className="text-[11px] opacity-80">{hint}</p>
        </div>
        <span className="tabular-nums text-sm font-medium">{players.length}</span>
      </header>
      <div className="mt-3 flex flex-1 flex-col gap-4">
        {players.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-muted">No starters in this slot.</p>
        ) : (
          groups.map((group) => (
            <div key={group.pos} className="space-y-2">
              <h3 className="px-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                {POSITION_LABEL[group.pos] ?? group.pos}{" "}
                <span className="tabular-nums">({group.players.length})</span>
              </h3>
              <div className="space-y-2">
                {group.players.map((player) => (
                  <PlayerCard
                    key={`${player.id}-${player.platform}-${player.teamAbbr}`}
                    player={player}
                    overlap={overlap}
                    matchups={matchups}
                    redZone={redZoneTeams.has(normalizeNflTeam(player.nflTeam))}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

type ColId = "my" | "overlap" | "opponent";

export function LineupBoard({
  my,
  overlap,
  opponent,
  matchups,
  redZoneTeams,
}: {
  my: Player[];
  overlap: Player[];
  opponent: Player[];
  matchups: MatchupScore[];
  redZoneTeams: Set<string>;
}) {
  const [col, setCol] = useState<ColId>("my");
  const tabs: { id: ColId; label: string; count: number }[] = [
    { id: "my", label: "My guys", count: my.length },
    { id: "overlap", label: "Both", count: overlap.length },
    { id: "opponent", label: "Theirs", count: opponent.length },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-elevated p-1 shadow-border lg:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCol(tab.id)}
            className={cn(
              "flex h-12 flex-col items-center justify-center rounded-lg text-xs font-medium",
              col === tab.id ? "bg-surface text-fg" : "text-muted",
            )}
          >
            {tab.label}
            <span className="tabular-nums text-[10px] opacity-70">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className={cn(col !== "my" && "hidden lg:block")}>
          <Column title="My guys" hint="You start them" players={my} tone="mine" matchups={matchups} redZoneTeams={redZoneTeams} />
        </div>
        <div className={cn(col !== "overlap" && "hidden lg:block")}>
          <Column
            title="Both"
            hint="Started on both sides"
            players={overlap}
            tone="shared"
            overlap
            matchups={matchups}
            redZoneTeams={redZoneTeams}
          />
        </div>
        <div className={cn(col !== "opponent" && "hidden lg:block")}>
          <Column
            title="Their guys"
            hint="Opponent starts them"
            players={opponent}
            tone="theirs"
            matchups={matchups}
            redZoneTeams={redZoneTeams}
          />
        </div>
      </div>
    </div>
  );
}
