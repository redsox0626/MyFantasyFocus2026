import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { initials, normalizeSleeperHandle, parseEspnLeagueId, parseSleeperHandles } from "./parse.ts";

describe("normalizeSleeperHandle", () => {
  it("strips @ and URLs", () => {
    assert.equal(normalizeSleeperHandle("@CoolGuy"), "CoolGuy");
    assert.equal(normalizeSleeperHandle("https://sleeper.app/u/coolguy"), "coolguy");
    assert.equal(normalizeSleeperHandle("https://sleeper.com/u/coolguy/leagues"), "coolguy");
  });
});

describe("parseSleeperHandles", () => {
  it("splits lists and de-dupes", () => {
    assert.deepEqual(parseSleeperHandles("a, b; c\nd"), ["a", "b", "c", "d"]);
    assert.deepEqual(parseSleeperHandles("@Ann ann ANN"), ["Ann"]);
    assert.deepEqual(parseSleeperHandles("  "), []);
  });
});

describe("parseEspnLeagueId", () => {
  it("reads raw ids and ESPN URLs", () => {
    assert.equal(parseEspnLeagueId("12345678"), "12345678");
    assert.equal(
      parseEspnLeagueId("https://fantasy.espn.com/football/league?leagueId=5544332&seasonId=2026"),
      "5544332",
    );
    assert.equal(parseEspnLeagueId("paste this 99887766 in"), "99887766");
    assert.equal(parseEspnLeagueId(""), "");
  });
});

describe("initials", () => {
  it("uses first letters of two words", () => {
    assert.equal(initials("Cool Guy"), "CG");
    assert.equal(initials("solo"), "SO");
  });
});
