import { C } from '../theme.js';
import { useGame } from '../store/GameContext.jsx';

export default function TopBar({ currentScreen, onNavigate }) {
  const { state } = useGame();
  const { gems, gold, energy, stamina } = state.resources;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: `${C.surface}EE`,
      borderBottom: `1px solid ${C.border}`,
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 20px', height: 56,
    }}>
      {/* Logo */}
      <div
        onClick={() => onNavigate('menu')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <span style={{ fontSize: 18, animation: 'starPulse 3s ease-in-out infinite' }}>✦</span>
        <span style={{
          fontSize: 16, fontWeight: 900, letterSpacing: 3,
          color: C.gold, textShadow: `0 0 12px ${C.gold}88`
        }}>APOLLION</span>
      </div>

      {/* Resources */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Resource icon="💎" value={gems.toLocaleString()} color={C.accentHi} />
        <Resource icon="💰" value={gold.toLocaleString()} color={C.goldHi} />
        <Resource icon="⚡" value={energy} color={C.cyan} />
        <Resource icon="🔮" value={`${stamina}/${state.player.maxStamina}`} color={C.green} />
      </div>

      {/* Player info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>{state.player.name}</div>
          <div style={{ fontSize: 10, color: C.muted }}>Niv. {state.player.level}</div>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.accent}, ${C.gold})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, border: `2px solid ${C.gold}`,
        }}>⭐</div>
      </div>
    </div>
  );
}

function Resource({ icon, value, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      background: `${C.card}CC`, border: `1px solid ${C.border}`,
      borderRadius: 20, padding: '4px 10px',
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'monospace' }}>{value}</span>
    </div>
  );
}
