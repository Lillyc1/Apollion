// Ennemis des donjons
export const ENEMIES = {
  // Chapitre 1 — Plaines Stellaires
  corrupted_sprite: {
    id: "corrupted_sprite", name: "Lutin Corrompu", portrait: "👾",
    element: "Abyssal", type: "normal",
    baseStats: { pv:800, atq:120, mag:80, def:60, res:60, vit:90, crit:5, cdmg:150 },
    skills: [
      { name:"Griffe", type:"atk", power:1.0, cooldown:0 },
      { name:"Morsure Corrompue", type:"atk_debuff", power:1.2, cooldown:3, desc:"Applique Poison" },
    ],
    rewards: { exp:80, gold:50, gems:0, fragments:[] }
  },
  star_guardian: {
    id: "star_guardian", name: "Gardien Stellaire", portrait: "⭐",
    element: "Stellaire", type: "elite",
    baseStats: { pv:1800, atq:200, mag:150, def:150, res:130, vit:85, crit:10, cdmg:160 },
    skills: [
      { name:"Frappe Étoilée", type:"atk", power:1.2, cooldown:0 },
      { name:"Bouclier Stellaire", type:"shield", power:0.8, cooldown:4 },
      { name:"Salve Dorée", type:"atk_aoe", power:0.9, cooldown:5 },
    ],
    rewards: { exp:200, gold:120, gems:1, fragments:["solene"] }
  },
  void_herald: {
    id: "void_herald", name: "Héraut du Néant", portrait: "🌀",
    element: "Néant", type: "boss",
    baseStats: { pv:6000, atq:350, mag:300, def:200, res:200, vit:80, crit:15, cdmg:175 },
    skills: [
      { name:"Souffle du Vide", type:"atk_aoe", power:1.3, cooldown:0 },
      { name:"Corruption", type:"debuff_aoe", power:0, cooldown:4 },
      { name:"Annihilation Partielle", type:"atk", power:2.5, cooldown:6 },
    ],
    rewards: { exp:1000, gold:500, gems:5, fragments:["etoile","nihila"] }
  },

  // Chapitre 2 — Abysses Corrompus
  abyss_crawler: {
    id: "abyss_crawler", name: "Rampant Abyssal", portrait: "🕷️",
    element: "Abyssal", type: "normal",
    baseStats: { pv:1200, atq:180, mag:120, def:80, res:90, vit:110, crit:8, cdmg:155 },
    skills: [
      { name:"Morsure Abyssale", type:"atk", power:1.0, cooldown:0 },
      { name:"Toile de Poison", type:"debuff_aoe", power:0, cooldown:3 },
    ],
    rewards: { exp:120, gold:70, gems:0, fragments:["nihila"] }
  },
  shadow_knight: {
    id: "shadow_knight", name: "Chevalier des Ombres", portrait: "⚔️",
    element: "Ombral", type: "elite",
    baseStats: { pv:2400, atq:280, mag:180, def:200, res:160, vit:95, crit:14, cdmg:170 },
    skills: [
      { name:"Lame Ombrale", type:"atk", power:1.3, cooldown:0 },
      { name:"Armure de Ténèbres", type:"buff_self", power:0, cooldown:4 },
      { name:"Charge Sombre", type:"atk", power:2.0, cooldown:5 },
    ],
    rewards: { exp:280, gold:160, gems:2, fragments:["noctara","sylphe"] }
  },
  abyss_queen: {
    id: "abyss_queen", name: "Reine Abyssale", portrait: "👑",
    element: "Abyssal", type: "boss",
    baseStats: { pv:9000, atq:420, mag:380, def:280, res:250, vit:85, crit:18, cdmg:185 },
    skills: [
      { name:"Cri du Vide", type:"atk_aoe", power:1.4, cooldown:0 },
      { name:"Drain Massif", type:"mag_drain", power:1.8, cooldown:4 },
      { name:"Phase Ultime", type:"buff_self", power:0, cooldown:6 },
      { name:"Ruine Abyssale", type:"ultimate", power:4.0, cooldown:8 },
    ],
    rewards: { exp:2000, gold:1000, gems:10, fragments:["ragna","vexara"] }
  },

  // Chapitre 3 — Forêt des Âmes
  soul_wisp: {
    id: "soul_wisp", name: "Âme Errante", portrait: "👻",
    element: "Spectral", type: "normal",
    baseStats: { pv:900, atq:140, mag:160, def:50, res:120, vit:125, crit:10, cdmg:160 },
    skills: [
      { name:"Touche Spectrale", type:"mag", power:1.0, cooldown:0 },
      { name:"Drain d'Âme", type:"mag_drain", power:1.3, cooldown:3 },
    ],
    rewards: { exp:100, gold:60, gems:0, fragments:["spiralia"] }
  },
  forest_golem: {
    id: "forest_golem", name: "Golem de la Forêt", portrait: "🌿",
    element: "Tellurique", type: "elite",
    baseStats: { pv:3000, atq:240, mag:160, def:300, res:240, vit:65, crit:6, cdmg:150 },
    skills: [
      { name:"Coup de Poing", type:"atk", power:1.1, cooldown:0 },
      { name:"Régénération", type:"heal", power:0.3, cooldown:3 },
      { name:"Séisme Local", type:"atk_aoe", power:1.2, cooldown:5 },
    ],
    rewards: { exp:300, gold:180, gems:2, fragments:["terra","gaia"] }
  },
  spirit_lord: {
    id: "spirit_lord", name: "Seigneur des Esprits", portrait: "🌀",
    element: "Spectral", type: "boss",
    baseStats: { pv:12000, atq:380, mag:500, def:250, res:350, vit:90, crit:20, cdmg:195 },
    skills: [
      { name:"Tempête Spectrale", type:"mag_aoe", power:1.5, cooldown:0 },
      { name:"Invocation d'Âmes", type:"summon", power:1.2, cooldown:4 },
      { name:"Possession Totale", type:"mag", power:2.8, cooldown:6 },
      { name:"Jugement des Morts", type:"ultimate", power:5.0, cooldown:9 },
    ],
    rewards: { exp:3000, gold:1500, gems:15, fragments:["phantera","spiralia","frosthana"] }
  },
};

export function getEnemyById(id) {
  return ENEMIES[id] ? { ...ENEMIES[id] } : null;
}
