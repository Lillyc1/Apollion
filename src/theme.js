export const C = {
  bg:        "#07030F",
  surface:   "#110823",
  card:      "#1A0D35",
  border:    "#3B1C6E",
  accent:    "#7C3AED",
  accentHi:  "#A855F7",
  gold:      "#D4A017",
  goldHi:    "#F5C842",
  text:      "#EDE9FE",
  muted:     "#9D8EC7",
  cyan:      "#22D3EE",
  green:     "#34D399",
  rose:      "#F43F5E",
  orange:    "#FB923C",
  red:       "#EF4444",
};

export const ELEMENTS = {
  Stellaire:  { bg: "#3B2800", accent: "#FCD34D", icon: "⭐", strongVs: "Abyssal",   weakVs: "Néant" },
  Abyssal:    { bg: "#1A0A2E", accent: "#7C3AED", icon: "🌀", strongVs: "Ombral",    weakVs: "Stellaire" },
  Ombral:     { bg: "#0F0F1F", accent: "#818CF8", icon: "🌑", strongVs: "Stellaire", weakVs: "Solaire" },
  Solaire:    { bg: "#2D0E00", accent: "#FB923C", icon: "🔥", strongVs: "Glacial",   weakVs: "Abyssal" },
  Glacial:    { bg: "#001A2E", accent: "#67E8F9", icon: "❄️", strongVs: "Fulgurant", weakVs: "Solaire" },
  Fulgurant:  { bg: "#1A0030", accent: "#C084FC", icon: "⚡", strongVs: "Tellurique",weakVs: "Glacial" },
  Tellurique: { bg: "#1A0A00", accent: "#92400E", icon: "🪨", strongVs: "Solaire",   weakVs: "Fulgurant" },
  Spectral:   { bg: "#001A10", accent: "#6EE7B7", icon: "👻", strongVs: "Abyssal",   weakVs: "Tellurique" },
  Néant:      { bg: "#000000", accent: "#CBD5E1", icon: "🕳️", strongVs: "Tous",      weakVs: "Aucun" },
};

export const CLASSES = {
  Gardienne:   { icon: "🛡️", color: "#1E3A5F", role: "tank" },
  Attaquante:  { icon: "⚔️", color: "#3B0764", role: "dps" },
  Mage:        { icon: "🪄", color: "#1A0A2E", role: "mage" },
  Soigneuse:   { icon: "✨", color: "#052E16", role: "healer" },
  Assassine:   { icon: "🗡️", color: "#0F0F1F", role: "assassin" },
  Archère:     { icon: "🏹", color: "#1C1917", role: "archer" },
  Invocatrice: { icon: "👋", color: "#2D0A4E", role: "summoner" },
  Berserker:   { icon: "🪓", color: "#3B0000", role: "berserker" },
};

export const RARITIES = {
  1:  { name: "Commune",      stars: "★",           color: "#9CA3AF", textColor: "#D1D5DB" },
  2:  { name: "Peu Commune",  stars: "★★",          color: "#34D399", textColor: "#6EE7B7" },
  3:  { name: "Rare",         stars: "★★★",         color: "#60A5FA", textColor: "#93C5FD" },
  4:  { name: "Épique",       stars: "★★★★",        color: "#A855F7", textColor: "#C084FC" },
  5:  { name: "Légendaire",   stars: "★★★★★",       color: "#D4A017", textColor: "#F5C842" },
  6:  { name: "Mythique",     stars: "★★★★★★",      color: "#EF4444", textColor: "#FCA5A5" },
  7:  { name: "Ancestrale",   stars: "★★★★★★★",     color: "#E5E7EB", textColor: "#F9FAFB" },
  8:  { name: "Céleste",      stars: "★★★★★★★★",    color: "#22D3EE", textColor: "#67E8F9" },
  9:  { name: "Divine",       stars: "★★★★★★★★★",   color: "#F9A8D4", textColor: "#FBCFE8" },
  10: { name: "Transcendante",stars: "★★★★★★★★★★",  color: "rainbow",  textColor: "#FFFFFF" },
  11: { name: "Secrète",      stars: "✦✦✦✦✦✦✦✦✦✦✦", color: "#CBD5E1", textColor: "#FFFFFF" },
};

export const GACHA_RATES = {
  1:  0.40,
  2:  0.25,
  3:  0.15,
  4:  0.08,
  5:  0.05,
  6:  0.03,
  7:  0.02,
  8:  0.01,
  9:  0.007,
  10: 0.0025,
  11: 0.0005,
};

export const btn = (extra = {}) => ({
  cursor: "pointer",
  border: "none",
  borderRadius: 10,
  padding: "10px 20px",
  fontFamily: "'Georgia', serif",
  fontWeight: 700,
  fontSize: 14,
  transition: "all 0.2s",
  ...extra,
});
