import { useState } from 'react';
import { C, RARITIES, ELEMENTS, CLASSES } from '../theme.js';
import { useGame } from '../store/GameContext.jsx';
import { getCharacterById, PLEIADES } from '../data/characters.js';

const FILTER_ELEMENTS = ['Tous', 'Stellaire', 'Abyssal', 'Ombral', 'Solaire', 'Glacial', 'Fulgurant', 'Tellurique', 'Spectral', 'Néant'];
const FILTER_CLASSES = ['Toutes', 'Gardienne', 'Attaquante', 'Mage', 'Soigneuse', 'Assassine', 'Archère', 'Invocatrice', 'Berserker'];

export default function CollectionScreen() {
  const { state } = useGame();
  const [filterElem, setFilterElem] = useState('Tous');
  const [filterClass, setFilterClass] = useState('Toutes');
  const [filterOwned, setFilterOwned] = useState('Toutes');
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState('rarity');

  const ownedIds = state.collection.pleiades.map(c => c.id);

  let chars = PLEIADES.filter(c => {
    if (filterElem !== 'Tous' && c.element !== filterElem) return false;
    if (filterClass !== 'Toutes' && c.classe !== filterClass) return false;
    if (filterOwned === 'Obtenues' && !ownedIds.includes(c.id)) return false;
    if (filterOwned === 'Manquantes' && ownedIds.includes(c.id)) return false;
    return true;
  });

  chars = [...chars].sort((a, b) => {
    if (sortBy === 'rarity') return b.rarity - a.rarity;
    if (sortBy === 'element') return a.element.localeCompare(b.element);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const selectedChar = selected ? getCharacterById(selected) : null;
  const selectedOwned = selected ? state.collection.pleiades.find(c => c.id === selected) : null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingTop: 72, paddingBottom: 24, display: 'flex' }}>

      {/* Main panel */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingTop: 8 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: 1 }}>
                ✦ COLLECTION
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                {ownedIds.length} / {PLEIADES.length} Pléiades obtenues
              </div>
            </div>
            <select
              value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: '6px 12px', fontFamily: 'Georgia, serif', fontSize: 12, cursor: 'pointer' }}
            >
              <option value="rarity">Trier par Rareté</option>
              <option value="element">Trier par Élément</option>
              <option value="name">Trier par Nom</option>
            </select>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <FilterRow label="Élément" options={FILTER_ELEMENTS} value={filterElem} onChange={setFilterElem} />
            <FilterRow label="Classe" options={FILTER_CLASSES} value={filterClass} onChange={setFilterClass} />
            <FilterRow label="Obtenue" options={['Toutes','Obtenues','Manquantes']} value={filterOwned} onChange={setFilterOwned} />
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
            {chars.map(char => {
              const owned = ownedIds.includes(char.id);
              const collData = state.collection.pleiades.find(c => c.id === char.id);
              const rarity = RARITIES[char.rarity] || RARITIES[3];
              const elemInfo = ELEMENTS[char.element] || {};

              return (
                <div
                  key={char.id}
                  onClick={() => setSelected(selected === char.id ? null : char.id)}
                  style={{
                    background: owned
                      ? `linear-gradient(160deg, ${elemInfo.bg || C.card}CC, ${C.card})`
                      : `${C.surface}44`,
                    border: `2px solid ${selected === char.id ? C.accentHi : owned ? rarity.color : C.border + '44'}`,
                    borderRadius: 12, padding: 8,
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    opacity: owned ? 1 : 0.4,
                    transition: 'all 0.18s',
                    transform: selected === char.id ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selected === char.id ? `0 0 20px ${C.accentHi}66` : owned ? `0 0 8px ${rarity.color}33` : 'none',
                  }}
                >
                  {collData && (
                    <div style={{ alignSelf: 'flex-start', background: `${C.accent}CC`, borderRadius: 4, fontSize: 8, color: C.text, fontWeight: 700, padding: '1px 4px' }}>
                      Lv{collData.level}
                    </div>
                  )}
                  <div style={{ fontSize: 36, filter: owned ? `drop-shadow(0 0 6px ${elemInfo.accent || '#fff'}66)` : 'grayscale(100%)' }}>
                    {char.portrait}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: owned ? rarity.textColor : C.muted, textAlign: 'center' }}>
                    {char.name}
                  </div>
                  <div style={{ fontSize: 8, color: owned ? rarity.color : C.muted + '66' }}>
                    {'★'.repeat(Math.min(char.rarity, 6))}{char.rarity > 6 ? '…' : ''}
                  </div>
                  {collData?.copies > 1 && (
                    <div style={{ fontSize: 8, color: C.cyan }}>×{collData.copies}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selectedChar && (
        <CharDetail char={selectedChar} owned={selectedOwned} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function FilterRow({ label, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 10, color: C.muted, letterSpacing: 1, width: 55, flexShrink: 0 }}>{label}</span>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            background: value === opt ? `${C.accent}33` : `${C.card}88`,
            border: `1px solid ${value === opt ? C.accentHi : C.border + '66'}`,
            borderRadius: 20, padding: '3px 10px',
            color: value === opt ? C.text : C.muted,
            cursor: 'pointer', fontSize: 11,
            fontFamily: 'Georgia, serif',
            transition: 'all 0.15s',
          }}
        >{opt}</button>
      ))}
    </div>
  );
}

function CharDetail({ char, owned, onClose }) {
  const rarity = RARITIES[char.rarity] || RARITIES[5];
  const elemInfo = ELEMENTS[char.element] || {};
  const classInfo = CLASSES[char.classe] || {};

  return (
    <div style={{
      width: 320, background: C.surface, borderLeft: `1px solid ${C.border}`,
      overflowY: 'auto', padding: '20px 20px', flexShrink: 0,
      display: 'flex', flexDirection: 'column', gap: 14,
      paddingTop: 80,
    }}>
      <button onClick={onClose} style={{
        alignSelf: 'flex-end', background: 'transparent',
        border: `1px solid ${C.border}`, color: C.muted,
        borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 13
      }}>✕</button>

      {/* Portrait */}
      <div style={{
        textAlign: 'center', padding: '20px 0',
        background: `linear-gradient(160deg, ${elemInfo.bg || C.card}, transparent)`,
        borderRadius: 16, border: `1px solid ${rarity.color}33`,
      }}>
        <div style={{ fontSize: 72, filter: `drop-shadow(0 0 16px ${elemInfo.accent || '#fff'}99)` }}>
          {char.portrait}
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: rarity.textColor, marginTop: 8, letterSpacing: 1 }}>
          {char.name}
        </div>
        <div style={{ fontSize: 12, color: rarity.color, marginTop: 4 }}>
          {char.rarity === 11 ? '✦ SECRÈTE ✦' : '★'.repeat(char.rarity)} {rarity.name}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
          <Tag icon={elemInfo.icon} label={char.element} color={elemInfo.accent} />
          <Tag icon={classInfo.icon} label={char.classe} color={C.accentHi} />
        </div>
      </div>

      {/* Lore */}
      <div style={{ background: `${C.card}88`, borderRadius: 10, padding: '10px 14px', border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Lore</div>
        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, fontStyle: 'italic' }}>
          « {char.lore} »
        </div>
      </div>

      {/* Stats */}
      {owned && (
        <div style={{ background: `${C.card}88`, borderRadius: 10, padding: '10px 14px', border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Stats (Lv {owned.level})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {Object.entries(char.baseStats).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: C.muted, textTransform: 'uppercase', fontSize: 9 }}>{key}</span>
                <span style={{ color: C.text, fontWeight: 700, fontFamily: 'monospace' }}>
                  {Math.round(val * (1 + (owned.level - 1) * 0.05))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      <div style={{ background: `${C.card}88`, borderRadius: 10, padding: '10px 14px', border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Compétences
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {char.skills.map(sk => (
            <div key={sk.id} style={{
              background: sk.isUltimate ? `${C.gold}11` : `${C.accent}11`,
              border: `1px solid ${sk.isUltimate ? C.gold + '44' : C.accent + '44'}`,
              borderRadius: 8, padding: '8px 10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: sk.isUltimate ? C.goldHi : C.accentHi }}>
                  {sk.isUltimate ? '⚡ ' : ''}{sk.name}
                </span>
                {sk.cooldown > 0 && (
                  <span style={{ fontSize: 9, color: C.muted }}>CD: {sk.cooldown}</span>
                )}
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 3, lineHeight: 1.4 }}>{sk.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {!owned && (
        <div style={{
          textAlign: 'center', padding: '10px', background: `${C.border}22`,
          borderRadius: 10, fontSize: 12, color: C.muted, fontStyle: 'italic',
        }}>
          Non obtenue — Invoquez-la via le Portail !
        </div>
      )}
    </div>
  );
}

function Tag({ icon, label, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: `${color}22`, border: `1px solid ${color}44`,
      borderRadius: 20, padding: '3px 10px', fontSize: 11, color,
    }}>
      {icon} {label}
    </div>
  );
}
