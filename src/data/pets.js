// Compagnons (Pets) — créatures évoluables
export const PETS = [
  {
    id: "luminos", name: "Luminos", element: "Stellaire", rarity: 3,
    portrait: "🦋", role: "offense",
    stages: [
      { stage: 1, name: "Luminos", portrait: "🦋", desc: "Petit papillon de lumière stellaire." },
      { stage: 2, name: "Lumidar", portrait: "🦅", desc: "Aigle doré aux ailes rayonnantes. (100 donjons)" },
      { stage: 3, name: "Lumiaris", portrait: "🌟", desc: "Phénix d'étoile — majesté absolue. (50 PvP + Boss Guilde)" },
    ],
    passive: "ATQ +12% de la Pléiade liée",
    skill: "Frappe d'Étoile: dégâts bonus lors d'un Crit",
  },
  {
    id: "noctulus", name: "Noctulus", element: "Abyssal", rarity: 4,
    portrait: "🦇", role: "control",
    stages: [
      { stage: 1, name: "Noctulus", portrait: "🦇", desc: "Chauve-souris abyssale, yeux violets." },
      { stage: 2, name: "Nocturnis", portrait: "🐉", desc: "Dragon nocturne compact. (100 donjons)" },
      { stage: 3, name: "Noctyrax", portrait: "🌑", desc: "Wyrm des abysses — terreur ailée. (50 PvP + Boss Guilde)" },
    ],
    passive: "Poison dure 1 tour de plus",
    skill: "Morsure Abyssale: Poison + VIT ennemi -10%",
  },
  {
    id: "crystallet", name: "Crystallet", element: "Glacial", rarity: 3,
    portrait: "❄️", role: "defense",
    stages: [
      { stage: 1, name: "Crystallet", portrait: "❄️", desc: "Petit cristal de glace flottant." },
      { stage: 2, name: "Crystara", portrait: "💠", desc: "Forme cristalline complexe. (100 donjons)" },
      { stage: 3, name: "Crystarion", portrait: "🔮", desc: "Colosse de cristal vivant. (50 PvP + Boss Guilde)" },
    ],
    passive: "DEF +15% de la Pléiade liée",
    skill: "Bouclier Glacial: absorbe 20% des dégâts une fois",
  },
  {
    id: "pyrix", name: "Pyrix", element: "Solaire", rarity: 4,
    portrait: "🦊", role: "offense",
    stages: [
      { stage: 1, name: "Pyrix", portrait: "🦊", desc: "Renard de feu aux flammes orangées." },
      { stage: 2, name: "Pyrixar", portrait: "🐺", desc: "Loup enflammé. (100 donjons)" },
      { stage: 3, name: "Infernus", portrait: "🔥", desc: "Créature de feu pur — incendie ambulant. (50 PvP + Boss Guilde)" },
    ],
    passive: "Brûlure inflige +25% de dégâts",
    skill: "Explosion de Flammes: Brûlure sur ennemi aléatoire chaque tour",
  },
  {
    id: "speculus", name: "Speculus", element: "Spectral", rarity: 3,
    portrait: "👁️", role: "utility",
    stages: [
      { stage: 1, name: "Speculus", portrait: "👁️", desc: "Œil flottant aux pupilles brillantes." },
      { stage: 2, name: "Specura", portrait: "🌀", desc: "Orbe spectral tourbillonnant. (100 donjons)" },
      { stage: 3, name: "Obscurum", portrait: "🕳️", desc: "Entité spectrale pure — l'Œil qui voit tout. (50 PvP + Boss Guilde)" },
    ],
    passive: "+20% gold gagné dans les donjons",
    skill: "Vision Spectrale: révèle les stats ennemies",
  },
  {
    id: "thunderpup", name: "Tonnerre", element: "Fulgurant", rarity: 2,
    portrait: "🐾", role: "offense",
    stages: [
      { stage: 1, name: "Tonnerre", portrait: "🐾", desc: "Chiot électrique aux oreilles en zig-zag." },
      { stage: 2, name: "Foudrin", portrait: "⚡", desc: "Canin chargé d'électricité. (100 donjons)" },
      { stage: 3, name: "Strikos", portrait: "🌩️", desc: "Loup de foudre — chaque pas crée un éclair. (50 PvP + Boss Guilde)" },
    ],
    passive: "VIT +8% de la Pléiade liée",
    skill: "Morsure Électrique: Étourdit ennemi (10% chance)",
  },
  {
    id: "terragon", name: "Terragon", element: "Tellurique", rarity: 3,
    portrait: "🐢", role: "defense",
    stages: [
      { stage: 1, name: "Terragon", portrait: "🐢", desc: "Tortue en pierre animée." },
      { stage: 2, name: "Terravark", portrait: "🦏", desc: "Rhino de pierre runique. (100 donjons)" },
      { stage: 3, name: "Bedrock", portrait: "🗿", desc: "Titan de la terre — immuable. (50 PvP + Boss Guilde)" },
    ],
    passive: "PV +10% de la Pléiade liée",
    skill: "Bouclier de Terre: réduit les dégâts reçus de 15%",
  },
  {
    id: "voidling", name: "Vide", element: "Néant", rarity: 5,
    portrait: "⬛", role: "offense",
    stages: [
      { stage: 1, name: "Vide", portrait: "⬛", desc: "Cube de ténèbres absolues." },
      { stage: 2, name: "Vacuus", portrait: "🕳️", desc: "Sphère d'annihilation. (100 donjons)" },
      { stage: 3, name: "Annihil", portrait: "∅", desc: "Le Néant Incarné — efface ce qu'il touche. (50 PvP + Boss Guilde)" },
    ],
    passive: "Ignore 10% des résistances ennemies",
    skill: "Annihilation: 5% chance d'instakill sur ennemi <50% PV",
  },
];

export function getPetById(id) {
  return PETS.find(p => p.id === id);
}
