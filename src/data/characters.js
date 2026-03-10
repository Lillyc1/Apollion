// Pleiades — guerrières légendaires d'Apollion
export const PLEIADES = [
  // ══ STELLAIRE ══
  {
    id: "etoile", name: "Étoile", element: "Stellaire", classe: "Gardienne", rarity: 5,
    portrait: "🌟", lore: "Première née des étoiles, gardienne du Voile Brisé.",
    baseStats: { pv:3200, atq:280, mag:180, def:320, res:280, vit:85, crit:12, cdmg:160, pen:5 },
    skills: [
      { id:"s0", name:"Frappe Stellaire", type:"atk", power:1.2, cooldown:0, desc:"Attaque physique puissante." },
      { id:"s1", name:"Bouclier Céleste", type:"shield", power:0.8, cooldown:3, desc:"Crée un bouclier absorbant 80% de l'ATQ." },
      { id:"s2", name:"Nova Protectrice", type:"atk_aoe", power:0.9, cooldown:4, desc:"Frappe tous les ennemis et réduit leur ATQ de 20%." },
      { id:"s3", name:"Voile des Étoiles", type:"ultimate", power:2.5, cooldown:6, desc:"Ultime: Invincibilité 1 tour + dégâts massifs.", isUltimate:true },
    ]
  },
  {
    id: "solene", name: "Solène", element: "Stellaire", classe: "Attaquante", rarity: 4,
    portrait: "💫", lore: "Chasseuse d'étoiles filantes, rapide comme l'éclair doré.",
    baseStats: { pv:2100, atq:380, mag:200, def:180, res:160, vit:115, crit:22, cdmg:190, pen:12 },
    skills: [
      { id:"s0", name:"Lame d'Astre", type:"atk", power:1.3, cooldown:0, desc:"Attaque rapide." },
      { id:"s1", name:"Rafale Étoilée", type:"atk_multi", power:0.7, cooldown:2, desc:"2 à 4 coups rapides." },
      { id:"s2", name:"Percée Céleste", type:"atk", power:2.0, cooldown:4, desc:"Attaque qui ignore 30% de la DEF." },
      { id:"s3", name:"Tempête Stellaire", type:"ultimate", power:3.2, cooldown:6, desc:"Ultime: Rafale de 5 coups + ATQ↑ 2 tours.", isUltimate:true },
    ]
  },
  {
    id: "lyrae", name: "Lyrae", element: "Stellaire", classe: "Mage", rarity: 6,
    portrait: "✨", lore: "Archiviste des constellations, maîtresse des formules astrales.",
    baseStats: { pv:2400, atq:200, mag:450, def:160, res:280, vit:95, crit:18, cdmg:200, pen:8 },
    skills: [
      { id:"s0", name:"Flèche Astrale", type:"mag", power:1.1, cooldown:0, desc:"Projectile magique stellaire." },
      { id:"s1", name:"Pluie de Météores", type:"mag_aoe", power:0.85, cooldown:3, desc:"Pluie de météores sur tous les ennemis." },
      { id:"s2", name:"Constellation", type:"buff", power:1.0, cooldown:4, desc:"Augmente MAG de l'équipe de 25% pour 2 tours." },
      { id:"s3", name:"Fin du Firmament", type:"ultimate", power:4.0, cooldown:7, desc:"Ultime: Déflagration magique massive.", isUltimate:true },
    ]
  },

  // ══ ABYSSAL ══
  {
    id: "nihila", name: "Nihila", element: "Abyssal", classe: "Assassine", rarity: 5,
    portrait: "🌀", lore: "Née des profondeurs corrompues, elle tranche dans l'obscurité.",
    baseStats: { pv:1900, atq:420, mag:280, def:140, res:160, vit:130, crit:28, cdmg:220, pen:18 },
    skills: [
      { id:"s0", name:"Griffes Abyssales", type:"atk", power:1.2, cooldown:0, desc:"Attaque rapide avec saignement." },
      { id:"s1", name:"Plongée dans l'Abîme", type:"atk", power:2.0, cooldown:3, desc:"Attaque surprise: dégâts × 1.5 si ennemi debuff." },
      { id:"s2", name:"Marque Abyssale", type:"debuff", power:0, cooldown:3, desc:"Applique Poison + réduit RES de 15%." },
      { id:"s3", name:"Gouffre Maudit", type:"ultimate", power:3.5, cooldown:6, desc:"Ultime: Dégâts massifs + Poison + exécution si <25% PV.", isUltimate:true },
    ]
  },
  {
    id: "vexara", name: "Vexara", element: "Abyssal", classe: "Mage", rarity: 4,
    portrait: "🕳️", lore: "Sorcière des profondeurs, elle puise dans les âmes perdues.",
    baseStats: { pv:2000, atq:180, mag:400, def:150, res:220, vit:100, crit:16, cdmg:185, pen:10 },
    skills: [
      { id:"s0", name:"Orbe du Vide", type:"mag", power:1.0, cooldown:0, desc:"Projectile abyssal." },
      { id:"s1", name:"Drain d'Âme", type:"mag_drain", power:1.4, cooldown:3, desc:"Vol de PV (50% des dégâts)." },
      { id:"s2", name:"Malédiction Abyssale", type:"debuff_aoe", power:0, cooldown:4, desc:"Réduit ATQ et MAG ennemis de 20%." },
      { id:"s3", name:"Appel du Néant", type:"ultimate", power:3.8, cooldown:7, desc:"Ultime: Dégâts massifs + Silence tous ennemis.", isUltimate:true },
    ]
  },
  {
    id: "ragna", name: "Ragna", element: "Abyssal", classe: "Berserker", rarity: 7,
    portrait: "💀", lore: "Guerrière ancestrale consumée par les ténèbres, sa rage est légendaire.",
    baseStats: { pv:3800, atq:520, mag:180, def:220, res:180, vit:105, crit:25, cdmg:210, pen:15 },
    skills: [
      { id:"s0", name:"Hache des Abysses", type:"atk", power:1.4, cooldown:0, desc:"Coup dévastateur." },
      { id:"s1", name:"Furie Abyssale", type:"atk_multi", power:0.8, cooldown:2, desc:"3 coups + ATQ↑ par coup porté." },
      { id:"s2", name:"Rage Maudite", type:"buff_self", power:0, cooldown:4, desc:"ATQ +40%, DEF -20% pour 3 tours." },
      { id:"s3", name:"Apocalypse Sombre", type:"ultimate", power:4.5, cooldown:7, desc:"Ultime: Dégâts colossaux + se soigne de 30% PV max.", isUltimate:true },
    ]
  },

  // ══ OMBRAL ══
  {
    id: "noctara", name: "Noctara", element: "Ombral", classe: "Assassine", rarity: 5,
    portrait: "🌑", lore: "Chasseuse de l'ombre, invisible jusqu'à l'instant fatal.",
    baseStats: { pv:1800, atq:440, mag:260, def:130, res:150, vit:140, crit:32, cdmg:230, pen:20 },
    skills: [
      { id:"s0", name:"Lame de l'Ombre", type:"atk", power:1.2, cooldown:0, desc:"Frappe rapide depuis l'ombre." },
      { id:"s1", name:"Dissimulation", type:"buff_self", power:0, cooldown:3, desc:"Esquive +50% pendant 2 tours." },
      { id:"s2", name:"Coup d'Exécution", type:"atk", power:2.5, cooldown:4, desc:"Dégâts × 2 contre cibles <50% PV." },
      { id:"s3", name:"Nuit Éternelle", type:"ultimate", power:3.8, cooldown:6, desc:"Ultime: Attaque toute l'équipe ennemie + Étourdit 1 tour.", isUltimate:true },
    ]
  },
  {
    id: "sylphe", name: "Sylphe", element: "Ombral", classe: "Archère", rarity: 4,
    portrait: "🌙", lore: "Archère de lune, ses flèches perçent les illusions.",
    baseStats: { pv:2000, atq:360, mag:240, def:160, res:180, vit:120, crit:24, cdmg:200, pen:14 },
    skills: [
      { id:"s0", name:"Flèche Lunaire", type:"atk", power:1.1, cooldown:0, desc:"Flèche magique ombrée." },
      { id:"s1", name:"Pluie de Flèches", type:"atk_aoe", power:0.75, cooldown:3, desc:"Flèches sur tous les ennemis." },
      { id:"s2", name:"Flèche Aveuglante", type:"atk_debuff", power:1.4, cooldown:4, desc:"Attaque + Aveugle (PRE -30%)." },
      { id:"s3", name:"Eclipse Mortelle", type:"ultimate", power:3.2, cooldown:6, desc:"Ultime: Frappe unique dévastatrice + DEF ignore 50%.", isUltimate:true },
    ]
  },
  {
    id: "umbra", name: "Umbra", element: "Ombral", classe: "Invocatrice", rarity: 3,
    portrait: "👤", lore: "Elle invoque les ombres des guerrières tombées.",
    baseStats: { pv:2200, atq:200, mag:320, def:200, res:240, vit:90, crit:12, cdmg:170, pen:6 },
    skills: [
      { id:"s0", name:"Invocation Ombre", type:"mag", power:0.9, cooldown:0, desc:"Invoque une ombre attaquante." },
      { id:"s1", name:"Armée des Ombres", type:"buff_team", power:0, cooldown:4, desc:"Toute l'équipe: esquive +20% 2 tours." },
      { id:"s2", name:"Double Ombre", type:"atk_multi", power:0.7, cooldown:3, desc:"2 attaques d'ombres simultanées." },
      { id:"s3", name:"Légion du Crépuscule", type:"ultimate", power:2.8, cooldown:6, desc:"Ultime: Invoque 3 ombres qui frappent tous les ennemis.", isUltimate:true },
    ]
  },

  // ══ SOLAIRE ══
  {
    id: "pyralia", name: "Pyralia", element: "Solaire", classe: "Attaquante", rarity: 5,
    portrait: "🔥", lore: "Guerrière du soleil brisé, ses flammes consument tout.",
    baseStats: { pv:2400, atq:400, mag:300, def:200, res:200, vit:110, crit:20, cdmg:195, pen:12 },
    skills: [
      { id:"s0", name:"Tranchant Solaire", type:"atk", power:1.2, cooldown:0, desc:"Lame enflammée." },
      { id:"s1", name:"Explosion Solaire", type:"atk_aoe", power:1.0, cooldown:3, desc:"Explosion de feu sur tous les ennemis." },
      { id:"s2", name:"Colonne de Feu", type:"atk", power:2.2, cooldown:4, desc:"Jaillissement de feu + Brûlure 3 tours." },
      { id:"s3", name:"Supernova", type:"ultimate", power:4.2, cooldown:7, desc:"Ultime: Déflagration solaire — zone totale + Brûlure.", isUltimate:true },
    ]
  },
  {
    id: "cendris", name: "Cendris", element: "Solaire", classe: "Berserker", rarity: 6,
    portrait: "💥", lore: "Née dans les cendres d'un soleil mourant, sa colère est infinie.",
    baseStats: { pv:3600, atq:480, mag:220, def:250, res:200, vit:95, crit:22, cdmg:205, pen:14 },
    skills: [
      { id:"s0", name:"Poing de Braise", type:"atk", power:1.3, cooldown:0, desc:"Coup de feu direct." },
      { id:"s1", name:"Furie Incandescente", type:"atk_multi", power:0.85, cooldown:2, desc:"4 coups de feu rapides." },
      { id:"s2", name:"Armure de Cendres", type:"buff_self", power:0, cooldown:4, desc:"DEF +35% + renvoi dégâts 15%." },
      { id:"s3", name:"Soleil Brisé", type:"ultimate", power:4.0, cooldown:7, desc:"Ultime: Explosion de cendres sur toute la zone.", isUltimate:true },
    ]
  },
  {
    id: "solaris", name: "Solaris", element: "Solaire", classe: "Soigneuse", rarity: 4,
    portrait: "☀️", lore: "Prêtresse solaire, elle purifie les âmes blessées.",
    baseStats: { pv:2600, atq:180, mag:360, def:220, res:280, vit:90, crit:10, cdmg:160, pen:4 },
    skills: [
      { id:"s0", name:"Touche Dorée", type:"heal", power:0.8, cooldown:0, desc:"Soin léger sur une alliée." },
      { id:"s1", name:"Bénédiction Solaire", type:"heal_aoe", power:0.6, cooldown:3, desc:"Soin sur toute l'équipe." },
      { id:"s2", name:"Lumière Purificatrice", type:"cleanse", power:0.5, cooldown:4, desc:"Retire tous les debuffs + soin." },
      { id:"s3", name:"Aurore Divine", type:"ultimate", power:0, cooldown:6, desc:"Ultime: Soin massif + ATQ↑ et MAG↑ équipe 3 tours.", isUltimate:true },
    ]
  },

  // ══ GLACIAL ══
  {
    id: "crystallia", name: "Crystallia", element: "Glacial", classe: "Mage", rarity: 5,
    portrait: "❄️", lore: "Maîtresse des cristaux de glace éternelle.",
    baseStats: { pv:2200, atq:180, mag:440, def:200, res:300, vit:88, crit:16, cdmg:195, pen:8 },
    skills: [
      { id:"s0", name:"Éclat de Glace", type:"mag", power:1.0, cooldown:0, desc:"Projectile de glace." },
      { id:"s1", name:"Tempête Givrée", type:"mag_aoe", power:0.8, cooldown:3, desc:"Blizzard sur tous les ennemis + Ralentissement." },
      { id:"s2", name:"Emprisonnement Glacial", type:"mag_debuff", power:1.5, cooldown:4, desc:"Gèle une cible (Étourdie 2 tours)." },
      { id:"s3", name:"Hiver Éternel", type:"ultimate", power:3.8, cooldown:7, desc:"Ultime: Gèle toute l'équipe ennemie + dégâts massifs.", isUltimate:true },
    ]
  },
  {
    id: "frosthana", name: "Frosthana", element: "Glacial", classe: "Soigneuse", rarity: 6,
    portrait: "🔮", lore: "Guérisseuse des glaces, ses larmes soignent les plus graves blessures.",
    baseStats: { pv:2800, atq:150, mag:380, def:250, res:350, vit:85, crit:8, cdmg:155, pen:3 },
    skills: [
      { id:"s0", name:"Touche de Givre", type:"heal", power:0.9, cooldown:0, desc:"Soin glacial qui ralentit aussi l'ennemi." },
      { id:"s1", name:"Soin Cristallin", type:"heal_aoe", power:0.7, cooldown:3, desc:"Soin + bouclier glacial sur toute l'équipe." },
      { id:"s2", name:"Armure de Glace", type:"shield_aoe", power:1.2, cooldown:4, desc:"Bouclier glacial pour toute l'équipe." },
      { id:"s3", name:"Tempête Curative", type:"ultimate", power:0, cooldown:6, desc:"Ultime: Résurrection d'une alliée KO + soin global.", isUltimate:true },
    ]
  },

  // ══ FULGURANT ══
  {
    id: "voltara", name: "Voltara", element: "Fulgurant", classe: "Attaquante", rarity: 5,
    portrait: "⚡", lore: "Frappée par la foudre à sa naissance, elle incarne la tempête.",
    baseStats: { pv:2100, atq:420, mag:280, def:160, res:180, vit:135, crit:26, cdmg:215, pen:16 },
    skills: [
      { id:"s0", name:"Lame Électrique", type:"atk", power:1.1, cooldown:0, desc:"Lame chargée d'électricité." },
      { id:"s1", name:"Décharge Fulminante", type:"atk_chain", power:1.0, cooldown:3, desc:"Chaîne électrique rebondissant sur 3 ennemis." },
      { id:"s2", name:"Accélération Fulgurante", type:"buff_self", power:0, cooldown:4, desc:"VIT × 2 + attaque immédiate supplémentaire." },
      { id:"s3", name:"Tempête Absolue", type:"ultimate", power:3.5, cooldown:6, desc:"Ultime: Orage sur toute la zone + Étourdit 1 tour.", isUltimate:true },
    ]
  },
  {
    id: "tempestia", name: "Tempestia", element: "Fulgurant", classe: "Mage", rarity: 8,
    portrait: "🌩️", lore: "Déesse des tempêtes célestes, son pouvoir dépasse la compréhension.",
    baseStats: { pv:2600, atq:240, mag:580, def:180, res:320, vit:110, crit:20, cdmg:230, pen:10 },
    skills: [
      { id:"s0", name:"Foudre Divine", type:"mag", power:1.3, cooldown:0, desc:"Foudre divine directe." },
      { id:"s1", name:"Orage de Comètes", type:"mag_aoe", power:1.1, cooldown:3, desc:"Pluie de foudres sur tous les ennemis." },
      { id:"s2", name:"Resonance Céleste", type:"buff_team", power:0, cooldown:4, desc:"MAG équipe +30% + Crit +10% pour 3 tours." },
      { id:"s3", name:"Jugement des Cieux", type:"ultimate", power:5.0, cooldown:8, desc:"Ultime: Déflagration divine — dégâts maximaux.", isUltimate:true },
    ]
  },

  // ══ TELLURIQUE ══
  {
    id: "terravex", name: "Terravex", element: "Tellurique", classe: "Gardienne", rarity: 5,
    portrait: "🪨", lore: "Muraille vivante de la terre ancienne, inébranlable.",
    baseStats: { pv:4000, atq:260, mag:160, def:400, res:340, vit:75, crit:8, cdmg:150, pen:4 },
    skills: [
      { id:"s0", name:"Poing de Pierre", type:"atk", power:1.1, cooldown:0, desc:"Coup de roc massif." },
      { id:"s1", name:"Fortification Runique", type:"buff_self", power:0, cooldown:3, desc:"DEF +50% + absorbe les dégâts pour les alliées." },
      { id:"s2", name:"Tremblement de Terre", type:"atk_aoe", power:0.9, cooldown:4, desc:"Frappe tout le terrain + Étourdit 1 tour." },
      { id:"s3", name:"Colonne de la Création", type:"ultimate", power:2.8, cooldown:6, desc:"Ultime: Piliers de roche, dégâts massifs + invincibilité équipe 1 tour.", isUltimate:true },
    ]
  },
  {
    id: "gaia", name: "Gaïa", element: "Tellurique", classe: "Soigneuse", rarity: 6,
    portrait: "🌿", lore: "Esprit de la terre nourricière, elle puise sa magie dans les racines du monde.",
    baseStats: { pv:3000, atq:160, mag:360, def:280, res:320, vit:80, crit:10, cdmg:160, pen:4 },
    skills: [
      { id:"s0", name:"Rosée Terrestre", type:"heal", power:1.0, cooldown:0, desc:"Soin naturel regenerant." },
      { id:"s1", name:"Floraison Runique", type:"heal_aoe", power:0.8, cooldown:3, desc:"Soin progressif sur toute l'équipe 3 tours." },
      { id:"s2", name:"Racines Protectrices", type:"shield_aoe", power:1.0, cooldown:4, desc:"Bouclier de terre pour toutes les alliées." },
      { id:"s3", name:"Éveil du Monde", type:"ultimate", power:0, cooldown:7, desc:"Ultime: Soin total équipe + Régén 5 tours + DEF↑.", isUltimate:true },
    ]
  },

  // ══ SPECTRAL ══
  {
    id: "phantera", name: "Phantera", element: "Spectral", classe: "Invocatrice", rarity: 5,
    portrait: "👻", lore: "Elle parle aux morts et en tire une armée de spectres.",
    baseStats: { pv:2300, atq:220, mag:400, def:180, res:260, vit:95, crit:15, cdmg:185, pen:8 },
    skills: [
      { id:"s0", name:"Touche Spectrale", type:"mag", power:1.0, cooldown:0, desc:"Attaque spectrale drainante." },
      { id:"s1", name:"Invocation de Spectres", type:"summon", power:1.2, cooldown:3, desc:"Invoque 2 spectres combattant pour 2 tours." },
      { id:"s2", name:"Drain Spectral", type:"mag_drain", power:1.6, cooldown:4, desc:"Vole PV et renforce les spectres invoqués." },
      { id:"s3", name:"Armée des Morts", type:"ultimate", power:3.5, cooldown:7, desc:"Ultime: Légion de spectres frappe 5 fois toute la zone.", isUltimate:true },
    ]
  },
  {
    id: "spiralia", name: "Spiralia", element: "Spectral", classe: "Assassine", rarity: 4,
    portrait: "🕊️", lore: "Fantôme vivant, elle traverse les corps sans laisser de trace.",
    baseStats: { pv:1700, atq:380, mag:300, def:120, res:200, vit:145, crit:30, cdmg:225, pen:22 },
    skills: [
      { id:"s0", name:"Lame Spectrale", type:"atk", power:1.1, cooldown:0, desc:"Frappe incorporelle, ignore boucliers." },
      { id:"s1", name:"Phase Fantôme", type:"buff_self", power:0, cooldown:3, desc:"Invincible 1 tour + attaque garantie." },
      { id:"s2", name:"Possession", type:"mag", power:2.0, cooldown:4, desc:"Prend le contrôle d'un ennemi 1 tour." },
      { id:"s3", name:"Déchirure de l'Âme", type:"ultimate", power:3.8, cooldown:6, desc:"Ultime: Dégâts massifs ignorant toutes les DEF.", isUltimate:true },
    ]
  },

  // ══ NÉANT ══
  {
    id: "voidara", name: "Voidara", element: "Néant", classe: "Mage", rarity: 11,
    portrait: "🕳️", lore: "L'Absente. Ni vivante ni morte. Son existence efface la réalité elle-même.",
    baseStats: { pv:3000, atq:300, mag:680, def:200, res:300, vit:100, crit:25, cdmg:250, pen:30 },
    skills: [
      { id:"s0", name:"Touche du Vide", type:"mag", power:1.4, cooldown:0, desc:"Attaque du néant ignorant les résistances." },
      { id:"s1", name:"Fissure Réelle", type:"mag_aoe", power:1.2, cooldown:3, desc:"Déchire la réalité — dégâts à toute la zone." },
      { id:"s2", name:"Annihilation", type:"mag", power:3.0, cooldown:5, desc:"Efface une cible (dégâts × 1.5 si elle a des buffs)." },
      { id:"s3", name:"Fin de Toutes Choses", type:"ultimate", power:6.0, cooldown:9, desc:"Ultime: Le Néant absorbe tout — dégâts inévitables sur toute la zone.", isUltimate:true },
    ]
  },

  // ══ COMMUNES & RARES POUR DÉPART ══
  {
    id: "luna", name: "Luna", element: "Ombral", classe: "Archère", rarity: 2,
    portrait: "🌙", lore: "Jeune archère de la lune, encore en apprentissage.",
    baseStats: { pv:1400, atq:280, mag:160, def:120, res:130, vit:100, crit:14, cdmg:170, pen:8 },
    skills: [
      { id:"s0", name:"Flèche Simple", type:"atk", power:1.0, cooldown:0, desc:"Flèche basique." },
      { id:"s1", name:"Double Tir", type:"atk_multi", power:0.65, cooldown:3, desc:"2 flèches." },
      { id:"s2", name:"Viser", type:"buff_self", power:0, cooldown:4, desc:"Prec +30% prochain coup." },
      { id:"s3", name:"Salve Lunaire", type:"ultimate", power:2.5, cooldown:6, desc:"Ultime: Pluie de flèches.", isUltimate:true },
    ]
  },
  {
    id: "ignis", name: "Ignis", element: "Solaire", classe: "Attaquante", rarity: 3,
    portrait: "🔥", lore: "Jeune combattante solaire, flamme naissante.",
    baseStats: { pv:1800, atq:320, mag:200, def:150, res:140, vit:105, crit:16, cdmg:175, pen:9 },
    skills: [
      { id:"s0", name:"Poing Brûlant", type:"atk", power:1.1, cooldown:0, desc:"Coup de poing enflammé." },
      { id:"s1", name:"Jet de Flammes", type:"atk_aoe", power:0.7, cooldown:3, desc:"Flammes sur 2-3 ennemis." },
      { id:"s2", name:"Cœur Ardent", type:"buff_self", power:0, cooldown:4, desc:"ATQ +25% 2 tours." },
      { id:"s3", name:"Eruption", type:"ultimate", power:2.8, cooldown:6, desc:"Ultime: Éruption volcanique.", isUltimate:true },
    ]
  },
  {
    id: "aqua", name: "Aqua", element: "Glacial", classe: "Soigneuse", rarity: 2,
    portrait: "💧", lore: "Soigneuse glaciale débutante, mais fiable.",
    baseStats: { pv:1900, atq:120, mag:260, def:180, res:200, vit:85, crit:8, cdmg:150, pen:3 },
    skills: [
      { id:"s0", name:"Soin de Rosée", type:"heal", power:0.7, cooldown:0, desc:"Petit soin." },
      { id:"s1", name:"Givre Guérisseur", type:"heal_aoe", power:0.5, cooldown:3, desc:"Soin léger équipe." },
      { id:"s2", name:"Bouclier de Glace", type:"shield", power:0.8, cooldown:4, desc:"Bouclier sur 1 alliée." },
      { id:"s3", name:"Cascade", type:"ultimate", power:0, cooldown:6, desc:"Ultime: Soin fort toute l'équipe.", isUltimate:true },
    ]
  },
  {
    id: "terra", name: "Terra", element: "Tellurique", classe: "Gardienne", rarity: 3,
    portrait: "🪨", lore: "Gardienne de pierre, première ligne fiable.",
    baseStats: { pv:2800, atq:220, mag:120, def:300, res:250, vit:72, crit:6, cdmg:145, pen:3 },
    skills: [
      { id:"s0", name:"Coup de Roc", type:"atk", power:1.0, cooldown:0, desc:"Frappe lourde." },
      { id:"s1", name:"Mur de Pierre", type:"buff_self", power:0, cooldown:3, desc:"DEF +40% 2 tours." },
      { id:"s2", name:"Secousse", type:"atk_aoe", power:0.7, cooldown:4, desc:"Mini-tremblement sur tous." },
      { id:"s3", name:"Forteresse", type:"ultimate", power:0, cooldown:6, desc:"Ultime: DEF max + protège tous les alliés.", isUltimate:true },
    ]
  },
];

export function getCharacterById(id) {
  return PLEIADES.find(c => c.id === id);
}

export function getCharactersByRarity(rarity) {
  return PLEIADES.filter(c => c.rarity === rarity);
}

export function rollGacha(pity = 0) {
  // Returns a rarity based on rates with pity system
  const rand = Math.random();

  // Pity: guaranteed 5+ at 80, soft pity starts at 60
  if (pity >= 80) return 5;
  if (pity >= 60) {
    const softMult = 1 + (pity - 60) * 0.08;
    if (rand < 0.05 * softMult) return 5;
  }

  let cumul = 0;
  const rates = { 1:0.40, 2:0.25, 3:0.15, 4:0.08, 5:0.05, 6:0.03, 7:0.02, 8:0.01, 9:0.007, 10:0.0025, 11:0.0005 };
  for (const [rarity, rate] of Object.entries(rates)) {
    cumul += rate;
    if (rand < cumul) return parseInt(rarity);
  }
  return 1;
}

export function getRandomCharacterOfRarity(rarity, bannerId = 'pleiades') {
  let pool = PLEIADES.filter(c => c.rarity === rarity);
  if (pool.length === 0) {
    // Fallback to nearest available rarity
    pool = PLEIADES.filter(c => c.rarity <= rarity);
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
