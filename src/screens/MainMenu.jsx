import { useEffect, useState } from 'react';
import { C } from '../theme.js';
import { useGame } from '../store/GameContext.jsx';

const NAV_ITEMS = [
  { id: 'dungeon',    icon: '🏰', label: 'Donjons',   desc: 'Explorez les chapitres',       color: '#1A0A2E' },
  { id: 'gacha',     icon: '🌀', label: 'Invocations',desc: 'Invoquez des Pléiades',        color: '#0F0030' },
  { id: 'team',      icon: '⚔️', label: 'Équipe',     desc: 'Composez votre équipe',        color: '#1A0A00' },
  { id: 'collection',icon: '📖', label: 'Collection', desc: 'Vos Pléiades & Compagnons',    color: '#001A10' },
  { id: 'arena',     icon: '🏆', label: 'Arène',      desc: 'Combat PvP asynchrone',        color: '#1A0A00' },
  { id: 'shop',      icon: '🛒', label: 'Shop',       desc: 'Ressources & Cosmétiques',     color: '#001A2E' },
  { id: 'profile',   icon: '👤', label: 'Profil',     desc: 'Statistiques & Succès',        color: '#1A001A' },
];

export default function MainMenu({ onNavigate }) {
  const { state, dispatch } = useGame();
  const [stars, setStars] = useState([]);
  const today = new Date().toDateString();
  const canClaimDaily = state.lastLogin !== today;

  useEffect(() => {
    setStars(Array.from({ length: 80 }, (_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 4, duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.4 + 0.05,
    })));
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, overflowY: 'auto',
      paddingTop: 72, paddingBottom: 24,
      position: 'relative',
    }}>
      {/* Bg stars */}
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'fixed', left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size, borderRadius: '50%',
          background: 'white', opacity: s.opacity,
          animation: `pulse ${s.duration}s ${s.delay}s ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>

        {/* Welcome banner */}
        <div style={{
          background: `linear-gradient(135deg, ${C.surface}, #1A0A3E)`,
          border: `1px solid ${C.border}`, borderRadius: 20,
          padding: '24px 32px', marginBottom: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: `0 4px 40px ${C.accent}22`,
        }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.text, letterSpacing: 1 }}>
              Bienvenue, <span style={{ color: C.gold }}>{state.player.name}</span> ✦
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
              Niveau {state.player.level} • {state.dungeon.completedStages.length} stages complétés •{' '}
              {state.player.totalPulls} invocations
            </div>
            {/* EXP bar */}
            <div style={{ marginTop: 10, width: 280 }}>
              <div style={{ height: 4, background: `${C.border}66`, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${Math.min((state.player.exp / (state.player.level * 200)) * 100, 100)}%`,
                  background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`,
                }} />
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
                EXP: {state.player.exp} / {state.player.level * 200}
              </div>
            </div>
          </div>

          {/* Daily bonus */}
          <button
            onClick={() => dispatch({ type: 'CLAIM_DAILY' })}
            disabled={!canClaimDaily}
            style={{
              background: canClaimDaily ? `linear-gradient(135deg, ${C.gold}, #92400E)` : `${C.border}44`,
              border: 'none', borderRadius: 14, padding: '14px 20px',
              color: canClaimDaily ? '#FFF' : C.muted,
              cursor: canClaimDaily ? 'pointer' : 'not-allowed',
              fontFamily: 'Georgia, serif', fontWeight: 700,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              transition: 'all 0.2s',
              boxShadow: canClaimDaily ? `0 4px 20px ${C.gold}44` : 'none',
            }}
          >
            <span style={{ fontSize: 28 }}>🎁</span>
            <span style={{ fontSize: 12 }}>{canClaimDaily ? 'Bonus Quotidien' : 'Déjà réclamé'}</span>
            <span style={{ fontSize: 10, opacity: 0.8 }}>Jour {state.loginStreak + (canClaimDaily ? 1 : 0)}</span>
          </button>
        </div>

        {/* Navigation grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 14,
        }}>
          {NAV_ITEMS.map(item => (
            <NavCard key={item.id} item={item} onNavigate={onNavigate} state={state} />
          ))}
        </div>

        {/* World news */}
        <div style={{
          marginTop: 20,
          background: `${C.surface}CC`, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: '16px 20px',
        }}>
          <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>
            📰 NOUVELLES D'APOLLION
          </div>
          {[
            { icon: '⭐', text: 'EVENT: La Semaine des Étoiles — x2 fragments sur tous les stages', color: C.goldHi },
            { icon: '🆕', text: 'NOUVEAU: Tempestia (Fulgurant/Céleste) disponible sur le Banner Étoile !', color: C.cyan },
            { icon: '⚔️', text: 'PVP Saison 1 en cours — rejoignez l\'Arène pour des récompenses exclusives', color: C.accentHi },
          ].map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0', borderTop: i > 0 ? `1px solid ${C.border}44` : 'none' }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>{n.icon}</span>
              <span style={{ fontSize: 12, color: n.color, lineHeight: 1.5 }}>{n.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavCard({ item, onNavigate, state }) {
  const [hovered, setHovered] = useState(false);

  const badges = {
    dungeon: state.dungeon.completedStages.length > 0
      ? `${state.dungeon.completedStages.length} complétés` : null,
    collection: `${state.collection.pleiades.length} Pléiades`,
    arena: state.arena.rank,
  };

  return (
    <div
      onClick={() => onNavigate(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${item.color}, ${C.card})`
          : `${C.surface}CC`,
        border: `1px solid ${hovered ? C.accentHi : C.border}`,
        borderRadius: 16, padding: '20px 22px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? `0 8px 30px ${C.accent}33` : 'none',
      }}
    >
      <div style={{
        fontSize: 34, width: 52, height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${item.color}88`, borderRadius: 14,
        border: `1px solid ${C.border}`,
        flexShrink: 0,
      }}>
        {item.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: hovered ? C.goldHi : C.text, letterSpacing: 0.5 }}>
          {item.label}
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{item.desc}</div>
        {badges[item.id] && (
          <div style={{
            marginTop: 5, display: 'inline-block',
            background: `${C.accent}33`, border: `1px solid ${C.accent}55`,
            borderRadius: 8, padding: '2px 8px',
            fontSize: 10, color: C.accentHi,
          }}>{badges[item.id]}</div>
        )}
      </div>
      <div style={{ color: hovered ? C.gold : C.muted, fontSize: 18 }}>›</div>
    </div>
  );
}
