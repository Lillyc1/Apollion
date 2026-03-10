import { useState, useEffect, useRef, useCallback } from 'react';
import { C, ELEMENTS } from '../theme.js';
import { useGame } from '../store/GameContext.jsx';
import { getCharacterById } from '../data/characters.js';
import { getEnemyById, ENEMIES } from '../data/enemies.js';

// ─── Combat Engine ────────────────────────────────────────
function initUnit(charData, isEnemy = false, level = 1) {
  const stats = { ...charData.baseStats };
  const mult = 1 + (level - 1) * 0.05;
  return {
    id: `${charData.id}_${Math.random().toString(36).slice(2)}`,
    name: charData.name,
    portrait: charData.portrait,
    element: charData.element,
    isEnemy,
    maxHp: Math.round(stats.pv * mult),
    hp: Math.round(stats.pv * mult),
    atq: Math.round(stats.atq * mult),
    mag: Math.round(stats.mag * mult),
    def: Math.round(stats.def * mult),
    res: Math.round(stats.res * mult),
    vit: Math.round(stats.vit * mult),
    crit: stats.crit,
    cdmg: stats.cdmg,
    pen: stats.pen || 0,
    skills: charData.skills,
    skillCooldowns: Object.fromEntries(charData.skills.map(s => [s.id, 0])),
    buffs: [],   // {type, value, turns}
    debuffs: [], // {type, value, turns}
    statuses: [], // 'poison','frozen','stunned','burning','silenced'
    shield: 0,
    regen: 0,
    isKO: false,
  };
}

function calcDamage(attacker, target, skill) {
  const isMag = ['mag','mag_aoe','mag_drain','mag_debuff'].includes(skill.type);
  const baseDmg = isMag ? attacker.mag : attacker.atq;
  let dmg = baseDmg * (skill.power || 1.0);

  // Defense reduction
  const defense = isMag ? target.res : target.def;
  const penIgnore = (attacker.pen || 0) / 100;
  const effectiveDef = defense * (1 - penIgnore);
  dmg = dmg * (1000 / (1000 + effectiveDef));

  // Element bonus
  const atkElem = ELEMENTS[attacker.element];
  if (atkElem?.strongVs === target.element) dmg *= 1.5;
  if (atkElem?.weakVs === target.element) dmg *= 0.67;

  // Crit
  const critRoll = Math.random() * 100;
  const isCrit = critRoll < attacker.crit;
  if (isCrit) dmg *= (attacker.cdmg / 100);

  // Buffs/debuffs
  const atkBuff = attacker.buffs.find(b => b.type === (isMag ? 'mag' : 'atk'));
  if (atkBuff) dmg *= (1 + atkBuff.value / 100);
  const defDebuff = target.debuffs.find(d => d.type === (isMag ? 'res' : 'def'));
  if (defDebuff) dmg *= (1 + defDebuff.value / 100);

  return { dmg: Math.max(1, Math.round(dmg)), isCrit };
}

function applyDamage(target, dmg) {
  let remaining = dmg;
  if (target.shield > 0) {
    const absorbed = Math.min(target.shield, remaining);
    remaining -= absorbed;
    target = { ...target, shield: target.shield - absorbed };
  }
  const newHp = Math.max(0, target.hp - remaining);
  return { ...target, hp: newHp, isKO: newHp <= 0 };
}

// ─── CombatScreen Component ───────────────────────────────
export default function CombatScreen({ stageData, onVictory, onDefeat, onBack }) {
  const { state } = useGame();

  // Build teams
  const buildPlayerTeam = useCallback(() => {
    return state.team.pleiades
      .filter(Boolean)
      .map(id => {
        const char = getCharacterById(id);
        const coll = state.collection.pleiades.find(c => c.id === id);
        if (!char) return null;
        return initUnit(char, false, coll?.level || 1);
      })
      .filter(Boolean);
  }, [state.team.pleiades, state.collection.pleiades]);

  const buildEnemyTeam = useCallback(() => {
    const enemyIds = stageData?.enemies || ['corrupted_sprite', 'corrupted_sprite', 'star_guardian'];
    return enemyIds.map(id => {
      const enemy = getEnemyById(id);
      if (!enemy) return null;
      return initUnit(enemy, true, stageData?.level || 1);
    }).filter(Boolean);
  }, [stageData]);

  const [playerTeam, setPlayerTeam] = useState(() => buildPlayerTeam());
  const [enemyTeam, setEnemyTeam] = useState(() => buildEnemyTeam());
  const [turn, setTurn] = useState(1);
  const [log, setLog] = useState([]);
  const [phase, setPhase] = useState('combat'); // 'combat' | 'victory' | 'defeat'
  const [autoPlay, setAutoPlay] = useState(state.settings.autoPlay);
  const [speed, setSpeed] = useState(1);
  const [activeUnit, setActiveUnit] = useState(null);
  const [floatingDmg, setFloatingDmg] = useState([]);
  const logRef = useRef(null);
  const autoTimer = useRef(null);

  function addLog(msg, type = 'normal') {
    setLog(prev => [...prev.slice(-30), { id: Date.now() + Math.random(), msg, type }]);
    setTimeout(() => logRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }), 50);
  }

  function addFloatingDmg(unitId, value, isCrit, isHeal = false) {
    const fd = { id: Date.now() + Math.random(), unitId, value, isCrit, isHeal };
    setFloatingDmg(prev => [...prev, fd]);
    setTimeout(() => setFloatingDmg(prev => prev.filter(f => f.id !== fd.id)), 1200);
  }

  function doSkill(actor, skill, targets) {
    let newPlayer = [...playerTeam];
    let newEnemy = [...enemyTeam];

    const actorTeam = actor.isEnemy ? newEnemy : newPlayer;
    const targetTeam = actor.isEnemy ? newPlayer : newEnemy;

    const applyToUnit = (units, unitId, fn) =>
      units.map(u => u.id === unitId ? fn(u) : u);

    if (skill.type === 'atk' || skill.type === 'mag') {
      const target = targets[0];
      const { dmg, isCrit } = calcDamage(actor, target, skill);
      const updated = applyDamage(target, dmg);
      addLog(`${actor.name} → ${target.name}: ${dmg}${isCrit ? ' 💥CRIT' : ''} dégâts`, isCrit ? 'crit' : 'normal');
      addFloatingDmg(target.id, dmg, isCrit);
      if (target.isEnemy) newEnemy = applyToUnit(newEnemy, target.id, () => updated);
      else newPlayer = applyToUnit(newPlayer, target.id, () => updated);

      // Drain
      if (skill.type === 'mag_drain') {
        const healAmt = Math.round(dmg * 0.5);
        addFloatingDmg(actor.id, healAmt, false, true);
        if (!actor.isEnemy) newPlayer = applyToUnit(newPlayer, actor.id, u => ({ ...u, hp: Math.min(u.maxHp, u.hp + healAmt) }));
        else newEnemy = applyToUnit(newEnemy, actor.id, u => ({ ...u, hp: Math.min(u.maxHp, u.hp + healAmt) }));
      }
    }

    else if (skill.type === 'atk_aoe' || skill.type === 'mag_aoe') {
      const alive = targetTeam.filter(u => !u.isKO);
      alive.forEach(t => {
        const { dmg, isCrit } = calcDamage(actor, t, { ...skill, power: (skill.power || 1) * 0.85 });
        const updated = applyDamage(t, dmg);
        addFloatingDmg(t.id, dmg, isCrit);
        if (t.isEnemy) newEnemy = applyToUnit(newEnemy, t.id, () => updated);
        else newPlayer = applyToUnit(newPlayer, t.id, () => updated);
      });
      addLog(`${actor.name} frappe TOUTE la zone !`, 'aoe');
    }

    else if (skill.type === 'atk_multi') {
      const hitCount = Math.floor(Math.random() * 2) + 2;
      const target = targets[0];
      let totalDmg = 0;
      for (let h = 0; h < hitCount; h++) {
        const { dmg } = calcDamage(actor, target, { ...skill, power: (skill.power || 0.7) });
        totalDmg += dmg;
        const currentTarget = target.isEnemy ? newEnemy.find(u => u.id === target.id) : newPlayer.find(u => u.id === target.id);
        if (currentTarget && !currentTarget.isKO) {
          const updated = applyDamage(currentTarget, dmg);
          if (target.isEnemy) newEnemy = applyToUnit(newEnemy, target.id, () => updated);
          else newPlayer = applyToUnit(newPlayer, target.id, () => updated);
        }
      }
      addLog(`${actor.name} → ${target.name}: ${hitCount} coups (${totalDmg} total) !`, 'multi');
      addFloatingDmg(target.id, totalDmg, false);
    }

    else if (skill.type === 'heal' || skill.type === 'heal_aoe') {
      const healTargets = skill.type === 'heal_aoe'
        ? (actor.isEnemy ? newEnemy : newPlayer).filter(u => !u.isKO)
        : [targets[0]];

      healTargets.forEach(t => {
        const healAmt = Math.round((actor.mag * (skill.power || 0.8)));
        const updated = { ...t, hp: Math.min(t.maxHp, t.hp + healAmt) };
        addFloatingDmg(t.id, healAmt, false, true);
        if (t.isEnemy) newEnemy = applyToUnit(newEnemy, t.id, () => updated);
        else newPlayer = applyToUnit(newPlayer, t.id, () => updated);
      });
      addLog(`${actor.name} soigne${skill.type === 'heal_aoe' ? ' toute l\'équipe' : ''} !`, 'heal');
    }

    else if (skill.type === 'shield') {
      const shieldAmt = Math.round(actor.atq * (skill.power || 0.8));
      const target = skill.type === 'shield' ? (actor.isEnemy ? newEnemy : newPlayer).find(u => u.id === actor.id) : targets[0];
      if (!actor.isEnemy) newPlayer = applyToUnit(newPlayer, actor.id, u => ({ ...u, shield: u.shield + shieldAmt }));
      else newEnemy = applyToUnit(newEnemy, actor.id, u => ({ ...u, shield: u.shield + shieldAmt }));
      addLog(`${actor.name} crée un bouclier de ${shieldAmt} !`, 'shield');
    }

    else if (skill.type === 'buff_self' || skill.type === 'buff_team') {
      const buffTargets = skill.type === 'buff_team'
        ? (actor.isEnemy ? newEnemy : newPlayer).filter(u => !u.isKO)
        : [actor];
      buffTargets.forEach(t => {
        const updated = { ...t, buffs: [...t.buffs, { type: 'atk', value: 25, turns: 2 }] };
        if (t.isEnemy) newEnemy = applyToUnit(newEnemy, t.id, () => updated);
        else newPlayer = applyToUnit(newPlayer, t.id, () => updated);
      });
      addLog(`${actor.name} augmente l'ATQ !`, 'buff');
    }

    else if (skill.type === 'debuff' || skill.type === 'debuff_aoe') {
      const debuffTargets = skill.type === 'debuff_aoe'
        ? targetTeam.filter(u => !u.isKO)
        : [targets[0]];
      debuffTargets.forEach(t => {
        const statuses = [...t.statuses];
        if (!statuses.includes('poison')) statuses.push('poison');
        const updated = { ...t, statuses };
        if (t.isEnemy) newEnemy = applyToUnit(newEnemy, t.id, () => updated);
        else newPlayer = applyToUnit(newPlayer, t.id, () => updated);
      });
      addLog(`${actor.name} applique Poison !`, 'debuff');
    }

    else if (skill.type === 'ultimate') {
      // Ultimate — big AOE damage
      const alive = targetTeam.filter(u => !u.isKO);
      alive.forEach(t => {
        const { dmg, isCrit } = calcDamage(actor, t, { ...skill });
        const updated = applyDamage(t, dmg);
        addFloatingDmg(t.id, dmg, isCrit);
        if (t.isEnemy) newEnemy = applyToUnit(newEnemy, t.id, () => updated);
        else newPlayer = applyToUnit(newPlayer, t.id, () => updated);
      });
      addLog(`⚡ ULTIME: ${actor.name} — ${skill.name} !`, 'ultimate');
    }

    // Cooldown
    const updatedActor = { ...actor, skillCooldowns: { ...actor.skillCooldowns, [skill.id]: skill.cooldown } };
    if (!actor.isEnemy) newPlayer = applyToUnit(newPlayer, actor.id, () => updatedActor);
    else newEnemy = applyToUnit(newEnemy, actor.id, () => updatedActor);

    setPlayerTeam(newPlayer);
    setEnemyTeam(newEnemy);
    return { newPlayer, newEnemy };
  }

  function getAliveUnits(team) {
    return team.filter(u => !u.isKO);
  }

  function doEnemyTurn(pTeam, eTeam) {
    const alive = getAliveUnits(eTeam);
    if (alive.length === 0) return { pTeam, eTeam };
    const alivePlayer = getAliveUnits(pTeam);
    if (alivePlayer.length === 0) return { pTeam, eTeam };

    let newPlayer = [...pTeam];
    let newEnemy = [...eTeam];

    alive.forEach(enemy => {
      const aliveP = newPlayer.filter(u => !u.isKO);
      if (aliveP.length === 0) return;

      // Choose skill
      const availableSkills = enemy.skills.filter(s => (enemy.skillCooldowns[s.id] || 0) === 0);
      const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)] || enemy.skills[0];

      // Choose target
      const isHeal = skill.type === 'heal' || skill.type === 'heal_aoe';
      const targets = isHeal
        ? [newEnemy.find(u => !u.isKO && u.hp < u.maxHp) || enemy]
        : [aliveP[Math.floor(Math.random() * aliveP.length)]];

      // Apply
      const applyToUnit = (units, unitId, fn) => units.map(u => u.id === unitId ? fn(u) : u);

      if (skill.type === 'atk' || skill.type === 'mag') {
        const target = targets[0];
        const { dmg, isCrit } = calcDamage(enemy, target, skill);
        const updated = applyDamage(target, dmg);
        addLog(`${enemy.name} → ${target.name}: ${dmg}${isCrit ? ' 💥' : ''} dégâts`, isCrit ? 'enemy_crit' : 'enemy');
        addFloatingDmg(target.id, dmg, isCrit);
        newPlayer = applyToUnit(newPlayer, target.id, () => updated);
      } else if (skill.type === 'atk_aoe') {
        const aliveUnits = newPlayer.filter(u => !u.isKO);
        aliveUnits.forEach(t => {
          const { dmg } = calcDamage(enemy, t, { ...skill, power: (skill.power || 1) * 0.85 });
          const updated = applyDamage(t, dmg);
          addFloatingDmg(t.id, dmg, false);
          newPlayer = applyToUnit(newPlayer, t.id, () => updated);
        });
        addLog(`${enemy.name} frappe toute l'équipe !`, 'enemy');
      } else if (skill.type === 'heal_aoe') {
        const healAmt = Math.round(enemy.mag * (skill.power || 0.5));
        newEnemy = newEnemy.map(u => !u.isKO ? { ...u, hp: Math.min(u.maxHp, u.hp + healAmt) } : u);
        addLog(`${enemy.name} soigne son équipe !`, 'enemy_heal');
      } else {
        // Default attack
        const target = aliveP[0];
        const { dmg } = calcDamage(enemy, target, { ...skill, type: 'atk', power: 1.0 });
        const updated = applyDamage(target, dmg);
        addFloatingDmg(target.id, dmg, false);
        newPlayer = applyToUnit(newPlayer, target.id, () => updated);
        addLog(`${enemy.name} attaque ${target.name}: ${dmg} dégâts`, 'enemy');
      }

      // Decrease cooldowns
      const updatedEnemy = {
        ...enemy,
        skillCooldowns: Object.fromEntries(
          Object.entries(enemy.skillCooldowns).map(([sid, cd]) => [sid, Math.max(0, cd - 1)])
        )
      };
      newEnemy = applyToUnit(newEnemy, enemy.id, () => updatedEnemy);
    });

    return { newPlayer, newEnemy };
  }

  function doTick() {
    if (phase !== 'combat') return;

    const alivePlayer = getAliveUnits(playerTeam);
    const aliveEnemy = getAliveUnits(enemyTeam);

    if (alivePlayer.length === 0) { setPhase('defeat'); return; }
    if (aliveEnemy.length === 0) { setPhase('victory'); return; }

    // Turn order by speed
    const allUnits = [...alivePlayer, ...aliveEnemy].sort((a, b) => b.vit - a.vit);
    const first = allUnits[0];

    if (!first.isEnemy) {
      // Auto-play for player unit
      const aliveEnemies = getAliveUnits(enemyTeam);
      const skill = first.skills.find(s => (first.skillCooldowns[s.id] || 0) === 0 && s.cooldown > 0) || first.skills[0];
      const target = aliveEnemies[0];
      const { newPlayer: np, newEnemy: ne } = doSkill(first, skill, [target]);

      // Decrease all player cooldowns
      setPlayerTeam(prev => prev.map(u => ({
        ...u,
        skillCooldowns: Object.fromEntries(
          Object.entries(u.skillCooldowns).map(([sid, cd]) => [sid, Math.max(0, cd - 1)])
        )
      })));

      // Check victory
      if (getAliveUnits(ne).length === 0) {
        setPhase('victory');
        return;
      }

      // Enemy turn
      setTimeout(() => {
        const { newPlayer: fp, newEnemy: fe } = doEnemyTurn(np, ne);
        setPlayerTeam(fp);
        setEnemyTeam(fe);
        if (getAliveUnits(fp).length === 0) setPhase('defeat');
        else setTurn(t => t + 1);
      }, 400 / speed);
    } else {
      const { newPlayer: fp, newEnemy: fe } = doEnemyTurn(playerTeam, enemyTeam);
      setPlayerTeam(fp);
      setEnemyTeam(fe);
      if (getAliveUnits(fp).length === 0) setPhase('defeat');
      else setTurn(t => t + 1);
    }
  }

  // Auto play
  useEffect(() => {
    if (autoPlay && phase === 'combat') {
      autoTimer.current = setTimeout(doTick, 1200 / speed);
      return () => clearTimeout(autoTimer.current);
    }
  }, [autoPlay, phase, turn, speed]);

  function handleManualSkill(actorIdx, skillIdx) {
    const actor = playerTeam[actorIdx];
    if (!actor || actor.isKO) return;
    const skill = actor.skills[skillIdx];
    if (!skill || actor.skillCooldowns[skill.id] > 0) return;

    const aliveEnemy = getAliveUnits(enemyTeam);
    if (aliveEnemy.length === 0) return;
    const target = aliveEnemy[0];

    const { newPlayer: np, newEnemy: ne } = doSkill(actor, skill, [target]);

    // Cooldown tick
    setPlayerTeam(prev => prev.map(u => ({
      ...u,
      skillCooldowns: Object.fromEntries(
        Object.entries(u.skillCooldowns).map(([sid, cd]) => [sid, Math.max(0, cd - (u.id === actor.id ? -1 : 1))])
      )
    })));

    if (getAliveUnits(ne).length === 0) { setPhase('victory'); return; }

    setTimeout(() => {
      const { newPlayer: fp, newEnemy: fe } = doEnemyTurn(np, ne);
      setPlayerTeam(fp);
      setEnemyTeam(fe);
      if (getAliveUnits(fp).length === 0) setPhase('defeat');
      else setTurn(t => t + 1);
    }, 400 / speed);
  }

  return (
    <div style={{ height: '100vh', background: C.bg, paddingTop: 56, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Controls bar */}
      <div style={{
        background: `${C.surface}EE`, borderBottom: `1px solid ${C.border}`,
        padding: '8px 20px', display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <button onClick={onBack} style={{ background: `${C.card}CC`, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12 }}>← Retour</button>
        <div style={{ fontSize: 13, color: C.text, fontWeight: 700 }}>
          Tour {turn} — {phase === 'combat' ? 'Combat en cours' : phase === 'victory' ? '🏆 Victoire !' : '💀 Défaite'}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer', fontSize: 12, color: C.text }}>
            <input type="checkbox" checked={autoPlay} onChange={e => setAutoPlay(e.target.checked)} />
            Auto
          </label>
          <select value={speed} onChange={e => setSpeed(+e.target.value)} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: '4px 8px', fontSize: 11 }}>
            <option value={1}>×1</option>
            <option value={2}>×2</option>
            <option value={3}>×3</option>
          </select>
          {!autoPlay && phase === 'combat' && (
            <button onClick={doTick} style={{ background: `linear-gradient(135deg, ${C.accent}, #4F1D96)`, border: 'none', borderRadius: 8, padding: '6px 16px', color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
              ▶ Tour
            </button>
          )}
        </div>
      </div>

      {/* Battle arena */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Enemy team */}
        <div style={{ padding: '16px 20px', display: 'flex', gap: 12, justifyContent: 'center', position: 'relative' }}>
          {enemyTeam.map((unit, i) => (
            <UnitDisplay key={unit.id} unit={unit} floats={floatingDmg.filter(f => f.unitId === unit.id)} />
          ))}
        </div>

        {/* VS divider */}
        <div style={{ textAlign: 'center', color: C.muted, fontSize: 12, letterSpacing: 3, padding: '4px 0' }}>
          ── VS ──
        </div>

        {/* Player team */}
        <div style={{ padding: '16px 20px', display: 'flex', gap: 12, justifyContent: 'center' }}>
          {playerTeam.map((unit, i) => (
            <UnitDisplay key={unit.id} unit={unit} floats={floatingDmg.filter(f => f.unitId === unit.id)} isPlayer />
          ))}
        </div>

        {/* Skills panel */}
        {!autoPlay && phase === 'combat' && (
          <div style={{ padding: '8px 20px', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {playerTeam.filter(u => !u.isKO).map((unit, ui) =>
              unit.skills.map((skill, si) => {
                const cd = unit.skillCooldowns[skill.id] || 0;
                return (
                  <button
                    key={`${ui}-${si}`}
                    onClick={() => handleManualSkill(ui, si)}
                    disabled={cd > 0}
                    style={{
                      background: cd > 0 ? `${C.border}33` : skill.isUltimate ? `linear-gradient(135deg, ${C.gold}, #92400E)` : `linear-gradient(135deg, ${C.accent}, #4F1D96)`,
                      border: 'none', borderRadius: 10, padding: '7px 12px',
                      color: cd > 0 ? C.muted : 'white', cursor: cd > 0 ? 'not-allowed' : 'pointer',
                      fontSize: 10, fontFamily: 'Georgia, serif',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, minWidth: 90,
                      opacity: cd > 0 ? 0.5 : 1,
                    }}
                  >
                    <span style={{ fontSize: 8, color: cd > 0 ? C.muted : C.goldHi }}>{unit.name}</span>
                    <span style={{ fontWeight: 700 }}>{skill.name}</span>
                    {cd > 0 && <span style={{ fontSize: 9 }}>CD: {cd}</span>}
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Combat log */}
        <div
          ref={logRef}
          style={{
            flex: 1, overflowY: 'auto', padding: '8px 20px',
            background: `${C.surface}66`, borderTop: `1px solid ${C.border}`,
            maxHeight: 140,
          }}
        >
          {log.map(entry => (
            <div key={entry.id} style={{
              fontSize: 11, lineHeight: 1.6,
              color: entry.type === 'crit' || entry.type === 'ultimate' ? C.goldHi
                : entry.type === 'heal' || entry.type === 'enemy_heal' ? C.green
                : entry.type === 'enemy' || entry.type === 'enemy_crit' ? C.rose
                : entry.type === 'buff' ? C.cyan
                : entry.type === 'debuff' ? C.orange
                : C.text,
            }}>
              {entry.msg}
            </div>
          ))}
        </div>
      </div>

      {/* Victory/Defeat overlay */}
      {(phase === 'victory' || phase === 'defeat') && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: phase === 'victory' ? '#000000BB' : '#000000DD',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.5s ease',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{phase === 'victory' ? '🏆' : '💀'}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: phase === 'victory' ? C.gold : C.rose, letterSpacing: 2, marginBottom: 8 }}>
            {phase === 'victory' ? 'VICTOIRE !' : 'DÉFAITE'}
          </div>
          <div style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>Tour {turn}</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onBack} style={{ background: `${C.card}CC`, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: '12px 28px', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'Georgia, serif' }}>
              ← Retour
            </button>
            {phase === 'victory' && onVictory && (
              <button onClick={onVictory} style={{ background: `linear-gradient(135deg, ${C.gold}, #92400E)`, border: 'none', borderRadius: 12, padding: '12px 28px', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                Réclamer ✦
              </button>
            )}
            {phase === 'defeat' && (
              <button onClick={() => { setPlayerTeam(buildPlayerTeam()); setEnemyTeam(buildEnemyTeam()); setTurn(1); setLog([]); setPhase('combat'); }} style={{ background: `linear-gradient(135deg, ${C.accent}, #4F1D96)`, border: 'none', borderRadius: 12, padding: '12px 28px', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                Réessayer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function UnitDisplay({ unit, floats, isPlayer }) {
  const elemInfo = ELEMENTS[unit.element] || {};
  const hpPct = unit.maxHp > 0 ? (unit.hp / unit.maxHp) * 100 : 0;
  const shieldPct = unit.maxHp > 0 ? (unit.shield / unit.maxHp) * 100 : 0;
  const hpColor = hpPct > 60 ? C.green : hpPct > 30 ? C.orange : C.rose;

  return (
    <div style={{
      width: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      opacity: unit.isKO ? 0.3 : 1, transition: 'opacity 0.3s',
      filter: unit.isKO ? 'grayscale(100%)' : 'none',
      position: 'relative',
    }}>
      {/* Floating damage */}
      {floats.map(f => (
        <div key={f.id} style={{
          position: 'absolute', top: -20, left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 14, fontWeight: 900, fontFamily: 'monospace',
          color: f.isHeal ? C.green : f.isCrit ? C.goldHi : C.rose,
          animation: 'float 1.2s ease forwards',
          zIndex: 10, whiteSpace: 'nowrap', pointerEvents: 'none',
          textShadow: f.isCrit ? `0 0 10px ${C.gold}` : 'none',
        }}>
          {f.isHeal ? '+' : '-'}{f.value}{f.isCrit ? '!!' : ''}
        </div>
      ))}

      {/* Portrait */}
      <div style={{
        width: 70, height: 70, borderRadius: 14,
        background: `linear-gradient(160deg, ${elemInfo.bg || C.card}, ${C.card})`,
        border: `2px solid ${elemInfo.accent || C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 34, boxShadow: unit.isKO ? 'none' : `0 0 12px ${elemInfo.accent || C.accent}44`,
      }}>
        {unit.portrait}
        {unit.isKO && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 20 }}>💀</div>}
      </div>

      {/* HP bar */}
      <div style={{ width: '100%' }}>
        <div style={{ height: 6, background: `${C.border}44`, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${hpPct}%`, background: hpColor, borderRadius: 3, transition: 'width 0.3s' }} />
          {shieldPct > 0 && (
            <div style={{ height: '100%', width: `${Math.min(shieldPct, 100 - hpPct)}%`, background: C.cyan, borderRadius: 3, marginTop: -6, opacity: 0.6 }} />
          )}
        </div>
        <div style={{ fontSize: 9, color: C.muted, textAlign: 'center', fontFamily: 'monospace', marginTop: 1 }}>
          {unit.hp}/{unit.maxHp}
        </div>
      </div>

      {/* Name */}
      <div style={{ fontSize: 10, fontWeight: 700, color: isPlayer ? C.accentHi : C.rose, textAlign: 'center' }}>
        {unit.name}
      </div>

      {/* Status icons */}
      {unit.statuses.length > 0 && (
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {unit.statuses.map(s => (
            <span key={s} style={{ fontSize: 10 }}>
              {s === 'poison' ? '☠️' : s === 'frozen' ? '❄️' : s === 'stunned' ? '😵' : s === 'burning' ? '🔥' : '🔇'}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
