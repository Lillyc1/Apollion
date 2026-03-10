// Donjons histoire — Chapitres > Actes > Salles
export const DUNGEONS = [
  {
    id: "ch1",
    name: "Chapitre 1",
    subtitle: "Les Plaines Stellaires",
    icon: "⭐",
    bg: "#0A0A1A",
    accent: "#FCD34D",
    unlockReq: null,
    lore: "Le Voile Brisé a laissé des failles dans les Plaines Stellaires. Des créatures corrompues envahissent les terres sacrées.",
    stages: [
      { id:"1-1", name:"L'Aube Corrompue",    difficulty:"Normal", enemies:["corrupted_sprite","corrupted_sprite","corrupted_sprite"],           stars:3, stamina:6,  rewards:{exp:100, gold:200, gems:0,  fragments:["luna"]}    },
      { id:"1-2", name:"Gardes de Pierre",    difficulty:"Normal", enemies:["star_guardian","corrupted_sprite","corrupted_sprite"],              stars:3, stamina:6,  rewards:{exp:150, gold:250, gems:0,  fragments:["ignis"]}   },
      { id:"1-3", name:"Brume Violette",      difficulty:"Normal", enemies:["abyss_crawler","star_guardian","corrupted_sprite"],                 stars:3, stamina:6,  rewards:{exp:200, gold:300, gems:1,  fragments:["terra"]}   },
      { id:"1-4", name:"L'Avant-Garde",       difficulty:"Difficile",enemies:["star_guardian","star_guardian","abyss_crawler","abyss_crawler"],  stars:3, stamina:8,  rewards:{exp:300, gold:400, gems:2,  fragments:["solene"]}  },
      { id:"1-5", name:"Boss: Héraut du Néant",difficulty:"Boss",  enemies:["void_herald"],                                                     stars:3, stamina:10, rewards:{exp:800, gold:800, gems:5,  fragments:["etoile","nihila"]} },
    ]
  },
  {
    id: "ch2",
    name: "Chapitre 2",
    subtitle: "Les Abysses Corrompus",
    icon: "🌀",
    bg: "#0A001A",
    accent: "#7C3AED",
    unlockReq: "ch1",
    lore: "Descendre dans les Abysses, c'est affronter la corruption à sa source. Seules les plus courageuses osent y mettre les pieds.",
    stages: [
      { id:"2-1", name:"Entrée des Abysses",  difficulty:"Normal",   enemies:["abyss_crawler","abyss_crawler","soul_wisp"],                            stars:3, stamina:7,  rewards:{exp:200, gold:350, gems:1,  fragments:["aqua"]}         },
      { id:"2-2", name:"Couloirs Obscurs",    difficulty:"Normal",   enemies:["shadow_knight","abyss_crawler","abyss_crawler"],                         stars:3, stamina:7,  rewards:{exp:280, gold:420, gems:1,  fragments:["umbra"]}        },
      { id:"2-3", name:"Chambre de Torture",  difficulty:"Difficile",enemies:["shadow_knight","shadow_knight","abyss_crawler"],                          stars:3, stamina:9,  rewards:{exp:380, gold:550, gems:2,  fragments:["noctara"]}      },
      { id:"2-4", name:"Trône des Ombres",    difficulty:"Difficile",enemies:["shadow_knight","shadow_knight","shadow_knight","abyss_crawler"],          stars:3, stamina:10, rewards:{exp:500, gold:700, gems:3,  fragments:["sylphe","vexara"]}},
      { id:"2-5", name:"Boss: Reine Abyssale",difficulty:"Boss",     enemies:["abyss_queen"],                                                            stars:3, stamina:12, rewards:{exp:1500, gold:1200, gems:10, fragments:["ragna","nihila"]}},
    ]
  },
  {
    id: "ch3",
    name: "Chapitre 3",
    subtitle: "La Forêt des Âmes",
    icon: "👻",
    bg: "#001408",
    accent: "#6EE7B7",
    unlockReq: "ch2",
    lore: "La Forêt des Âmes abrite les esprits de guerrières tombées. Ils ne sont pas tous bienveillants.",
    stages: [
      { id:"3-1", name:"Lisière Spectre",     difficulty:"Normal",   enemies:["soul_wisp","soul_wisp","soul_wisp"],                                      stars:3, stamina:8,  rewards:{exp:350, gold:480, gems:1,  fragments:["spiralia"]}       },
      { id:"3-2", name:"Arbres Vivants",      difficulty:"Normal",   enemies:["forest_golem","soul_wisp","soul_wisp"],                                   stars:3, stamina:8,  rewards:{exp:420, gold:560, gems:2,  fragments:["phantera"]}       },
      { id:"3-3", name:"Âmes en Peine",       difficulty:"Difficile",enemies:["forest_golem","soul_wisp","soul_wisp","soul_wisp"],                       stars:3, stamina:10, rewards:{exp:560, gold:720, gems:3,  fragments:["frosthana"]}      },
      { id:"3-4", name:"Sanctuaire Ancien",   difficulty:"Difficile",enemies:["forest_golem","forest_golem","shadow_knight"],                            stars:3, stamina:11, rewards:{exp:720, gold:900, gems:4,  fragments:["crystallia","gaia"]}},
      { id:"3-5", name:"Boss: Seigneur des Esprits",difficulty:"Boss",enemies:["spirit_lord"],                                                           stars:3, stamina:15, rewards:{exp:3000, gold:2000, gems:20, fragments:["phantera","lyrae"]}},
    ]
  },
];

export function getDungeonById(id) {
  return DUNGEONS.find(d => d.id === id);
}

export function getStageById(stageId) {
  for (const dungeon of DUNGEONS) {
    const stage = dungeon.stages.find(s => s.id === stageId);
    if (stage) return { stage, dungeon };
  }
  return null;
}
