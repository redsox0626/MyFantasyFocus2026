import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { f as normalizeNflTeam, u as formatPlayerName } from "./constants-B6K5XiYV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sleeper.server-k0GjoDuD.js
/** Suffixes ESPN includes (III) that Sleeper often omits. Longer roman numerals first. */
var NAME_SUFFIX = /\b((jr|sr)s?\.?|iii|ii|iv|v)\b/gi;
var SKIP_ABBREV_WORDS = /* @__PURE__ */ new Set([
	"the",
	"a",
	"an",
	"of",
	"and",
	"mr",
	"mrs",
	"ms",
	"team",
	"my"
]);
function normalizePersonName(name) {
	return (name || "").toLowerCase().replace(NAME_SUFFIX, " ").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}
/** Compact identity key so "Kenneth Walker III" === "Kenneth Walker". */
function nameKey(name) {
	return normalizePersonName(name).replace(/ /g, "");
}
function identityKey(name, position) {
	return `${nameKey(name)}|${(position || "UNKNOWN").toUpperCase()}`;
}
/**
* 5–6 letter fantasy-team slug from the actual team name, not the account.
* "Mr. Bananagrabber" → BANANA, "Daniels Pays-Lewis" → DANPAY.
*/
function abbreviateTeamName(name, length = 6) {
	if (!name) return "UNK";
	const words = name.replace(/['’]/g, "").replace(/[^a-zA-Z0-9\s]/g, " ").trim().split(/\s+/).filter(Boolean);
	const meaningful = words.filter((w) => !SKIP_ABBREV_WORDS.has(w.toLowerCase()));
	const use = meaningful.length ? meaningful : words;
	if (!use.length) return "UNK";
	if (use.length >= 2) {
		const rest = use.slice(1).join("");
		const firstLen = Math.max(3, length - Math.min(3, rest.length));
		return `${use[0].slice(0, firstLen)}${rest.slice(0, Math.max(0, length - firstLen))}`.slice(0, length).toUpperCase() || "UNK";
	}
	return use[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, length).toUpperCase() || "UNK";
}
var sleeper_server_exports = /* @__PURE__ */ __exportAll({
	collectSleeperStarts: () => collectSleeperStarts,
	findSleeperIdByName: () => findSleeperIdByName,
	getNflState: () => getNflState,
	getSleeperPlayers: () => getSleeperPlayers,
	lookupSleeperUser: () => lookupSleeperUser,
	lookupSleeperUsers: () => lookupSleeperUsers,
	sleeperPlayerInfo: () => sleeperPlayerInfo
});
var SLEEPER = "https://api.sleeper.app/v1";
var playerCache = null;
var playerCacheAt = 0;
var PLAYER_TTL_MS = 216e5;
async function sleeperGet(path) {
	const res = await fetch(`${SLEEPER}${path}`, { headers: { Accept: "application/json" } });
	if (!res.ok) throw new Error(`Sleeper ${path} failed (${res.status})`);
	return await res.json();
}
async function getNflState() {
	const data = await sleeperGet("/state/nfl");
	const week = Number(data.week || data.display_week || 1) || 1;
	return {
		week: Math.max(1, week),
		season: String(data.season || 2026),
		seasonType: data.season_type || "regular",
		seasonStartDate: data.season_start_date || `2026-09-09`,
		displayWeek: Number(data.display_week || week)
	};
}
async function getSleeperPlayers() {
	const now = Date.now();
	if (playerCache && now - playerCacheAt < PLAYER_TTL_MS) return playerCache;
	playerCache = await sleeperGet("/players/nfl");
	playerCacheAt = now;
	return playerCache;
}
function sleeperPlayerInfo(id, dict) {
	const p = dict[id];
	if (!p) {
		const asTeam = dict[id] || Object.values(dict).find((x) => x.position === "DEF" && x.team === id);
		if (!asTeam) return {
			short: `Player ${id}`,
			full: `Player ${id}`,
			position: "UNKNOWN",
			nflTeam: "FA"
		};
		const { full, short } = formatPlayerName(asTeam.first_name || "", asTeam.last_name || asTeam.full_name || id);
		return {
			short,
			full,
			position: asTeam.position || "DEF",
			nflTeam: normalizeNflTeam(asTeam.team || id)
		};
	}
	const { full, short } = formatPlayerName(p.first_name || "", p.last_name || p.full_name || "");
	return {
		short,
		full,
		position: p.position || "UNKNOWN",
		nflTeam: normalizeNflTeam(p.team)
	};
}
async function mapPool(items, limit, fn) {
	const out = new Array(items.length);
	let cursor = 0;
	async function worker() {
		while (cursor < items.length) {
			const idx = cursor++;
			out[idx] = await fn(items[idx]);
		}
	}
	const n = Math.min(limit, items.length) || 0;
	await Promise.all(Array.from({ length: n }, () => worker()));
	return out;
}
function sleeperTeamName(user, fallback) {
	const meta = user?.metadata || {};
	return (meta.team_name || meta.teamName || "").trim() || (user?.display_name || user?.username || fallback).trim() || fallback;
}
function matchupPoints(matchup) {
	const custom = matchup?.custom_points;
	if (custom != null && custom !== "") {
		const n = Number(custom);
		if (Number.isFinite(n)) return n;
	}
	const n = Number(matchup?.points ?? 0);
	return Number.isFinite(n) ? n : 0;
}
function uniqueAccounts(accounts) {
	const map = /* @__PURE__ */ new Map();
	for (const account of accounts) {
		const username = account.username.trim().toLowerCase();
		if (!username) continue;
		const prev = map.get(username);
		if (!prev) {
			map.set(username, {
				username,
				leagueIds: account.leagueIds ?? null
			});
			continue;
		}
		if (account.leagueIds == null) prev.leagueIds = null;
		else if (prev.leagueIds) prev.leagueIds = [.../* @__PURE__ */ new Set([...prev.leagueIds, ...account.leagueIds])];
	}
	return [...map.values()];
}
async function collectSleeperStarts(accounts, week, season) {
	const myStarts = [];
	const oppStarts = [];
	const matchups = [];
	const warnings = [];
	let leaguesUsed = 0;
	for (const account of uniqueAccounts(accounts)) {
		const username = account.username;
		let user;
		try {
			user = await sleeperGet(`/user/${encodeURIComponent(username)}`);
		} catch {
			warnings.push(`Sleeper user “${username}” was not found.`);
			continue;
		}
		if (!user?.user_id) {
			warnings.push(`Sleeper user “${username}” was not found.`);
			continue;
		}
		const display = user.username || user.display_name || username;
		let leagues = [];
		try {
			leagues = await sleeperGet(`/user/${user.user_id}/leagues/nfl/${season}`);
		} catch {
			warnings.push(`Could not load ${season} leagues for ${display}.`);
			continue;
		}
		if (!Array.isArray(leagues) || leagues.length === 0) {
			warnings.push(`${display} has no Sleeper NFL leagues for ${season}.`);
			continue;
		}
		const allow = account.leagueIds;
		const filtered = allow == null ? leagues : leagues.filter((league) => allow.includes(String(league.league_id)));
		if (allow != null && filtered.length === 0) {
			warnings.push(`No selected leagues remain for ${display}.`);
			continue;
		}
		const results = await mapPool(filtered, 5, async (league) => {
			try {
				const [rosters, matchupRows, users] = await Promise.all([
					sleeperGet(`/league/${league.league_id}/rosters`),
					sleeperGet(`/league/${league.league_id}/matchups/${week}`),
					sleeperGet(`/league/${league.league_id}/users`).catch(() => [])
				]);
				const userRoster = rosters.find((r) => r.owner_id === user.user_id);
				if (!userRoster) return null;
				const userMatchup = matchupRows.find((m) => m.roster_id === userRoster.roster_id);
				if (!userMatchup) return null;
				const oppMatchup = matchupRows.find((m) => m.matchup_id === userMatchup.matchup_id && m.roster_id !== userRoster.roster_id);
				const oppRoster = oppMatchup ? rosters.find((r) => r.roster_id === oppMatchup.roster_id) : null;
				const myUser = users.find((u) => u.user_id === user.user_id) || user;
				const oppUser = oppRoster ? users.find((u) => u.user_id === oppRoster.owner_id) : null;
				const myName = sleeperTeamName(myUser, display);
				const oppName = oppUser ? sleeperTeamName(oppUser, "Opponent") : "Opponent";
				return {
					userMatchup,
					oppMatchup,
					myAbbrev: abbreviateTeamName(myName),
					oppAbbrev: abbreviateTeamName(oppName),
					myName,
					oppName,
					matchupId: `sleeper:${league.league_id}:${week}`,
					leagueName: league.name || "Sleeper league"
				};
			} catch {
				return null;
			}
		});
		for (const row of results) {
			if (!row) continue;
			leaguesUsed += 1;
			matchups.push({
				id: row.matchupId,
				leagueName: row.leagueName,
				myTeam: {
					name: row.myName,
					abbrev: row.myAbbrev,
					score: matchupPoints(row.userMatchup)
				},
				oppTeam: row.oppMatchup ? {
					name: row.oppName,
					abbrev: row.oppAbbrev,
					score: matchupPoints(row.oppMatchup)
				} : null
			});
			for (const pid of row.userMatchup?.starters || []) {
				if (!pid || pid === "0") continue;
				myStarts.push({
					playerId: String(pid),
					fantasyAbbrev: row.myAbbrev,
					fantasyName: row.myName,
					matchupId: row.matchupId
				});
			}
			if (row.oppMatchup) for (const pid of row.oppMatchup.starters || []) {
				if (!pid || pid === "0") continue;
				oppStarts.push({
					playerId: String(pid),
					fantasyAbbrev: row.oppAbbrev,
					fantasyName: row.oppName,
					matchupId: row.matchupId
				});
			}
		}
	}
	return {
		myStarts,
		oppStarts,
		matchups,
		leaguesUsed,
		warnings
	};
}
async function lookupSleeperUser(username, season) {
	const query = username.trim().replace(/^@/, "");
	const empty = {
		found: false,
		query,
		username: query.toLowerCase(),
		leagues: []
	};
	if (!query) return empty;
	try {
		const user = await sleeperGet(`/user/${encodeURIComponent(query)}`);
		if (!user?.user_id) return empty;
		let leagues = [];
		try {
			leagues = await sleeperGet(`/user/${user.user_id}/leagues/nfl/${season}`);
		} catch {
			leagues = [];
		}
		return {
			found: true,
			query,
			username: user.username || query,
			userId: String(user.user_id),
			displayName: user.display_name || user.username || query,
			avatar: user.avatar || null,
			leagues: (Array.isArray(leagues) ? leagues : []).map((league) => ({
				id: String(league.league_id),
				name: String(league.name || "League"),
				avatar: league.avatar || null,
				size: Number(league.total_rosters) || 0
			}))
		};
	} catch {
		return empty;
	}
}
async function lookupSleeperUsers(usernames, season) {
	return mapPool([...new Set(usernames.map((u) => u.trim().replace(/^@/, "")).filter(Boolean))].slice(0, 12), 4, (name) => lookupSleeperUser(name, season));
}
/** Best-effort match of an ESPN display name onto a Sleeper player id. */
function findSleeperIdByName(name, position, dict) {
	const targetKey = nameKey(name);
	const parts = normalizePersonName(name).split(" ").filter(Boolean);
	const first = parts[0] || "";
	const last = parts.slice(1).join(" ");
	const positions = position === "FLEX" ? [
		"RB",
		"WR",
		"TE"
	] : [position === "DST" || position === "D" ? "DEF" : position];
	if (positions.includes("DEF")) for (const [id, player] of Object.entries(dict)) {
		if (player.position !== "DEF") continue;
		const pn = nameKey(`${player.full_name || ""} ${player.first_name || ""} ${player.last_name || ""} ${player.team || ""}`);
		if (pn && targetKey && (pn.includes(targetKey) || targetKey.includes(pn))) return id;
	}
	let initialFallback = null;
	for (const [id, player] of Object.entries(dict)) {
		if (!positions.includes(player.position || "")) continue;
		const pFull = `${player.first_name || ""} ${player.last_name || player.full_name || ""}`;
		const pKey = nameKey(pFull);
		if (pKey && targetKey && pKey === targetKey) return id;
		const pParts = normalizePersonName(pFull).split(" ").filter(Boolean);
		const pFirst = pParts[0] || "";
		const pLast = pParts.slice(1).join(" ");
		if (last && pLast === last && (pFirst === first || pFirst.startsWith(first) || first.startsWith(pFirst))) return id;
		if (last && pLast === last && first[0] && pFirst[0] === first[0]) initialFallback = initialFallback || id;
	}
	return initialFallback;
}
//#endregion
export { sleeperPlayerInfo as a, identityKey as c, getSleeperPlayers as i, findSleeperIdByName as n, sleeper_server_exports as o, getNflState as r, abbreviateTeamName as s, collectSleeperStarts as t };
