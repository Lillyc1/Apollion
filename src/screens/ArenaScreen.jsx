import { useState } from 'react';
import { C, ELEMENTS, RARITIES } from '../theme.js';
import { useGame } from '../store/GameContext.jsx';
import { getCharacterById } from '../data/characters.js';
import CombatScreen from './CombatScreen.jsx';

const ARENA_OPPONENTS = [
  { name: "Invocatrice Kira", power: 3200, rank: "Bronze", team: ["ignis", "luna", "aqua", "terra"], reward: { gold: 300, arenaToken: 1 } },
  { name: "Maître Zael", power: 5800, rank: "Argent", team: ["pyralia", "noctara", "terra", "aqua"], reward: { gold: 500, arenaToken: 2 } },
  { name: "Commandante Ryx", power: 9400, rank: "Or", team: ["ragna", "crystallia", "voltara", "solaris"], reward: { gold: 800, arenaToken: 3 } },
  { name: "Gardien Eos", power: 15200, rank: "Platine", team: ["lyrae", "nihila", "frosthana", "terravex"], reward: { gold: 1200, arenaToken: 5 } },
  { name: "Apex Stellaire", power: 28000, rank: "Diamant", team: ["tempestia", "ragna", "voidara", "gaia"], reward: { gold: 2000, arenaToken: 8 } },
];

const RANKS = ["Bronze", "Argent", "Or", "Platine", "Diamant", "Stellaire", "Absolu"];
const RANK_COLORS = { Bronze: '#CD7F32', Argent: '#C0C0C0', Or: '#FFD700', Platine: '#E5E4E2', Diamant: '#B9F2FF', Stellaire: '#D4A017', Absolu: '#EF4444' };

export default function ArenaScreen() {
  const { state, dispatch } = useGame();
  const [fighting, setFighting] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const rankColor = RANK_COLORS[state.arena.rank] || C.muted;
  const rankIdx = RANKS.indexOf(state.arena.rank);
  const nextRank = RANKS[rankIdx + 1];

  function startFight(opponent) {
    if (state.arena.attacksLeft <= 0) return;
    // Build enemy stage data
    setFighting({
      ...opponent,
      enemies: opponent.team.filter(id => getCharacterById(id)),
    });
  }

  function handleVictory(opponent) {
    dispatch({ type: 'ADD_RESOURCES', gold: opponent.reward.gold });
    setLastResult({ type: 'victory', opponent, reward: opponent.reward });
    setFighting(null);
    // Rank up logic (simplified)
    if (state.arena.points + 30 >= (rankIdx + 1) * 100 && nextRank) {
      // dispatch rank up — simplified
    }
  }

  if (fighting) {
    return (
      <CombatScreen
        stageData={{ enemies: fighting.enemies, level: 5 }}
        onVictory={() => handleVictory(fighting)}
        onDefeat={() => setFighting(null)}
        onBack={() => setFighting(null)}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingTop: 72, paddingBottom: 24, overflowY: 'auto' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, #1A0A00, ${C.surface})`,
          border: `2px solid ${rankColor}44`, borderRadius: 20,
          padding: '24px 28px', marginBottom: 20, marginTop: 8,
          boxShadow: `0 4px 30px ${rankColor}22`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: rankColor, letterSpacing: 1 }}>
                🏆 ARÈNE — {state.arena.rank}
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                Saison 1 • Combat PvP asynchrone
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.text, fontFamily: 'monospace' }}>{state.arena.points}</div>
              <div style={{ fontSize: 10, color: C.muted }}>Points</div>
            </div>
          </div>

          {/* Attacks left */}
          <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
            <span style={{ fontSize: 11, color: C.muted }}>Attaques restantes:</span>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{
                width: 24, height: 24, borderRadius: '50%',
                background: i < state.arena.attacksLeft ? C.rose : `${C.border}33`,
                border: `2px solid ${i < state.arena.attacksLeft ? C.rose : C.border + '44'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
              }}>
                {i < state.arena.attacksLeft ? '⚔️' : ''}
              </div>
            ))}
          </div>

          {nextRank && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.muted, marginBottom: 3 }}>
                <span>{state.arena.rank}</span>
                <span>{nextRank}</span>
              </div>
              <div style={{ height: 4, background: `${C.border}44`, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(state.arena.points % 100)}%`,
                  background: `linear-gradient(90deg, ${rankColor}, ${C.gold})`,
                  borderRadius: 2,
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Last result */}
        {lastResult && (
          <div style={{
            background: lastResult.type === 'victory' ? `${C.green}11` : `${C.rose}11`,
            border: `1px solid ${lastResult.type === 'victory' ? C.green + '44' : C.rose + '44'}`,
            borderRadius: 12, padding: '10px 16px', marginBottom: 16,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: lastResult.type === 'victory' ? C.green : C.rose, fontWeight: 700, fontSize: 13 }}>
              {lastResult.type === 'victory' ? '✓ Victoire' : '✗ Défaite'} contre {lastResult.opponent.name}
            </span>
            {lastResult.type === 'victory' && (
              <span style={{ fontSize: 12, color: C.gold }}>+{lastResult.reward.gold} 💰</span>
            )}
            <button onClick={() => setLastResult(null)} style={{ background: 'transparent', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>
        )}

        {/* Opponents */}
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Adversaires disponibles</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ARENA_OPPONENTS.map((opp, i) => {
            const oppRankColor = RANK_COLORS[opp.rank] || C.muted;
            const canFight = state.arena.attacksLeft > 0;

            return (
              <div key={i} style={{
                background: `${C.surface}CC`, border: `1px solid ${oppRankColor}33`,
                borderRadius: 16, padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 16,
                opacity: canFight ? 1 : 0.6,
              }}>
                {/* Avatar */}
                <div style={{
                  width: 50, height: 50, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${oppRankColor}44, ${C.card})`,
                  border: `2px solid ${oppRankColor}66`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                }}>⭐</div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{opp.name}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 3 }}>
                    <span style={{ fontSize: 11, color: oppRankColor }}>🏆 {opp.rank}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>⚡ {opp.power.toLocaleString()} PS</span>
                  </div>
                  {/* Team preview */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    {opp.team.map(id => {
                      const char = getCharacterById(id);
                      if (!char) return null;
                      return <span key={id} style={{ fontSize: 16 }}>{char.portrait}</span>;
                    })}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: C.gold, marginBottom: 6 }}>
                    +{opp.reward.gold} 💰
                  </div>
                  <button
                    onClick={() => startFight(opp)}
                    disabled={!canFight}
                    style={{
                      background: canFight ? `linear-gradient(135deg, ${C.rose}, #7F1D1D)` : `${C.border}44`,
                      border: 'none', borderRadius: 10, padding: '8px 16px',
                      color: canFight ? 'white' : C.muted,
                      cursor: canFight ? 'pointer' : 'not-allowed',
                      fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 12,
                    }}
                  >
                    ⚔️ Combattre
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Season rewards */}
        <div style={{
          background: `${C.surface}CC`, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: '16px 20px', marginTop: 20,
        }}>
          <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, marginBottom: 12 }}>
            🏅 RÉCOMPENSES DE FIN DE SAISON
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {RANKS.map((rank, i) => (
              <div key={rank} style={{
                flexShrink: 0, textAlign: 'center',
                background: rankIdx >= i ? `${RANK_COLORS[rank]}22` : `${C.card}66`,
                border: `1px solid ${RANK_COLORS[rank]}${rankIdx >= i ? '88' : '22'}`,
                borderRadius: 12, padding: '10px 14px', minWidth: 90,
              }}>
                <div style={{ fontSize: 10, color: RANK_COLORS[rank], fontWeight: 700 }}>{rank}</div>
                <div style={{ fontSize: 16, margin: '6px 0' }}>
                  {i === 0 ? '💰' : i === 1 ? '💎' : i === 2 ? '🔮' : i === 3 ? '⭐' : i === 4 ? '✦' : i === 5 ? '👑' : '🌟'}
                </div>
                <div style={{ fontSize: 9, color: C.muted }}>
                  {i === 0 ? '500 or' : i === 1 ? '100 💎' : i === 2 ? '300 💎' : i === 3 ? '500 💎' : i === 4 ? '1000 💎' : i === 5 ? 'Skin' : 'Titre'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
