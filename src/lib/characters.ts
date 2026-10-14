export type CharacterPreset = {
  name: string;
  movie: string;
  /** Lower-case spellings guests might type. The first one is the canonical key. */
  aliases: readonly string[];
};

// Iconic presets for the quick-pick chips. The aliases make sure variations
// like "Poo", "Pooja" and "Poo (Pooja)" all count as the same character.
export const POPULAR_CHARACTERS: readonly CharacterPreset[] = [
  { name: "Poo", movie: "Kabhi Khushi Kabhie Gham", aliases: ["poo", "pooja", "pooja sharma", "poo pooja"] },
  { name: "Geet Dhillon", movie: "Jab We Met", aliases: ["geet", "geet dhillon"] },
  { name: "Raj Malhotra", movie: "Dilwale Dulhania Le Jayenge", aliases: ["raj", "raj malhotra"] },
  { name: "Chulbul Pandey", movie: "Dabangg", aliases: ["chulbul pandey", "robinhood pandey", "chulbul"] },
  { name: "Baburao Ganpatrao Apte", movie: "Hera Pheri", aliases: ["baburao", "babu bhaiya", "baburao ganpatrao apte", "babubhaiya"] },
  { name: "Rancho", movie: "3 Idiots", aliases: ["rancho", "phunsukh wangdu", "ranchoddas chanchad"] },
  { name: "Munna Bhai", movie: "Munna Bhai M.B.B.S.", aliases: ["munna bhai", "murli prasad sharma", "munnabhai"] },
  { name: "Circuit", movie: "Munna Bhai M.B.B.S.", aliases: ["circuit", "sarkeshwar"] },
  { name: "Rani Mehra", movie: "Queen", aliases: ["rani mehra", "rani"] },
  { name: "Don", movie: "Don", aliases: ["don", "mark donald"] },
  { name: "Mogambo", movie: "Mr. India", aliases: ["mogambo"] },
  { name: "Gabbar Singh", movie: "Sholay", aliases: ["gabbar", "gabbar singh"] },
  { name: "Basanti", movie: "Sholay", aliases: ["basanti"] },
  { name: "Naina Talwar", movie: "Yeh Jawaani Hai Deewani", aliases: ["naina", "naina talwar"] },
  { name: "Bunny", movie: "Yeh Jawaani Hai Deewani", aliases: ["bunny", "kabir thapar"] },
  { name: "Mastani", movie: "Bajirao Mastani", aliases: ["mastani"] },
];

/** "  GEET!! " -> "geet". Folds accents and keeps letters from any script. */
function clean(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, " ")
    .trim();
}

const PRESET_KEYS = new Map<string, string>();
for (const preset of POPULAR_CHARACTERS) {
  const canonical = preset.aliases[0];
  for (const variant of [preset.name, ...preset.aliases]) {
    const key = clean(variant);
    if (!PRESET_KEYS.has(key)) PRESET_KEYS.set(key, canonical);
  }
}

/** Comparison key for a character name; known aliases collapse to one key. */
export function characterKey(value: string) {
  const key = clean(value);
  return PRESET_KEYS.get(key) ?? key;
}

/** Claims keyed by character, so lookups stay cheap while the guest types. */
export function indexClaims<T extends { character: string }>(claims: readonly T[]) {
  const index = new Map<string, T>();
  for (const claim of claims) {
    const key = characterKey(claim.character);
    if (key && !index.has(key)) index.set(key, claim);
  }
  return index;
}

/** The existing claim on this character, if any guest already locked it. */
export function findClaim<T>(index: ReadonlyMap<string, T>, character: string) {
  const key = characterKey(character);
  return key ? index.get(key) : undefined;
}
