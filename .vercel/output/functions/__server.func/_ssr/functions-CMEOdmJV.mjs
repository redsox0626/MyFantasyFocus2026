import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/functions-CMEOdmJV.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getBootstrap_createServerFn_handler = createServerRpc({
	id: "0a25e930827fb0f3144bef45b9cfc0ce5f1a032abad79564eb7b0e4ec44e9447",
	name: "getBootstrap",
	filename: "src/lib/fantasy/functions.ts"
}, (opts) => getBootstrap.__executeServer(opts));
var getBootstrap = createServerFn({ method: "GET" }).handler(getBootstrap_createServerFn_handler, async () => {
	const { bootstrapFantasy } = await import("./analyze.server-DbTTKzWi.mjs");
	return bootstrapFantasy();
});
var espnCreds = object({
	leagueId: string().min(1),
	espn_s2: string().optional(),
	swid: string().optional(),
	teamId: string().optional()
});
var getEspnTeams_createServerFn_handler = createServerRpc({
	id: "26c449fad815004f33a5935a96b3a508965a80f1e1a185c307b9140acc282662",
	name: "getEspnTeams",
	filename: "src/lib/fantasy/functions.ts"
}, (opts) => getEspnTeams.__executeServer(opts));
var getEspnTeams = createServerFn({ method: "POST" }).validator(object({
	leagueId: string().regex(/^\d+$/, "League ID must be numeric"),
	espn_s2: string().optional(),
	swid: string().optional()
})).handler(getEspnTeams_createServerFn_handler, async ({ data }) => {
	const { espnTeams } = await import("./analyze.server-DbTTKzWi.mjs");
	return espnTeams(data);
});
var lookupSleeperUsers_createServerFn_handler = createServerRpc({
	id: "a221d77796c553f9e500f9c85c8155acd7162ecbb81346cd9d67541ef7c3007f",
	name: "lookupSleeperUsers",
	filename: "src/lib/fantasy/functions.ts"
}, (opts) => lookupSleeperUsers.__executeServer(opts));
var lookupSleeperUsers = createServerFn({ method: "POST" }).validator(object({
	usernames: array(string().min(1)).max(12),
	season: string().min(4).max(6)
})).handler(lookupSleeperUsers_createServerFn_handler, async ({ data }) => {
	const { lookupSleeperUsers: lookup } = await import("./sleeper.server-k0GjoDuD.mjs").then((n) => n.o);
	return lookup(data.usernames, data.season);
});
var sleeperAccount = object({
	username: string().min(1),
	leagueIds: array(string()).nullable().optional()
});
var runAnalysis_createServerFn_handler = createServerRpc({
	id: "d8c2015cfab9ed22853e4ef74e389aaed027105c33eabef89c10815e6cd8e628",
	name: "runAnalysis",
	filename: "src/lib/fantasy/functions.ts"
}, (opts) => runAnalysis.__executeServer(opts));
var runAnalysis = createServerFn({ method: "POST" }).validator(object({
	platform: _enum([
		"sleeper",
		"espn",
		"both"
	]),
	week: number().int().min(1).max(18),
	sleeperUsernames: string().optional(),
	sleeperAccounts: array(sleeperAccount).optional(),
	espn: espnCreds.optional()
})).handler(runAnalysis_createServerFn_handler, async ({ data }) => {
	const { analyzeLineups } = await import("./analyze.server-DbTTKzWi.mjs");
	return analyzeLineups(data);
});
//#endregion
export { getBootstrap_createServerFn_handler, getEspnTeams_createServerFn_handler, lookupSleeperUsers_createServerFn_handler, runAnalysis_createServerFn_handler };
