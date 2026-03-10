import { useState } from 'react';
import { C, RARITIES, ELEMENTS, CLASSES } from '../theme.js';
import { useGame } from '../store/GameContext.jsx';
import { getCharacterById, PLEIADES } from '../data/characters.js';
import { getPetById, PETS } from '../data/pets.js';

export default function TeamScreen({ onNavigate }) {
  const { state, dispatch } = useGame();
  const [activeSlot, setActiveSlot] = useState(null); // { type: 'pleiades'|'pets', index: 0-3 }
  const [tab, setTab] = useState('pleiades');

  const team = state.team;
  const ownedPleiades = state.collection.pleiades;
  const ownedPets = state.collection.pets;

  function selectForSlot(id) {
    if (!activeSlot) return;
    const { type, index } = activeSlot;

    if (type === 'pleiades') {
      const newTeam = [...team.pleiades];
      // Remove from other slots if already there
      const existingIdx = newTeam.indexOf(id);
      if (existingIdx !== -1 && existingIdx !== index) newTeam[existingIdx] = null;
      newTeam[index] = id;
      dispatch({ type: 'SET_TEAM_PLEIADES', pleiades: newTeam });
    } else {
      const newTeam = [...team.pets];
      const existingIdx = newTeam.indexOf(id);
      if (existingIdx !== -1 && existingIdx !== index) newTeam[existingIdx] = null;
      newTeam[index] = id;
      dispatch({ type: 'SET_TEAM_PETS', pets: newTeam });
    }
    setActiveSlot(null);
  }

  function removeFromSlot(type, index) {
    if (type === 'pleiades') {
      const newTeam = [...team.pleiades];
      newTeam[index] = null;
      dispatch({ type: 'SET_TEAM_PLEIADES', pleiades: newTeam });
    } else {
      const newTeam = [...team.pets];
      newTeam[index] = null;
      dispatch({ type: 'SET_TEAM_PETS', pets: newTeam });
    }
  }

  // Calculate team power
  const teamPower = team.pleiades.reduce((acc, id) => {
    if (!id) return acc;
    const char = getCharacterById(id);
    if (!char) return acc;
    const coll = ownedPleiades.find(c => c.id === id);
    const level = coll?.level || 1;
    const statSum = Object.values(char.baseStats).reduce((s, v) => s + v, 0);
    return acc + Math.round(statSum * (1 + (level - 1) * 0.05) * (char.rarity * 0.3 + 0.7));
  }, 0);

  // Synergies
  const teamElements = team.pleiades.filter(Boolean).map(id => getCharacterById(id)?.element).filter(Boolean);
  const elemCount = teamElements.reduce((acc, e) => ({ ...acc, [e]: (acc[e] || 0) + 1 }), {});
  const synergies = Object.entries(elemCount).filter(([, cnt]) => cnt >= 2).map(([elem, cnt]) => ({
    elem, cnt,
    bonus: cnt >= 4 ? 'ATQ +25% MAG +25%' : cnt >= 3 ? 'ATQ +15%' : 'CRIT +8%',
  }));

  const teamClasses = team.pleiades.filter(Boolean).map(id => getCharacterById(id)?.classe).filter(Boolean);
  const hasHealer = teamClasses.includes('Soigneuse');
  const hasTank = teamClasses.includes('Gardienne');
  const classSynergy = hasHealer && hasTank ? 'DEF +20% — Composition équilibrée' : null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingTop: 72, display: 'flex', overflow: 'hidden', height: '100vh' }}>

      {/* Team builder panel */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px', borderRight: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>

          <div style={{ fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: 1, marginBottom: 6 }}>
            ⚔️ COMPOSITION D'ÉQUIPE
          </div>

          {/* Power */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
            <div style={{
              background: `${C.gold}11`, border: `1px solid ${C.gold}44`,
              borderRadius: 10, padding: '8px 14px',
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <span style={{ fontSize: 14 }}>⚡</span>
              <span style={{ fontSize: 11, color: C.muted }}>Puissance</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: C.gold, fontFamily: 'monospace' }}>
                {teamPower.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Pleiades slots */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Pléiades (4 max)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[0,1,2,3].map(i => {
                const charId = team.pleiades[i];
                const char = charId ? getCharacterById(charId) : null;
                const isActive = activeSlot?.type === 'pleiades' && activeSlot?.index === i;

                return (
                  <div
                    key={i}
                    onClick={() => setActiveSlot(isActive ? null : { type: 'pleiades', index: i })}
                    style={{
                      height: 130, border: `2px solid ${isActive ? C.accentHi : char ? RARITIES[char.rarity]?.color || C.border : C.border}`,
                      borderRadius: 14, cursor: 'pointer', overflow: 'hidden',
                      background: char
                        ? `linear-gradient(160deg, ${ELEMENTS[char.element]?.bg || C.card}CC, ${C.card})`
                        : `${C.surface}44`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                      transition: 'all 0.2s',
                      boxShadow: isActive ? `0 0 20px ${C.accentHi}66` : 'none',
                      position: 'relative',
                    }}
                  >
                    {char ? (
                      <>
                        <div style={{ fontSize: 40, filter: `drop-shadow(0 0 6px ${ELEMENTS[char.element]?.accent || '#fff'}66)` }}>
                          {char.portrait}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: RARITIES[char.rarity]?.textColor || C.text, textAlign: 'center' }}>
                          {char.name}
                        </div>
                        <div style={{ fontSize: 8, color: RARITIES[char.rarity]?.color || C.muted }}>
                          {'★'.repeat(Math.min(char.rarity, 6))}
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); removeFromSlot('pleiades', i); }}
                          style={{ position: 'absolute', top: 3, right: 3, background: `${C.rose}33`, border: 'none', borderRadius: 4, color: C.rose, cursor: 'pointer', fontSize: 9, padding: '2px 4px' }}
                        >✕</button>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 28, color: isActive ? C.accentHi : C.muted }}>
                          {isActive ? '✦' : '+'}
                        </div>
                        <div style={{ fontSize: 9, color: C.muted }}>Slot {i + 1}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pet slots */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Compagnons (4 max)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[0,1,2,3].map(i => {
                const petId = team.pets[i];
                const pet = petId ? getPetById(petId) : null;
                const isActive = activeSlot?.type === 'pets' && activeSlot?.index === i;
                const petData = ownedPets.find(p => p.id === petId);
                const stage = pet ? (petData ? pet.stages[petData.stage - 1] : pet.stages[0]) : null;

                return (
                  <div
                    key={i}
                    onClick={() => setActiveSlot(isActive ? null : { type: 'pets', index: i })}
                    style={{
                      height: 90, border: `2px solid ${isActive ? C.green : pet ? C.green + '88' : C.border}`,
                      borderRadius: 12, cursor: 'pointer',
                      background: pet ? `${C.card}CC` : `${C.surface}44`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
                      transition: 'all 0.2s',
                      boxShadow: isActive ? `0 0 16px ${C.green}44` : 'none',
                      position: 'relative',
                    }}
                  >
                    {stage ? (
                      <>
                        <div style={{ fontSize: 28 }}>{stage.portrait}</div>
                        <div style={{ fontSize: 9, color: C.green, fontWeight: 700 }}>{stage.name}</div>
                        <button
                          onClick={e => { e.stopPropagation(); removeFromSlot('pets', i); }}
                          style={{ position: 'absolute', top: 3, right: 3, background: `${C.rose}33`, border: 'none', borderRadius: 4, color: C.rose, cursor: 'pointer', fontSize: 9, padding: '2px 4px' }}
                        >✕</button>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 22, color: isActive ? C.green : C.muted }}>{isActive ? '✦' : '+'}</div>
                        <div style={{ fontSize: 8, color: C.muted }}>Pet {i + 1}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Synergies */}
          {(synergies.length > 0 || classSynergy) && (
            <div style={{ background: `${C.card}88`, borderRadius: 12, padding: '12px 14px', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                ✦ Synergies Actives
              </div>
              {synergies.map(s => (
                <div key={s.elem} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: ELEMENTS[s.elem]?.accent || C.text }}>
                    {ELEMENTS[s.elem]?.icon} {s.elem} ×{s.cnt}
                  </span>
                  <span style={{ fontSize: 11, color: C.green }}>+{s.bonus}</span>
                </div>
              ))}
              {classSynergy && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: C.accentHi }}>🛡️ Tank + ✨ Healer</span>
                  <span style={{ fontSize: 11, color: C.green }}>{classSynergy}</span>
                </div>
              )}
            </div>
          )}

          {/* Go to combat */}
          <button
            onClick={() => onNavigate('combat')}
            style={{
              width: '100%', marginTop: 16, padding: '14px',
              background: `linear-gradient(135deg, ${C.accent}, #4F1D96)`,
              border: 'none', borderRadius: 14, color: 'white', cursor: 'pointer',
              fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 14,
              boxShadow: `0 4px 20px ${C.accent}44`,
            }}
          >
            ⚔️ Combat Test — Entraînement
          </button>
        </div>
      </div>

      {/* Picker panel */}
      {activeSlot && (
        <div style={{ width: 280, background: C.surface, overflowY: 'auto', padding: 16, paddingTop: 80 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 12 }}>
            {activeSlot.type === 'pleiades' ? 'Choisir une Pléiade' : 'Choisir un Compagnon'}
          </div>
          {/* Tab */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {['pleiades', 'pets'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '6px', background: activeSlot.type === t ? `${C.accent}33` : `${C.card}88`,
                border: `1px solid ${activeSlot.type === t ? C.accent : C.border}`,
                borderRadius: 8, color: activeSlot.type === t ? C.text : C.muted,
                cursor: 'pointer', fontSize: 11, fontFamily: 'Georgia, serif',
              }}>
                {t === 'pleiades' ? '⭐ Pléiades' : '🐾 Pets'}
              </button>
            ))}
          </div>

          {activeSlot.type === 'pleiades' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ownedPleiades.map(col => {
                const char = getCharacterById(col.id);
                if (!char) return null;
                const inTeam = team.pleiades.includes(char.id) && team.pleiades[activeSlot.index] !== char.id;
                return (
                  <div
                    key={col.id}
                    onClick={() => !inTeam && selectForSlot(col.id)}
                    style={{
                      display: 'flex', gap: 10, alignItems: 'center',
                      background: inTeam ? `${C.border}22` : `${C.card}CC`,
                      border: `1px solid ${inTeam ? C.border + '44' : RARITIES[char.rarity]?.color + '66' || C.border}`,
                      borderRadius: 10, padding: '8px 10px', cursor: inTeam ? 'not-allowed' : 'pointer',
                      opacity: inTeam ? 0.5 : 1, transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{char.portrait}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: RARITIES[char.rarity]?.textColor || C.text }}>
                        {char.name}
                      </div>
                      <div style={{ fontSize: 10, color: C.muted }}>
                        {char.element} • {char.classe} • Lv{col.level}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ownedPets.map(col => {
                const pet = getPetById(col.id);
                if (!pet) return null;
                const stage = pet.stages[col.stage - 1];
                const inTeam = team.pets.includes(pet.id) && team.pets[activeSlot.index] !== pet.id;
                return (
                  <div
                    key={col.id}
                    onClick={() => !inTeam && selectForSlot(col.id)}
                    style={{
                      display: 'flex', gap: 10, alignItems: 'center',
                      background: `${C.card}CC`, border: `1px solid ${C.green}44`,
                      borderRadius: 10, padding: '8px 10px', cursor: inTeam ? 'not-allowed' : 'pointer',
                      opacity: inTeam ? 0.5 : 1, transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{stage.portrait}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.green }}>{stage.name}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>Stade {col.stage} • {pet.element}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
