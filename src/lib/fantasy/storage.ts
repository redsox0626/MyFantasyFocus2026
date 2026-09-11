import { parseSleeperHandles } from "./parse";
import type { EspnCredentials, Platform, SleeperAccount, SleeperRecent } from "./types";

const ESPN_KEY = "mff.espn.credentials";
const SLEEPER_KEY = "mff.sleeper.usernames";
const ACCOUNTS_KEY = "mff.sleeper.accounts";
const RECENTS_KEY = "mff.sleeper.recents";
const PLATFORM_KEY = "mff.platform";
const IDP_KEY = "mff.showIdp";

export function loadEspnCredentialsList(): EspnCredentials[] {
  try {
    const raw = localStorage.getItem(ESPN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((c): c is EspnCredentials => Boolean(c?.leagueId));
    }
    // Migrate the old single-credentials shape saved before multi-league support.
    if (parsed?.leagueId) return [parsed as EspnCredentials];
    return [];
  } catch {
    return [];
  }
}

export function saveEspnCredentialsList(list: EspnCredentials[]): void {
  localStorage.setItem(ESPN_KEY, JSON.stringify(list));
}

export function loadSleeperUsernames(): string {
  try {
    return localStorage.getItem(SLEEPER_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveSleeperUsernames(value: string): void {
  localStorage.setItem(SLEEPER_KEY, value);
}

function slimAccount(account: SleeperAccount): SleeperAccount {
  return {
    username: account.username,
    userId: account.userId,
    displayName: account.displayName,
    avatar: account.avatar ?? null,
    leagueIds: account.leagueIds ?? null,
  };
}

export function loadSleeperAccounts(): SleeperAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SleeperAccount[];
      if (Array.isArray(parsed)) {
        return parsed.filter((a) => a && typeof a.username === "string" && a.username.trim());
      }
    }
  } catch {
    /* migrate from the legacy comma string below */
  }
  return parseSleeperHandles(loadSleeperUsernames()).map((username) => ({ username }));
}

export function saveSleeperAccounts(accounts: SleeperAccount[]): void {
  const slim = accounts.map(slimAccount);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(slim));
  saveSleeperUsernames(slim.map((a) => a.username).join(", "));
}

export function loadSleeperRecents(): SleeperRecent[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SleeperRecent[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r) => r && typeof r.username === "string").slice(0, 8);
  } catch {
    return [];
  }
}

export function pushSleeperRecents(accounts: SleeperAccount[]): SleeperRecent[] {
  const incoming: SleeperRecent[] = accounts
    .filter((a) => !a.missing)
    .map((a) => ({
      username: a.username,
      displayName: a.displayName,
      avatar: a.avatar ?? null,
    }));
  const seen = new Set<string>();
  const merged: SleeperRecent[] = [];
  for (const row of [...incoming, ...loadSleeperRecents()]) {
    const key = row.username.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(row);
    if (merged.length >= 8) break;
  }
  localStorage.setItem(RECENTS_KEY, JSON.stringify(merged));
  return merged;
}

export function loadPlatform(): Platform {
  try {
    const v = localStorage.getItem(PLATFORM_KEY);
    if (v === "sleeper" || v === "espn" || v === "both") return v;
  } catch {
    /* ignore */
  }
  return "sleeper";
}

export function savePlatform(platform: Platform): void {
  localStorage.setItem(PLATFORM_KEY, platform);
}

export function loadShowIdp(): boolean {
  try {
    const v = localStorage.getItem(IDP_KEY);
    if (v === "0") return false;
    if (v === "1") return true;
  } catch {
    /* ignore */
  }
  return true;
}

export function saveShowIdp(value: boolean): void {
  localStorage.setItem(IDP_KEY, value ? "1" : "0");
}
