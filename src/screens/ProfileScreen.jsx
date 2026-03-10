import { useState } from 'react';
import { C, RARITIES, ELEMENTS } from '../theme.js';
import { useGame } from '../store/GameContext.jsx';
import { getCharacterById, PLEIADES } from '../data/characters.js';
import { DUNGEONS } from '../data/dungeons.js';

export default function ProfileScreen() {
  const { state, dispatch } = useGame();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.player.name);

  const totalStars = Object.values(state.dungeon.stageStars).reduce((a, b) => a + b, 0);
  const maxStars = DUNGEONS.reduce((acc, d) => acc + d.stages.length * 3, 0);

  const completionPct = Math.round((state.collection.pleiades.length / PLEIADES.length) * 100);

  const rankColor = {
    Bronze: '#CD7F32', Argent: '#C0C0C0', Or: '#FFD700',
    Platine: '#E5E4E2', Diamant: '#B9F2FF', Stellaire: C.gold, Absolu: C.rose
  }[state.arena.rank] || C.muted;

  const repRank =
    state.player.reputation >= 1000 ? { name: 'Apollyon', color: C.rose, icon: '🌟' } :
    state.player.reputation >= 600 ? { name: 'Légendaire', color: C.gold, icon: '⭐' } :
    state.player.reputation >= 300 ? { name: 'Stellaire', color: C.cyan, icon: '✦' } :
    state.player.reputation >= 100 ? { name: 'Gardien', color: C.accentHi, icon: '🛡️' } :
    { name: 'Éclaireur', color: C.muted, icon: '🔍' };

  const teamPower = state.team.pleiades.reduce((acc, id) => {
    if (!id) return acc;
    const char = getCharacterById(id);
    if (!char) return acc;
    const coll = state.collection.pleiades.find(c => c.id === id);
    const level = coll?.level || 1;
    return acc + Math.round(Object.values(char.baseStats).reduce((s, v) => s + v, 0) * (1 + (level - 1) * 0.05) * (char.rarity * 0.3 + 0.7));
  }, 0);

  // Achievements
  const achievements = [
    { icon: '⭐', label: 'Première Pléiade', unlocked: state.player.totalPulls >= 1, desc: 'Effectuer votre première invocation' },
    { icon: '💎', label: 'Collectionneur', unlocked: state.collection.pleiades.length >= 5, desc: 'Obtenir 5 Pléiades différentes' },
    { icon: '🏰', label: 'Explorateur', unlocked: state.dungeon.completedStages.length >= 1, desc: 'Compléter un stage de donjon' },
    { icon: '🏆', label: 'Conquérant', unlocked: state.dungeon.completedStages.length >= 5, desc: 'Compléter 5 stages' },
    { icon: '✦', label: 'Élu des Étoiles', unlocked: state.collection.pleiades.some(c => c.stars >= 5), desc: 'Obtenir une Pléiade Légendaire' },
    { icon: '🌀', label: 'Invocateur Fou', unlocked: state.player.totalPulls >= 50, desc: '50 invocations effectuées' },
    { icon: '🔮', label: 'Maîtrise', unlocked: state.player.level >= 10, desc: 'Atteindre le niveau 10' },
    { icon: '💰', label: 'Trésorier', unlocked: state.resources.gold >= 50000, desc: 'Accumuler 50 000 or' },
  ];

  function saveName() {
    if (nameInput.trim().length >= 2) {
      dispatch({ type: 'RENAME_PLAYER', name: nameInput.trim() });
      setEditingName(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingTop: 72, paddingBottom: 24, overflowY: 'auto' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>

        {/* Profile header */}
        <div style={{
          background: `linear-gradient(135deg, #1A0A3E, ${C.surface})`,
          border: `1px solid ${C.border}`, borderRadius: 20,
          padding: '28px 32px', marginBottom: 20, marginTop: 8,
          display: 'flex', gap: 24, alignItems: 'center',
          boxShadow: `0 4px 40px ${C.accent}22`,
        }}>
          {/* Avatar */}
          <div style={{
            width: 90, height: 90, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${C.accent}, ${C.gold})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 42, border: `3px solid ${C.gold}`,
            boxShadow: `0 0 30px ${C.gold}44`,
          }}>⭐</div>

          <div style={{ flex: 1 }}>
            {/* Name */}
            {editingName ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveName()}
                  style={{ background: C.card, border: `1px solid ${C.accentHi}`, color: C.text, borderRadius: 8, padding: '6px 12px', fontSize: 16, fontFamily: 'Georgia, serif', fontWeight: 700, outline: 'none', maxWidth: 200 }}
                  autoFocus
                  maxLength={20}
                />
                <button onClick={saveName} style={{ background: `${C.accent}33`, border: `1px solid ${C.accent}`, color: C.text, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>✓</button>
                <button onClick={() => setEditingName(false)} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12 }}>✕</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.text }}>{state.player.name}</div>
                <button onClick={() => setEditingName(true)} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}>✏️</button>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Stat icon="⚡" label="Niveau" value={state.player.level} color={C.cyan} />
              <Stat icon="💪" label="Puissance" value={teamPower.toLocaleString()} color={C.gold} />
              <Stat icon={repRank.icon} label="Réputation" value={`${state.player.reputation} (${repRank.name})`} color={repRank.color} />
            </div>
          </div>

          {/* Arena rank */}
          <div style={{
            textAlign: 'center', background: `${C.card}CC`,
            borderRadius: 14, padding: '12px 16px', border: `1px solid ${rankColor}33`,
          }}>
            <div style={{ fontSize: 28 }}>🏆</div>
            <div style={{ fontSize: 12, color: rankColor, fontWeight: 700, marginTop: 4 }}>{state.arena.rank}</div>
            <div style={{ fontSize: 10, color: C.muted }}>Arène</div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '🌀', label: 'Invocations', value: state.player.totalPulls, color: C.accentHi },
            { icon: '📖', label: 'Pléiades obtenues', value: `${state.collection.pleiades.length}/${PLEIADES.length}`, color: C.gold },
            { icon: '🏰', label: 'Stages complétés', value: state.dungeon.completedStages.length, color: C.green },
            { icon: '⭐', label: 'Étoiles totales', value: `${totalStars}/${maxStars}`, color: C.goldHi },
            { icon: '💎', label: 'Gemmes dépensées', value: (1500 - state.resources.gems + 1500 > 0 ? Math.max(0, 1500 - state.resources.gems) : 0), color: C.cyan },
            { icon: '💰', label: 'Or total gagné', value: state.player.totalGold || state.resources.gold, color: C.gold },
            { icon: '🔥', label: 'Série connexion', value: `${state.loginStreak} jours`, color: C.orange },
            { icon: '🎯', label: 'Complétion', value: `${completionPct}%`, color: C.green },
          ].map(s => (
            <div key={s.label} style={{
              background: `${C.surface}CC`, border: `1px solid ${C.border}`,
              borderRadius: 14, padding: '14px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: s.color, fontFamily: 'monospace' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Current team */}
        <div style={{
          background: `${C.surface}CC`, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: '16px 20px', marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, marginBottom: 12 }}>⚔️ ÉQUIPE ACTIVE</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {state.team.pleiades.filter(Boolean).map(id => {
              const char = getCharacterById(id);
              if (!char) return null;
              const coll = state.collection.pleiades.find(c => c.id === id);
              const rarity = RARITIES[char.rarity] || RARITIES[3];
              const elemInfo = ELEMENTS[char.element] || {};
              return (
                <div key={id} style={{
                  display: 'flex', gap: 8, alignItems: 'center',
                  background: `linear-gradient(135deg, ${elemInfo.bg || C.card}CC, ${C.card})`,
                  border: `1px solid ${rarity.color}44`,
                  borderRadius: 12, padding: '8px 12px',
                }}>
                  <span style={{ fontSize: 28 }}>{char.portrait}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: rarity.textColor }}>{char.name}</div>
                    <div style={{ fontSize: 9, color: C.muted }}>Lv{coll?.level || 1} • {char.element}</div>
                  </div>
                </div>
              );
            })}
            {state.team.pleiades.filter(Boolean).length === 0 && (
              <div style={{ fontSize: 12, color: C.muted, fontStyle: 'italic' }}>Aucune équipe composée</div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div style={{
          background: `${C.surface}CC`, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: '16px 20px',
        }}>
          <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, marginBottom: 12 }}>
            🏅 SUCCÈS ({achievements.filter(a => a.unlocked).length}/{achievements.length})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
            {achievements.map(ach => (
              <div key={ach.label} style={{
                display: 'flex', gap: 10, alignItems: 'center',
                background: ach.unlocked ? `${C.gold}11` : `${C.card}66`,
                border: `1px solid ${ach.unlocked ? C.gold + '44' : C.border + '44'}`,
                borderRadius: 10, padding: '8px 12px',
                opacity: ach.unlocked ? 1 : 0.5,
              }}>
                <span style={{ fontSize: 22, filter: ach.unlocked ? 'none' : 'grayscale(100%)' }}>{ach.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: ach.unlocked ? C.goldHi : C.muted }}>{ach.label}</div>
                  <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.4 }}>{ach.desc}</div>
                </div>
                {ach.unlocked && <span style={{ marginLeft: 'auto', color: C.green, fontSize: 14 }}>✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div style={{
          background: `${C.surface}CC`, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: '16px 20px', marginTop: 20,
        }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            ⚙️ Paramètres
          </div>
          {[
            { key: 'autoPlay', label: 'Combat Auto par défaut' },
            { key: 'sfx', label: 'Effets sonores' },
            { key: 'music', label: 'Musique' },
          ].map(s => (
            <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${C.border}33` }}>
              <span style={{ fontSize: 13, color: C.text }}>{s.label}</span>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_SETTING', key: s.key })}
                style={{
                  background: state.settings[s.key] ? `${C.green}33` : `${C.border}33`,
                  border: `1px solid ${state.settings[s.key] ? C.green : C.border}`,
                  borderRadius: 20, padding: '4px 16px', cursor: 'pointer',
                  color: state.settings[s.key] ? C.green : C.muted, fontSize: 11, fontWeight: 700,
                }}
              >
                {state.settings[s.key] ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}

          <button
            onClick={() => {
              if (window.confirm('Réinitialiser la sauvegarde ? Cette action est irréversible !')) {
                localStorage.removeItem('apollion_save');
                window.location.reload();
              }
            }}
            style={{
              marginTop: 12, width: '100%', padding: '10px',
              background: 'transparent', border: `1px solid ${C.rose}44`,
              borderRadius: 10, color: C.rose, cursor: 'pointer', fontSize: 12,
              fontFamily: 'Georgia, serif',
            }}
          >
            ⚠️ Réinitialiser la sauvegarde
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{ fontSize: 10, color: C.muted }}>{label}:</span>
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}
