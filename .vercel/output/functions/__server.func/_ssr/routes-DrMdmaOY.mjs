import { i as __toESM } from "../_runtime.mjs";
import { a as KICKOFF_WINDOWS, c as SEASON_START_LABEL, d as isIdpPosition, f as normalizeNflTeam, l as TIME_SLOTS, o as POSITION_LABEL, p as sleeperAvatarUrl, s as POSITION_ORDER } from "./constants-B6K5XiYV.mjs";
import { i as teamsInSlot, n as findGameForTeam, r as kickoffLabel, t as classifySlot } from "./schedule-B0w6Xspk.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
import { a as Plus, c as ChevronDown, i as Radio, l as Check, n as Trophy, o as LoaderCircle, s as LayoutGrid, t as X } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, h as Slot, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as cn } from "./router-BL-Dy3rS.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DrMdmaOY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:enabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-border hover:bg-primary/90",
			secondary: "bg-surface text-fg shadow-border hover:bg-subtle",
			outline: "bg-transparent text-fg shadow-border hover:bg-subtle",
			ghost: "text-muted hover:bg-subtle hover:text-fg",
			mine: "bg-mine text-mine-fg hover:opacity-90",
			theirs: "bg-theirs text-theirs-fg hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-bg/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed z-50 flex max-h-[92dvh] flex-col overflow-y-auto bg-elevated text-fg shadow-border", "max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto max-sm:w-full max-sm:rounded-t-2xl", "max-sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-sm:pt-2", "sm:left-1/2 sm:top-1/2 sm:w-[calc(100%-2rem)] sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-5", "p-5 focus:outline-none", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-subtle sm:hidden",
			"aria-hidden": true
		}),
		children,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-2 top-2 flex size-11 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-fg sm:right-3 sm:top-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})
	]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 space-y-1 pr-10", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-semibold tracking-tight text-fg", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted text-pretty", className),
		...props
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-12 w-full rounded-lg bg-surface px-3 text-base text-fg shadow-border", "placeholder:text-muted", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-xs font-medium tracking-wide text-muted", className),
	...props
}));
Label.displayName = "Label";
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getBootstrap = createServerFn({ method: "GET" }).handler(createSsrRpc("0a25e930827fb0f3144bef45b9cfc0ce5f1a032abad79564eb7b0e4ec44e9447"));
var espnCreds = object({
	leagueId: string().min(1),
	espn_s2: string().optional(),
	swid: string().optional(),
	teamId: string().optional()
});
var getEspnTeams = createServerFn({ method: "POST" }).validator(object({
	leagueId: string().regex(/^\d+$/, "League ID must be numeric"),
	espn_s2: string().optional(),
	swid: string().optional()
})).handler(createSsrRpc("26c449fad815004f33a5935a96b3a508965a80f1e1a185c307b9140acc282662"));
var lookupSleeperUsers = createServerFn({ method: "POST" }).validator(object({
	usernames: array(string().min(1)).max(12),
	season: string().min(4).max(6)
})).handler(createSsrRpc("a221d77796c553f9e500f9c85c8155acd7162ecbb81346cd9d67541ef7c3007f"));
var sleeperAccount = object({
	username: string().min(1),
	leagueIds: array(string()).nullable().optional()
});
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
})).handler(createSsrRpc("d8c2015cfab9ed22853e4ef74e389aaed027105c33eabef89c10815e6cd8e628"));
/** Normalize a pasted Sleeper handle, URL, or @mention into a bare username. */
function normalizeSleeperHandle(raw) {
	let s = raw.trim();
	if (!s) return "";
	s = s.replace(/^@/, "");
	s = s.replace(/^https?:\/\/(www\.)?sleeper\.(app|com)\//i, "");
	s = s.replace(/^u\//i, "");
	s = s.split(/[/?#]/)[0] || "";
	return s.trim();
}
/**
* Split a typed or pasted blob into unique Sleeper handles.
* Commas, semicolons, and newlines always split; spaces split when the chunk
* looks like a list of handles (no spaces inside a single Sleeper username).
*/
function parseSleeperHandles(raw) {
	const chunks = raw.split(/[,;\n]+/);
	const handles = [];
	const seen = /* @__PURE__ */ new Set();
	for (const chunk of chunks) {
		const trimmed = chunk.trim();
		if (!trimmed) continue;
		const pieces = /\s/.test(trimmed) ? trimmed.split(/\s+/) : [trimmed];
		for (const piece of pieces) {
			const handle = normalizeSleeperHandle(piece);
			if (!handle) continue;
			const key = handle.toLowerCase();
			if (seen.has(key)) continue;
			seen.add(key);
			handles.push(handle);
		}
	}
	return handles;
}
/** Pull a numeric ESPN league ID out of a raw ID or fantasy.espn.com URL. */
function parseEspnLeagueId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	const query = trimmed.match(/[?&]leagueId=(\d+)/i);
	if (query?.[1]) return query[1];
	const path = trimmed.match(/\/league(?:\/view)?\/(\d+)/i);
	if (path?.[1]) return path[1];
	if (/^\d+$/.test(trimmed)) return trimmed;
	return trimmed.match(/(\d{5,})/)?.[1] || "";
}
function initials(name) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length >= 2) return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
	return name.slice(0, 2).toUpperCase() || "?";
}
function EspnDialog({ open, onOpenChange, onConnected, initial }) {
	const [step, setStep] = (0, import_react.useState)("league");
	const [leagueId, setLeagueId] = (0, import_react.useState)("");
	const [espnS2, setEspnS2] = (0, import_react.useState)("");
	const [swid, setSwid] = (0, import_react.useState)("");
	const [showPrivate, setShowPrivate] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [teams, setTeams] = (0, import_react.useState)([]);
	const [pending, setPending] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
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
			const result = await getEspnTeams({ data: {
				leagueId: id,
				espn_s2: espnS2.trim() || void 0,
				swid: swid.trim() || void 0
			} });
			const creds = {
				leagueId: id,
				espn_s2: espnS2.trim(),
				swid: swid.trim(),
				teamId: result.teams[0] ? String(result.teams[0].id) : void 0
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
	function pickTeam(teamId) {
		if (!pending) return;
		onConnected({
			...pending,
			teamId
		}, teams);
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: step === "league" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add ESPN league" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Paste the league ID — or the whole ESPN fantasy URL. Public leagues need nothing else." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "league-id",
						children: "League ID or URL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "league-id",
						inputMode: "url",
						autoCapitalize: "none",
						autoCorrect: "off",
						spellCheck: false,
						placeholder: "123456789 or espn.com/…leagueId=",
						value: leagueId,
						onChange: (e) => setLeagueId(e.target.value),
						onBlur: () => {
							const parsed = parseEspnLeagueId(leagueId);
							if (parsed) setLeagueId(parsed);
						},
						onPaste: (e) => {
							const parsed = parseEspnLeagueId(e.clipboardData.getData("text"));
							if (parsed) {
								e.preventDefault();
								setLeagueId(parsed);
							}
						},
						onKeyDown: (e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleConnect();
							}
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setShowPrivate((v) => !v),
					className: "min-h-11 text-left text-sm text-muted underline-offset-2 hover:text-fg hover:underline",
					children: showPrivate ? "Hide private-league cookies" : "Private league? Add cookies"
				}),
				showPrivate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 rounded-xl bg-surface p-3 shadow-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "From a logged-in browser: Application → Cookies → espn_s2 and SWID. Stored only on this device."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "espn-s2",
								children: "espn_s2"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "espn-s2",
								autoCapitalize: "none",
								autoCorrect: "off",
								placeholder: "Cookie value",
								value: espnS2,
								onChange: (e) => setEspnS2(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "swid",
								children: "SWID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "swid",
								autoCapitalize: "none",
								autoCorrect: "off",
								placeholder: "{A1B2C3D4-...}",
								value: swid,
								onChange: (e) => setSwid(e.target.value)
							})]
						})
					]
				}) : null,
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-theirs",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "h-12 w-full",
					onClick: handleConnect,
					disabled: loading,
					children: loading ? "Connecting…" : "Continue"
				})
			]
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Which team is yours?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				"League ",
				pending?.leagueId,
				". This is the side we treat as you."
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1",
				children: teams.map((team) => {
					const selected = pending?.teamId === String(team.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => pickTeam(String(team.id)),
						className: cn("flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-3 text-left", selected ? "bg-primary text-primary-foreground" : "bg-surface text-fg shadow-border"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm font-medium",
								children: team.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs opacity-70",
								children: team.abbrev
							})]
						}), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 shrink-0" }) : null]
					}) }, team.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "mt-3 h-11 w-full",
				onClick: () => setStep("league"),
				children: "Back"
			})
		] }) })
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums", {
	variants: { variant: {
		default: "bg-subtle text-fg",
		muted: "bg-subtle text-muted",
		mine: "bg-mine text-mine-fg",
		theirs: "bg-theirs text-theirs-fg",
		shared: "bg-shared text-shared-fg",
		outline: "shadow-border text-muted"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function tagForm(tag, matchups) {
	const matchup = matchups.find((m) => m.id === tag.matchupId);
	if (!matchup || matchup.status === "pending" || matchup.status === "tied") return matchup?.status ?? "pending";
	if (tag.side === "mine") return matchup.status;
	return matchup.status === "winning" ? "losing" : "winning";
}
function cardForm(tags, matchups) {
	if (!tags?.length) return void 0;
	const forms = tags.map((t) => tagForm(t, matchups)).filter((s) => s === "winning" || s === "losing");
	if (!forms.length) return void 0;
	if (forms.every((s) => s === "winning")) return "winning";
	if (forms.every((s) => s === "losing")) return "losing";
	return "mixed";
}
function formatScore(n) {
	if (!Number.isFinite(n)) return "0";
	return n.toFixed(n % 1 === 0 ? 0 : 1);
}
function overlapTone(player) {
	const my = player.myCount || 0;
	const opp = player.oppCount || 0;
	if (my > opp) return "mine";
	if (opp > my) return "theirs";
	return "shared";
}
function PlayerCard({ player, overlap, matchups }) {
	const tone = overlap ? overlapTone(player) : void 0;
	const tags = player.tags?.length ? player.tags : (player.teamAbbr || "").split(",").filter(Boolean).map((abbrev) => ({
		abbrev,
		name: abbrev,
		side: "mine",
		platform: "sleeper",
		matchupId: ""
	}));
	const form = cardForm(player.tags, matchups);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("rounded-lg bg-surface px-3 py-3 shadow-border", tone === "mine" && "bg-mine-wash", tone === "theirs" && "bg-theirs-wash", tone === "shared" && "bg-shared-wash", form === "winning" && "shadow-win", form === "losing" && "shadow-lose", form === "mixed" && "shadow-mixed"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-start justify-between gap-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium text-fg",
						children: player.playerNameOnly
					}), player.count > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: tone ?? "muted",
						className: "shrink-0",
						children: ["×", player.count]
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 truncate text-xs text-muted tabular-nums",
					children: [player.nflTeam, player.kickoff ? ` · ${player.kickoff}` : ""]
				})]
			})
		}), tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex flex-wrap gap-1",
			children: tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				title: tag.name,
				className: cn("rounded-md px-1.5 py-0.5 font-mono text-[10px] tracking-wide", overlap && tag.side === "mine" && "bg-mine text-mine-fg", overlap && tag.side === "theirs" && "bg-theirs text-theirs-fg", (!overlap || tag.side !== "mine" && tag.side !== "theirs") && "bg-subtle text-muted"),
				children: tag.abbrev
			}, `${tag.matchupId}-${tag.side}-${tag.abbrev}`))
		}) : null]
	});
}
function groupByPosition(players) {
	const known = new Set(POSITION_ORDER);
	const groups = POSITION_ORDER.map((pos) => ({
		pos,
		players: players.filter((p) => p.position === pos)
	})).filter((g) => g.players.length > 0);
	const extra = players.filter((p) => !known.has(p.position));
	if (extra.length) groups.push({
		pos: "IDP",
		players: extra
	});
	return groups;
}
function Column({ title, hint, players, tone, overlap, matchups }) {
	const groups = groupByPosition(players);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-w-0 flex-1 flex-col rounded-2xl bg-elevated p-3 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: cn("flex items-center justify-between rounded-xl px-3 py-2.5", tone === "mine" && "bg-mine text-mine-fg", tone === "theirs" && "bg-theirs text-theirs-fg", tone === "shared" && "bg-shared text-shared-fg"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold leading-tight tracking-tight",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] opacity-80",
				children: hint
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-sm font-medium",
				children: players.length
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-1 flex-col gap-4",
			children: players.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 py-8 text-center text-sm text-muted",
				children: "No starters in this slot."
			}) : groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "px-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted",
					children: [
						POSITION_LABEL[group.pos] ?? group.pos,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [
								"(",
								group.players.length,
								")"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: group.players.map((player) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
						player,
						overlap,
						matchups
					}, `${player.id}-${player.platform}-${player.teamAbbr}`))
				})]
			}, group.pos))
		})]
	});
}
function LineupBoard({ my, overlap, opponent, matchups }) {
	const [col, setCol] = (0, import_react.useState)("my");
	const tabs = [
		{
			id: "my",
			label: "My guys",
			count: my.length
		},
		{
			id: "overlap",
			label: "Both",
			count: overlap.length
		},
		{
			id: "opponent",
			label: "Theirs",
			count: opponent.length
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-3 gap-1 rounded-xl bg-elevated p-1 shadow-border lg:hidden",
			children: tabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setCol(tab.id),
				className: cn("flex h-12 flex-col items-center justify-center rounded-lg text-xs font-medium", col === tab.id ? "bg-surface text-fg" : "text-muted"),
				children: [tab.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-[10px] opacity-70",
					children: tab.count
				})]
			}, tab.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-3 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn(col !== "my" && "hidden lg:block"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
						title: "My guys",
						hint: "You start them",
						players: my,
						tone: "mine",
						matchups
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn(col !== "overlap" && "hidden lg:block"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
						title: "Both",
						hint: "Started on both sides",
						players: overlap,
						tone: "shared",
						overlap: true,
						matchups
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn(col !== "opponent" && "hidden lg:block"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
						title: "Their guys",
						hint: "Opponent starts them",
						players: opponent,
						tone: "theirs",
						matchups
					})
				})
			]
		})]
	});
}
function SleeperAvatar({ name, avatar, size = "md" }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	const src = sleeperAvatarUrl(avatar);
	const dim = size === "sm" ? "size-8 text-[10px]" : "size-10 text-xs";
	if (!src || failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex shrink-0 items-center justify-center rounded-full bg-subtle font-medium text-fg", dim),
		"aria-hidden": true,
		children: initials(name)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		width: size === "sm" ? 32 : 40,
		height: size === "sm" ? 32 : 40,
		className: cn("shrink-0 rounded-full bg-subtle object-cover", dim),
		onError: () => setFailed(true)
	});
}
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	ref,
	className: cn("peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full shadow-border transition-colors duration-150", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:cursor-not-allowed disabled:opacity-50", "data-[state=checked]:bg-mine data-[state=unchecked]:bg-subtle", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block size-5 rounded-full bg-fg shadow-sm transition-transform duration-150", "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1") })
}));
Switch.displayName = Switch$1.displayName;
var ESPN_KEY = "mff.espn.credentials";
var SLEEPER_KEY = "mff.sleeper.usernames";
var ACCOUNTS_KEY = "mff.sleeper.accounts";
var RECENTS_KEY = "mff.sleeper.recents";
var PLATFORM_KEY = "mff.platform";
var IDP_KEY = "mff.showIdp";
function loadEspnCredentials() {
	try {
		const raw = localStorage.getItem(ESPN_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed?.leagueId) return null;
		return parsed;
	} catch {
		return null;
	}
}
function saveEspnCredentials(creds) {
	localStorage.setItem(ESPN_KEY, JSON.stringify(creds));
}
function clearEspnCredentials() {
	localStorage.removeItem(ESPN_KEY);
}
function loadSleeperUsernames() {
	try {
		return localStorage.getItem(SLEEPER_KEY) ?? "";
	} catch {
		return "";
	}
}
function saveSleeperUsernames(value) {
	localStorage.setItem(SLEEPER_KEY, value);
}
function slimAccount(account) {
	return {
		username: account.username,
		userId: account.userId,
		displayName: account.displayName,
		avatar: account.avatar ?? null,
		leagueIds: account.leagueIds ?? null
	};
}
function loadSleeperAccounts() {
	try {
		const raw = localStorage.getItem(ACCOUNTS_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) return parsed.filter((a) => a && typeof a.username === "string" && a.username.trim());
		}
	} catch {}
	return parseSleeperHandles(loadSleeperUsernames()).map((username) => ({ username }));
}
function saveSleeperAccounts(accounts) {
	const slim = accounts.map(slimAccount);
	localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(slim));
	saveSleeperUsernames(slim.map((a) => a.username).join(", "));
}
function loadSleeperRecents() {
	try {
		const raw = localStorage.getItem(RECENTS_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((r) => r && typeof r.username === "string").slice(0, 8);
	} catch {
		return [];
	}
}
function pushSleeperRecents(accounts) {
	const incoming = accounts.filter((a) => !a.missing).map((a) => ({
		username: a.username,
		displayName: a.displayName,
		avatar: a.avatar ?? null
	}));
	const seen = /* @__PURE__ */ new Set();
	const merged = [];
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
function savePlatform(platform) {
	localStorage.setItem(PLATFORM_KEY, platform);
}
function loadShowIdp() {
	try {
		const v = localStorage.getItem(IDP_KEY);
		if (v === "0") return false;
		if (v === "1") return true;
	} catch {}
	return true;
}
function saveShowIdp(value) {
	localStorage.setItem(IDP_KEY, value ? "1" : "0");
}
function useDebounced(value, ms) {
	const [v, setV] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => setV(value), ms);
		return () => window.clearTimeout(t);
	}, [value, ms]);
	return v;
}
function selectedCount(account) {
	if (!account.leagues) return null;
	if (account.leagueIds == null) return account.leagues.length;
	return account.leagues.filter((l) => account.leagueIds.includes(l.id)).length;
}
function applyLookup(account, info) {
	if (!info.found) return {
		...account,
		missing: true,
		leagues: []
	};
	return {
		...account,
		username: info.username || account.username,
		userId: info.userId,
		displayName: info.displayName,
		avatar: info.avatar ?? null,
		leagues: info.leagues,
		missing: false
	};
}
function TeamComposer({ season, accounts, onAccountsChange, espnCreds, espnTeams, onEspnOpen, onEspnTeamChange, onEspnDisconnect, showIdp, onShowIdp, loading, onAnalyze, onDemo, hasResult, onHide }) {
	const [draft, setDraft] = (0, import_react.useState)("");
	const [hydrating, setHydrating] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [previewStatus, setPreviewStatus] = (0, import_react.useState)("idle");
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const [flash, setFlash] = (0, import_react.useState)(null);
	const [recents, setRecents] = (0, import_react.useState)([]);
	const cache = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const accountsRef = (0, import_react.useRef)(accounts);
	accountsRef.current = accounts;
	const debouncedDraft = useDebounced(draft, 380);
	const addedKeys = (0, import_react.useMemo)(() => new Set(accounts.map((a) => a.username.toLowerCase())), [accounts]);
	(0, import_react.useEffect)(() => {
		setRecents(loadSleeperRecents());
	}, []);
	(0, import_react.useEffect)(() => {
		const need = accounts.filter((a) => !a.leagues && !a.missing && !cache.current.has(a.username.toLowerCase()));
		if (!need.length) return;
		const keys = need.map((a) => a.username.toLowerCase());
		setHydrating((prev) => /* @__PURE__ */ new Set([...prev, ...keys]));
		let cancelled = false;
		lookupSleeperUsers({ data: {
			usernames: need.map((a) => a.username),
			season
		} }).then((rows) => {
			if (cancelled) return;
			const byQuery = /* @__PURE__ */ new Map();
			for (const row of rows) {
				cache.current.set(row.query.toLowerCase(), row);
				cache.current.set(row.username.toLowerCase(), row);
				byQuery.set(row.query.toLowerCase(), row);
			}
			onAccountsChange(accountsRef.current.map((account) => {
				const info = byQuery.get(account.username.toLowerCase()) || cache.current.get(account.username.toLowerCase());
				return info ? applyLookup(account, info) : account;
			}));
		}).catch(() => void 0).finally(() => {
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
	}, [accounts.map((a) => a.username).join("|"), season]);
	(0, import_react.useEffect)(() => {
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
		lookupSleeperUsers({ data: {
			usernames: [handle],
			season
		} }).then((rows) => {
			if (cancelled) return;
			const row = rows[0];
			if (row) {
				cache.current.set(handle.toLowerCase(), row);
				cache.current.set(row.username.toLowerCase(), row);
				setPreview(row);
			} else setPreview({
				found: false,
				query: handle,
				username: handle,
				leagues: []
			});
			setPreviewStatus("ready");
		}).catch(() => {
			if (!cancelled) {
				setPreview(null);
				setPreviewStatus("idle");
			}
		});
		return () => {
			cancelled = true;
		};
	}, [
		debouncedDraft,
		season,
		addedKeys
	]);
	function persist(next) {
		onAccountsChange(next);
		setRecents(pushSleeperRecents(next));
	}
	function addHandles(raw) {
		const handles = parseSleeperHandles(raw);
		if (!handles.length) return false;
		let next = accounts;
		let added = false;
		let duplicate = null;
		for (const handle of handles) {
			const key = handle.toLowerCase();
			if (next.some((a) => a.username.toLowerCase() === key)) {
				duplicate = handle;
				continue;
			}
			const cached = cache.current.get(key);
			const seed = { username: handle };
			next = [...next, cached ? applyLookup(seed, cached) : seed];
			added = true;
		}
		if (added) persist(next);
		if (duplicate && !added) {
			setFlash(duplicate.toLowerCase());
			window.setTimeout(() => setFlash(null), 700);
			document.getElementById(`account-${duplicate.toLowerCase()}`)?.scrollIntoView({
				behavior: "smooth",
				block: "nearest"
			});
		}
		setDraft("");
		setPreview(null);
		setPreviewStatus("idle");
		return added || Boolean(duplicate);
	}
	function removeAccount(username) {
		persist(accounts.filter((a) => a.username.toLowerCase() !== username.toLowerCase()));
		if (expanded?.toLowerCase() === username.toLowerCase()) setExpanded(null);
	}
	function setLeagueIds(username, leagueIds) {
		persist(accounts.map((a) => a.username.toLowerCase() === username.toLowerCase() ? {
			...a,
			leagueIds
		} : a));
	}
	const sleeperTeams = accounts.reduce((sum, a) => sum + (selectedCount(a) ?? 0), 0);
	const espnOn = Boolean(espnCreds);
	const teamCount = sleeperTeams + (espnOn ? 1 : 0);
	const canAnalyze = accounts.some((a) => !a.missing) || espnOn;
	const selectedEspnTeam = espnTeams.find((t) => String(t.id) === espnCreds?.teamId);
	const visibleRecents = recents.filter((r) => !addedKeys.has(r.username.toLowerCase())).slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-5 rounded-2xl bg-elevated p-4 shadow-border sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold tracking-tight text-fg",
					children: "Your teams"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-sm text-muted",
					children: "Add every Sleeper account you play under. We’ll pull this week’s lineups."
				})] }), teamCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "shrink-0 pb-0.5 text-xs tabular-nums text-muted",
					children: [
						teamCount,
						" ",
						teamCount === 1 ? "team" : "teams"
					]
				}) : null]
			}),
			accounts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: accounts.map((account) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountRow, {
					account,
					loading: hydrating.has(account.username.toLowerCase()),
					expanded: expanded?.toLowerCase() === account.username.toLowerCase(),
					flashed: flash === account.username.toLowerCase(),
					onToggle: () => setExpanded((cur) => cur?.toLowerCase() === account.username.toLowerCase() ? null : account.username),
					onRemove: () => removeAccount(account.username),
					onLeagueIds: (ids) => setLeagueIds(account.username, ids)
				}, account.username))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4",
				onSubmit: (e) => {
					e.preventDefault();
					addHandles(draft);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "sleeper-handle",
					className: "sr-only",
					children: "Sleeper username"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "sleeper-handle",
						name: "sleeper-handle",
						autoCapitalize: "none",
						autoCorrect: "off",
						autoComplete: "off",
						spellCheck: false,
						enterKeyHint: "go",
						placeholder: accounts.length ? "Add another username" : "Sleeper username",
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						onPaste: (e) => {
							const text = e.clipboardData.getData("text");
							if (parseSleeperHandles(text).length > 1) {
								e.preventDefault();
								addHandles(text);
							}
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						variant: "secondary",
						disabled: !draft.trim(),
						className: "h-12 shrink-0 px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add"]
					})]
				})]
			}),
			previewStatus === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted",
				children: [
					"Looking up ",
					parseSleeperHandles(draft)[0] || "that account",
					"…"
				]
			}) : null,
			previewStatus === "ready" && preview && !addedKeys.has(preview.username.toLowerCase()) ? preview.found ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => addHandles(preview.username),
				className: "mt-2 flex min-h-14 w-full items-center gap-3 rounded-xl bg-surface px-3 text-left shadow-border transition-[background-color] duration-150 hover:bg-subtle",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SleeperAvatar, {
						name: preview.displayName || preview.username,
						avatar: preview.avatar
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm font-medium text-fg",
							children: preview.displayName || preview.username
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block truncate text-xs text-muted",
							children: [
								"@",
								preview.username,
								preview.leagues.length ? ` · ${preview.leagues.length} ${preview.leagues.length === 1 ? "league" : "leagues"}` : " · no 2026 leagues yet"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-fg",
						children: "Add"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-theirs",
				children: [
					"No Sleeper account named “",
					preview.query,
					"”."
				]
			}) : null,
			visibleRecents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted",
					children: "Recent"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
					children: visibleRecents.map((recent) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => addHandles(recent.username),
						className: "flex h-11 shrink-0 items-center gap-2 rounded-full bg-surface py-1 pl-1 pr-3 shadow-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SleeperAvatar, {
							name: recent.displayName || recent.username,
							avatar: recent.avatar,
							size: "sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-fg",
							children: recent.displayName || recent.username
						})]
					}, recent.username))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: espnCreds ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-3 shadow-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-subtle text-[10px] font-semibold tracking-wide text-fg",
								children: "ESPN"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-sm font-medium text-fg",
									children: ["League ", espnCreds.leagueId]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted",
									children: [espnCreds.espn_s2 || espnCreds.swid ? "Private" : "Public", selectedEspnTeam ? ` · ${selectedEspnTeam.name}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: onEspnOpen,
								className: "shrink-0",
								children: "Edit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Remove ESPN league",
								onClick: onEspnDisconnect,
								className: "flex size-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-fg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})
						]
					}), espnTeams.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Your ESPN team"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-12 w-full rounded-lg bg-elevated px-3 text-base text-fg shadow-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							value: espnCreds.teamId || "",
							onChange: (e) => onEspnTeamChange(e.target.value),
							children: espnTeams.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: String(team.id),
								children: [
									team.name,
									" (",
									team.abbrev,
									")"
								]
							}, team.id))
						})]
					}) : null]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onEspnOpen,
					className: "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-surface text-sm text-fg shadow-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add an ESPN league"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2.5 shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg",
					children: "IDP players"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Linebackers, DL, and DBs"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: showIdp,
					onCheckedChange: onShowIdp,
					"aria-label": "Show IDP players"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky bottom-0 z-10 -mx-4 mt-4 border-t border-border bg-elevated px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onAnalyze,
					disabled: loading || !canAnalyze,
					className: "h-12 w-full",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Analyzing"] }) : teamCount > 0 ? `Analyze ${teamCount} ${teamCount === 1 ? "team" : "teams"}` : "Analyze lineups"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: onDemo,
						disabled: loading,
						className: "h-11 flex-1",
						children: "Sample slate"
					}), hasResult && onHide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: onHide,
						className: "h-11 flex-1",
						children: "Hide"
					}) : null]
				})]
			})
		]
	});
}
function AccountRow({ account, loading, expanded, flashed, onToggle, onRemove, onLeagueIds }) {
	const count = selectedCount(account);
	const title = account.displayName || account.username;
	const leagues = account.leagues || [];
	const allSelected = account.leagueIds == null || leagues.length > 0 && count === leagues.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		id: `account-${account.username.toLowerCase()}`,
		className: cn("rounded-xl bg-surface shadow-border transition-[box-shadow] duration-200", flashed && "shadow-win", account.missing && "shadow-lose"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-14 items-center gap-2 pr-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onToggle,
				className: "flex min-w-0 flex-1 items-center gap-3 py-2 pl-3 text-left",
				"aria-expanded": expanded,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SleeperAvatar, {
						name: title,
						avatar: account.avatar
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm font-medium text-fg",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-xs text-muted",
							children: loading ? "Finding leagues…" : account.missing ? "Not found on Sleeper" : count == null ? `@${account.username}` : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"@",
								account.username,
								" · ",
								allSelected ? "All " : "",
								count,
								" ",
								count === 1 ? "league" : "leagues"
							] })
						})]
					}),
					leagues.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 shrink-0 text-muted transition-transform duration-200", expanded && "rotate-180") }) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `Remove ${title}`,
				onClick: onRemove,
				className: "flex size-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("grid transition-[grid-template-rows] duration-200 ease-out", expanded && leagues.length ? "grid-rows-[1fr]" : "grid-rows-[0fr]"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-2 py-2",
					children: [leagues.length > 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex gap-1 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-9 rounded-lg px-2 text-xs text-muted hover:text-fg",
							onClick: () => onLeagueIds(null),
							children: "All"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-9 rounded-lg px-2 text-xs text-muted hover:text-fg",
							onClick: () => onLeagueIds([]),
							children: "None"
						})]
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-0.5",
						children: leagues.map((league) => {
							const on = account.leagueIds == null || account.leagueIds.includes(league.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									const current = account.leagueIds == null ? leagues.map((l) => l.id) : [...account.leagueIds];
									const next = on ? current.filter((id) => id !== league.id) : [...current, league.id];
									onLeagueIds(next.length === leagues.length ? null : next);
								},
								className: "flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left hover:bg-subtle",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("flex size-5 shrink-0 items-center justify-center rounded-md shadow-border", on ? "bg-primary text-primary-foreground" : "bg-elevated text-transparent"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate text-sm text-fg",
										children: league.name
									}),
									league.size ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs tabular-nums text-muted",
										children: league.size
									}) : null
								]
							}) }, league.id);
						})
					})]
				})
			})
		})]
	});
}
function TeamSummary({ accounts, espnCreds, espnLabel, onClick }) {
	const teamCount = accounts.reduce((sum, a) => sum + (selectedCount(a) ?? 0), 0) + (espnCreds ? 1 : 0);
	const faces = accounts.slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "mb-4 flex min-h-14 w-full items-center gap-3 rounded-2xl bg-elevated px-3 text-left shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 -space-x-2",
				children: [faces.map((account) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full ring-2 ring-elevated",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SleeperAvatar, {
						name: account.displayName || account.username,
						avatar: account.avatar,
						size: "sm"
					})
				}, account.username)), espnCreds ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex size-8 items-center justify-center rounded-full bg-subtle text-[10px] font-semibold tracking-wide text-fg ring-2 ring-elevated",
					children: "ESPN"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-sm font-medium text-fg",
					children: teamCount > 0 ? `${teamCount} ${teamCount === 1 ? "team" : "teams"}` : "Your teams"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-xs text-muted",
					children: espnLabel || "Tap to edit accounts"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 shrink-0 text-muted" })
		]
	});
}
function ScoresBoard({ matchups }) {
	if (!matchups.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "rounded-2xl bg-elevated px-4 py-10 text-center shadow-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "No matchups yet. Analyze lineups to see live scores."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: matchups.map((m) => {
			const opp = m.oppTeam;
			const mineLead = m.status === "winning";
			const theirsLead = m.status === "losing";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl bg-elevated p-3 shadow-border sm:p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[11px] font-medium uppercase tracking-[0.14em] text-muted",
							children: m.leagueName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "muted",
							children: m.platform === "espn" ? "ESPN" : "Sleeper"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[1fr_auto_1fr] items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("min-w-0 rounded-xl px-3 py-2.5", mineLead ? "bg-mine text-mine-fg" : "bg-surface"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-display text-base font-semibold tracking-tight",
										children: m.myTeam.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[10px] tracking-wide opacity-70",
										children: m.myTeam.abbrev
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-display text-2xl font-semibold tabular-nums leading-none",
										children: formatScore(m.myTeam.score)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-muted",
								children: "vs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("min-w-0 rounded-xl px-3 py-2.5 text-right", theirsLead ? "bg-theirs text-theirs-fg" : "bg-surface"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-display text-base font-semibold tracking-tight",
										children: opp?.name ?? "Bye"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[10px] tracking-wide opacity-70",
										children: opp?.abbrev ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-display text-2xl font-semibold tabular-nums leading-none",
										children: opp ? formatScore(opp.score) : "—"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-center text-[11px] text-muted",
						children: m.status === "winning" ? "You’re ahead" : m.status === "losing" ? "You’re behind" : m.status === "tied" ? "Tied" : "Waiting on kickoff"
					})
				]
			}, m.id);
		})
	});
}
function TimeSlotBar({ value, onChange, counts, liveCount = 0 }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const windowSelected = value !== "All" && value !== "Live";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			role: "tablist",
			"aria-label": "Kickoff window",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": value === "Live",
					onClick: () => onChange("Live"),
					className: cn("flex h-11 min-w-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm", "transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96]", value === "Live" ? "bg-mine text-mine-fg" : "bg-surface text-muted shadow-border hover:text-fg"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: cn("size-3.5", liveCount > 0 && value !== "Live" && "text-mine") }),
						"Live",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums opacity-80",
							children: liveCount
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					"aria-selected": value === "All",
					onClick: () => onChange("All"),
					className: cn("h-11 shrink-0 rounded-full px-4 text-sm", "transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96]", value === "All" ? "bg-primary text-primary-foreground" : "bg-surface text-muted shadow-border hover:text-fg"),
					children: "All"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-expanded": open,
					onClick: () => setOpen((v) => !v),
					className: cn("flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-sm", "transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96]", windowSelected ? "bg-primary text-primary-foreground" : "bg-surface text-muted shadow-border hover:text-fg"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: windowSelected ? value : "Other windows"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 shrink-0 transition-transform duration-150", open && "rotate-180") })]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
			children: KICKOFF_WINDOWS.map((slot) => {
				const selected = value === slot;
				const count = counts?.[slot];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						onChange(slot);
						setOpen(false);
					},
					className: cn("flex h-11 items-center justify-between rounded-xl px-3 text-left text-sm", selected ? "bg-primary text-primary-foreground" : "bg-surface text-fg shadow-border"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: slot
					}), typeof count === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-xs opacity-70",
						children: count
					}) : null]
				}, slot);
			})
		}) : null]
	});
}
function tags(...items) {
	return items;
}
function p(partial) {
	return {
		count: 0,
		platform: "sleeper",
		playerNameOnly: partial.name,
		...partial
	};
}
var my = [
	p({
		id: "demo-maye",
		name: "D. Maye",
		position: "QB",
		teamAbbr: "KINGS,SUNSET",
		nflTeam: "NE",
		count: 2,
		tags: tags({
			abbrev: "KINGS",
			name: "Kings",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-kings"
		}, {
			abbrev: "SUNSET",
			name: "Sunset",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-sunset"
		})
	}),
	p({
		id: "demo-allen",
		name: "J. Allen",
		position: "QB",
		teamAbbr: "KINGS",
		nflTeam: "BUF",
		tags: tags({
			abbrev: "KINGS",
			name: "Kings",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-kings"
		})
	}),
	p({
		id: "demo-achane",
		name: "D. Achane",
		position: "RB",
		teamAbbr: "KINGS,SUNSET",
		nflTeam: "MIA",
		count: 2,
		tags: tags({
			abbrev: "KINGS",
			name: "Kings",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-kings"
		}, {
			abbrev: "SUNSET",
			name: "Sunset",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-sunset"
		})
	}),
	p({
		id: "demo-gibbs",
		name: "J. Gibbs",
		position: "RB",
		teamAbbr: "SUNSET",
		nflTeam: "DET",
		tags: tags({
			abbrev: "SUNSET",
			name: "Sunset",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-sunset"
		})
	}),
	p({
		id: "demo-chase",
		name: "J. Chase",
		position: "WR",
		teamAbbr: "KINGS",
		nflTeam: "CIN",
		tags: tags({
			abbrev: "KINGS",
			name: "Kings",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-kings"
		})
	}),
	p({
		id: "demo-arsb",
		name: "A. St. Brown",
		position: "WR",
		teamAbbr: "SUNSET",
		nflTeam: "DET",
		tags: tags({
			abbrev: "SUNSET",
			name: "Sunset",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-sunset"
		})
	}),
	p({
		id: "demo-btj",
		name: "B. Thomas Jr.",
		position: "WR",
		teamAbbr: "KINGS",
		nflTeam: "JAX",
		tags: tags({
			abbrev: "KINGS",
			name: "Kings",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-kings"
		})
	}),
	p({
		id: "demo-bowers",
		name: "B. Bowers",
		position: "TE",
		teamAbbr: "SUNSET",
		nflTeam: "LV",
		tags: tags({
			abbrev: "SUNSET",
			name: "Sunset",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-sunset"
		})
	}),
	p({
		id: "demo-aubrey",
		name: "B. Aubrey",
		position: "K",
		teamAbbr: "KINGS",
		nflTeam: "DAL",
		tags: tags({
			abbrev: "KINGS",
			name: "Kings",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-kings"
		})
	}),
	p({
		id: "demo-bills",
		name: "Buffalo",
		position: "DEF",
		teamAbbr: "SUNSET",
		nflTeam: "BUF",
		tags: tags({
			abbrev: "SUNSET",
			name: "Sunset",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-sunset"
		})
	}),
	p({
		id: "demo-parsons",
		name: "M. Parsons",
		position: "LB",
		teamAbbr: "KINGS",
		nflTeam: "GB",
		tags: tags({
			abbrev: "KINGS",
			name: "Kings",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-kings"
		})
	}),
	p({
		id: "demo-hutch",
		name: "A. Hutchinson",
		position: "DL",
		teamAbbr: "SUNSET",
		nflTeam: "DET",
		tags: tags({
			abbrev: "SUNSET",
			name: "Sunset",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-sunset"
		})
	})
];
var overlap = [
	p({
		id: "demo-cmc",
		name: "C. McCaffrey",
		position: "RB",
		teamAbbr: "KINGS,THEBOY",
		nflTeam: "SF",
		platform: "both",
		myCount: 2,
		oppCount: 1,
		count: 3,
		tags: tags({
			abbrev: "KINGS",
			name: "Kings",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-kings"
		}, {
			abbrev: "THEBOY",
			name: "The Boys",
			side: "theirs",
			platform: "sleeper",
			matchupId: "demo-kings"
		})
	}),
	p({
		id: "demo-jj",
		name: "J. Jefferson",
		position: "WR",
		teamAbbr: "KINGS,RIVERS",
		nflTeam: "MIN",
		platform: "both",
		myCount: 1,
		oppCount: 1,
		count: 2,
		tags: tags({
			abbrev: "KINGS",
			name: "Kings",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-kings"
		}, {
			abbrev: "RIVERS",
			name: "Rivers",
			side: "theirs",
			platform: "sleeper",
			matchupId: "demo-sunset"
		})
	}),
	p({
		id: "demo-lamb",
		name: "C. Lamb",
		position: "WR",
		teamAbbr: "SUNSET,THEBOY",
		nflTeam: "DAL",
		platform: "both",
		myCount: 1,
		oppCount: 2,
		count: 3,
		tags: tags({
			abbrev: "SUNSET",
			name: "Sunset",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-sunset"
		}, {
			abbrev: "THEBOY",
			name: "The Boys",
			side: "theirs",
			platform: "sleeper",
			matchupId: "demo-kings"
		})
	}),
	p({
		id: "demo-kelce",
		name: "T. Kelce",
		position: "TE",
		teamAbbr: "KINGS,RIVERS",
		nflTeam: "KC",
		platform: "both",
		myCount: 1,
		oppCount: 1,
		count: 2,
		tags: tags({
			abbrev: "KINGS",
			name: "Kings",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-kings"
		}, {
			abbrev: "RIVERS",
			name: "Rivers",
			side: "theirs",
			platform: "sleeper",
			matchupId: "demo-sunset"
		})
	}),
	p({
		id: "demo-walker",
		name: "K. Walker",
		position: "RB",
		teamAbbr: "KINGS,THEBOY",
		nflTeam: "SEA",
		platform: "both",
		myCount: 1,
		oppCount: 1,
		count: 2,
		tags: tags({
			abbrev: "KINGS",
			name: "Kings",
			side: "mine",
			platform: "sleeper",
			matchupId: "demo-kings"
		}, {
			abbrev: "THEBOY",
			name: "The Boys",
			side: "theirs",
			platform: "sleeper",
			matchupId: "demo-kings"
		})
	})
];
var DEMO_RESULT = {
	my,
	opponent: [
		p({
			id: "demo-hurts",
			name: "J. Hurts",
			position: "QB",
			teamAbbr: "THEBOY",
			nflTeam: "PHI",
			tags: tags({
				abbrev: "THEBOY",
				name: "The Boys",
				side: "theirs",
				platform: "sleeper",
				matchupId: "demo-kings"
			})
		}),
		p({
			id: "demo-nix",
			name: "B. Nix",
			position: "QB",
			teamAbbr: "RIVERS",
			nflTeam: "DEN",
			tags: tags({
				abbrev: "RIVERS",
				name: "Rivers",
				side: "theirs",
				platform: "sleeper",
				matchupId: "demo-sunset"
			})
		}),
		p({
			id: "demo-saquon",
			name: "S. Barkley",
			position: "RB",
			teamAbbr: "THEBOY,RIVERS",
			nflTeam: "PHI",
			count: 2,
			tags: tags({
				abbrev: "THEBOY",
				name: "The Boys",
				side: "theirs",
				platform: "sleeper",
				matchupId: "demo-kings"
			}, {
				abbrev: "RIVERS",
				name: "Rivers",
				side: "theirs",
				platform: "sleeper",
				matchupId: "demo-sunset"
			})
		}),
		p({
			id: "demo-puka",
			name: "P. Nacua",
			position: "WR",
			teamAbbr: "THEBOY",
			nflTeam: "LAR",
			tags: tags({
				abbrev: "THEBOY",
				name: "The Boys",
				side: "theirs",
				platform: "sleeper",
				matchupId: "demo-kings"
			})
		}),
		p({
			id: "demo-mhj",
			name: "M. Harrison Jr.",
			position: "WR",
			teamAbbr: "RIVERS",
			nflTeam: "ARI",
			tags: tags({
				abbrev: "RIVERS",
				name: "Rivers",
				side: "theirs",
				platform: "sleeper",
				matchupId: "demo-sunset"
			})
		}),
		p({
			id: "demo-jsw",
			name: "J. Smith-Njigba",
			position: "WR",
			teamAbbr: "THEBOY",
			nflTeam: "SEA",
			tags: tags({
				abbrev: "THEBOY",
				name: "The Boys",
				side: "theirs",
				platform: "sleeper",
				matchupId: "demo-kings"
			})
		}),
		p({
			id: "demo-mcbride",
			name: "T. McBride",
			position: "TE",
			teamAbbr: "THEBOY",
			nflTeam: "ARI",
			tags: tags({
				abbrev: "THEBOY",
				name: "The Boys",
				side: "theirs",
				platform: "sleeper",
				matchupId: "demo-kings"
			})
		}),
		p({
			id: "demo-tucker",
			name: "J. Tucker",
			position: "K",
			teamAbbr: "RIVERS",
			nflTeam: "BAL",
			tags: tags({
				abbrev: "RIVERS",
				name: "Rivers",
				side: "theirs",
				platform: "sleeper",
				matchupId: "demo-sunset"
			})
		}),
		p({
			id: "demo-eagles",
			name: "Philadelphia",
			position: "DEF",
			teamAbbr: "THEBOY",
			nflTeam: "PHI",
			tags: tags({
				abbrev: "THEBOY",
				name: "The Boys",
				side: "theirs",
				platform: "sleeper",
				matchupId: "demo-kings"
			})
		}),
		p({
			id: "demo-crosby",
			name: "M. Crosby",
			position: "DL",
			teamAbbr: "THEBOY",
			nflTeam: "LV",
			tags: tags({
				abbrev: "THEBOY",
				name: "The Boys",
				side: "theirs",
				platform: "sleeper",
				matchupId: "demo-kings"
			})
		})
	],
	overlap,
	matchups: [{
		id: "demo-kings",
		platform: "sleeper",
		leagueName: "Sibling Rivalry",
		myTeam: {
			name: "Kings",
			abbrev: "KINGS",
			score: 104.2
		},
		oppTeam: {
			name: "The Boys",
			abbrev: "THEBOY",
			score: 91
		},
		status: "winning"
	}, {
		id: "demo-sunset",
		platform: "sleeper",
		leagueName: "The Degenerates",
		myTeam: {
			name: "Sunset",
			abbrev: "SUNSET",
			score: 78.4
		},
		oppTeam: {
			name: "Rivers",
			abbrev: "RIVERS",
			score: 88.1
		},
		status: "losing"
	}],
	meta: {
		week: 1,
		season: "2026",
		sleeperLeagues: 2,
		espnUsed: false,
		warnings: ["Sample Week 1 slate — connect Sleeper or ESPN to analyze your real lineups."],
		liveTeams: ["SEA", "NE"]
	}
};
function annotatePlayers(players, bootstrap, week) {
	if (!bootstrap) return players;
	return players.map((player) => {
		const game = findGameForTeam(bootstrap.schedule, week, player.nflTeam);
		return {
			...player,
			kickoff: game ? kickoffLabel(game.start_time) : player.nflTeam && player.nflTeam !== "FA" ? "Bye" : player.kickoff,
			slot: game ? classifySlot(game) : player.slot
		};
	});
}
function applyPlayerFilters(players, opts) {
	let list = players;
	if (!opts.showIdp) list = list.filter((p) => !isIdpPosition(p.position));
	if (opts.filter === "All") return list;
	if (opts.filter === "Live") return list.filter((p) => opts.liveTeams.has(normalizeNflTeam(p.nflTeam)));
	return list.filter((p) => opts.teams.has(normalizeNflTeam(p.nflTeam)));
}
function slotCounts(result, bootstrap, week, showIdp) {
	const all = [
		...result.my,
		...result.overlap,
		...result.opponent
	].filter((p) => showIdp || !isIdpPosition(p.position));
	const counts = { All: all.length };
	if (!bootstrap) return counts;
	for (const slot of TIME_SLOTS) {
		if (slot === "All") continue;
		const teams = teamsInSlot(bootstrap.schedule, week, slot);
		counts[slot] = all.filter((p) => teams.has(normalizeNflTeam(p.nflTeam))).length;
	}
	return counts;
}
function derivePlatform(accounts, espn) {
	const sleeper = accounts.some((a) => !a.missing);
	if (sleeper && espn) return "both";
	if (espn && !sleeper) return "espn";
	return "sleeper";
}
function HomeScreen() {
	const [bootstrap, setBootstrap] = (0, import_react.useState)(null);
	const [bootError, setBootError] = (0, import_react.useState)(null);
	const [accounts, setAccounts] = (0, import_react.useState)([]);
	const [week, setWeek] = (0, import_react.useState)(1);
	const [espnCreds, setEspnCreds] = (0, import_react.useState)(null);
	const [espnTeams, setEspnTeams] = (0, import_react.useState)([]);
	const [espnOpen, setEspnOpen] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const [showIdp, setShowIdp] = (0, import_react.useState)(true);
	const [view, setView] = (0, import_react.useState)("lineups");
	(0, import_react.useEffect)(() => {
		setAccounts(loadSleeperAccounts());
		setShowIdp(loadShowIdp());
		const stored = loadEspnCredentials();
		if (stored) {
			setEspnCreds(stored);
			getEspnTeams({ data: {
				leagueId: stored.leagueId,
				espn_s2: stored.espn_s2 || void 0,
				swid: stored.swid || void 0
			} }).then((r) => setEspnTeams(r.teams)).catch(() => void 0);
		}
		getBootstrap().then((data) => {
			setBootstrap(data);
			setWeek(data.state.week || 1);
		}).catch((err) => {
			setBootError(err instanceof Error ? err.message : "Could not load NFL week.");
		});
	}, []);
	const season = bootstrap?.state.season || String(2026);
	const platform = derivePlatform(accounts, espnCreds);
	const liveTeams = (0, import_react.useMemo)(() => {
		const fromResult = result?.meta.liveTeams || [];
		const fromBoot = bootstrap?.liveTeams || [];
		return new Set((fromResult.length ? fromResult : fromBoot).map(normalizeNflTeam));
	}, [result, bootstrap]);
	const filtered = (0, import_react.useMemo)(() => {
		if (!result) return null;
		const teams = filter !== "All" && filter !== "Live" ? teamsInSlot(bootstrap?.schedule || [], result.meta.week, filter) : /* @__PURE__ */ new Set();
		const opts = {
			filter,
			teams,
			liveTeams,
			showIdp
		};
		return {
			my: applyPlayerFilters(result.my, opts),
			overlap: applyPlayerFilters(result.overlap, opts),
			opponent: applyPlayerFilters(result.opponent, opts)
		};
	}, [
		result,
		filter,
		bootstrap,
		liveTeams,
		showIdp
	]);
	const counts = result ? slotCounts(result, bootstrap, result.meta.week, showIdp) : void 0;
	const livePlayerCount = result ? [
		...result.my,
		...result.overlap,
		...result.opponent
	].filter((p) => (showIdp || !isIdpPosition(p.position)) && liveTeams.has(normalizeNflTeam(p.nflTeam))).length : 0;
	function persistAccounts(next) {
		setAccounts(next);
		saveSleeperAccounts(next);
	}
	function persistIdp(next) {
		setShowIdp(next);
		saveShowIdp(next);
	}
	async function handleAnalyze() {
		if (!accounts.some((a) => !a.missing) && !espnCreds) {
			toast.error("Add a Sleeper username or an ESPN league.");
			return;
		}
		setLoading(true);
		try {
			saveSleeperAccounts(accounts);
			savePlatform(platform);
			const data = await runAnalysis({ data: {
				platform,
				week,
				sleeperAccounts: accounts.filter((a) => !a.missing).map((a) => ({
					username: a.username,
					leagueIds: a.leagueIds ?? null
				})),
				espn: espnCreds ? {
					leagueId: espnCreds.leagueId,
					teamId: espnCreds.teamId,
					espn_s2: espnCreds.espn_s2 || void 0,
					swid: espnCreds.swid || void 0
				} : void 0
			} });
			setResult(data);
			setCollapsed(true);
			setView("lineups");
			for (const warning of data.meta.warnings) toast.message(warning);
			toast.success(`Week ${data.meta.week} · ${data.my.length} yours, ${data.overlap.length} shared, ${data.opponent.length} theirs`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Analysis failed.");
		} finally {
			setLoading(false);
		}
	}
	function loadDemo() {
		const w = week;
		const demo = {
			my: annotatePlayers(DEMO_RESULT.my, bootstrap, w),
			opponent: annotatePlayers(DEMO_RESULT.opponent, bootstrap, w),
			overlap: annotatePlayers(DEMO_RESULT.overlap, bootstrap, w),
			matchups: DEMO_RESULT.matchups,
			meta: {
				...DEMO_RESULT.meta,
				week: w,
				season
			}
		};
		setResult(demo);
		setCollapsed(true);
		setFilter("All");
		setView("lineups");
		toast.message("Sample Week 1 slate — connect a real league to replace it.");
	}
	function handleEspnConnected(creds, teams) {
		setEspnCreds(creds);
		setEspnTeams(teams);
		saveEspnCredentials(creds);
		toast.success(`Connected ESPN league ${creds.leagueId}`);
	}
	function disconnectEspn() {
		clearEspnCredentials();
		setEspnCreds(null);
		setEspnTeams([]);
	}
	const showComposer = !collapsed || !result;
	const showNav = Boolean(result) && collapsed;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pt-4 sm:px-6 sm:pb-16 sm:pt-6", showNav ? "pb-28" : "pb-8"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 -mx-4 mb-4 bg-bg/90 px-4 py-3 backdrop-blur-sm sm:static sm:mx-0 sm:mb-8 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] font-medium uppercase tracking-[0.22em] text-muted",
							children: ["NFL ", season]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl",
							children: "My Fantasy Focus"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex h-12 shrink-0 items-center gap-2 rounded-xl bg-surface px-3 text-base shadow-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-wide text-muted",
							children: "Wk"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "bg-transparent text-fg tabular-nums focus:outline-none",
							value: week,
							onChange: (e) => setWeek(Number(e.target.value)),
							"aria-label": "NFL week",
							children: Array.from({ length: 18 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: n,
								className: "bg-elevated text-fg",
								children: n
							}, n))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 hidden max-w-2xl text-sm text-muted text-pretty sm:block",
					children: [
						"Stack every Sleeper and ESPN lineup, then see who you and your opponent both started. Season opens",
						" ",
						SEASON_START_LABEL,
						"."
					]
				})]
			}),
			bootError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm text-theirs",
				children: bootError
			}) : null,
			result && collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamSummary, {
				accounts,
				espnCreds,
				espnLabel: "Tap to edit accounts",
				onClick: () => setCollapsed(false)
			}) : null,
			showComposer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamComposer, {
				season,
				accounts,
				onAccountsChange: persistAccounts,
				espnCreds,
				espnTeams,
				onEspnOpen: () => setEspnOpen(true),
				onEspnTeamChange: (teamId) => {
					if (!espnCreds) return;
					const next = {
						...espnCreds,
						teamId
					};
					setEspnCreds(next);
					saveEspnCredentials(next);
				},
				onEspnDisconnect: disconnectEspn,
				showIdp,
				onShowIdp: persistIdp,
				loading,
				onAnalyze: handleAnalyze,
				onDemo: loadDemo,
				hasResult: Boolean(result),
				onHide: result ? () => setCollapsed(true) : void 0
			}) : null,
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden grid-cols-2 gap-1 rounded-xl bg-elevated p-1 shadow-border sm:grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewTab, {
						active: view === "lineups",
						onClick: () => setView("lineups"),
						icon: "lineups",
						label: "Lineups"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewTab, {
						active: view === "scores",
						onClick: () => setView("scores"),
						icon: "scores",
						label: "Scores"
					})]
				}), view === "lineups" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeSlotBar, {
						value: filter,
						onChange: setFilter,
						counts,
						liveCount: livePlayerCount
					}),
					result.meta.warnings.length > 0 && collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted text-pretty",
						children: result.meta.warnings[0]
					}) : null,
					filtered ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupBoard, {
						my: filtered.my,
						overlap: filtered.overlap,
						opponent: filtered.opponent,
						matchups: result.matchups
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-1 text-center text-xs text-muted",
						children: "Green outline = that fantasy team is winning. Red = losing. In Both, green chips are yours and red chips are the opponent."
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoresBoard, { matchups: result.matchups })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { onDemo: loadDemo }),
			showNav ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] sm:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setView("lineups"),
						className: cn("flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", view === "lineups" ? "text-fg" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-5" }), "Lineups"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setView("scores"),
						className: cn("flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", view === "scores" ? "text-fg" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-5" }), "Scores"]
					})]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EspnDialog, {
				open: espnOpen,
				onOpenChange: setEspnOpen,
				onConnected: handleEspnConnected,
				initial: espnCreds
			})
		]
	});
}
function ViewTab({ active, onClick, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-medium", active ? "bg-surface text-fg" : "text-muted hover:text-fg"),
		children: [icon === "lineups" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4" }), label]
	});
}
function EmptyState({ onDemo }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted sm:hidden",
				children: "Add a username, pick the leagues you care about, then analyze this week’s slate."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden gap-3 sm:grid sm:grid-cols-3",
				children: [
					{
						title: "Pull every league",
						body: "Drop in Sleeper usernames and we walk each 2026 roster versus this week’s opponent."
					},
					{
						title: "Spot the overlap",
						body: "Players you both started land in Both — color-coded by who started them more often."
					},
					{
						title: "Live windows",
						body: "Jump to games on now, or open other kickoff windows. Watch scores while you wait."
					}
				].map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-2xl bg-elevated p-5 shadow-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold tracking-tight text-fg",
						children: card.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted text-pretty",
						children: card.body
					})]
				}, card.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ButtonGhost, { onDemo })
		]
	});
}
function ButtonGhost({ onDemo }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: onDemo,
		className: "hidden h-11 rounded-lg px-4 text-sm text-muted hover:bg-subtle hover:text-fg sm:inline-flex sm:items-center",
		children: "Preview a sample Week 1 slate"
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeScreen, {});
}
//#endregion
export { Home as component };
