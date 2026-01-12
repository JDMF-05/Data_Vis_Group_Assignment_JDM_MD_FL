// URL of the text file containing a list of unique artist names
const ARTISTS_URL =
  "https://jdmf-05.github.io/Data_Vis_Group_Assignment_JDM_MD_FL/generator/unique_performers.txt?v=1";

// Will store the searchable artist index after it is built
let ARTIST_INDEX = null;

// Normalizes a string to make artist name comparisons consistent.
// This removes accents, punctuation, extra spaces, and forces lowercase.
function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s]/g, "")                     // remove symbols
    .replace(/\s+/g, " ")                            // collapse spaces
    .trim();
}

// Builds a searchable index of artists using Fuse.js.
// Each artist is stored with its original name and a normalized version.
function buildArtistIndex(artists) {
  const unique = [];
  const seen = new Set();

  for (const raw of artists) {
    const original = raw.trim();
    if (!original) continue;

    const norm = normalize(original);

// Skip duplicates based on normalized name
    if (seen.has(norm)) continue;
    seen.add(norm);

    unique.push({
      original,           // original display name
      norm,               // normalized version for comparison
      tokens: norm.split(" ") // individual words for prefix matching
    });
  }

// Create a Fuse.js instance for fuzzy searching
  const fuse = new Fuse(unique, {
    keys: ["original", "norm", "tokens"],
    threshold: 0.38,          // controls how fuzzy the matches can be
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2
  });

  return { list: unique, fuse };
}

// Searches for matching artists using both prefix and fuzzy matching.
// Prefix matches are prioritised over fuzzy matches.
function searchArtists(query, max = 10) {
  if (!ARTIST_INDEX) return [];

  const q = normalize(query);
  if (q.length < 2) return [];

  const { list, fuse } = ARTIST_INDEX;

// Find artists where the name or any word starts with the query
  const prefix = list.filter(a =>
    a.norm.startsWith(q) ||
    a.tokens.some(t => t.startsWith(q))
  );

// Fuse.js fuzzy search results
  const fuzzy = fuse.search(q).map(r => r.item);

// Merge results while avoiding duplicates
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

// Returns the best matching artist name for a given query.
// Used when generating the poster.
function bestArtistForQuery(query) {
  const r = searchArtists(query, 1);
  return r.length ? r[0].original : null;
}
