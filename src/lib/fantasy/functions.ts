import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getBootstrap = createServerFn({ method: "GET" }).handler(async () => {
  const { bootstrapFantasy } = await import("./analyze.server");
  return bootstrapFantasy();
});

const espnCreds = z.object({
  leagueId: z.string().min(1),
  espn_s2: z.string().optional(),
  swid: z.string().optional(),
  teamId: z.string().optional(),
});

export const getEspnTeams = createServerFn({ method: "POST" })
  .validator(
    z.object({
      leagueId: z.string().regex(/^\d+$/, "League ID must be numeric"),
      espn_s2: z.string().optional(),
      swid: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { espnTeams } = await import("./analyze.server");
    return espnTeams(data);
  });

export const lookupSleeperUsers = createServerFn({ method: "POST" })
  .validator(
    z.object({
      usernames: z.array(z.string().min(1)).max(12),
      season: z.string().min(4).max(6),
    }),
  )
  .handler(async ({ data }) => {
    const { lookupSleeperUsers: lookup } = await import("./sleeper.server");
    return lookup(data.usernames, data.season);
  });

const sleeperAccount = z.object({
  username: z.string().min(1),
  leagueIds: z.array(z.string()).nullable().optional(),
});

export const runAnalysis = createServerFn({ method: "POST" })
  .validator(
    z.object({
      platform: z.enum(["sleeper", "espn", "both"]),
      week: z.number().int().min(1).max(18),
      sleeperUsernames: z.string().optional(),
      sleeperAccounts: z.array(sleeperAccount).optional(),
      espn: z.array(espnCreds).max(10).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { analyzeLineups } = await import("./analyze.server");
    return analyzeLineups(data);
  });
