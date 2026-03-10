import { useState } from "react";

// ─── COLOUR TOKENS ────────────────────────────────────────
const C = {
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
};

// ─── ELEMENT COLOURS ─────────────────────────────────────
const ELEMS = {
  Stellaire:  { bg: "#3B2800", accent: "#FCD34D", icon: "⭐" },
  Abyssal:    { bg: "#1A0A2E", accent: "#7C3AED", icon: "🌀" },
  Ombral:     { bg: "#0F0F1F", accent: "#818CF8", icon: "🌑" },
  Solaire:    { bg: "#2D0E00", accent: "#FB923C", icon: "🔥" },
  Glacial:    { bg: "#001A2E", accent: "#67E8F9", icon: "❄️" },
  Fulgurant:  { bg: "#1A0030", accent: "#C084FC", icon: "⚡" },
  Tellurique: { bg: "#1A0A00", accent: "#92400E", icon: "🪨" },
  Spectral:   { bg: "#001A10", accent: "#6EE7B7", icon: "👻" },
  Néant:      { bg: "#000000", accent: "#CBD5E1", icon: "🕳️" },
};

// ─── ASSET DATA ───────────────────────────────────────────
const SECTIONS = [
  {
    id: "resources",
    label: "Ressources & Monnaies",
    icon: "💰",
    desc: "Icônes qui apparaissent dans la barre du haut, le shop, les récompenses",
    assets: [
      { file: "icon_gems.png",        dim: "128×128", color: "#4C1D95", preview: "💎", label: "Gemmes",           desc: "Gemme étoile violet taillée à 6 branches, translucide avec reflet interne, lueur violette externe", prompt: "a single violet star-cut gemstone, translucent with inner light glow, purple magical aura, dark fantasy Korean webtoon illustration, floating, transparent background, detailed facets, no text" },
      { file: "icon_gold.png",        dim: "128×128", color: "#78350F", preview: "💰", label: "Or / Pièces",      desc: "Sac de cuir sombre, pièces d'or qui débordent avec éclat doré, style manhwa", prompt: "a leather coin pouch with gold coins spilling out, dark leather texture, golden coins with star engraving, warm gold glow, dark fantasy Korean webtoon style, transparent background, no text" },
      { file: "icon_energy.png",      dim: "128×128", color: "#312E81", preview: "⚡", label: "Énergie",          desc: "Cristal éclair violet-blanc debout, crépitement électrique, particules autour", prompt: "a glowing purple-white lightning crystal standing upright, electric sparks around it, energy particles, dark fantasy webtoon style, transparent background, vibrant purple-cyan colors, no text" },
      { file: "icon_guild_coin.png",  dim: "128×128", color: "#713F12", preview: "🏅", label: "Pièce de Guilde",  desc: "Médaille ronde dorée gravée d'un bouclier étoilé, ruban violet attaché", prompt: "a golden guild medal coin with shield and star engraving, purple ribbon attached, ornate border, dark fantasy webtoon style, transparent background, no text" },
      { file: "icon_arena_token.png", dim: "128×128", color: "#1E3A5F", preview: "🪙", label: "Jeton d'Arène",    desc: "Hexagone argenté gravé d'épées croisées, lueur bleue froide acier", prompt: "a silver hexagonal arena token with crossed swords engraving, cold blue metallic gleam, dark fantasy webtoon illustration, transparent background, no text" },
      { file: "icon_fragments.png",   dim: "128×128", color: "#3B0764", preview: "✨", label: "Fragments",        desc: "Éclats lumineux violets-dorés de gemme brisée qui se reforment, particules magiques", prompt: "shattered gemstone fragments glowing purple and gold, pieces gathering together, magical particles, dark fantasy webtoon style, transparent background, vibrant colors, no text" },
      { file: "icon_bond_token.png",  dim: "128×128", color: "#500724", preview: "🖤", label: "Jeton de Lien",    desc: "Cœur noir stylisé enroulé d'un fil de lumière violette en spirale, étoiles aux extrémités", prompt: "a stylized dark heart wrapped in a spiral of violet light thread, two small stars at thread ends, dark fantasy webtoon illustration, transparent background, elegant and mysterious, no text" },
      { file: "icon_stamina.png",     dim: "128×128", color: "#2D1B69", preview: "🔮", label: "Stamina",          desc: "Flamme violette-blanche en forme de goutte debout, intérieur lumineux, contour sombre élégant", prompt: "a standing purple-white flame teardrop shape, glowing inner light, elegant dark outline, dark fantasy webtoon style, transparent background, vibrant magical fire, no text" },
      { file: "icon_dungeon_key.png", dim: "128×128", color: "#1C1917", preview: "🗝️", label: "Clé de Donjon",   desc: "Clé ancienne violette, crâne stylisé comme poignée, dents en runes, lueur pourpre", prompt: "an ancient purple key with a stylized skull handle, runic-shaped teeth, purple magical glow, dark fantasy webtoon style, transparent background, detailed ornate metal, no text" },
      { file: "icon_reputation.png",  dim: "128×128", color: "#422006", preview: "👁️", label: "Réputation",      desc: "Étoile à 5 branches or avec un œil stylisé ouvert au centre, rayons dorés", prompt: "a golden five-pointed star with an open stylized eye at center, golden light rays, majestic dark fantasy webtoon style, transparent background, ornate details, no text" },
    ]
  },
  {
    id: "elements",
    label: "Icônes d'Éléments",
    icon: "🌟",
    desc: "Affichées sur les cartes de personnage, filtres, compositions d'équipe",
    assets: Object.entries(ELEMS).map(([name, val]) => ({
      file: `elem_${name.toLowerCase()}.png`,
      dim: "96×96",
      color: val.bg,
      preview: val.icon,
      label: name,
      accent: val.accent,
      desc: `Emblème héraldique de l'élément ${name} — couleur signature ${val.accent}`,
      prompt: `${name} element emblem icon, dark fantasy Korean webtoon style, ${val.accent} color scheme, circular emblematic design, transparent background, no text, highly detailed`
    }))
  },
  {
    id: "classes",
    label: "Classes de Pléiades",
    icon: "⚔️",
    desc: "Icônes de classe sur les cartes, filtres et compositions",
    assets: [
      { file: "class_guardian.png",  dim: "80×80", color: "#1E3A5F", preview: "🛡️", label: "Gardienne",    desc: "Bouclier massif orné, étoile en relief, métal violet-or, crack décoratif", prompt: "massive ornate shield with embossed star, purple and gold metallic texture, decorative crack, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "class_striker.png",   dim: "80×80", color: "#3B0764", preview: "⚔️", label: "Attaquante",   desc: "Deux lames courbes croisées, métal sombre, fil lumineux violet sur le tranchant", prompt: "two crossed curved fantasy blades, dark metal with glowing purple edge, dynamic angle, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "class_mage.png",      dim: "80×80", color: "#1A0A2E", preview: "🪄", label: "Mage",         desc: "Bâton de magie, orbe violet flottant au sommet, runes gravées sur bois sombre", prompt: "magic staff with floating purple orb at top, runic engravings on dark wood, radiating energy, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "class_healer.png",    dim: "80×80", color: "#052E16", preview: "✨", label: "Soigneuse",    desc: "Calice doré avec particules lumineuses verte-or, runes de soin gravées", prompt: "golden chalice with green-gold light particles pouring out, healing runes engraved, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "class_assassin.png",  dim: "80×80", color: "#0F0F1F", preview: "🗡️", label: "Assassine",   desc: "Dague fine noire, poignée ornée, goutte de poison violet à la pointe, ombre derrière", prompt: "thin black dagger with ornate handle, purple poison drop at tip, stylized shadow behind, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "class_archer.png",    dim: "80×80", color: "#1C1917", preview: "🏹", label: "Archère",      desc: "Arc bois sombre, flèche d'énergie violette, corde en fil de lumière", prompt: "elegant dark wood bow with energy-glowing purple arrow, light thread bowstring, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "class_summoner.png",  dim: "80×80", color: "#2D0A4E", preview: "👋", label: "Invocatrice",  desc: "Main ouverte, pentagramme violet au-dessus de la paume, créature fantôme miniature", prompt: "open hand with violet light pentagram above palm, tiny ghost creature floating above, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "class_berserker.png", dim: "80×80", color: "#3B0000", preview: "🪓", label: "Berserk",      desc: "Hache double massive fendue, métal rouge-noir, fissures de feu", prompt: "massive split double axe, red-black metal, fire-filled cracks in blade, dark fantasy Korean webtoon icon, transparent background, no text" },
    ]
  },
  {
    id: "backgrounds",
    label: "Fonds & Décors",
    icon: "🗺️",
    desc: "Arrière-plans des combats, menus, carte du monde — format 16:9",
    assets: [
      { file: "bg_worldmap.png",          dim: "1920×1080", color: "#050208", preview: "🌍", label: "Carte du Monde",      desc: "Vue cosmique : 7 continents flottants reliés par filaments dorés, nébuleuse violet-bleu, étoiles", prompt: "aerial view of floating fantasy world Apollion, 7 floating continents connected by golden light filaments, purple-blue nebula background, twinkling stars, epic dark fantasy Korean webtoon illustration, wide shot, no characters, no text" },
      { file: "bg_stellar_plains.png",    dim: "1920×1080", color: "#0A0A1A", preview: "🌾", label: "Plaines Stellaires",  desc: "Herbe translucide blanc-bleu, colonnes dorées brisées, ciel nocturne avec étoiles géantes", prompt: "celestial plains with translucent white-blue grass, broken golden column ruins, night sky with giant visible stars, oblique sunlight filaments, dark fantasy Korean webtoon background, no characters, no text" },
      { file: "bg_abyss.png",             dim: "1920×1080", color: "#07000F", preview: "🌑", label: "Abysses Corrompus",   desc: "Gouffres infinis, cristaux violet-noir, brouillard violet au sol, ténèbres totales au plafond", prompt: "corrupted abyss with infinite dark chasms, black-violet crystal spires, purple ground fog, absolute darkness ceiling, malevolent crystal glow, dark fantasy Korean webtoon background, no characters, no text" },
      { file: "bg_soul_forest.png",       dim: "1920×1080", color: "#001508", preview: "🌿", label: "Forêt des Âmes",      desc: "Troncs translucides avec sève verte lumineuse, flammes cyan errantes, mousses bioluminescentes", prompt: "ancient forest with translucent tree trunks showing glowing green sap, wandering cyan flame spirits, bioluminescent moss floor, soft green mist, dark fantasy Korean webtoon background, no characters, no text" },
      { file: "bg_broken_city.png",       dim: "1920×1080", color: "#0C0C14", preview: "🏚️", label: "Cité Brisée",         desc: "Cathédrales gothiques aux vitraux brisés, tours écroulées, dallage marbre noir-or, lumière lunaire", prompt: "Gothic city ruins, cathedrals with shattered stained glass, half-collapsed towers with floating debris, cracked black-gold marble floor, cold moonlight, dark fantasy Korean webtoon background, no characters, no text" },
      { file: "bg_glacial_peak.png",      dim: "1920×1080", color: "#001020", preview: "🏔️", label: "Pic Glacial",         desc: "Sommet au-dessus des nuages, cristaux glace cyan monumentaux, aurores violettes-vertes, neige lente", prompt: "mountain summit above clouds, monumental blue-cyan ice crystal formations, purple-green northern lights, slow snow particles, everything sparkling, dark fantasy Korean webtoon background, no characters, no text" },
      { file: "bg_solar_sanctuary.png",   dim: "1920×1080", color: "#1A0500", preview: "🔥", label: "Sanctuaire Solaire",  desc: "Temple dans les cendres volantes, piliers basalte doré, autel avec flammes éternelles, lava dorée", prompt: "ancient temple in flying ashes, golden basalt pillars, central altar with eternal orange-red flames, ash particles, cracked golden lava floor, dark fantasy Korean webtoon background, no characters, no text" },
      { file: "bg_gacha_portal.png",      dim: "1920×1080", color: "#0A0018", preview: "🌀", label: "Portail Gacha",        desc: "Grand portail circulaire violet-noir tournant, runes en orbite, espace cosmique visible derrière", prompt: "large circular purple-black summoning portal slowly rotating, ancient runes orbiting, cosmic space visible through portal, energy radiating outward, dark fantasy Korean webtoon background, no characters, no text" },
      { file: "bg_dungeon_editor.png",    dim: "1920×1080", color: "#050510", preview: "🏗️", label: "Éditeur de Donjon",   desc: "Vue du haut, grille hexagonale sombre, murs gothiques, flambeaux violets, perspective isométrique", prompt: "top-down dungeon construction view, dark hexagonal grid on black, gothic stone walls, purple torches at corners, slightly isometric perspective, dark fantasy Korean webtoon style, no characters, no text" },
    ]
  },
  {
    id: "fx",
    label: "Effets de Combat",
    icon: "💥",
    desc: "Sprites superposés lors des compétences — fond transparent obligatoire — 512×512",
    assets: [
      { file: "fx_stellar_burst.png",  dim: "512×512", color: "#2D1A00", preview: "💛", label: "Explosion Stellaire",  desc: "Explosion radiale dorée, étoiles projetées dans toutes les directions, traînées de lumière", prompt: "radial golden light explosion with star projectiles in all directions, light trails, energy burst, dark fantasy webtoon VFX sprite, transparent background, no characters" },
      { file: "fx_abyss_vortex.png",   dim: "512×512", color: "#1A0A2E", preview: "🟣", label: "Vortex Abyssal",       desc: "Vortex violet qui aspire la lumière, spirale de ténèbres, éclats projetés vers l'extérieur", prompt: "purple light-absorbing vortex, darkness spiral, dark shards projected outward, energy implosion, dark fantasy webtoon VFX sprite, transparent background" },
      { file: "fx_shadow_slash.png",   dim: "512×512", color: "#0A0A14", preview: "⬛", label: "Lame d'Ombre",         desc: "Lames de ténèbres tranchantes en croix, éclat de shadow avec traînées de noirceur", prompt: "dark shadow blades crossing, shadow burst with darkness trails, slashing motion, dark fantasy webtoon VFX sprite, transparent background" },
      { file: "fx_solar_column.png",   dim: "512×512", color: "#2D0800", preview: "🔶", label: "Colonne Solaire",      desc: "Colonne de flammes orangées jaillissant du bas, cendres qui retombent, distorsion de chaleur", prompt: "orange fire column erupting from below, falling ashes, heat distortion shimmer, dark fantasy webtoon VFX sprite, transparent background" },
      { file: "fx_ice_star.png",       dim: "512×512", color: "#001828", preview: "🔵", label: "Étoile de Glace",      desc: "Cristaux de glace en étoile autour d'un point central, souffle de froid visible", prompt: "ice crystals forming in star pattern around center point, visible cold breath effect, freezing dark fantasy webtoon VFX sprite, transparent background" },
      { file: "fx_lightning_arc.png",  dim: "512×512", color: "#1A0030", preview: "⚡", label: "Arc Fulgurant",        desc: "Arcs électriques violet-blanc qui rayonnent, réseau de foudre crépitant", prompt: "purple-white electric arcs radiating from center, lightning network pattern, crackling energy, dark fantasy webtoon VFX sprite, transparent background" },
      { file: "fx_earth_impact.png",   dim: "512×512", color: "#140800", preview: "🟤", label: "Impact Tellurique",    desc: "Sol fissuré avec onde de choc circulaire, piliers de roche, débris de pierre en vol", prompt: "ground cracking with circular shockwave, rock pillars emerging, flying stone debris, dark fantasy webtoon VFX sprite, transparent background" },
      { file: "fx_soul_drain.png",     dim: "512×512", color: "#001A10", preview: "🟢", label: "Drain Spectral",       desc: "Fil d'énergie verte en spirale, formes fantômes, particules d'âme flottantes", prompt: "translucent green energy thread spiraling, ghost shapes swirling, soul particles floating, dark fantasy webtoon VFX sprite, transparent background" },
      { file: "fx_void_rift.png",      dim: "512×512", color: "#000000", preview: "⚫", label: "Fissure du Néant",     desc: "Déchirure dans la réalité — fissure noire avec étoiles visibles derrière, bords qui scintillent", prompt: "reality tear, black rift with stars visible behind, irregular shimmering edges, void opening, dark fantasy webtoon VFX sprite, transparent background" },
      { file: "fx_critical_hit.png",   dim: "512×512", color: "#2D1800", preview: "💫", label: "Coup Critique",        desc: "Explosion d'impact dorée, rayons qui irradient, petites étoiles, burst rouge-or", prompt: "golden impact explosion with radiating rays, small stars around impact, stylized gold-red damage burst, dark fantasy webtoon VFX sprite, transparent background" },
      { file: "fx_heal_burst.png",     dim: "512×512", color: "#022C22", preview: "💚", label: "Soin",                 desc: "Particules lumineuses verte-dorée qui remontent, croix de soin au centre, bulles lumineuses", prompt: "green-gold light particles rising upward, stylized healing cross at center, glowing bubbles, dark fantasy webtoon VFX sprite, transparent background" },
      { file: "fx_shield_pop.png",     dim: "512×512", color: "#1A0A2E", preview: "🔮", label: "Bouclier Brisé",       desc: "Sphère de bouclier violette translucide qui éclate en verre lumineux, onde circulaire", prompt: "translucent purple shield sphere shattering into glowing glass shards, circular energy wave, dark fantasy webtoon VFX sprite, transparent background" },
    ]
  },
  {
    id: "status",
    label: "Icônes de Statut",
    icon: "🔰",
    desc: "Flottent autour des personnages en combat — 48×48 — lisibles en un coup d'œil",
    assets: [
      { file: "status_poison.png",      dim: "48×48", color: "#052E16", preview: "☠️", label: "Poison",        desc: "Goutte verte acide avec crâne stylisé à l'intérieur, contour vert-noir" },
      { file: "status_frozen.png",      dim: "48×48", color: "#082F49", preview: "❄️", label: "Gelé",          desc: "Flocon de glace cyan qui emprisonne un point lumineux, bords de cristal" },
      { file: "status_stunned.png",     dim: "48×48", color: "#3B2500", preview: "😵", label: "Étourdi",       desc: "Éclair jaune-orange qui tourne en cercle avec des étoiles autour" },
      { file: "status_burning.png",     dim: "48×48", color: "#3B0A00", preview: "🔥", label: "Brûlure",       desc: "Petite flamme orange-rouge vive, légère fumée noire au sommet" },
      { file: "status_silenced.png",    dim: "48×48", color: "#1A0A2E", preview: "🔇", label: "Silence",       desc: "Bulle de dialogue barrée d'une croix violette — impossibilité de sorts" },
      { file: "status_shielded.png",    dim: "48×48", color: "#1E1B4B", preview: "🛡️", label: "Bouclier",     desc: "Petit bouclier violet translucide brillant, lueur protectrice" },
      { file: "status_atk_up.png",      dim: "48×48", color: "#3B0000", preview: "⬆️", label: "ATQ ↑",        desc: "Épée avec flèche vers le haut en rouge-or, offensif et dynamique" },
      { file: "status_def_up.png",      dim: "48×48", color: "#052E16", preview: "🛡️", label: "DEF ↑",        desc: "Bouclier solide avec flèche vers le haut en vert-or" },
      { file: "status_speed_up.png",    dim: "48×48", color: "#082F49", preview: "💨", label: "VIT ↑",        desc: "Deux traits de vitesse cyan avec flèche vers le haut, impression de rapidité" },
      { file: "status_regen.png",       dim: "48×48", color: "#022C22", preview: "💚", label: "Régén",         desc: "Croix de soin verte avec particules lumineuses qui remontent" },
      { file: "status_doom.png",        dim: "48×48", color: "#1C0000", preview: "💀", label: "Malédiction",   desc: "Crâne noir avec minuteur doré — compte à rebours fatal" },
      { file: "status_invincible.png",  dim: "48×48", color: "#2D2000", preview: "⭐", label: "Invincible",   desc: "Étoile dorée avec contour de lumière rayonnante — invulnérabilité" },
    ]
  },
  {
    id: "dungeon",
    label: "Pièges & Monstres (Donjon)",
    icon: "🏰",
    desc: "Icônes posables dans l'éditeur de donjon — reconnaissables à 32px",
    assets: [
      { file: "trap_spike.png",       dim: "80×80", color: "#1A0000", preview: "🩸", label: "Piques",          desc: "Pic métallique jaillissant avec sang stylisé, cercle d'alerte rouge", prompt: "metal spike trap shooting upward, stylized blood splatter, red alert circle, dungeon floor, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "trap_fire.png",        dim: "80×80", color: "#2D0800", preview: "🔥", label: "Jet de Feu",       desc: "Jet de flamme horizontal orange-rouge, sol de pierres noircies", prompt: "horizontal fire jet trap, orange-red flames, heat distortion, scorched stone floor, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "trap_ice.png",         dim: "80×80", color: "#001828", preview: "❄️", label: "Piques de Glace",  desc: "Cristaux de glace qui surgissent en étoile, sol givré", prompt: "ice crystals erupting in star pattern, frosted floor around, cold breath, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "trap_poison.png",      dim: "80×80", color: "#052E16", preview: "☠️", label: "Champignon Toxique", desc: "Champignon sombre qui crache spores vertes toxiques, sol humide", prompt: "dark mushroom spewing green toxic spore cloud, damp dungeon floor, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "trap_lightning.png",   dim: "80×80", color: "#1A0030", preview: "⚡", label: "Bobine Tesla",     desc: "Bobine Tesla fantasy avec arcs violet-blanc, cercle d'impact au sol", prompt: "fantasy tesla coil with purple-white electric arcs, impact circle on floor, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "trap_alarm.png",       dim: "80×80", color: "#1A0000", preview: "🔴", label: "Orbe d'Alarme",   desc: "Orbe cristal rouge pulsant sur piédestal, rayons d'alerte", prompt: "pulsing red crystal orb on pedestal, alert rays radiating outward, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "trap_teleport.png",    dim: "80×80", color: "#0F1030", preview: "🌀", label: "Portail Piège",   desc: "Cercle runique bleu-violet au sol, portail miniature, fils de lumière en spirale", prompt: "runic circle portal on floor opening, blue-violet miniature rift, spiral light threads, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "monster_skeleton.png", dim: "80×80", color: "#1A0A00", preview: "💀", label: "Squelette",        desc: "Squelette guerrier avec armure brisée, épée rouillée, os lumineux violets", prompt: "warrior skeleton with cracked dungeon armor, rusty sword, violet glowing bones, threatening pose, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "monster_golem.png",    dim: "80×80", color: "#0F0F0F", preview: "🗿", label: "Golem",            desc: "Golem de pierre sombre, runes gravées lumineuses, poings massifs", prompt: "dark stone golem with glowing carved runes, massive fists, slow imposing stance, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "monster_wraith.png",   dim: "80×80", color: "#0A0A1E", preview: "👻", label: "Spectre",          desc: "Fantôme translucide violet avec griffes étirées, visage effacé, voile de ténèbres", prompt: "translucent purple wraith ghost with stretched claws, erased face, darkness veil, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "monster_spider.png",   dim: "80×80", color: "#0A0A00", preview: "🕷️", label: "Araignée",         desc: "Araignée sombre avec carapace violette, 8 yeux rouges luisants, toile magique", prompt: "dark spider with purple carapace, 8 glowing red eyes, magical web around, dark fantasy Korean webtoon icon, transparent background, no text" },
      { file: "monster_gargoyle.png", dim: "80×80", color: "#1A1A1A", preview: "🦇", label: "Gargouille",       desc: "Gargouille de pierre animée, ailes déployées, yeux de braise, crocs visibles", prompt: "animated stone gargoyle with spread stone wings, ember eyes, visible fangs, dark fantasy Korean webtoon icon, transparent background, no text" },
    ]
  },
  {
    id: "rewards",
    label: "Récompenses & Coffres",
    icon: "🎁",
    desc: "Coffres, médailles et trophées — affichés dans les récompenses et le profil",
    assets: [
      { file: "reward_chest_common.png",    dim: "128×128", color: "#1C1917", preview: "📦", label: "Coffre Commun",     desc: "Coffre de bois sombre, serrure simple métal, lumière blanche au bord du couvercle entrouvert", prompt: "dark wood chest with simple metal lock, white light glowing at slightly open lid, common reward, dark fantasy Korean webtoon style, transparent background" },
      { file: "reward_chest_rare.png",      dim: "128×128", color: "#0A1A3B", preview: "📫", label: "Coffre Rare",       desc: "Coffre métal bleu avec gravures runiques, serrure cristalline, lueur bleue sous le couvercle", prompt: "blue metal chest with runic engravings, crystal lock, blue glow seeping under lid, rare reward, dark fantasy Korean webtoon style, transparent background" },
      { file: "reward_chest_legendary.png", dim: "128×128", color: "#2D1A00", preview: "📯", label: "Coffre Légendaire", desc: "Coffre doré massif avec ornements en spirale, serrure étoilée, rayon de lumière dorée qui jaillit", prompt: "massive golden chest with spiral ornaments, star-shaped lock, golden light ray shooting from lid, legendary reward, dark fantasy Korean webtoon style, transparent background" },
      { file: "reward_chest_secret.png",    dim: "128×128", color: "#000000", preview: "🌌", label: "Coffre Secret",     desc: "Coffre noir cosmique, étoiles visibles à travers, serrure de néant, distorsion spatiale", prompt: "cosmic black chest with stars visible through it, void lock, space distortion around it, ultra rare secret, dark fantasy Korean webtoon style, transparent background" },
      { file: "medal_bronze.png",           dim: "96×96",   color: "#1C0A00", preview: "🥉", label: "Médaille Bronze",  desc: "Médaille ronde bronze, étoile gravée, ruban rouge-brun, légère patine ancienne", prompt: "round bronze medal with engraved star, red-brown ribbon, aged patina, dark fantasy Korean webtoon style, transparent background, no text" },
      { file: "medal_silver.png",           dim: "96×96",   color: "#111827", preview: "🥈", label: "Médaille Argent",  desc: "Médaille ronde argent brillant, étoile et runes gravées, ruban bleu argent", prompt: "round silver medal with star and rune engravings, silver-blue ribbon, dark fantasy Korean webtoon style, transparent background, no text" },
      { file: "medal_gold.png",             dim: "96×96",   color: "#2D1A00", preview: "🥇", label: "Médaille Or",      desc: "Médaille ronde or, étoile dorée en relief avec rayons, ruban violet", prompt: "round gold medal with raised gold star and rays, purple ribbon, prestigious dark fantasy Korean webtoon style, transparent background, no text" },
      { file: "medal_stellar.png",          dim: "96×96",   color: "#1A0A2E", preview: "⭐", label: "Médaille Stellaire","desc": "Médaille hexagonale violette-or, étoile multibranche, particules lumineuses orbitantes", prompt: "hexagonal purple-gold medal with multi-branch star, orbiting light particles, golden ribbon, epic dark fantasy Korean webtoon style, transparent background, no text" },
      { file: "trophy_guild.png",           dim: "128×128", color: "#1A0800", preview: "🏆", label: "Trophée Guilde",   desc: "Coupe gothique ornementée, épées croisées derrière, couleur or-noir, gravures de combat", prompt: "ornate gothic guild trophy cup, two crossed swords behind, gold-black color, combat engravings, dark fantasy Korean webtoon style, transparent background, no text" },
      { file: "trophy_arena.png",           dim: "128×128", color: "#0A0A1A", preview: "🗡️", label: "Trophée Arène",   desc: "Gladius romain stylisé planté dans un piédestal, couronne de lauriers noirs-or", prompt: "stylized roman gladius planted in pedestal, black and gold laurel crown, arena champion trophy, dark fantasy Korean webtoon style, transparent background, no text" },
    ]
  },
  {
    id: "branding",
    label: "Logo & Branding",
    icon: "✴️",
    desc: "Assets de marque, écrans système, cadres de profil",
    assets: [
      { file: "logo_apollion.png",          dim: "800×400",  color: "#07030F", preview: "🌟", label: "Logo Principal",      desc: "APOLLION en lettres serif majuscules espacées, couleur or avec lueur violette, petite étoile 8 branches entre les lettres", prompt: "APOLLION wordmark logo, serif capital letters with spacing, gold color with violet magical glow, small 8-pointed star between A and P letters, transparent background, dark fantasy style, clean elegant design, no extra elements" },
      { file: "icon_app.png",               dim: "512×512",  color: "#07030F", preview: "🔮", label: "Icône Application",    desc: "Fond carré arrondi violet-noir, étoile 8 branches or au centre avec lueur, sobre et reconnaissable", prompt: "app icon, dark purple-black rounded square background, centered golden 8-pointed star with glow, dark fantasy game icon, clean minimal design, no text" },
      { file: "splash_loading.png",         dim: "1920×1080", color: "#000000", preview: "⚫", label: "Écran de Chargement", desc: "Fond noir absolu, logo Apollion centré en or, barre de chargement fine violette, citation lore en italique blanc, particules d'étoiles légères", prompt: "loading screen, absolute black background, centered Apollion logo in gold with purple glow, thin purple loading bar below, italic white text below, very subtle star particles, no extra elements" },
      { file: "frame_profile_basic.png",    dim: "256×256",  color: "#0D0020", preview: "🔵", label: "Cadre Profil Basique", desc: "Anneau circulaire violet simple avec légères étoiles intégrées dans le bord", prompt: "basic circular profile frame, simple violet ring with subtle star details in border, elegant minimal, dark fantasy game style, transparent center and background" },
      { file: "frame_profile_legendary.png",dim: "256×256",  color: "#1A0D00", preview: "🟡", label: "Cadre Profil Légend.", desc: "Anneau complexe avec ornements floraux gothiques dorés, gemmes aux quatre points cardinaux, aura lumineuse", prompt: "legendary circular profile frame, complex ring with golden gothic floral ornaments, gems at four cardinal points, luminous aura, dark fantasy game style, transparent center and background" },
      { file: "divider_ornament.png",       dim: "800×40",   color: "#07030F", preview: "〰️", label: "Séparateur Décoratif", desc: "Motif central d'étoile avec deux lignes ornementées qui s'étendent, or sur fond transparent", prompt: "decorative horizontal UI divider, central star motif with two ornate scrollwork lines extending left and right, gold color, dark fantasy style, transparent background" },
    ]
  }
];

// ─── ASSET CARD ──────────────────────────────────────────
function AssetCard({ asset, onSelect }) {
  return (
    <div
      onClick={() => onSelect(asset)}
      style={{
        background: `linear-gradient(145deg, ${asset.color}CC, ${C.card})`,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "14px 14px 12px",
        cursor: "pointer",
        transition: "all 0.18s ease",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = C.accentHi;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${C.accent}44`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Preview emoji + dim badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 32, lineHeight: 1 }}>{asset.preview}</span>
        <span style={{
          fontSize: 10, fontFamily: "monospace",
          background: `${C.accent}33`, color: C.accentHi,
          border: `1px solid ${C.accent}55`,
          borderRadius: 4, padding: "2px 6px",
          whiteSpace: "nowrap"
        }}>{asset.dim}</span>
      </div>

      {/* Label */}
      <div style={{ color: C.text, fontWeight: 700, fontSize: 13, letterSpacing: 0.3 }}>
        {asset.label}
      </div>

      {/* Filename */}
      <div style={{
        color: C.muted, fontSize: 10, fontFamily: "monospace",
        background: "#00000033", borderRadius: 4, padding: "3px 6px",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
      }}>
        {asset.file}
      </div>

      {/* Description preview */}
      <div style={{
        color: C.muted, fontSize: 11, lineHeight: 1.4,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
      }}>
        {asset.desc}
      </div>

      {/* Prompt indicator */}
      {asset.prompt && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          width: 6, height: 6, borderRadius: "50%",
          background: C.green, boxShadow: `0 0 6px ${C.green}`
        }} title="Prompt Imagen 4 disponible" />
      )}
    </div>
  );
}

// ─── DETAIL PANEL ────────────────────────────────────────
function DetailPanel({ asset, onClose }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(asset.prompt || "Pas de prompt pour cet asset");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#00000099",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 24, backdropFilter: "blur(4px)"
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.surface, border: `1px solid ${C.accentHi}`,
          borderRadius: 16, padding: 28, maxWidth: 640, width: "100%",
          boxShadow: `0 24px 64px #00000088, 0 0 40px ${C.accent}33`,
          display: "flex", flexDirection: "column", gap: 16
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 48 }}>{asset.preview}</span>
            <div>
              <div style={{ color: C.text, fontWeight: 800, fontSize: 20 }}>{asset.label}</div>
              <div style={{ color: C.muted, fontSize: 12, fontFamily: "monospace" }}>{asset.file}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: `1px solid ${C.border}`,
            color: C.muted, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 16
          }}>✕</button>
        </div>

        {/* Dims + format */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Dimensions", val: asset.dim + "px" },
            { label: "Format", val: asset.file.split(".").pop().toUpperCase() },
            { label: "Fond", val: asset.prompt?.includes("transparent") ? "Transparent" : "Opaque" },
          ].map(b => (
            <div key={b.label} style={{
              background: `${C.accent}22`, border: `1px solid ${C.accent}44`,
              borderRadius: 8, padding: "6px 12px", display: "flex", gap: 6, alignItems: "center"
            }}>
              <span style={{ color: C.muted, fontSize: 11 }}>{b.label}</span>
              <span style={{ color: C.accentHi, fontWeight: 700, fontSize: 12 }}>{b.val}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{
          background: "#00000033", borderRadius: 10, padding: "12px 16px",
          border: `1px solid ${C.border}`
        }}>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Description visuelle</div>
          <div style={{ color: C.text, fontSize: 14, lineHeight: 1.6 }}>{asset.desc}</div>
        </div>

        {/* Prompt */}
        {asset.prompt ? (
          <div style={{
            background: "#001A0A", borderRadius: 10, padding: "12px 16px",
            border: `1px solid ${C.green}44`
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ color: C.green, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
                🎨 Prompt Imagen 4
              </div>
              <button onClick={copy} style={{
                background: copied ? `${C.green}33` : `${C.accent}22`,
                border: `1px solid ${copied ? C.green : C.accent}66`,
                color: copied ? C.green : C.accentHi,
                borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700
              }}>
                {copied ? "✓ Copié !" : "Copier"}
              </button>
            </div>
            <div style={{ color: "#86EFAC", fontSize: 13, lineHeight: 1.6, fontFamily: "monospace", fontStyle: "italic" }}>
              {asset.prompt}
            </div>
          </div>
        ) : (
          <div style={{
            background: "#0A0A1A", borderRadius: 10, padding: "12px 16px",
            border: `1px solid ${C.border}`, color: C.muted, fontSize: 13
          }}>
            Cet asset est généré en code (CSS/SVG) — pas de prompt Imagen 4 nécessaire.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("resources");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const current = SECTIONS.find(s => s.id === activeSection);

  const filtered = current?.assets.filter(a =>
    !search ||
    a.label.toLowerCase().includes(search.toLowerCase()) ||
    a.file.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const totalAssets = SECTIONS.reduce((acc, s) => acc + s.assets.length, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: "'Georgia', serif",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* ── TOP BAR ── */}
      <div style={{
        background: `${C.surface}EE`,
        borderBottom: `1px solid ${C.border}`,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(10px)",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 3, color: C.gold }}>
            ✦ APOLLION
          </div>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, marginTop: 2 }}>
            ASSET BIBLE — {totalAssets} ASSETS VISUELS
          </div>
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un asset..."
          style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: "8px 14px",
            color: C.text, fontSize: 13,
            width: 240, outline: "none",
            fontFamily: "sans-serif"
          }}
          onFocus={e => e.target.style.borderColor = C.accentHi}
          onBlur={e => e.target.style.borderColor = C.border}
        />
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* ── SIDEBAR ── */}
        <div style={{
          width: 220,
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          position: "sticky",
          top: 65,
          height: "calc(100vh - 65px)",
          overflowY: "auto"
        }}>
          <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, paddingLeft: 8 }}>
            Catégories
          </div>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveSection(s.id); setSearch(""); }}
              style={{
                background: activeSection === s.id ? `${C.accent}33` : "transparent",
                border: activeSection === s.id ? `1px solid ${C.accent}` : "1px solid transparent",
                borderRadius: 8,
                padding: "9px 12px",
                color: activeSection === s.id ? C.text : C.muted,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                transition: "all 0.15s"
              }}
            >
              <span>{s.icon}</span>
              <span style={{ flex: 1 }}>{s.label}</span>
              <span style={{
                background: `${C.accent}22`, color: C.muted,
                fontSize: 10, borderRadius: 10, padding: "1px 6px"
              }}>{s.assets.length}</span>
            </button>
          ))}

          {/* Stats */}
          <div style={{
            marginTop: "auto", paddingTop: 16,
            borderTop: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column", gap: 6
          }}>
            {[
              { label: "Total assets", val: totalAssets },
              { label: "Avec prompt IA", val: SECTIONS.reduce((acc, s) => acc + s.assets.filter(a => a.prompt).length, 0) },
              { label: "Catégories", val: SECTIONS.length },
            ].map(stat => (
              <div key={stat.label} style={{
                display: "flex", justifyContent: "space-between",
                padding: "4px 8px", fontSize: 11
              }}>
                <span style={{ color: C.muted }}>{stat.label}</span>
                <span style={{ color: C.accentHi, fontWeight: 700 }}>{stat.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
          {current && (
            <>
              {/* Section header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>{current.icon}</span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: 1 }}>
                      {current.label}
                    </h2>
                    <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{current.desc}</div>
                  </div>
                </div>
                <div style={{
                  marginTop: 16, padding: "10px 16px",
                  background: `${C.gold}11`, border: `1px solid ${C.gold}33`,
                  borderRadius: 8, display: "flex", alignItems: "center", gap: 8
                }}>
                  <span style={{ color: C.gold, fontSize: 12 }}>●</span>
                  <span style={{ color: C.muted, fontSize: 12 }}>
                    Cliquer sur un asset pour voir sa description complète et son prompt Imagen 4 •{" "}
                    <span style={{ color: C.green }}>● = prompt disponible</span>
                  </span>
                </div>
              </div>

              {/* Grid */}
              {filtered.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                  gap: 14
                }}>
                  {filtered.map(a => (
                    <AssetCard key={a.file} asset={a} onSelect={setSelected} />
                  ))}
                </div>
              ) : (
                <div style={{ color: C.muted, textAlign: "center", padding: "60px 0", fontSize: 15 }}>
                  Aucun asset trouvé pour "{search}"
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── DETAIL MODAL ── */}
      {selected && <DetailPanel asset={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
