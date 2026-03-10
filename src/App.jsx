import { useState, useEffect } from 'react';
import { GameProvider, useGame } from './store/GameContext.jsx';
import { C } from './theme.js';
import LoadingScreen from './screens/LoadingScreen.jsx';
import MainMenu from './screens/MainMenu.jsx';
import GachaScreen from './screens/GachaScreen.jsx';
import CollectionScreen from './screens/CollectionScreen.jsx';
import TeamScreen from './screens/TeamScreen.jsx';
import CombatScreen from './screens/CombatScreen.jsx';
import DungeonScreen from './screens/DungeonScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import ShopScreen from './screens/ShopScreen.jsx';
import ArenaScreen from './screens/ArenaScreen.jsx';
import TopBar from './components/TopBar.jsx';

function GameApp() {
  const { state } = useGame();
  const [screen, setScreen] = useState('loading');

  function navigate(to) {
    setScreen(to);
  }

  const showTopBar = !['loading', 'combat'].includes(screen);

  return (
    <div style={{ width: '100vw', height: '100vh', background: C.bg, overflow: 'hidden', position: 'relative' }}>
      {/* Loading screen */}
      {screen === 'loading' && (
        <LoadingScreen onLoaded={() => setScreen('menu')} />
      )}

      {/* Top bar */}
      {showTopBar && (
        <TopBar currentScreen={screen} onNavigate={navigate} />
      )}

      {/* Screens */}
      {screen === 'menu' && (
        <MainMenu onNavigate={navigate} />
      )}
      {screen === 'gacha' && (
        <GachaScreen onNavigate={navigate} />
      )}
      {screen === 'collection' && (
        <CollectionScreen onNavigate={navigate} />
      )}
      {screen === 'team' && (
        <TeamScreen onNavigate={navigate} />
      )}
      {screen === 'combat' && (
        <CombatScreen
          stageData={{ enemies: ['corrupted_sprite', 'star_guardian', 'abyss_crawler'], level: 1 }}
          onVictory={() => navigate('menu')}
          onDefeat={() => navigate('menu')}
          onBack={() => navigate('menu')}
        />
      )}
      {screen === 'dungeon' && (
        <DungeonScreen onNavigate={navigate} />
      )}
      {screen === 'profile' && (
        <ProfileScreen onNavigate={navigate} />
      )}
      {screen === 'shop' && (
        <ShopScreen onNavigate={navigate} />
      )}
      {screen === 'arena' && (
        <ArenaScreen onNavigate={navigate} />
      )}

      {/* Notifications */}
      <Notifications />
    </div>
  );
}

function Notifications() {
  const { state, dispatch } = useGame();

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      zIndex: 500, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
      pointerEvents: 'none',
    }}>
      {state.notifications.map(notif => (
        <div
          key={notif.id}
          style={{
            background: notif.type === 'success' ? `${C.green}22` : notif.type === 'error' ? `${C.rose}22` : `${C.surface}EE`,
            border: `1px solid ${notif.type === 'success' ? C.green + '66' : notif.type === 'error' ? C.rose + '66' : C.border}`,
            borderRadius: 12, padding: '10px 20px',
            color: notif.type === 'success' ? C.green : notif.type === 'error' ? C.rose : C.text,
            fontSize: 13, fontWeight: 700,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 4px 20px #00000044`,
            animation: 'slideIn 0.3s ease, fadeIn 0.3s ease',
            pointerEvents: 'all',
            maxWidth: 380, textAlign: 'center',
          }}
          onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', id: notif.id })}
        >
          {notif.message}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}
