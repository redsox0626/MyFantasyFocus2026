import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { groupByPosition } from "@/components/app/lineup-board";
import { PlayerCard } from "@/components/app/player-card";
import { normalizeNflTeam } from "@/lib/fantasy/constants";
import type { MatchupScore, Player } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

// Slowly auto-scrolls a column that's too tall to fit, pausing at each end
// so a viewer on a couch has time to read before it reverses direction.
// Reads scrollHeight/clientHeight live each frame, so it needs no knowledge
// of how long the list is or how it changes as data refreshes.
function useAutoScroll(ref: React.RefObject<HTMLDivElement>, speedPxPerSec = 26) {
  useEffect(() => {
    let raf = 0;
    let direction: 1 | -1 = 1;
    let lastTime = 0;
    let pauseUntil = 0;

    function tick(now: number) {
      const el = ref.current;
      if (!lastTime) lastTime = now;
      if (!el) {
        lastTime = now;
        raf = requestAnimationFrame(tick);
        return;
      }
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 4 || now < pauseUntil) {
        lastTime = now;
        raf = requestAnimationFrame(tick);
        return;
      }
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      el.scrollTop += direction * speedPxPerSec * dt;
      if (el.scrollTop >= maxScroll - 1) {
        el.scrollTop = maxScroll;
        direction = -1;
        pauseUntil = now + 2600;
      } else if (el.scrollTop <= 1) {
        el.scrollTop = 0;
        direction = 1;
        pauseUntil = now + 2600;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref, speedPxPerSec]);
}

function CastColumn({
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
  const scrollRef = useRef<HTMLDivElement>(null);
  useAutoScroll(scrollRef);
  const groups = groupByPosition(players);

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl bg-elevated p-3 shadow-border">
      <header
        className={cn(
          "flex shrink-0 items-center justify-between rounded-xl px-4 py-3",
          tone === "mine" && "bg-mine text-mine-fg",
          tone === "theirs" && "bg-theirs text-theirs-fg",
          tone === "shared" && "bg-shared text-shared-fg",
        )}
      >
        <div>
          <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight">{title}</h2>
          <p className="text-sm opacity-80">{hint}</p>
        </div>
        <span className="tabular-nums text-lg font-medium">{players.length}</span>
      </header>
      <div
        ref={scrollRef}
        className="mt-3 min-h-0 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex flex-col gap-4 pb-2">
          {players.length === 0 ? (
            <p className="px-2 py-8 text-center text-base text-muted">No starters in this slot.</p>
          ) : (
            groups.map((group) => (
              <div key={group.pos} className="space-y-2">
                <h3 className="px-1 text-sm font-medium uppercase tracking-[0.14em] text-muted">
                  {group.pos} <span className="tabular-nums">({group.players.length})</span>
                </h3>
                <div className="space-y-2">
                  {group.players.map((player) => (
                    <PlayerCard
                      key={`${player.id}-${player.platform}-${player.teamAbbr}`}
                      player={player}
                      overlap={overlap}
                      matchups={matchups}
                      redZone={redZoneTeams.has(normalizeNflTeam(player.nflTeam))}
                      large
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export function CastBoard({
  my,
  overlap,
  opponent,
  matchups,
  redZoneTeams,
  onExit,
}: {
  my: Player[];
  overlap: Player[];
  opponent: Player[];
  matchups: MatchupScore[];
  redZoneTeams: Set<string>;
  onExit: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onExit();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black p-4">
      <button
        type="button"
        onClick={onExit}
        className="absolute right-4 top-4 z-10 flex h-11 items-center gap-2 rounded-full bg-elevated px-4 text-sm font-medium text-fg shadow-border"
      >
        <X className="size-4" />
        Exit cast mode
      </button>
      <div className="flex min-h-0 flex-1 gap-4 pt-2">
        <CastColumn
          title="My guys"
          hint="You start them"
          players={my}
          tone="mine"
          matchups={matchups}
          redZoneTeams={redZoneTeams}
        />
        <CastColumn
          title="Both"
          hint="Started on both sides"
          players={overlap}
          tone="shared"
          overlap
          matchups={matchups}
          redZoneTeams={redZoneTeams}
        />
        <CastColumn
          title="Their guys"
          hint="Opponent starts them"
          players={opponent}
          tone="theirs"
          matchups={matchups}
          redZoneTeams={redZoneTeams}
        />
      </div>
    </div>
  );
}
