/** Suffixes ESPN includes (III) that Sleeper often omits. Longer roman numerals first. */
const NAME_SUFFIX = /\b((jr|sr)s?\.?|iii|ii|iv|v)\b/gi;
const SKIP_ABBREV_WORDS = new Set(["the", "a", "an", "of", "and", "mr", "mrs", "ms", "team", "my"]);

export function normalizePersonName(name: string): string {
  return (name || "")
    .toLowerCase()
    .replace(NAME_SUFFIX, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/** Compact identity key so "Kenneth Walker III" === "Kenneth Walker". */
export function nameKey(name: string): string {
  return normalizePersonName(name).replace(/ /g, "");
}

export function identityKey(name: string, position: string): string {
  return `${nameKey(name)}|${(position || "UNKNOWN").toUpperCase()}`;
}

/**
 * 5–6 letter fantasy-team slug from the actual team name, not the account.
 * "Mr. Bananagrabber" → BANANA, "Daniels Pays-Lewis" → DANPAY.
 */
export function abbreviateTeamName(name: string, length = 6): string {
  if (!name) return "UNK";
  const words = name
    .replace(/['’]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const meaningful = words.filter((w) => !SKIP_ABBREV_WORDS.has(w.toLowerCase()));
  const use = meaningful.length ? meaningful : words;
  if (!use.length) return "UNK";
  if (use.length >= 2) {
    const rest = use.slice(1).join("");
    const firstLen = Math.max(3, length - Math.min(3, rest.length));
    const slug = `${use[0].slice(0, firstLen)}${rest.slice(0, Math.max(0, length - firstLen))}`;
    return slug.slice(0, length).toUpperCase() || "UNK";
  }
  return use[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, length).toUpperCase() || "UNK";
}
