/** Normalize a pasted Sleeper handle, URL, or @mention into a bare username. */
export function normalizeSleeperHandle(raw: string): string {
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
export function parseSleeperHandles(raw: string): string[] {
  const chunks = raw.split(/[,;\n]+/);
  const handles: string[] = [];
  const seen = new Set<string>();
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
export function parseEspnLeagueId(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const query = trimmed.match(/[?&]leagueId=(\d+)/i);
  if (query?.[1]) return query[1];
  const path = trimmed.match(/\/league(?:\/view)?\/(\d+)/i);
  if (path?.[1]) return path[1];
  if (/^\d+$/.test(trimmed)) return trimmed;
  const any = trimmed.match(/(\d{5,})/);
  return any?.[1] || "";
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0]?.[0] || "";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}
