import { f as normalizeNflTeam } from "./constants-B6K5XiYV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schedule-B0w6Xspk.js
var ET = "America/New_York";
function gameDateInEt(iso) {
	const utc = new Date(iso);
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: ET,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(utc);
	const grab = (type) => parts.find((p) => p.type === type)?.value ?? "0";
	return new Date(Number(grab("year")), Number(grab("month")) - 1, Number(grab("day")), Number(grab("hour")), Number(grab("minute")));
}
function classifySlot(game) {
	const country = (game.country || "USA").toUpperCase();
	if (country !== "USA" && country !== "UNITED STATES" && country !== "") return "International";
	const d = gameDateInEt(game.start_time);
	const day = d.getDay();
	const hour = d.getHours() + d.getMinutes() / 60;
	if (day === 3) return "Wednesday";
	if (day === 4) return "Thursday";
	if (day === 5 || day === 6) return "International";
	if (day === 0) {
		if (hour < 15) return "Sunday Early";
		if (hour < 19) return "Sunday Late";
		return "Sunday Night";
	}
	if (day === 1) return "Monday Night";
	if (day === 2) return "Wednesday";
	return "International";
}
function kickoffLabel(iso) {
	const utc = new Date(iso);
	return new Intl.DateTimeFormat("en-US", {
		timeZone: ET,
		weekday: "short",
		hour: "numeric",
		minute: "2-digit",
		timeZoneName: "short"
	}).format(utc);
}
function findGameForTeam(schedule, week, nflTeam) {
	const team = normalizeNflTeam(nflTeam);
	return schedule.find((g) => g.week === week && (normalizeNflTeam(g.home_team) === team || normalizeNflTeam(g.away_team) === team));
}
function teamsInSlot(schedule, week, slot) {
	const teams = /* @__PURE__ */ new Set();
	if (slot === "All") return teams;
	for (const game of schedule) {
		if (game.week !== week) continue;
		if (classifySlot(game) !== slot) continue;
		teams.add(normalizeNflTeam(game.home_team));
		teams.add(normalizeNflTeam(game.away_team));
	}
	return teams;
}
//#endregion
export { teamsInSlot as i, findGameForTeam as n, kickoffLabel as r, classifySlot as t };
