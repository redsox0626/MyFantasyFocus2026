import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getEspnTeams } from "@/lib/fantasy/functions";
import { parseEspnLeagueId } from "@/lib/fantasy/parse";
import type { EspnCredentials, EspnTeam } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

export function EspnDialog({
  open,
  onOpenChange,
  onConnected,
  initial,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnected: (creds: EspnCredentials, teams: EspnTeam[]) => void;
  initial?: EspnCredentials | null;
}) {
  const [step, setStep] = useState<"league" | "team">("league");
  const [leagueId, setLeagueId] = useState("");
  const [espnS2, setEspnS2] = useState("");
  const [swid, setSwid] = useState("");
  const [showPrivate, setShowPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<EspnTeam[]>([]);
  const [pending, setPending] = useState<EspnCredentials | null>(null);

  useEffect(() => {
    if (!open) return;
    const seed = initial || null;
    setLeagueId(seed?.leagueId || "");
    setEspnS2(seed?.espn_s2 || "");
    setSwid(seed?.swid || "");
    setShowPrivate(Boolean(seed?.espn_s2 || seed?.swid));
    setError(null);
    setStep("league");
    setTeams([]);
    setPending(null);
    setLoading(false);
  }, [open, initial]);

  async function handleConnect() {
    const id = parseEspnLeagueId(leagueId);
    if (!/^\d+$/.test(id)) {
      setError("Paste a league ID or ESPN league URL.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getEspnTeams({
        data: {
          leagueId: id,
          espn_s2: espnS2.trim() || undefined,
          swid: swid.trim() || undefined,
        },
      });
      const creds: EspnCredentials = {
        leagueId: id,
        espn_s2: espnS2.trim(),
        swid: swid.trim(),
        teamId: result.teams[0] ? String(result.teams[0].id) : undefined,
      };
      if (result.teams.length <= 1) {
        onConnected(creds, result.teams);
        onOpenChange(false);
        return;
      }
      setTeams(result.teams);
      setPending(creds);
      setStep("team");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach this ESPN league.");
    } finally {
      setLoading(false);
    }
  }

  function pickTeam(teamId: string) {
    if (!pending) return;
    onConnected({ ...pending, teamId }, teams);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {step === "league" ? (
          <>
            <DialogHeader>
              <DialogTitle>Add ESPN league</DialogTitle>
              <DialogDescription>
                Paste the league ID — or the whole ESPN fantasy URL. Public leagues need nothing else.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="league-id">League ID or URL</Label>
                <Input
                  id="league-id"
                  inputMode="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="123456789 or espn.com/…leagueId="
                  value={leagueId}
                  onChange={(e) => setLeagueId(e.target.value)}
                  onBlur={() => {
                    const parsed = parseEspnLeagueId(leagueId);
                    if (parsed) setLeagueId(parsed);
                  }}
                  onPaste={(e) => {
                    const text = e.clipboardData.getData("text");
                    const parsed = parseEspnLeagueId(text);
                    if (parsed) {
                      e.preventDefault();
                      setLeagueId(parsed);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleConnect();
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPrivate((v) => !v)}
                className="min-h-11 text-left text-sm text-muted underline-offset-2 hover:text-fg hover:underline"
              >
                {showPrivate ? "Hide private-league cookies" : "Private league? Add cookies"}
              </button>
              {showPrivate ? (
                <div className="space-y-3 rounded-xl bg-surface p-3 shadow-border">
                  <p className="text-xs text-muted">
                    From a logged-in browser: Application → Cookies → espn_s2 and SWID. Stored only on this
                    device.
                  </p>
                  <div className="space-y-1.5">
                    <Label htmlFor="espn-s2">espn_s2</Label>
                    <Input
                      id="espn-s2"
                      autoCapitalize="none"
                      autoCorrect="off"
                      placeholder="Cookie value"
                      value={espnS2}
                      onChange={(e) => setEspnS2(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="swid">SWID</Label>
                    <Input
                      id="swid"
                      autoCapitalize="none"
                      autoCorrect="off"
                      placeholder="{A1B2C3D4-...}"
                      value={swid}
                      onChange={(e) => setSwid(e.target.value)}
                    />
                  </div>
                </div>
              ) : null}
              {error ? <p className="text-sm text-theirs">{error}</p> : null}
              <Button className="h-12 w-full" onClick={handleConnect} disabled={loading}>
                {loading ? "Connecting…" : "Continue"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Which team is yours?</DialogTitle>
              <DialogDescription>League {pending?.leagueId}. This is the side we treat as you.</DialogDescription>
            </DialogHeader>
            <ul className="space-y-1">
              {teams.map((team) => {
                const selected = pending?.teamId === String(team.id);
                return (
                  <li key={team.id}>
                    <button
                      type="button"
                      onClick={() => pickTeam(String(team.id))}
                      className={cn(
                        "flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-3 text-left",
                        selected ? "bg-primary text-primary-foreground" : "bg-surface text-fg shadow-border",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{team.name}</span>
                        <span className="block text-xs opacity-70">{team.abbrev}</span>
                      </span>
                      {selected ? <Check className="size-4 shrink-0" /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
            <Button variant="ghost" className="mt-3 h-11 w-full" onClick={() => setStep("league")}>
              Back
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
