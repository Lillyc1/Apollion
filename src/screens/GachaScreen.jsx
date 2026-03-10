import { useState } from 'react';
import { C, RARITIES, ELEMENTS } from '../theme.js';
import { useGame } from '../store/GameContext.jsx';
import { getCharacterById } from '../data/characters.js';

const BANNERS = [
  {
    id: 'pleiades', name: 'Les Pléiades', icon: '⭐', subtitle: 'Invoquez des guerrières légendaires',
    color: '#3B1C6E', featured: 'tempestia', featuredLabel: 'FEATURED',
    costs: { single: 300, multi: 2800 }, currency: 'gems',
    desc: '5★ garantie à 80 invocations • Rate-up × 2 sur Tempestia',
  },
  {
    id: 'pets', name: 'Compagnons', icon: '🐾', subtitle: 'Invoquez des Pets évoluables',
    color: '#1A3B00', featured: 'pyrix', featuredLabel: 'NOUVEAU',
    costs: { single: 150, multi: 1400 }, currency: 'gems',
    desc: 'Pyrix (Solaire) en vedette • Évolution en 3 stades',
  },
  {
    id: 'dungeon', name: 'Donjon Banner', icon: '🏰', subtitle: 'Monstres & Pièges pour votre donjon',
    color: '#1A0A00', featured: null, featuredLabel: null,
    costs: { single: 150, multi: 1400 }, currency: 'gems',
    desc: 'Renforcez les défenses de votre donjon personnel',
  },
];

export default function GachaScreen({ onNavigate }) {
  const { state, dispatch } = useGame();
  const [activeBanner, setActiveBanner] = useState('pleiades');
  const [pullResults, setPullResults] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [showPortal, setShowPortal] = useState(false);

  const banner = BANNERS.find(b => b.id === activeBanner);

  function doPull(count) {
    if (animating) return;
    setAnimating(true);
    setShowPortal(true);

    setTimeout(() => {
      dispatch({ type: 'PULL_GACHA', banner: activeBanner, count });
      setTimeout(() => {
        setShowPortal(false);
        // Small delay to show results from state
        setAnimating(false);
      }, 800);
    }, 1200);
  }

  const lastResults = state.lastPullResults;
  const currentPity = state.pity[activeBanner] || 0;

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      paddingTop: 72, paddingBottom: 24, overflowY: 'auto',
    }}>
      {/* Portal animation overlay */}
      {showPortal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'radial-gradient(circle at 50% 50%, #1A003A, #000000)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{
            fontSize: 120,
            animation: 'spin 2s linear infinite, pulse 1s ease-in-out infinite',
            filter: `drop-shadow(0 0 40px ${C.accentHi})`,
          }}>🌀</div>
        </div>
      )}

      {/* Last pull results overlay */}
      {lastResults && !showPortal && (
        <PullResults results={lastResults} onClose={() => dispatch({ type: 'CLEAR_PULL_RESULTS' })} />
      )}

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.text, letterSpacing: 2 }}>
            ✦ PORTAIL D'INVOCATION ✦
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
            Réunissez les Pléiades pour sauver Apollion
          </div>
        </div>

        {/* Banner selector */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {BANNERS.map(b => (
            <button key={b.id} onClick={() => setActiveBanner(b.id)} style={{
              flex: 1, padding: '12px 8px',
              background: activeBanner === b.id ? `${C.accent}33` : `${C.surface}CC`,
              border: `2px solid ${activeBanner === b.id ? C.accentHi : C.border}`,
              borderRadius: 12, cursor: 'pointer',
              color: activeBanner === b.id ? C.text : C.muted,
              fontFamily: 'Georgia, serif', fontWeight: 700,
              fontSize: 12, transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: 22 }}>{b.icon}</div>
              <div>{b.name}</div>
            </button>
          ))}
        </div>

        {/* Active banner */}
        <div style={{
          background: `linear-gradient(135deg, ${banner.color}, ${C.surface})`,
          border: `1px solid ${C.border}`, borderRadius: 20,
          padding: 28, marginBottom: 20,
          display: 'flex', gap: 24, alignItems: 'center',
          boxShadow: `0 4px 40px ${C.accent}22`,
        }}>
          {/* Portal visual */}
          <div style={{
            width: 160, height: 200, flexShrink: 0,
            background: 'radial-gradient(circle at 50% 50%, #1A003A, #000)',
            borderRadius: 16, border: `2px solid ${C.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 40px ${C.accent}44, inset 0 0 40px ${C.accent}22`,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 80, animation: 'float 3s ease-in-out infinite' }}>{banner.icon}</div>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'conic-gradient(transparent 0deg, #7C3AED11 90deg, transparent 180deg)',
              animation: 'spin 8s linear infinite',
            }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.gold, letterSpacing: 1 }}>{banner.name}</div>
            <div style={{ fontSize: 13, color: C.text, marginTop: 4 }}>{banner.subtitle}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>{banner.desc}</div>

            {/* Pity info */}
            <div style={{
              marginTop: 14, padding: '10px 14px',
              background: `${C.card}CC`, borderRadius: 10, border: `1px solid ${C.border}`,
              display: 'flex', gap: 20, alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Compteur Pity</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: currentPity > 60 ? C.rose : C.accentHi }}>
                  {currentPity} / 80
                </div>
              </div>
              <div style={{ flex: 1, height: 6, background: `${C.border}44`, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(currentPity / 80) * 100}%`,
                  background: currentPity > 60
                    ? `linear-gradient(90deg, ${C.accent}, ${C.rose})`
                    : `linear-gradient(90deg, ${C.accent}, ${C.accentHi})`,
                  borderRadius: 3, transition: 'width 0.3s',
                }} />
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>
                {80 - currentPity} avant garantie
              </div>
            </div>

            {/* Pull buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <PullButton
                label="1x"
                cost={banner.costs.single}
                icon="💎"
                onClick={() => doPull(1)}
                disabled={animating || state.resources.gems < banner.costs.single}
              />
              <PullButton
                label="10x"
                cost={banner.costs.multi}
                icon="💎"
                onClick={() => doPull(10)}
                disabled={animating || state.resources.gems < banner.costs.multi}
                highlight
                bonus="1★5 garantie"
              />
            </div>
          </div>
        </div>

        {/* Rates table */}
        <div style={{
          background: `${C.surface}CC`, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: '16px 20px',
        }}>
          <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>
            📊 TAUX D'INVOCATION
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 6 }}>
            {[
              { rarity: 5, name: 'Légendaire', rate: '5.0%', color: '#D4A017' },
              { rarity: 6, name: 'Mythique', rate: '3.0%', color: '#EF4444' },
              { rarity: 7, name: 'Ancestrale', rate: '2.0%', color: '#E5E7EB' },
              { rarity: 8, name: 'Céleste', rate: '1.0%', color: '#22D3EE' },
              { rarity: 4, name: 'Épique', rate: '8.0%', color: '#A855F7' },
              { rarity: 3, name: 'Rare', rate: '15.0%', color: '#60A5FA' },
              { rarity: 11, name: 'Secrète', rate: '0.05%', color: '#CBD5E1' },
            ].map(r => (
              <div key={r.rarity} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '5px 10px', background: `${C.card}88`, borderRadius: 8,
                border: `1px solid ${r.color}33`,
              }}>
                <span style={{ fontSize: 11, color: r.color, fontWeight: 700 }}>{r.name}</span>
                <span style={{ fontSize: 12, color: C.text, fontFamily: 'monospace' }}>{r.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PullButton({ label, cost, icon, onClick, disabled, highlight, bonus }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      flex: 1, padding: '14px 18px',
      background: disabled ? `${C.border}44`
        : highlight ? `linear-gradient(135deg, ${C.gold}, #92400E)`
        : `linear-gradient(135deg, ${C.accent}, #4F1D96)`,
      border: 'none', borderRadius: 14, cursor: disabled ? 'not-allowed' : 'pointer',
      color: disabled ? C.muted : '#FFF',
      fontFamily: 'Georgia, serif', fontWeight: 700,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      transition: 'all 0.2s',
      boxShadow: disabled ? 'none' : highlight ? `0 4px 20px ${C.gold}44` : `0 4px 20px ${C.accent}44`,
      opacity: disabled ? 0.5 : 1,
    }}>
      <div style={{ fontSize: 18, fontWeight: 900 }}>Invoquer {label}</div>
      <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>{icon}</span> <span>{cost.toLocaleString()}</span>
      </div>
      {bonus && <div style={{ fontSize: 10, color: '#FFD700', marginTop: 2 }}>✓ {bonus}</div>}
    </button>
  );
}

function PullResults({ results, onClose }) {
  const highestRarity = Math.max(...results.map(r => r.rarity));
  const isSecret = highestRarity === 11;
  const isLegendary = highestRarity >= 5;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: isSecret ? '#000000EE' : '#07030FEE',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 20, animation: 'fadeIn 0.4s ease',
    }}>
      {/* Title */}
      <div style={{ fontSize: 20, color: isSecret ? '#CBD5E1' : C.gold, fontWeight: 900, marginBottom: 20, letterSpacing: 3 }}>
        {isSecret ? '✦ INVOCATION SECRÈTE ✦' : isLegendary ? '⭐ LÉGENDAIRE ⭐' : '— Résultat —'}
      </div>

      {/* Results grid */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12,
        justifyContent: 'center', maxWidth: 700, marginBottom: 24,
      }}>
        {results.map((char, i) => (
          <PullCard key={i} char={char} delay={i * 0.08} />
        ))}
      </div>

      {/* Summary */}
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>
        Meilleure obtention: {' '}
        <span style={{ color: RARITIES[highestRarity]?.textColor || C.gold, fontWeight: 700 }}>
          {RARITIES[highestRarity]?.name || 'Légendaire'}
        </span>
      </div>

      <button onClick={onClose} style={{
        background: `linear-gradient(135deg, ${C.accent}, #4F1D96)`,
        border: 'none', borderRadius: 14, padding: '14px 40px',
        color: 'white', cursor: 'pointer', fontSize: 15, fontWeight: 700,
        fontFamily: 'Georgia, serif',
        boxShadow: `0 4px 20px ${C.accent}66`,
      }}>
        Continuer ✦
      </button>
    </div>
  );
}

function PullCard({ char, delay }) {
  const rarity = RARITIES[char.rarity] || RARITIES[5];
  const elemInfo = ELEMENTS[char.element] || {};
  const isSecret = char.rarity === 11;

  return (
    <div style={{
      width: 110, background: `linear-gradient(160deg, ${elemInfo.bg || C.card}, ${C.card})`,
      border: `2px solid ${rarity.color}`,
      borderRadius: 14, padding: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
      boxShadow: `0 0 16px ${rarity.color}55`,
      animation: `popIn 0.4s ${delay}s cubic-bezier(0.16, 1, 0.3, 1) both`,
    }}>
      <div style={{ fontSize: 44, filter: `drop-shadow(0 0 8px ${elemInfo.accent || '#fff'}88)` }}>
        {char.portrait}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: rarity.textColor, textAlign: 'center', lineHeight: 1.2 }}>
        {char.name}
      </div>
      <div style={{ fontSize: 9, color: rarity.color, letterSpacing: 1 }}>
        {isSecret ? '✦' : '★'.repeat(Math.min(char.rarity, 10))}
      </div>
      <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1 }}>{char.element}</div>
    </div>
  );
}
