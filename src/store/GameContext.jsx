import { createContext, useContext, useReducer, useEffect } from 'react';
import { PLEIADES, rollGacha, getRandomCharacterOfRarity } from '../data/characters.js';
import { PETS } from '../data/pets.js';

const GameContext = createContext(null);

const INITIAL_STATE = {
  player: {
    name: "Invocateur",
    level: 1,
    exp: 0,
    stamina: 60,
    maxStamina: 60,
    reputation: 0,
    totalPulls: 0,
    totalGold: 0,
  },
  resources: {
    gems: 1500,
    gold: 10000,
    energy: 100,
    stamina: 60,
    guildCoin: 0,
    arenaToken: 0,
    fragments: {},
    bondTokens: 0,
    dungeonKeys: 5,
  },
  collection: {
    pleiades: [
      { id: "luna", stars: 1, level: 1, exp: 0, copies: 1 },
      { id: "ignis", stars: 1, level: 1, exp: 0, copies: 1 },
      { id: "aqua", stars: 1, level: 1, exp: 0, copies: 1 },
      { id: "terra", stars: 1, level: 1, exp: 0, copies: 1 },
    ],
    pets: [
      { id: "thunderpup", stage: 1, level: 1, copies: 1, dungeons: 0, pvpWins: 0 },
    ],
  },
  team: {
    pleiades: ["luna", "ignis", "aqua", "terra"],
    pets: ["thunderpup", null, null, null],
  },
  pity: {
    pleiades: 0,
    pets: 0,
    dungeon: 0,
    secretPity: 0,
  },
  dungeon: {
    completedStages: [],
    stageStars: {},
    currentChapter: "ch1",
  },
  arena: {
    rank: "Bronze",
    points: 0,
    season: 1,
    wins: 0,
    losses: 0,
    attacksLeft: 3,
  },
  guild: null,
  notifications: [],
  settings: {
    autoPlay: false,
    speed: 1,
    sfx: true,
    music: true,
  },
  lastLogin: null,
  loginStreak: 0,
};

function loadState() {
  try {
    const saved = localStorage.getItem('apollion_save');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with initial state to handle new fields
      return deepMerge(INITIAL_STATE, parsed);
    }
  } catch (e) {
    console.warn('Failed to load save:', e);
  }
  return INITIAL_STATE;
}

function deepMerge(base, override) {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (key in base && typeof base[key] === 'object' && !Array.isArray(base[key]) && base[key] !== null) {
      result[key] = deepMerge(base[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

function saveState(state) {
  try {
    localStorage.setItem('apollion_save', JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save:', e);
  }
}

function addNotification(state, message, type = 'info') {
  const notif = { id: Date.now(), message, type };
  return {
    ...state,
    notifications: [...state.notifications.slice(-4), notif],
  };
}

function addToCollection(collection, char) {
  const existing = collection.pleiades.find(c => c.id === char.id);
  if (existing) {
    return {
      ...collection,
      pleiades: collection.pleiades.map(c =>
        c.id === char.id ? { ...c, copies: c.copies + 1 } : c
      ),
    };
  }
  return {
    ...collection,
    pleiades: [...collection.pleiades, { id: char.id, stars: char.rarity, level: 1, exp: 0, copies: 1 }],
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'PULL_GACHA': {
      const { banner, count } = action;
      const cost = count === 10 ? (banner === 'pleiades' ? 2800 : 1400) : (banner === 'pleiades' ? 300 : 150);

      if (state.resources.gems < cost) {
        return addNotification(state, "Gemmes insuffisantes !", "error");
      }

      const results = [];
      let pity = state.pity[banner] || 0;

      for (let i = 0; i < count; i++) {
        const rarity = rollGacha(pity);
        const char = getRandomCharacterOfRarity(rarity, banner);
        results.push(char);
        pity = rarity >= 5 ? 0 : pity + 1;
      }

      let newCollection = state.collection;
      for (const char of results) {
        if (banner === 'pleiades' || banner === 'dungeon') {
          newCollection = addToCollection(newCollection, char);
        }
      }

      const newPullCount = state.player.totalPulls + count;
      const highestRarity = Math.max(...results.map(r => r.rarity));

      return {
        ...state,
        resources: { ...state.resources, gems: state.resources.gems - cost },
        collection: newCollection,
        pity: { ...state.pity, [banner]: pity, secretPity: state.pity.secretPity + count },
        player: { ...state.player, totalPulls: newPullCount },
        lastPullResults: results,
      };
    }

    case 'SET_TEAM_PLEIADES': {
      return { ...state, team: { ...state.team, pleiades: action.pleiades } };
    }

    case 'SET_TEAM_PETS': {
      return { ...state, team: { ...state.team, pets: action.pets } };
    }

    case 'COMPLETE_STAGE': {
      const { stageId, stars, rewards } = action;
      const alreadyCompleted = state.dungeon.completedStages.includes(stageId);
      const prevStars = state.dungeon.stageStars[stageId] || 0;
      const newStars = Math.max(prevStars, stars);

      let newFragments = { ...state.resources.fragments };
      if (rewards.fragments) {
        for (const fragId of rewards.fragments) {
          newFragments[fragId] = (newFragments[fragId] || 0) + 1;
        }
      }

      const newExp = state.player.exp + rewards.exp;
      const levelThreshold = state.player.level * 200;
      const newLevel = newExp >= levelThreshold ? state.player.level + 1 : state.player.level;

      let newState = {
        ...state,
        resources: {
          ...state.resources,
          gold: state.resources.gold + rewards.gold,
          gems: state.resources.gems + (rewards.gems || 0),
          stamina: state.resources.stamina - (action.staminaCost || 0),
          fragments: newFragments,
        },
        dungeon: {
          ...state.dungeon,
          completedStages: alreadyCompleted
            ? state.dungeon.completedStages
            : [...state.dungeon.completedStages, stageId],
          stageStars: { ...state.dungeon.stageStars, [stageId]: newStars },
        },
        player: {
          ...state.player,
          exp: newLevel > state.player.level ? newExp - levelThreshold : newExp,
          level: newLevel,
        },
      };

      if (newLevel > state.player.level) {
        newState = addNotification(newState, `Niveau ${newLevel} atteint !`, 'success');
      }

      return newState;
    }

    case 'SPEND_STAMINA': {
      if (state.resources.stamina < action.amount) return state;
      return { ...state, resources: { ...state.resources, stamina: state.resources.stamina - action.amount } };
    }

    case 'ADD_RESOURCES': {
      return {
        ...state,
        resources: {
          ...state.resources,
          gems: state.resources.gems + (action.gems || 0),
          gold: state.resources.gold + (action.gold || 0),
          energy: state.resources.energy + (action.energy || 0),
        }
      };
    }

    case 'RENAME_PLAYER': {
      return { ...state, player: { ...state.player, name: action.name } };
    }

    case 'DISMISS_NOTIFICATION': {
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.id) };
    }

    case 'CLEAR_PULL_RESULTS': {
      return { ...state, lastPullResults: null };
    }

    case 'LEVEL_UP_CHARACTER': {
      const { charId } = action;
      return {
        ...state,
        collection: {
          ...state.collection,
          pleiades: state.collection.pleiades.map(c =>
            c.id === charId ? { ...c, level: Math.min(c.level + 1, 100) } : c
          )
        }
      };
    }

    case 'TOGGLE_SETTING': {
      return { ...state, settings: { ...state.settings, [action.key]: !state.settings[action.key] } };
    }

    case 'CLAIM_DAILY': {
      const today = new Date().toDateString();
      if (state.lastLogin === today) return state;
      const streak = state.loginStreak + 1;
      const gems = 50 + (streak % 7 === 0 ? 200 : 0); // Bonus hebdo
      const gold = 500 * Math.min(streak, 7);
      return addNotification({
        ...state,
        resources: { ...state.resources, gems: state.resources.gems + gems, gold: state.resources.gold + gold },
        lastLogin: today,
        loginStreak: streak,
      }, `Connexion jour ${streak}: +${gems} 💎 +${gold} 💰`, 'success');
    }

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Auto-dismiss notifications
  useEffect(() => {
    if (state.notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'DISMISS_NOTIFICATION', id: state.notifications[0].id });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [state.notifications]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
