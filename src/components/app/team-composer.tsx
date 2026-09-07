import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, LoaderCircle, Plus, X } from "lucide-react";
import { SleeperAvatar } from "@/components/app/sleeper-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { lookupSleeperUsers } from "@/lib/fantasy/functions";
import { parseSleeperHandles } from "@/lib/fantasy/parse";
import {
  loadSleeperRecents,
  pushSleeperRecents,
} from "@/lib/fantasy/storage";
import type { EspnCredentials, EspnTeam, SleeperAccount, SleeperRecent, SleeperUserLookup } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return v;
}

function selectedCount(account: SleeperAccount): number | null {
  if (!account.leagues) return null;
  if (account.leagueIds == null) return account.leagues.length;
  return account.leagues.filter((l) => account.leagueIds!.includes(l.id)).length;
}

function applyLookup(account: SleeperAccount, info: SleeperUserLookup): SleeperAccount {
  if (!info.found) return { ...account, missing: true, leagues: [] };
  return {
    ...account,
    username: info.username || account.username,
    userId: info.userId,
    displayName: info.displayName,
    avatar: info.avatar ?? null,
    leagues: info.leagues,
    missing: false,
  };
}

export function TeamComposer({
  season,
  accounts,
  onAccountsChange,
  espnCreds,
  espnTeams,
  onEspnOpen,
  onEspnTeamChange,
  onEspnDisconnect,
  showIdp,
  onShowIdp,
  loading,
  onAnalyze,
  onDemo,
  hasResult,
  onHide,
}: {
  season: string;
  accounts: SleeperAccount[];
  onAccountsChange: (next: SleeperAccount[]) => void;
  espnCreds: EspnCredentials | null;
  espnTeams: EspnTeam[];
  onEspnOpen: () => void;
  onEspnTeamChange: (teamId: string) => void;
  onEspnDisconnect: () => void;
  showIdp: boolean;
  onShowIdp: (next: boolean) => void;
  loading: boolean;
  onAnalyze: () => void;
  onDemo: () => void;
  hasResult: boolean;
  onHide?: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [hydrating, setHydrating] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<SleeperUserLookup | null>(null);
  const [previewStatus, setPreviewStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [recents, setRecents] = useState<SleeperRecent[]>([]);
  const cache = useRef(new Map<string, SleeperUserLookup>());
  const accountsRef = useRef(accounts);
  accountsRef.current = accounts;
  const debouncedDraft = useDebounced(draft, 380);

  const addedKeys = useMemo(
    () => new Set(accounts.map((a) => a.username.toLowerCase())),
    [accounts],
  );

  useEffect(() => {
    setRecents(loadSleeperRecents());
  }, []);

  useEffect(() => {
    const need = accounts.filter((a) => !a.leagues && !a.missing && !cache.current.has(a.username.toLowerCase()));
    if (!need.length) return;
    const keys = need.map((a) => a.username.toLowerCase());
    setHydrating((prev) => new Set([...prev, ...keys]));
    let cancelled = false;
    lookupSleeperUsers({ data: { usernames: need.map((a) => a.username), season } })
      .then((rows) => {
        if (cancelled) return;
        const byQuery = new Map<string, SleeperUserLookup>();
        for (const row of rows) {
          cache.current.set(row.query.toLowerCase(), row);
          cache.current.set(row.username.toLowerCase(), row);
          byQuery.set(row.query.toLowerCase(), row);
        }
        onAccountsChange(
          accountsRef.current.map((account) => {
            const info = byQuery.get(account.username.toLowerCase()) || cache.current.get(account.username.toLowerCase());
            return info ? applyLookup(account, info) : account;
          }),
        );
      })
      .catch(() => undefined)
      .finally(() => {
        if (cancelled) return;
        setHydrating((prev) => {
          const next = new Set(prev);
          for (const k of keys) next.delete(k);
          return next;
        });
      });
    return () => {
      cancelled = true;
    };
    // Only re-run when a username is added without league data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts.map((a) => a.username).join("|"), season]);

  useEffect(() => {
    const handles = parseSleeperHandles(debouncedDraft);
    const handle = handles.length === 1 ? handles[0] : "";
    if (!handle || handle.length < 2 || addedKeys.has(handle.toLowerCase())) {
      setPreview(null);
      setPreviewStatus("idle");
      return;
    }
    const cached = cache.current.get(handle.toLowerCase());
    if (cached) {
      setPreview(cached);
      setPreviewStatus("ready");
      return;
    }
    let cancelled = false;
    setPreviewStatus("loading");
    lookupSleeperUsers({ data: { usernames: [handle], season } })
      .then((rows) => {
        if (cancelled) return;
        const row = rows[0];
        if (row) {
          cache.current.set(handle.toLowerCase(), row);
          cache.current.set(row.username.toLowerCase(), row);
          setPreview(row);
        } else {
          setPreview({ found: false, query: handle, username: handle, leagues: [] });
        }
        setPreviewStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setPreview(null);
          setPreviewStatus("idle");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedDraft, season, addedKeys]);

  function persist(next: SleeperAccount[]) {
    onAccountsChange(next);
    setRecents(pushSleeperRecents(next));
  }

  function addHandles(raw: string): boolean {
    const handles = parseSleeperHandles(raw);
    if (!handles.length) return false;
    let next = accounts;
    let added = false;
    let duplicate: string | null = null;
    for (const handle of handles) {
      const key = handle.toLowerCase();
      if (next.some((a) => a.username.toLowerCase() === key)) {
        duplicate = handle;
        continue;
      }
      const cached = cache.current.get(key);
      const seed: SleeperAccount = { username: handle };
      next = [...next, cached ? applyLookup(seed, cached) : seed];
      added = true;
    }
    if (added) persist(next);
    if (duplicate && !added) {
      setFlash(duplicate.toLowerCase());
      window.setTimeout(() => setFlash(null), 700);
      const node = document.getElementById(`account-${duplicate.toLowerCase()}`);
      node?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    setDraft("");
    setPreview(null);
    setPreviewStatus("idle");
    return added || Boolean(duplicate);
  }

  function removeAccount(username: string) {
    persist(accounts.filter((a) => a.username.toLowerCase() !== username.toLowerCase()));
    if (expanded?.toLowerCase() === username.toLowerCase()) setExpanded(null);
  }

  function setLeagueIds(username: string, leagueIds: string[] | null) {
    persist(accounts.map((a) => (a.username.toLowerCase() === username.toLowerCase() ? { ...a, leagueIds } : a)));
  }

  const sleeperTeams = accounts.reduce((sum, a) => sum + (selectedCount(a) ?? 0), 0);
  const espnOn = Boolean(espnCreds);
  const teamCount = sleeperTeams + (espnOn ? 1 : 0);
  const canAnalyze = accounts.some((a) => !a.missing) || espnOn;
  const selectedEspnTeam = espnTeams.find((t) => String(t.id) === espnCreds?.teamId);
  const visibleRecents = recents.filter((r) => !addedKeys.has(r.username.toLowerCase())).slice(0, 6);

  return (
    <section className="mb-5 rounded-2xl bg-elevated p-4 shadow-border sm:p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-fg">Your teams</h2>
          <p className="mt-0.5 text-sm text-muted">
            Add every Sleeper account you play under. We’ll pull this week’s lineups.
          </p>
        </div>
        {teamCount > 0 ? (
          <p className="shrink-0 pb-0.5 text-xs tabular-nums text-muted">
            {teamCount} {teamCount === 1 ? "team" : "teams"}
          </p>
        ) : null}
      </div>

      {accounts.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {accounts.map((account) => (
            <AccountRow
              key={account.username}
              account={account}
              loading={hydrating.has(account.username.toLowerCase())}
              expanded={expanded?.toLowerCase() === account.username.toLowerCase()}
              flashed={flash === account.username.toLowerCase()}
              onToggle={() =>
                setExpanded((cur) =>
                  cur?.toLowerCase() === account.username.toLowerCase() ? null : account.username,
                )
              }
              onRemove={() => removeAccount(account.username)}
              onLeagueIds={(ids) => setLeagueIds(account.username, ids)}
            />
          ))}
        </ul>
      ) : null}

      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          addHandles(draft);
        }}
      >
        <Label htmlFor="sleeper-handle" className="sr-only">
          Sleeper username
        </Label>
        <div className="flex gap-2">
          <Input
            id="sleeper-handle"
            name="sleeper-handle"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
            placeholder={accounts.length ? "Add another username" : "Sleeper username"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onPaste={(e) => {
              const text = e.clipboardData.getData("text");
              const handles = parseSleeperHandles(text);
              if (handles.length > 1) {
                e.preventDefault();
                addHandles(text);
              }
            }}
          />
          <Button type="submit" variant="secondary" disabled={!draft.trim()} className="h-12 shrink-0 px-4">
            <Plus className="size-4" />
            Add
          </Button>
        </div>
      </form>

      {previewStatus === "loading" ? (
        <p className="mt-2 text-xs text-muted">Looking up {parseSleeperHandles(draft)[0] || "that account"}…</p>
      ) : null}
      {previewStatus === "ready" && preview && !addedKeys.has(preview.username.toLowerCase()) ? (
        preview.found ? (
          <button
            type="button"
            onClick={() => addHandles(preview.username)}
            className="mt-2 flex min-h-14 w-full items-center gap-3 rounded-xl bg-surface px-3 text-left shadow-border transition-[background-color] duration-150 hover:bg-subtle"
          >
            <SleeperAvatar name={preview.displayName || preview.username} avatar={preview.avatar} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-fg">
                {preview.displayName || preview.username}
              </span>
              <span className="block truncate text-xs text-muted">
                @{preview.username}
                {preview.leagues.length
                  ? ` · ${preview.leagues.length} ${preview.leagues.length === 1 ? "league" : "leagues"}`
                  : " · no 2026 leagues yet"}
              </span>
            </span>
            <span className="text-xs font-medium text-fg">Add</span>
          </button>
        ) : (
          <p className="mt-2 text-xs text-theirs">No Sleeper account named “{preview.query}”.</p>
        )
      ) : null}

      {visibleRecents.length > 0 ? (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Recent</p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visibleRecents.map((recent) => (
              <button
                key={recent.username}
                type="button"
                onClick={() => addHandles(recent.username)}
                className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-surface py-1 pl-1 pr-3 shadow-border"
              >
                <SleeperAvatar name={recent.displayName || recent.username} avatar={recent.avatar} size="sm" />
                <span className="text-sm text-fg">{recent.displayName || recent.username}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        {espnCreds ? (
          <div className="rounded-xl bg-surface p-3 shadow-border">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-subtle text-[10px] font-semibold tracking-wide text-fg">
                ESPN
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">League {espnCreds.leagueId}</p>
                <p className="truncate text-xs text-muted">
                  {espnCreds.espn_s2 || espnCreds.swid ? "Private" : "Public"}
                  {selectedEspnTeam ? ` · ${selectedEspnTeam.name}` : ""}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onEspnOpen} className="shrink-0">
                Edit
              </Button>
              <button
                type="button"
                aria-label="Remove ESPN league"
                onClick={onEspnDisconnect}
                className="flex size-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </div>
            {espnTeams.length > 1 ? (
              <label className="mt-3 block">
                <span className="sr-only">Your ESPN team</span>
                <select
                  className="h-12 w-full rounded-lg bg-elevated px-3 text-base text-fg shadow-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={espnCreds.teamId || ""}
                  onChange={(e) => onEspnTeamChange(e.target.value)}
                >
                  {espnTeams.map((team) => (
                    <option key={team.id} value={String(team.id)}>
                      {team.name} ({team.abbrev})
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={onEspnOpen}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-surface text-sm text-fg shadow-border"
          >
            <Plus className="size-4" />
            Add an ESPN league
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2.5 shadow-border">
        <div>
          <p className="text-sm text-fg">IDP players</p>
          <p className="text-xs text-muted">Linebackers, DL, and DBs</p>
        </div>
        <Switch checked={showIdp} onCheckedChange={onShowIdp} aria-label="Show IDP players" />
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-4 border-t border-border bg-elevated px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:pt-4">
        <Button onClick={onAnalyze} disabled={loading || !canAnalyze} className="h-12 w-full">
          {loading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Analyzing
            </>
          ) : teamCount > 0 ? (
            `Analyze ${teamCount} ${teamCount === 1 ? "team" : "teams"}`
          ) : (
            "Analyze lineups"
          )}
        </Button>
        <div className="mt-2 flex gap-2">
          <Button variant="ghost" onClick={onDemo} disabled={loading} className="h-11 flex-1">
            Sample slate
          </Button>
          {hasResult && onHide ? (
            <Button variant="ghost" onClick={onHide} className="h-11 flex-1">
              Hide
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function AccountRow({
  account,
  loading,
  expanded,
  flashed,
  onToggle,
  onRemove,
  onLeagueIds,
}: {
  account: SleeperAccount;
  loading: boolean;
  expanded: boolean;
  flashed: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onLeagueIds: (ids: string[] | null) => void;
}) {
  const count = selectedCount(account);
  const title = account.displayName || account.username;
  const leagues = account.leagues || [];
  const allSelected = account.leagueIds == null || (leagues.length > 0 && count === leagues.length);

  return (
    <li
      id={`account-${account.username.toLowerCase()}`}
      className={cn(
        "rounded-xl bg-surface shadow-border transition-[box-shadow] duration-200",
        flashed && "shadow-win",
        account.missing && "shadow-lose",
      )}
    >
      <div className="flex min-h-14 items-center gap-2 pr-1">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 py-2 pl-3 text-left"
          aria-expanded={expanded}
        >
          <SleeperAvatar name={title} avatar={account.avatar} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-fg">{title}</span>
            <span className="block truncate text-xs text-muted">
              {loading ? (
                "Finding leagues…"
              ) : account.missing ? (
                "Not found on Sleeper"
              ) : !leagues.length ? (
                <>@{account.username} · no 2026 leagues</>
              ) : count === 0 ? (
                <>@{account.username} · none selected</>
              ) : (
                <>
                  @{account.username}
                  {" · "}
                  {allSelected ? "All " : ""}
                  {count} {count === 1 ? "league" : "leagues"}
                </>
              )}
            </span>
          </span>
          {leagues.length > 0 ? (
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-muted transition-transform duration-200",
                expanded && "rotate-180",
              )}
            />
          ) : null}
        </button>
        <button
          type="button"
          aria-label={`Remove ${title}`}
          onClick={onRemove}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-fg"
        >
          <X className="size-4" />
        </button>
      </div>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          expanded && leagues.length ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-2 py-2">
            {leagues.length > 3 ? (
              <div className="mb-1 flex gap-1 px-1">
                <button
                  type="button"
                  className="h-9 rounded-lg px-2 text-xs text-muted hover:text-fg"
                  onClick={() => onLeagueIds(null)}
                >
                  All
                </button>
                <button
                  type="button"
                  className="h-9 rounded-lg px-2 text-xs text-muted hover:text-fg"
                  onClick={() => onLeagueIds([])}
                >
                  None
                </button>
              </div>
            ) : null}
            <ul className="space-y-0.5">
              {leagues.map((league) => {
                const on = account.leagueIds == null || account.leagueIds.includes(league.id);
                return (
                  <li key={league.id}>
                    <button
                      type="button"
                      onClick={() => {
                        const current =
                          account.leagueIds == null ? leagues.map((l) => l.id) : [...account.leagueIds];
                        const next = on ? current.filter((id) => id !== league.id) : [...current, league.id];
                        onLeagueIds(next.length === leagues.length ? null : next);
                      }}
                      className="flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left hover:bg-subtle"
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md shadow-border",
                          on ? "bg-primary text-primary-foreground" : "bg-elevated text-transparent",
                        )}
                      >
                        <Check className="size-3" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-fg">{league.name}</span>
                      {league.size ? (
                        <span className="text-xs tabular-nums text-muted">{league.size}</span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}

export function TeamSummary({
  accounts,
  espnCreds,
  espnLabel,
  onClick,
}: {
  accounts: SleeperAccount[];
  espnCreds: EspnCredentials | null;
  espnLabel?: string;
  onClick: () => void;
}) {
  const sleeperTeams = accounts.reduce((sum, a) => sum + (selectedCount(a) ?? 0), 0);
  const teamCount = sleeperTeams + (espnCreds ? 1 : 0);
  const faces = accounts.slice(0, 4);

  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 flex min-h-14 w-full items-center gap-3 rounded-2xl bg-elevated px-3 text-left shadow-border"
    >
      <div className="flex shrink-0 -space-x-2">
        {faces.map((account) => (
          <span key={account.username} className="rounded-full ring-2 ring-elevated">
            <SleeperAvatar name={account.displayName || account.username} avatar={account.avatar} size="sm" />
          </span>
        ))}
        {espnCreds ? (
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-subtle text-[10px] font-semibold tracking-wide text-fg ring-2 ring-elevated">
            ESPN
          </span>
        ) : null}
      </div>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-fg">
          {teamCount > 0 ? `${teamCount} ${teamCount === 1 ? "team" : "teams"}` : "Your teams"}
        </span>
        <span className="block truncate text-xs text-muted">
          {espnLabel || "Tap to edit accounts"}
        </span>
      </span>
      <ChevronDown className="size-4 shrink-0 text-muted" />
    </button>
  );
}

