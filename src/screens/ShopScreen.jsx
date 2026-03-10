import { useState } from 'react';
import { C } from '../theme.js';
import { useGame } from '../store/GameContext.jsx';

const DAILY_SHOP = [
  { id: 'gems_small', icon: '💎', name: 'Cristaux Étoilés', desc: '50 Gemmes', cost: 1000, currency: 'gold', reward: { gems: 50 } },
  { id: 'gems_med', icon: '💎', name: 'Gemmes Célestes', desc: '150 Gemmes', cost: 2500, currency: 'gold', reward: { gems: 150 } },
  { id: 'stamina_pack', icon: '🔮', name: 'Énergie Stellaire', desc: '+30 Stamina', cost: 200, currency: 'gold', reward: { stamina: 30 } },
  { id: 'energy_pack', icon: '⚡', name: 'Cristal d\'Énergie', desc: '+50 Énergie', cost: 300, currency: 'gold', reward: { energy: 50 } },
  { id: 'dungeon_key', icon: '🗝️', name: 'Clé de Donjon', desc: '+3 Clés', cost: 500, currency: 'gold', reward: { dungeonKeys: 3 } },
];

const GEM_PACKS = [
  { id: 'crystal', icon: '💎', name: 'Cristal', gems: 500, bonus: 0, price: '4.99€', color: '#9CA3AF' },
  { id: 'star', icon: '💫', name: 'Étoile', gems: 1200, bonus: 200, price: '9.99€', color: '#60A5FA' },
  { id: 'nebula', icon: '🌌', name: 'Nébuleuse', gems: 2500, bonus: 500, price: '19.99€', color: C.accentHi },
  { id: 'galaxy', icon: '🌀', name: 'Galaxie', gems: 6500, bonus: 1500, price: '49.99€', color: C.gold },
  { id: 'apollion', icon: '✦', name: 'Apollion', gems: 14000, bonus: 4000, price: '99.99€', color: C.rose, exclusive: true },
];

const BATTLE_PASS_INFO = {
  level: 0,
  maxLevel: 50,
  price: '9.99€',
  perks: ['Ressources ×2', 'Cosmétique exclusif de saison', '+10 invocations bonus', 'Accès aux quêtes premium'],
};

export default function ShopScreen() {
  const { state, dispatch } = useGame();
  const [activeTab, setActiveTab] = useState('daily');
  const [purchasedToday, setPurchasedToday] = useState([]);

  function buyDailyItem(item) {
    if (purchasedToday.includes(item.id)) return;
    if (state.resources.gold < item.cost) return;

    dispatch({ type: 'ADD_RESOURCES', ...item.reward });
    dispatch({ type: 'ADD_RESOURCES', gold: -item.cost });
    setPurchasedToday(prev => [...prev, item.id]);
  }

  const tabs = [
    { id: 'daily', label: 'Shop Quotidien', icon: '🛒' },
    { id: 'gems', label: 'Gemmes', icon: '💎' },
    { id: 'battlepass', label: 'Battle Pass', icon: '⚔️' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingTop: 72, paddingBottom: 24, overflowY: 'auto' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>

        <div style={{ fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: 1, marginBottom: 16, paddingTop: 8 }}>
          🛒 SHOP D'APOLLION
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '10px 8px',
              background: activeTab === tab.id ? `${C.accent}33` : `${C.surface}CC`,
              border: `2px solid ${activeTab === tab.id ? C.accentHi : C.border}`,
              borderRadius: 12, cursor: 'pointer',
              color: activeTab === tab.id ? C.text : C.muted,
              fontFamily: 'Georgia, serif', fontWeight: 700,
              fontSize: 12, transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: 20 }}>{tab.icon}</div>
              <div style={{ marginTop: 3 }}>{tab.label}</div>
            </button>
          ))}
        </div>

        {/* Daily Shop */}
        {activeTab === 'daily' && (
          <>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>
              Se renouvelle chaque jour • {purchasedToday.length}/{DAILY_SHOP.length} achetés
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
              {DAILY_SHOP.map(item => {
                const bought = purchasedToday.includes(item.id);
                const canAfford = state.resources.gold >= item.cost;
                return (
                  <div key={item.id} style={{
                    background: `${C.surface}CC`, border: `1px solid ${bought ? C.border + '33' : C.border}`,
                    borderRadius: 16, padding: '16px 18px',
                    opacity: bought ? 0.5 : 1, transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ fontSize: 36, background: `${C.card}CC`, borderRadius: 12, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: C.accentHi }}>{item.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => buyDailyItem(item)}
                      disabled={bought || !canAfford}
                      style={{
                        width: '100%', padding: '8px',
                        background: bought ? 'transparent' : canAfford ? `linear-gradient(135deg, ${C.gold}, #92400E)` : `${C.border}44`,
                        border: `1px solid ${bought ? C.border + '33' : canAfford ? C.gold + '66' : C.border}`,
                        borderRadius: 10, cursor: bought || !canAfford ? 'not-allowed' : 'pointer',
                        color: bought ? C.muted : canAfford ? 'white' : C.muted,
                        fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      {bought ? '✓ Acheté' : <>💰 {item.cost.toLocaleString()} or</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Gems shop */}
        {activeTab === 'gems' && (
          <>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>
              Les Gemmes permettent d'invoquer des Pléiades, Pets et entités de donjon
            </div>
            {/* Free gems info */}
            <div style={{
              background: `${C.green}11`, border: `1px solid ${C.green}33`,
              borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: 12, color: C.green,
            }}>
              💚 Joueur F2P: ~800 gemmes/semaine via quêtes, donjons et classements !
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {GEM_PACKS.map(pack => (
                <div key={pack.id} style={{
                  background: pack.exclusive ? 'radial-gradient(circle at 50% 0%, #1A003A, #000)' : `${C.surface}CC`,
                  border: `2px solid ${pack.color}44`,
                  borderRadius: 16, padding: '18px',
                  boxShadow: pack.exclusive ? `0 0 30px ${pack.color}22` : 'none',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {pack.exclusive && (
                    <div style={{ position: 'absolute', top: 8, right: 8, background: pack.color, color: '#000', borderRadius: 6, fontSize: 9, padding: '2px 6px', fontWeight: 700 }}>
                      EXCLUSIF
                    </div>
                  )}
                  <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 8, filter: `drop-shadow(0 0 10px ${pack.color}66)` }}>
                    {pack.icon}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: pack.color }}>{pack.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: C.text, marginTop: 4, fontFamily: 'monospace' }}>
                      {pack.gems.toLocaleString()} 💎
                    </div>
                    {pack.bonus > 0 && (
                      <div style={{ fontSize: 11, color: C.green }}>+{pack.bonus.toLocaleString()} BONUS</div>
                    )}
                    <div style={{ fontSize: 16, color: C.gold, fontWeight: 700, marginTop: 8 }}>{pack.price}</div>
                  </div>
                  <button style={{
                    width: '100%', marginTop: 12, padding: '10px',
                    background: `linear-gradient(135deg, ${pack.color}33, ${pack.color}11)`,
                    border: `1px solid ${pack.color}66`, borderRadius: 10,
                    color: pack.color, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                    fontFamily: 'Georgia, serif',
                  }}>
                    Acheter
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Battle Pass */}
        {activeTab === 'battlepass' && (
          <div>
            <div style={{
              background: `linear-gradient(135deg, #1A0A3E, #0A001A)`,
              border: `2px solid ${C.gold}66`, borderRadius: 20,
              padding: '24px 28px', marginBottom: 20,
              boxShadow: `0 4px 40px ${C.gold}22`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.gold, letterSpacing: 1 }}>
                    ⚔️ Éclat Stellaire
                  </div>
                  <div style={{ fontSize: 13, color: C.text, marginTop: 4 }}>Battle Pass Saison 1</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Durée: 4 semaines</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: C.gold }}>9.99€</div>
                  <div style={{ fontSize: 10, color: C.green }}>Farmable en jeu</div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>Progression</span>
                  <span style={{ fontSize: 11, color: C.gold }}>Niveau {BATTLE_PASS_INFO.level} / {BATTLE_PASS_INFO.maxLevel}</span>
                </div>
                <div style={{ height: 6, background: `${C.border}44`, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(BATTLE_PASS_INFO.level / BATTLE_PASS_INFO.maxLevel) * 100}%`,
                    background: `linear-gradient(90deg, ${C.gold}, ${C.accentHi})`,
                    borderRadius: 3,
                  }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                {BATTLE_PASS_INFO.perks.map((perk, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: C.text }}>
                    <span style={{ color: C.gold }}>✦</span> {perk}
                  </div>
                ))}
              </div>

              <button style={{
                width: '100%', padding: '12px',
                background: `linear-gradient(135deg, ${C.gold}, #92400E)`,
                border: 'none', borderRadius: 14, color: 'white', cursor: 'pointer',
                fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 14,
                boxShadow: `0 4px 20px ${C.gold}44`,
              }}>
                Activer le Battle Pass — 9.99€
              </button>
            </div>

            {/* Free track preview */}
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Paliers gratuits (aperçu)</div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
              {[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(level => (
                <div key={level} style={{
                  flexShrink: 0, width: 70, textAlign: 'center',
                  background: `${C.card}CC`, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '8px 6px',
                }}>
                  <div style={{ fontSize: 18 }}>
                    {level <= 10 ? '💰' : level <= 20 ? '💎' : level <= 30 ? '🔮' : level <= 40 ? '⭐' : '✦'}
                  </div>
                  <div style={{ fontSize: 9, color: C.muted, marginTop: 3 }}>Lv{level}</div>
                  <div style={{ fontSize: 9, color: C.gold }}>
                    {level <= 10 ? '+500 or' : level <= 20 ? '+50💎' : level <= 30 ? '+100💎' : level <= 40 ? '+200💎' : 'Skin!'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
