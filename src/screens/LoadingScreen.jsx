import { useEffect, useState } from 'react';
import { C } from '../theme.js';

const LORE_QUOTES = [
  "« Quand les étoiles s'éteignent, les invocateurs s'éveillent… »",
  "« Le Voile Brisé n'est pas une fin — c'est un commencement. »",
  "« Chaque Pléiade porte en elle un éclat du Voile. »",
  "« Les abysses remontent. Apollion a besoin de toi. »",
  "« Les étoiles ne meurent pas. Elles deviennent des légendes. »",
];

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [quote] = useState(() => LORE_QUOTES[Math.floor(Math.random() * LORE_QUOTES.length)]);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLogo(true), 300);
    const timer2 = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer2);
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 80);
    return () => { clearTimeout(timer1); clearInterval(timer2); };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(onLoaded, 600);
    }
  }, [progress, onLoaded]);

  // Stars
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Star particles */}
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size,
          borderRadius: '50%',
          background: 'white',
          opacity: Math.random() * 0.6 + 0.1,
          animation: `pulse ${s.duration}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}

      {/* Logo */}
      <div style={{
        opacity: showLogo ? 1 : 0,
        transform: showLogo ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <div style={{ fontSize: 64, animation: 'starPulse 2s ease-in-out infinite' }}>✦</div>
        <div style={{
          fontSize: 52, fontWeight: 900, letterSpacing: 12,
          color: C.gold, textShadow: `0 0 30px ${C.gold}88, 0 0 60px ${C.accent}44`,
          fontFamily: 'Georgia, serif',
        }}>APOLLION</div>
        <div style={{ fontSize: 14, color: C.accentHi, letterSpacing: 6, textTransform: 'uppercase' }}>
          ✦ Stellar Bond ✦
        </div>
      </div>

      {/* Loading bar */}
      <div style={{ marginTop: 60, width: 320, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: '100%', height: 4, background: `${C.border}44`,
          borderRadius: 2, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(progress, 100)}%`,
            background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`,
            borderRadius: 2,
            transition: 'width 0.1s ease',
            boxShadow: `0 0 10px ${C.accent}`,
          }} />
        </div>
        <div style={{ fontSize: 11, color: C.muted, textAlign: 'center', fontStyle: 'italic', lineHeight: 1.6 }}>
          {quote}
        </div>
        <div style={{ fontSize: 10, color: `${C.muted}88`, letterSpacing: 2 }}>
          LillyAiVerse Studio
        </div>
      </div>
    </div>
  );
}
