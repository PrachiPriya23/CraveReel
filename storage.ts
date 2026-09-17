import { CartItem, Order, UserPreferences, AIComparisonQuery } from '../types';

const ROOM_DB_KEYS = {
  LIKES: 'cravebite_room_likes',
  CART: 'cravebite_room_cart',
  ORDERS: 'cravebite_room_orders',
  PREFERENCES: 'cravebite_room_preferences',
  AI_HISTORY: 'cravebite_room_ai_history',
  COINS: 'cravebite_room_coins',
};

export const RoomDB = {
  // Liked items
  getLikedIds: (): string[] => {
    try {
      const data = localStorage.getItem(ROOM_DB_KEYS.LIKES);
      return data ? JSON.parse(data) : ['food_1', 'food_3'];
    } catch {
      return ['food_1', 'food_3'];
    }
  },

  toggleLike: (id: string): string[] => {
    const current = RoomDB.getLikedIds();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    localStorage.setItem(ROOM_DB_KEYS.LIKES, JSON.stringify(next));
    return next;
  },

  // Cart
  getCart: (): CartItem[] => {
    try {
      const data = localStorage.getItem(ROOM_DB_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCart: (cart: CartItem[]): void => {
    localStorage.setItem(ROOM_DB_KEYS.CART, JSON.stringify(cart));
  },

  // Orders
  getOrders: (): Order[] => {
    try {
      const data = localStorage.getItem(ROOM_DB_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveOrder: (order: Order): Order[] => {
    const current = RoomDB.getOrders();
    const next = [order, ...current];
    localStorage.setItem(ROOM_DB_KEYS.ORDERS, JSON.stringify(next));
    return next;
  },

  updateOrderStatus: (orderId: string, status: Order['status']): Order[] => {
    const current = RoomDB.getOrders();
    const next = current.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          stepLogs: ord.stepLogs.map((step) => ({
            ...step,
            completed: step.completed || step.step === status,
          })),
        };
      }
      return ord;
    });
    localStorage.setItem(ROOM_DB_KEYS.ORDERS, JSON.stringify(next));
    return next;
  },

  // User Preferences
  getPreferences: (): UserPreferences => {
    try {
      const data = localStorage.getItem(ROOM_DB_KEYS.PREFERENCES);
      return data
        ? JSON.parse(data)
        : {
            mood: 'Late Night',
            craving: 'Spicy',
            budget: 'mid',
            cuisine: 'All',
            maxPrepTime: 25,
            vegOnly: false,
          };
    } catch {
      return {
        mood: 'Late Night',
        craving: 'Spicy',
        budget: 'mid',
        cuisine: 'All',
        maxPrepTime: 25,
        vegOnly: false,
      };
    }
  },

  savePreferences: (pref: UserPreferences): void => {
    localStorage.setItem(ROOM_DB_KEYS.PREFERENCES, JSON.stringify(pref));
  },

  // Crave Coins
  getCoins: (): number => {
    try {
      const data = localStorage.getItem(ROOM_DB_KEYS.COINS);
      return data ? parseInt(data, 10) : 240;
    } catch {
      return 240;
    }
  },

  addCoins: (amount: number): number => {
    const current = RoomDB.getCoins();
    const next = current + amount;
    localStorage.setItem(ROOM_DB_KEYS.COINS, next.toString());
    return next;
  },

  // AI History
  getAIHistory: (): AIComparisonQuery[] => {
    try {
      const data = localStorage.getItem(ROOM_DB_KEYS.AI_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAIQuery: (item: AIComparisonQuery): AIComparisonQuery[] => {
    const current = RoomDB.getAIHistory();
    const next = [item, ...current.slice(0, 15)];
    localStorage.setItem(ROOM_DB_KEYS.AI_HISTORY, JSON.stringify(next));
    return next;
  },
};
