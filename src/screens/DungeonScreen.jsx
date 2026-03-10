import { useState } from 'react';
import { C, ELEMENTS } from '../theme.js';
import { useGame } from '../store/GameContext.jsx';
import { DUNGEONS, getStageById } from '../data/dungeons.js';
import { getEnemyById } from '../data/enemies.js';
import CombatScreen from './CombatScreen.jsx';

export default function DungeonScreen({ onNavigate }) {
  const { state, dispatch } = useGame();
  const [selectedDungeon, setSelectedDungeon] = useState(null);
  const [combatStage, setCombatStage] = useState(null);
  const [previewStage, setPreviewStage] = useState(null);

  function isUnlocked(dungeon) {
    if (!dungeon.unlockReq) return true;
    const reqDungeon = DUNGEONS.find(d => d.id === dungeon.unlockReq);
    if (!reqDungeon) return true;
    const lastStage = reqDungeon.stages[reqDungeon.stages.length - 1];
    return state.dungeon.completedStages.includes(lastStage.id);
  }

  function startStage(stageId) {
    const result = getStageById(stageId);
    if (!result) return;
    if (state.resources.stamina < result.stage.stamina) {
      return; // Not enough stamina
    }
    setCombatStage(result.stage);
    setPreviewStage(null);
  }

  function handleVictory() {
    if (!combatStage) return;
    const result = getStageById(combatStage.id);
    if (!result) return;

    const stars = 3; // Simple: always 3 stars on victory
    dispatch({
      type: 'COMPLETE_STAGE',
      stageId: combatStage.id,
      stars,
      rewards: combatStage.rewards,
      staminaCost: combatStage.stamina,
    });
    setCombatStage(null);
    setSelectedDungeon(null);
  }

  // In combat
  if (combatStage) {
    return (
      <CombatScreen
        stageData={combatStage}
        onVictory={handleVictory}
        onDefeat={() => setCombatStage(null)}
        onBack={() => setCombatStage(null)}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingTop: 72, paddingBottom: 24, overflowY: 'auto' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>

        <div style={{ fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: 1, marginBottom: 6, paddingTop: 8 }}>
          🏰 DONJONS HISTOIRE
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>
          Explorez les 3 chapitres d'Apollion • Stamina: {state.resources.stamina}/{state.player.maxStamina}
        </div>

        {/* Dungeons */}
        {DUNGEONS.map(dungeon => {
          const unlocked = isUnlocked(dungeon);
          const completedCount = dungeon.stages.filter(s => state.dungeon.completedStages.includes(s.id)).length;
          const totalStars = dungeon.stages.reduce((acc, s) => acc + (state.dungeon.stageStars[s.id] || 0), 0);
          const maxStars = dungeon.stages.length * 3;

          return (
            <div key={dungeon.id} style={{ marginBottom: 20 }}>
              {/* Chapter header */}
              <div
                onClick={() => unlocked && setSelectedDungeon(selectedDungeon === dungeon.id ? null : dungeon.id)}
                style={{
                  background: unlocked
                    ? `linear-gradient(135deg, ${dungeon.bg}, ${C.surface})`
                    : `${C.surface}44`,
                  border: `1px solid ${unlocked ? dungeon.accent + '66' : C.border + '33'}`,
                  borderRadius: 16, padding: '18px 24px',
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', gap: 16,
                  transition: 'all 0.2s',
                  opacity: unlocked ? 1 : 0.5,
                  boxShadow: unlocked ? `0 4px 20px ${dungeon.accent}22` : 'none',
                }}
              >
                <div style={{ fontSize: 40 }}>{dungeon.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: dungeon.accent, letterSpacing: 1 }}>
                    {dungeon.name}
                  </div>
                  <div style={{ fontSize: 13, color: C.text }}>{dungeon.subtitle}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontStyle: 'italic' }}>{dungeon.lore}</div>
                  {unlocked && (
                    <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                      <span style={{ fontSize: 11, color: C.muted }}>
                        Stages: {completedCount}/{dungeon.stages.length}
                      </span>
                      <span style={{ fontSize: 11, color: C.goldHi }}>
                        ⭐ {totalStars}/{maxStars}
                      </span>
                    </div>
                  )}
                </div>
                {!unlocked && <div style={{ fontSize: 20, color: C.muted }}>🔒</div>}
                {unlocked && <div style={{ fontSize: 20, color: C.muted }}>{selectedDungeon === dungeon.id ? '▲' : '▼'}</div>}
              </div>

              {/* Stages */}
              {selectedDungeon === dungeon.id && unlocked && (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {dungeon.stages.map((stage, idx) => {
                    const completed = state.dungeon.completedStages.includes(stage.id);
                    const stars = state.dungeon.stageStars[stage.id] || 0;
                    const prevCompleted = idx === 0 || state.dungeon.completedStages.includes(dungeon.stages[idx - 1].id);
                    const stageUnlocked = prevCompleted;
                    const isPreview = previewStage === stage.id;

                    const diffColor = stage.difficulty === 'Boss' ? C.rose
                      : stage.difficulty === 'Difficile' ? C.orange
                      : C.green;

                    return (
                      <div key={stage.id}>
                        <div
                          onClick={() => stageUnlocked && setPreviewStage(isPreview ? null : stage.id)}
                          style={{
                            background: `${C.card}CC`,
                            border: `1px solid ${completed ? dungeon.accent + '44' : stageUnlocked ? C.border : C.border + '33'}`,
                            borderRadius: 12, padding: '12px 16px',
                            cursor: stageUnlocked ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', gap: 12,
                            opacity: stageUnlocked ? 1 : 0.4,
                            marginLeft: 20,
                            transition: 'all 0.15s',
                          }}
                        >
                          <div style={{ fontSize: 20, minWidth: 30, textAlign: 'center' }}>
                            {completed ? '✅' : stageUnlocked ? '⚔️' : '🔒'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{stage.name}</span>
                              <span style={{ fontSize: 10, color: diffColor, background: `${diffColor}22`, borderRadius: 8, padding: '1px 6px' }}>
                                {stage.difficulty}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 3 }}>
                              <span style={{ fontSize: 10, color: C.goldHi }}>
                                {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
                              </span>
                              <span style={{ fontSize: 10, color: C.muted }}>
                                🔮 -{stage.stamina} stamina
                              </span>
                              <span style={{ fontSize: 10, color: C.gold }}>
                                💰 +{stage.rewards.gold}
                              </span>
                              {stage.rewards.gems > 0 && (
                                <span style={{ fontSize: 10, color: C.accentHi }}>
                                  💎 +{stage.rewards.gems}
                                </span>
                              )}
                            </div>
                          </div>
                          {stageUnlocked && <div style={{ fontSize: 14, color: C.muted }}>{isPreview ? '▲' : '▼'}</div>}
                        </div>

                        {/* Stage preview */}
                        {isPreview && stageUnlocked && (
                          <div style={{
                            marginLeft: 20, background: `${C.surface}CC`,
                            border: `1px solid ${C.border}`, borderRadius: 12,
                            padding: '14px 16px', marginTop: 4,
                          }}>
                            <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Ennemis :</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                              {[...new Set(stage.enemies)].map(enemyId => {
                                const enemy = getEnemyById(enemyId);
                                if (!enemy) return null;
                                const count = stage.enemies.filter(e => e === enemyId).length;
                                return (
                                  <div key={enemyId} style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    background: `${C.card}CC`, borderRadius: 10, padding: '6px 10px',
                                    border: `1px solid ${enemy.type === 'boss' ? C.rose + '44' : C.border}`,
                                  }}>
                                    <span style={{ fontSize: 20 }}>{enemy.portrait}</span>
                                    <div>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: enemy.type === 'boss' ? C.rose : C.text }}>
                                        {enemy.name} {count > 1 ? `×${count}` : ''}
                                        {enemy.type === 'boss' && ' 👑'}
                                      </div>
                                      <div style={{ fontSize: 9, color: C.muted }}>{enemy.element}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                              <div style={{ fontSize: 11, color: C.muted }}>Récompenses :</div>
                              {stage.rewards.fragments.map(f => (
                                <div key={f} style={{ fontSize: 10, color: C.accentHi, background: `${C.accent}22`, borderRadius: 8, padding: '2px 8px' }}>
                                  Fragment: {f}
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => startStage(stage.id)}
                              disabled={state.resources.stamina < stage.stamina}
                              style={{
                                width: '100%', padding: '10px',
                                background: state.resources.stamina < stage.stamina
                                  ? `${C.border}44`
                                  : `linear-gradient(135deg, ${dungeon.accent}99, ${dungeon.bg})`,
                                border: `1px solid ${dungeon.accent}66`,
                                borderRadius: 10, color: state.resources.stamina < stage.stamina ? C.muted : C.text,
                                cursor: state.resources.stamina < stage.stamina ? 'not-allowed' : 'pointer',
                                fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 13,
                              }}
                            >
                              {state.resources.stamina < stage.stamina
                                ? `❌ Stamina insuffisante (${state.resources.stamina}/${stage.stamina})`
                                : `⚔️ Lancer le Combat`
                              }
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
