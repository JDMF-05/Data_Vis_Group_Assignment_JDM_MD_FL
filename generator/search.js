const ARTISTS_URL =
  "https://jdmf-05.github.io/Data_Vis_Group_Assignment_JDM_MD_FL/generator/unique_performers.txt";


let ARTIST_INDEX = null;

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildArtistIndex(artists) {
  const unique = [];
  const seen = new Set();

  for (const raw of artists) {
    const original = raw.trim();
    if (!original) continue;

    const norm = normalize(original);
    if (seen.has(norm)) continue;
    seen.add(norm);

    unique.push({
      original,
      norm,
      tokens: norm.split(" ")
    });
  }

  const fuse = new Fuse(unique, {
    keys: ["original", "norm", "tokens"],
    threshold: 0.38,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2
  });

  return { list: unique, fuse };
}

function searchArtists(query, max=10) {
  if (!ARTIST_INDEX) return [];
  const q = normalize(query);
  if (q.length < 2) return [];

  const { list, fuse } = ARTIST_INDEX;

  const prefix = list.filter(a =>
    a.norm.startsWith(q) ||
    a.tokens.some(t => t.startsWith(q))
  );

  const fuzzy = fuse.search(q).map(r => r.item);

  const out = [];
  const seen = new Set();

  for (const group of [prefix, fuzzy]) {
    for (const a of group) {
      if (seen.has(a.norm)) continue;
      seen.add(a.norm);
      out.push(a);
      if (out.length >= max) break;
    }
    if (out.length >= max) break;
  }

  return out;
}

function bestArtistForQuery(query) {
  const r = searchArtists(query, 1);
  return r.length ? r[0].original : null;
}
