import { C, RARITIES, ELEMENTS, CLASSES } from '../theme.js';
import { getCharacterById } from '../data/characters.js';

const RARITY_BORDER = {
  1:  { border: '#9CA3AF', glow: 'none' },
  2:  { border: '#34D399', glow: '0 0 8px #34D39966' },
  3:  { border: '#60A5FA', glow: '0 0 10px #60A5FA66' },
  4:  { border: '#A855F7', glow: '0 0 12px #A855F788' },
  5:  { border: '#D4A017', glow: '0 0 16px #D4A01788', shimmer: true },
  6:  { border: '#EF4444', glow: '0 0 18px #EF444488' },
  7:  { border: '#E5E7EB', glow: '0 0 20px #E5E7EBAA' },
  8:  { border: '#22D3EE', glow: '0 0 22px #22D3EEAA' },
  9:  { border: '#F9A8D4', glow: '0 0 24px #F9A8D4AA' },
  10: { border: 'rainbow', glow: '0 0 30px #FFFFFF88' },
  11: { border: '#CBD5E1', glow: '0 0 40px #CBD5E1CC' },
};

export default function CharacterCard({ charId, collectionData, size = 'md', onClick, selected }) {
  const char = getCharacterById(charId);
  if (!char) return null;

  const rarity = collectionData?.stars || char.rarity;
  const level = collectionData?.level || 1;
  const rarityInfo = RARITIES[rarity] || RARITIES[5];
  const elemInfo = ELEMENTS[char.element] || {};
  const classInfo = CLASSES[char.classe] || {};
  const borderInfo = RARITY_BORDER[rarity] || RARITY_BORDER[5];

  const isSecret = rarity === 11;
  const sizes = {
    sm: { w: 80, h: 100, emoji: 28, name: 10, stars: 8, padding: 6 },
    md: { w: 120, h: 155, emoji: 42, name: 12, stars: 10, padding: 10 },
    lg: { w: 160, h: 210, emoji: 56, name: 14, stars: 11, padding: 14 },
  };
  const s = sizes[size] || sizes.md;

  const borderStyle = borderInfo.border === 'rainbow'
    ? 'linear-gradient(90deg, #ff0080, #ff8c00, #ffe100, #00ff80, #00c8ff, #a855f7)'
    : `1px solid ${borderInfo.border}`;

  return (
    <div
      onClick={onClick}
      style={{
        width: s.w, height: s.h,
        background: isSecret
          ? 'radial-gradient(circle at 50% 30%, #1a1a2e, #000000)'
          : `linear-gradient(160deg, ${elemInfo.bg || C.card}CC, ${C.card})`,
        border: borderInfo.border === 'rainbow' ? '2px solid transparent' : `2px solid ${borderInfo.border}`,
        backgroundImage: borderInfo.border === 'rainbow'
          ? `linear-gradient(160deg, ${elemInfo.bg || C.card}CC, ${C.card}), linear-gradient(90deg, #ff0080, #ff8c00, #ffe100, #00ff80, #00c8ff, #a855f7)`
          : undefined,
        backgroundOrigin: borderInfo.border === 'rainbow' ? 'border-box' : undefined,
        backgroundClip: borderInfo.border === 'rainbow' ? 'padding-box, border-box' : undefined,
        boxShadow: selected ? `0 0 20px ${C.accentHi}, ${borderInfo.glow}` : borderInfo.glow,
        borderRadius: 12, padding: s.padding,
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 4, position: 'relative',
        transition: 'all 0.2s',
        transform: selected ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Level badge */}
      {collectionData && (
        <div style={{
          position: 'absolute', top: 4, left: 4,
          background: `${C.accent}CC`, borderRadius: 4,
          fontSize: 9, color: C.text, fontWeight: 700,
          padding: '1px 4px', fontFamily: 'monospace',
        }}>Lv{level}</div>
      )}

      {/* Element + Class icons */}
      <div style={{
        position: 'absolute', top: 4, right: 4,
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <span style={{ fontSize: 12 }}>{elemInfo.icon}</span>
        <span style={{ fontSize: 10 }}>{classInfo.icon}</span>
      </div>

      {/* Portrait */}
      <div style={{
        fontSize: s.emoji, lineHeight: 1, marginTop: 8,
        filter: isSecret ? 'drop-shadow(0 0 12px #CBD5E1)' : `drop-shadow(0 0 6px ${elemInfo.accent || '#fff'}88)`,
        animation: isSecret ? 'float 3s ease-in-out infinite' : undefined,
      }}>
        {char.portrait}
      </div>

      {/* Name */}
      <div style={{
        fontSize: s.name, fontWeight: 700, color: rarityInfo.textColor,
        textAlign: 'center', lineHeight: 1.2, letterSpacing: 0.5,
        textShadow: `0 0 8px ${rarityInfo.color}88`,
      }}>
        {char.name}
      </div>

      {/* Stars */}
      <div style={{ fontSize: s.stars, color: rarityInfo.color, letterSpacing: 1, lineHeight: 1 }}>
        {isSecret ? '✦' : rarityInfo.stars.slice(0, rarity)}
      </div>

      {/* Rarity name for lg */}
      {size === 'lg' && (
        <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, textTransform: 'uppercase' }}>
          {rarityInfo.name}
        </div>
      )}

      {/* Secret glow overlay */}
      {isSecret && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 12,
          background: 'radial-gradient(circle at 50% 50%, #CBD5E122, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}
