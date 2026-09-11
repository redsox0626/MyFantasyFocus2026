import type { AnalysisResult, FantasyTeamTag, Player } from "./types";

function tags(...items: FantasyTeamTag[]): FantasyTeamTag[] {
  return items;
}

function p(
  partial: Omit<Player, "count" | "platform" | "playerNameOnly"> & {
    playerNameOnly?: string;
    count?: number;
    platform?: Player["platform"];
    myCount?: number;
    oppCount?: number;
    tags?: FantasyTeamTag[];
  },
): Player {
  return {
    count: 0,
    platform: "sleeper",
    playerNameOnly: partial.name,
    ...partial,
  };
}

const my: Player[] = [
  p({
    id: "demo-maye",
    name: "D. Maye",
    position: "QB",
    teamAbbr: "KINGS,SUNSET",
    nflTeam: "NE",
    count: 2,
    tags: tags(
      { abbrev: "KINGS", name: "Kings", side: "mine", platform: "sleeper", matchupId: "demo-kings" },
      { abbrev: "SUNSET", name: "Sunset", side: "mine", platform: "sleeper", matchupId: "demo-sunset" },
    ),
  }),
  p({
    id: "demo-allen",
    name: "J. Allen",
    position: "QB",
    teamAbbr: "KINGS",
    nflTeam: "BUF",
    tags: tags({ abbrev: "KINGS", name: "Kings", side: "mine", platform: "sleeper", matchupId: "demo-kings" }),
  }),
  p({
    id: "demo-achane",
    name: "D. Achane",
    position: "RB",
    teamAbbr: "KINGS,SUNSET",
    nflTeam: "MIA",
    count: 2,
    tags: tags(
      { abbrev: "KINGS", name: "Kings", side: "mine", platform: "sleeper", matchupId: "demo-kings" },
      { abbrev: "SUNSET", name: "Sunset", side: "mine", platform: "sleeper", matchupId: "demo-sunset" },
    ),
  }),
  p({
    id: "demo-gibbs",
    name: "J. Gibbs",
    position: "RB",
    teamAbbr: "SUNSET",
    nflTeam: "DET",
    tags: tags({ abbrev: "SUNSET", name: "Sunset", side: "mine", platform: "sleeper", matchupId: "demo-sunset" }),
  }),
  p({
    id: "demo-chase",
    name: "J. Chase",
    position: "WR",
    teamAbbr: "KINGS",
    nflTeam: "CIN",
    tags: tags({ abbrev: "KINGS", name: "Kings", side: "mine", platform: "sleeper", matchupId: "demo-kings" }),
  }),
  p({
    id: "demo-arsb",
    name: "A. St. Brown",
    position: "WR",
    teamAbbr: "SUNSET",
    nflTeam: "DET",
    tags: tags({ abbrev: "SUNSET", name: "Sunset", side: "mine", platform: "sleeper", matchupId: "demo-sunset" }),
  }),
  p({
    id: "demo-btj",
    name: "B. Thomas Jr.",
    position: "WR",
    teamAbbr: "KINGS",
    nflTeam: "JAX",
    tags: tags({ abbrev: "KINGS", name: "Kings", side: "mine", platform: "sleeper", matchupId: "demo-kings" }),
  }),
  p({
    id: "demo-bowers",
    name: "B. Bowers",
    position: "TE",
    teamAbbr: "SUNSET",
    nflTeam: "LV",
    tags: tags({ abbrev: "SUNSET", name: "Sunset", side: "mine", platform: "sleeper", matchupId: "demo-sunset" }),
  }),
  p({
    id: "demo-aubrey",
    name: "B. Aubrey",
    position: "K",
    teamAbbr: "KINGS",
    nflTeam: "DAL",
    tags: tags({ abbrev: "KINGS", name: "Kings", side: "mine", platform: "sleeper", matchupId: "demo-kings" }),
  }),
  p({
    id: "demo-bills",
    name: "Buffalo",
    position: "DEF",
    teamAbbr: "SUNSET",
    nflTeam: "BUF",
    tags: tags({ abbrev: "SUNSET", name: "Sunset", side: "mine", platform: "sleeper", matchupId: "demo-sunset" }),
  }),
  p({
    id: "demo-parsons",
    name: "M. Parsons",
    position: "LB",
    teamAbbr: "KINGS",
    nflTeam: "GB",
    tags: tags({ abbrev: "KINGS", name: "Kings", side: "mine", platform: "sleeper", matchupId: "demo-kings" }),
  }),
  p({
    id: "demo-hutch",
    name: "A. Hutchinson",
    position: "DL",
    teamAbbr: "SUNSET",
    nflTeam: "DET",
    tags: tags({ abbrev: "SUNSET", name: "Sunset", side: "mine", platform: "sleeper", matchupId: "demo-sunset" }),
  }),
];

const overlap: Player[] = [
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
    tags: tags(
      { abbrev: "KINGS", name: "Kings", side: "mine", platform: "sleeper", matchupId: "demo-kings" },
      { abbrev: "THEBOY", name: "The Boys", side: "theirs", platform: "sleeper", matchupId: "demo-kings" },
    ),
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
    tags: tags(
      { abbrev: "KINGS", name: "Kings", side: "mine", platform: "sleeper", matchupId: "demo-kings" },
      { abbrev: "RIVERS", name: "Rivers", side: "theirs", platform: "sleeper", matchupId: "demo-sunset" },
    ),
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
    tags: tags(
      { abbrev: "SUNSET", name: "Sunset", side: "mine", platform: "sleeper", matchupId: "demo-sunset" },
      { abbrev: "THEBOY", name: "The Boys", side: "theirs", platform: "sleeper", matchupId: "demo-kings" },
    ),
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
    tags: tags(
      { abbrev: "KINGS", name: "Kings", side: "mine", platform: "sleeper", matchupId: "demo-kings" },
      { abbrev: "RIVERS", name: "Rivers", side: "theirs", platform: "sleeper", matchupId: "demo-sunset" },
    ),
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
    tags: tags(
      { abbrev: "KINGS", name: "Kings", side: "mine", platform: "sleeper", matchupId: "demo-kings" },
      { abbrev: "THEBOY", name: "The Boys", side: "theirs", platform: "sleeper", matchupId: "demo-kings" },
    ),
  }),
];

const opponent: Player[] = [
  p({
    id: "demo-hurts",
    name: "J. Hurts",
    position: "QB",
    teamAbbr: "THEBOY",
    nflTeam: "PHI",
    tags: tags({ abbrev: "THEBOY", name: "The Boys", side: "theirs", platform: "sleeper", matchupId: "demo-kings" }),
  }),
  p({
    id: "demo-nix",
    name: "B. Nix",
    position: "QB",
    teamAbbr: "RIVERS",
    nflTeam: "DEN",
    tags: tags({ abbrev: "RIVERS", name: "Rivers", side: "theirs", platform: "sleeper", matchupId: "demo-sunset" }),
  }),
  p({
    id: "demo-saquon",
    name: "S. Barkley",
    position: "RB",
    teamAbbr: "THEBOY,RIVERS",
    nflTeam: "PHI",
    count: 2,
    tags: tags(
      { abbrev: "THEBOY", name: "The Boys", side: "theirs", platform: "sleeper", matchupId: "demo-kings" },
      { abbrev: "RIVERS", name: "Rivers", side: "theirs", platform: "sleeper", matchupId: "demo-sunset" },
    ),
  }),
  p({
    id: "demo-puka",
    name: "P. Nacua",
    position: "WR",
    teamAbbr: "THEBOY",
    nflTeam: "LAR",
    tags: tags({ abbrev: "THEBOY", name: "The Boys", side: "theirs", platform: "sleeper", matchupId: "demo-kings" }),
  }),
  p({
    id: "demo-mhj",
    name: "M. Harrison Jr.",
    position: "WR",
    teamAbbr: "RIVERS",
    nflTeam: "ARI",
    tags: tags({ abbrev: "RIVERS", name: "Rivers", side: "theirs", platform: "sleeper", matchupId: "demo-sunset" }),
  }),
  p({
    id: "demo-jsw",
    name: "J. Smith-Njigba",
    position: "WR",
    teamAbbr: "THEBOY",
    nflTeam: "SEA",
    tags: tags({ abbrev: "THEBOY", name: "The Boys", side: "theirs", platform: "sleeper", matchupId: "demo-kings" }),
  }),
  p({
    id: "demo-mcbride",
    name: "T. McBride",
    position: "TE",
    teamAbbr: "THEBOY",
    nflTeam: "ARI",
    tags: tags({ abbrev: "THEBOY", name: "The Boys", side: "theirs", platform: "sleeper", matchupId: "demo-kings" }),
  }),
  p({
    id: "demo-tucker",
    name: "J. Tucker",
    position: "K",
    teamAbbr: "RIVERS",
    nflTeam: "BAL",
    tags: tags({ abbrev: "RIVERS", name: "Rivers", side: "theirs", platform: "sleeper", matchupId: "demo-sunset" }),
  }),
  p({
    id: "demo-eagles",
    name: "Philadelphia",
    position: "DEF",
    teamAbbr: "THEBOY",
    nflTeam: "PHI",
    tags: tags({ abbrev: "THEBOY", name: "The Boys", side: "theirs", platform: "sleeper", matchupId: "demo-kings" }),
  }),
  p({
    id: "demo-crosby",
    name: "M. Crosby",
    position: "DL",
    teamAbbr: "THEBOY",
    nflTeam: "LV",
    tags: tags({ abbrev: "THEBOY", name: "The Boys", side: "theirs", platform: "sleeper", matchupId: "demo-kings" }),
  }),
];

export const DEMO_RESULT: AnalysisResult = {
  my,
  opponent,
  overlap,
  matchups: [
    {
      id: "demo-kings",
      platform: "sleeper",
      leagueName: "Sibling Rivalry",
      myTeam: { name: "Kings", abbrev: "KINGS", score: 104.2, projected: 118.6 },
      oppTeam: { name: "The Boys", abbrev: "THEBOY", score: 91.0, projected: 102.3 },
      status: "winning",
    },
    {
      id: "demo-sunset",
      platform: "sleeper",
      leagueName: "The Degenerates",
      myTeam: { name: "Sunset", abbrev: "SUNSET", score: 78.4, projected: 96.7 },
      oppTeam: { name: "Rivers", abbrev: "RIVERS", score: 88.1, projected: 94.2 },
      status: "losing",
    },
  ],
  meta: {
    week: 1,
    season: "2026",
    sleeperLeagues: 2,
    espnUsed: false,
    warnings: ["Sample Week 1 slate — connect Sleeper or ESPN to analyze your real lineups."],
    liveTeams: ["SEA", "NE"],
    redZoneTeams: ["SEA"],
  },
};
