import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Trophy } from "lucide-react";
import { toast } from "sonner";
import { EspnDialog } from "@/components/app/espn-dialog";
import { LineupBoard } from "@/components/app/lineup-board";
import { TeamComposer, TeamSummary } from "@/components/app/team-composer";
import { ScoresBoard } from "@/components/app/scores-board";
import { TimeSlotBar } from "@/components/app/time-slot-bar";
import { SEASON_START_LABEL, SEASON_YEAR, TIME_SLOTS, isIdpPosition, normalizeNflTeam } from "@/lib/fantasy/constants";
import { DEMO_RESULT } from "@/lib/fantasy/demo";
import { getBootstrap, getEspnTeams, runAnalysis } from "@/lib/fantasy/functions";
import { classifySlot, findGameForTeam, kickoffLabel, teamsInSlot } from "@/lib/fantasy/schedule";
import {
  loadEspnCredentialsList,
  loadShowIdp,
  loadSleeperAccounts,
  saveEspnCredentialsList,
  savePlatform,
  saveShowIdp,
  saveSleeperAccounts,
} from "@/lib/fantasy/storage";
import type {
  AnalysisResult,
  BootstrapData,
  EspnConnection,
  EspnCredentials,
  EspnTeam,
  Platform,
  Player,
  SleeperAccount,
  TimeFilter,
  TimeSlot,
} from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

function annotatePlayers(players: Player[], bootstrap: BootstrapData | null, week: number): Player[] {
  if (!bootstrap) return players;
  return players.map((player) => {
    const game = findGameForTeam(bootstrap.schedule, week, player.nflTeam);
    return {
      ...player,
      kickoff: game ? kickoffLabel(game.start_time) : player.nflTeam && player.nflTeam !== "FA" ? "Bye" : player.kickoff,
      slot: game ? classifySlot(game) : player.slot,
    };
  });
}

function applyPlayerFilters(
  players: Player[],
  opts: { filter: TimeFilter; teams: Set<string>; liveTeams: Set<string>; showIdp: boolean },
): Player[] {
  let list = players;
  if (!opts.showIdp) list = list.filter((p) => !isIdpPosition(p.position));
  if (opts.filter === "All") return list;
  if (opts.filter === "Live") return list.filter((p) => opts.liveTeams.has(normalizeNflTeam(p.nflTeam)));
  return list.filter((p) => opts.teams.has(normalizeNflTeam(p.nflTeam)));
}

function slotCounts(result: AnalysisResult, bootstrap: BootstrapData | null, week: number, showIdp: boolean) {
  const all = [...result.my, ...result.overlap, ...result.opponent].filter(
    (p) => showIdp || !isIdpPosition(p.position),
  );
  const counts: Partial<Record<TimeSlot, number>> = { All: all.length };
  if (!bootstrap) return counts;
  for (const slot of TIME_SLOTS) {
    if (slot === "All") continue;
    const teams = teamsInSlot(bootstrap.schedule, week, slot);
    counts[slot] = all.filter((p) => teams.has(normalizeNflTeam(p.nflTeam))).length;
  }
  return counts;
}

function espnPayload(connections: EspnConnection[]) {
  return connections.map(({ creds }) => ({
    leagueId: creds.leagueId,
    teamId: creds.teamId,
    espn_s2: creds.espn_s2 || undefined,
    swid: creds.swid || undefined,
  }));
}

function derivePlatform(accounts: SleeperAccount[], hasEspn: boolean): Platform {
  const sleeper = accounts.some((a) => !a.missing);
  if (sleeper && hasEspn) return "both";
  if (hasEspn && !sleeper) return "espn";
  return "sleeper";
}

export function HomeScreen() {
  const [bootstrap, setBootstrap] = useState<BootstrapData | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<SleeperAccount[]>([]);
  const [week, setWeek] = useState(1);
  const [espnConnections, setEspnConnections] = useState<EspnConnection[]>([]);
  const [espnOpen, setEspnOpen] = useState(false);
  const [editingEspnLeagueId, setEditingEspnLeagueId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [filter, setFilter] = useState<TimeFilter>("All");
  const [collapsed, setCollapsed] = useState(false);
  const [showIdp, setShowIdp] = useState(true);
  const [view, setView] = useState<"lineups" | "scores">("lineups");

  useEffect(() => {
    setAccounts(loadSleeperAccounts());
    setShowIdp(loadShowIdp());
    const stored = loadEspnCredentialsList();
    if (stored.length) {
      setEspnConnections(stored.map((creds) => ({ creds, teams: [] })));
      Promise.all(
        stored.map((creds) =>
          getEspnTeams({
            data: {
              leagueId: creds.leagueId,
              espn_s2: creds.espn_s2 || undefined,
              swid: creds.swid || undefined,
            },
          })
            .then((r) => ({ leagueId: creds.leagueId, teams: r.teams }))
            .catch(() => ({ leagueId: creds.leagueId, teams: [] as EspnTeam[] })),
        ),
      ).then((results) => {
        setEspnConnections((cur) =>
          cur.map((conn) => {
            const match = results.find((r) => r.leagueId === conn.creds.leagueId);
            return match ? { ...conn, teams: match.teams } : conn;
          }),
        );
      });
    }
    getBootstrap()
      .then((data) => {
        setBootstrap(data);
        setWeek(data.state.week || 1);
      })
      .catch((err) => {
        setBootError(err instanceof Error ? err.message : "Could not load NFL week.");
      });
  }, []);

  const season = bootstrap?.state.season || String(SEASON_YEAR);
  const platform = derivePlatform(accounts, espnConnections.length > 0);
  const liveTeams = useMemo(() => {
    const fromResult = result?.meta.liveTeams || [];
    const fromBoot = bootstrap?.liveTeams || [];
    return new Set((fromResult.length ? fromResult : fromBoot).map(normalizeNflTeam));
  }, [result, bootstrap]);
  const redZoneTeams = useMemo(() => {
    const fromResult = result?.meta.redZoneTeams || [];
    const fromBoot = bootstrap?.redZoneTeams || [];
    return new Set((fromResult.length ? fromResult : fromBoot).map(normalizeNflTeam));
  }, [result, bootstrap]);

  const filtered = useMemo(() => {
    if (!result) return null;
    const teams =
      filter !== "All" && filter !== "Live"
        ? teamsInSlot(bootstrap?.schedule || [], result.meta.week, filter)
        : new Set<string>();
    const opts = { filter, teams, liveTeams, showIdp };
    return {
      my: applyPlayerFilters(result.my, opts),
      overlap: applyPlayerFilters(result.overlap, opts),
      opponent: applyPlayerFilters(result.opponent, opts),
    };
  }, [result, filter, bootstrap, liveTeams, showIdp]);

  const counts = result ? slotCounts(result, bootstrap, result.meta.week, showIdp) : undefined;
  const livePlayerCount = result
    ? [...result.my, ...result.overlap, ...result.opponent].filter(
        (p) => (showIdp || !isIdpPosition(p.position)) && liveTeams.has(normalizeNflTeam(p.nflTeam)),
      ).length
    : 0;

  function persistAccounts(next: SleeperAccount[]) {
    setAccounts(next);
    saveSleeperAccounts(next);
  }

  function persistIdp(next: boolean) {
    setShowIdp(next);
    saveShowIdp(next);
  }

  async function refreshSilently() {
    const sleeperOn = accounts.some((a) => !a.missing);
    if (!sleeperOn && !espnConnections.length) return;
    try {
      const data = await runAnalysis({
        data: {
          platform,
          week,
          sleeperAccounts: accounts
            .filter((a) => !a.missing)
            .map((a) => ({
              username: a.username,
              leagueIds: a.leagueIds ?? null,
            })),
          espn: espnConnections.length ? espnPayload(espnConnections) : undefined,
        },
      });
      setResult(data);
    } catch {
      // Silent — a background refresh hiccup shouldn't interrupt the user
      // with a toast every 30s. The next tick tries again.
    }
  }

  // Auto-refresh scores/points while the tab stays open, so live games
  // update without needing a manual reload. Only runs once an initial
  // analysis has been loaded, and skips ticks while the tab isn't visible
  // to avoid pointless calls while backgrounded.
  useEffect(() => {
    if (!result) return;
    const REFRESH_MS = 30_000;
    const id = setInterval(() => {
      if (document.hidden) return;
      refreshSilently();
    }, REFRESH_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(result), accounts, espnConnections, week, platform]);

  async function handleAnalyze() {
    const sleeperOn = accounts.some((a) => !a.missing);
    if (!sleeperOn && !espnConnections.length) {
      toast.error("Add a Sleeper username or an ESPN league.");
      return;
    }
    setLoading(true);
    try {
      saveSleeperAccounts(accounts);
      savePlatform(platform);
      const data = await runAnalysis({
        data: {
          platform,
          week,
          sleeperAccounts: accounts
            .filter((a) => !a.missing)
            .map((a) => ({
              username: a.username,
              leagueIds: a.leagueIds ?? null,
            })),
          espn: espnConnections.length ? espnPayload(espnConnections) : undefined,
        },
      });
      setResult(data);
      setCollapsed(true);
      setView("lineups");
      for (const warning of data.meta.warnings) toast.message(warning);
      toast.success(
        `Week ${data.meta.week} · ${data.my.length} yours, ${data.overlap.length} shared, ${data.opponent.length} theirs`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  function loadDemo() {
    const w = week;
    const demo: AnalysisResult = {
      my: annotatePlayers(DEMO_RESULT.my, bootstrap, w),
      opponent: annotatePlayers(DEMO_RESULT.opponent, bootstrap, w),
      overlap: annotatePlayers(DEMO_RESULT.overlap, bootstrap, w),
      matchups: DEMO_RESULT.matchups,
      meta: { ...DEMO_RESULT.meta, week: w, season },
    };
    setResult(demo);
    setCollapsed(true);
    setFilter("All");
    setView("lineups");
    toast.message("Sample Week 1 slate — connect a real league to replace it.");
  }

  function handleEspnConnected(creds: EspnCredentials, teams: EspnTeam[]) {
    setEspnConnections((cur) => {
      const next = editingEspnLeagueId
        ? cur.map((c) => (c.creds.leagueId === editingEspnLeagueId ? { creds, teams } : c))
        : cur.some((c) => c.creds.leagueId === creds.leagueId)
          ? cur.map((c) => (c.creds.leagueId === creds.leagueId ? { creds, teams } : c))
          : [...cur, { creds, teams }];
      saveEspnCredentialsList(next.map((c) => c.creds));
      return next;
    });
    setEditingEspnLeagueId(null);
    toast.success(`Connected ESPN league ${creds.leagueId}`);
  }

  function disconnectEspn(leagueId: string) {
    setEspnConnections((cur) => {
      const next = cur.filter((c) => c.creds.leagueId !== leagueId);
      saveEspnCredentialsList(next.map((c) => c.creds));
      return next;
    });
  }

  const showComposer = !collapsed || !result;
  const showNav = Boolean(result) && collapsed;

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pt-4 sm:px-6 sm:pb-16 sm:pt-6",
        showNav ? "pb-28" : "pb-8",
      )}
    >
      <header className="sticky top-0 z-20 -mx-4 mb-4 bg-bg/90 px-4 py-3 backdrop-blur-sm sm:static sm:mx-0 sm:mb-8 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">NFL {season}</p>
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl">
              My Fantasy Focus
            </h1>
          </div>
          <label className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-surface px-3 text-base shadow-border">
            <span className="text-xs uppercase tracking-wide text-muted">Wk</span>
            <select
              className="bg-transparent text-fg tabular-nums focus:outline-none"
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              aria-label="NFL week"
            >
              {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n} className="bg-elevated text-fg">
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 hidden max-w-2xl text-sm text-muted text-pretty sm:block">
          Stack every Sleeper and ESPN lineup, then see who you and your opponent both started. Season opens{" "}
          {SEASON_START_LABEL}.
        </p>
      </header>

      {bootError ? <p className="mb-4 text-sm text-theirs">{bootError}</p> : null}

      {result && collapsed ? (
        <TeamSummary
          accounts={accounts}
          espnConnections={espnConnections}
          espnLabel="Tap to edit accounts"
          onClick={() => setCollapsed(false)}
        />
      ) : null}

      {showComposer ? (
        <TeamComposer
          season={season}
          accounts={accounts}
          onAccountsChange={persistAccounts}
          espnConnections={espnConnections}
          onEspnOpen={() => {
            setEditingEspnLeagueId(null);
            setEspnOpen(true);
          }}
          onEspnEdit={(leagueId) => {
            setEditingEspnLeagueId(leagueId);
            setEspnOpen(true);
          }}
          onEspnTeamChange={(leagueId, teamId) => {
            setEspnConnections((cur) => {
              const next = cur.map((c) => (c.creds.leagueId === leagueId ? { ...c, creds: { ...c.creds, teamId } } : c));
              saveEspnCredentialsList(next.map((c) => c.creds));
              return next;
            });
          }}
          onEspnDisconnect={disconnectEspn}
          showIdp={showIdp}
          onShowIdp={persistIdp}
          loading={loading}
          onAnalyze={handleAnalyze}
          onDemo={loadDemo}
          hasResult={Boolean(result)}
          onHide={result ? () => setCollapsed(true) : undefined}
        />
      ) : null}

      {result ? (
        <div className="space-y-4">
          <div className="hidden grid-cols-2 gap-1 rounded-xl bg-elevated p-1 shadow-border sm:grid">
            <ViewTab active={view === "lineups"} onClick={() => setView("lineups")} icon="lineups" label="Lineups" />
            <ViewTab active={view === "scores"} onClick={() => setView("scores")} icon="scores" label="Scores" />
          </div>

          {view === "lineups" ? (
            <>
              <TimeSlotBar value={filter} onChange={setFilter} counts={counts} liveCount={livePlayerCount} />
              {result.meta.warnings.length > 0 && collapsed ? (
                <p className="text-xs text-muted text-pretty">{result.meta.warnings[0]}</p>
              ) : null}
              {filtered ? (
                <LineupBoard
                  my={filtered.my}
                  overlap={filtered.overlap}
                  opponent={filtered.opponent}
                  matchups={result.matchups}
                  redZoneTeams={redZoneTeams}
                />
              ) : null}
              <p className="px-1 text-center text-xs text-muted">
                Green outline = that fantasy team is winning. Red = losing. In Both, green chips are yours and red chips
                are the opponent.
              </p>
            </>
          ) : (
            <ScoresBoard matchups={result.matchups} />
          )}
        </div>
      ) : (
        <EmptyState onDemo={loadDemo} />
      )}

      {showNav ? (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] sm:hidden">
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={() => setView("lineups")}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                view === "lineups" ? "text-fg" : "text-muted",
              )}
            >
              <LayoutGrid className="size-5" />
              Lineups
            </button>
            <button
              type="button"
              onClick={() => setView("scores")}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                view === "scores" ? "text-fg" : "text-muted",
              )}
            >
              <Trophy className="size-5" />
              Scores
            </button>
          </div>
        </nav>
      ) : null}

      <EspnDialog
        open={espnOpen}
        onOpenChange={(open) => {
          setEspnOpen(open);
          if (!open) setEditingEspnLeagueId(null);
        }}
        onConnected={handleEspnConnected}
        initial={espnConnections.find((c) => c.creds.leagueId === editingEspnLeagueId)?.creds || null}
      />
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: "lineups" | "scores";
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-medium",
        active ? "bg-surface text-fg" : "text-muted hover:text-fg",
      )}
    >
      {icon === "lineups" ? <LayoutGrid className="size-4" /> : <Trophy className="size-4" />}
      {label}
    </button>
  );
}

function EmptyState({ onDemo }: { onDemo: () => void }) {
  return (
    <section className="space-y-3">
      <p className="text-sm text-muted sm:hidden">
        Add a username, pick the leagues you care about, then analyze this week’s slate.
      </p>
      <div className="hidden gap-3 sm:grid sm:grid-cols-3">
        {[
          {
            title: "Pull every league",
            body: "Drop in Sleeper usernames and we walk each 2026 roster versus this week’s opponent.",
          },
          {
            title: "Spot the overlap",
            body: "Players you both started land in Both — color-coded by who started them more often.",
          },
          {
            title: "Live windows",
            body: "Jump to games on now, or open other kickoff windows. Watch scores while you wait.",
          },
        ].map((card) => (
          <article key={card.title} className="rounded-2xl bg-elevated p-5 shadow-border">
            <h2 className="font-display text-xl font-semibold tracking-tight text-fg">{card.title}</h2>
            <p className="mt-2 text-sm text-muted text-pretty">{card.body}</p>
          </article>
        ))}
      </div>
      <ButtonGhost onDemo={onDemo} />
    </section>
  );
}

function ButtonGhost({ onDemo }: { onDemo: () => void }) {
  return (
    <button
      type="button"
      onClick={onDemo}
      className="hidden h-11 rounded-lg px-4 text-sm text-muted hover:bg-subtle hover:text-fg sm:inline-flex sm:items-center"
    >
      Preview a sample Week 1 slate
    </button>
  );
}
