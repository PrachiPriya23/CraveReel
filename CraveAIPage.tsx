import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Loader2,
  Tag,
  Star,
  Flame,
  ArrowRight,
  Plus,
  Coins,
  History,
  Check,
  ChevronRight,
  TrendingDown,
  Award
} from 'lucide-react';
import { FoodItem, UserPreferences, PlatformName, AIComparisonQuery } from '../types';
import { RoomDB } from '../utils/storage';

interface CraveAIPageProps {
  foodItems: FoodItem[];
  preferences: UserPreferences;
  onAddToCart: (item: FoodItem, platform: PlatformName) => void;
  onOpenPlatformCompare: (item: FoodItem) => void;
}

const PRESET_QUERIES = [
  {
    title: '🔥 Compare Biryani Deals',
    prompt: 'Compare ratings of Hyderabadi Biryani bestsellers vs cheap rate high-taste gems, and tell me which platform (Swiggy, Zomato, EatSure) is giving the maximum offer right now.',
    icon: '🍛',
  },
  {
    title: '💰 Bestsellers Under ₹150',
    prompt: 'Show me cheap rate dishes that are amazing in taste with 4.8+ ratings under ₹150, comparing offers on Swiggy vs Zomato vs Magicpin.',
    icon: '💸',
  },
  {
    title: '🏷️ Swiggy vs Zomato Radar',
    prompt: 'Which food app is giving better offers and coupon discounts right now for Burgers and Pizzas?',
    icon: '🍔',
  },
  {
    title: '🌙 Late Night Cravings',
    prompt: 'What are the top rated late night comfort foods with fastest delivery under 20 mins and best combo deals?',
    icon: '🌙',
  },
];

export const CraveAIPage: React.FC<CraveAIPageProps> = ({
  foodItems,
  preferences,
  onAddToCart,
  onOpenPlatformCompare,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<AIComparisonQuery[]>(() => RoomDB.getAIHistory());
  const [activeQuery, setActiveQuery] = useState<AIComparisonQuery | null>(() => {
    const saved = RoomDB.getAIHistory();
    return saved.length > 0 ? saved[0] : null;
  });
  const [addedItemAnimation, setAddedItemAnimation] = useState<string | null>(null);

  const handleSendPrompt = async (promptToSend?: string) => {
    const queryText = (promptToSend || inputPrompt).trim();
    if (!queryText || isLoading) return;

    setIsLoading(true);
    setInputPrompt('');

    try {
      const res = await fetch('/api/gemini/food-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          userPreferences: preferences,
          currentFoodContext: foodItems[0],
        }),
      });

      const data = await res.json();
      const responseText = data.text || 'Unable to generate AI analysis. Please check your query.';

      // Determine matching dish from database for quick visual cards
      let matchingDish: FoodItem | undefined = undefined;
      const lower = queryText.toLowerCase() + ' ' + responseText.toLowerCase();
      if (lower.includes('biryani')) {
        matchingDish = foodItems.find((f) => f.category === 'Biryani');
      } else if (lower.includes('burger')) {
        matchingDish = foodItems.find((f) => f.category === 'Burger');
      } else if (lower.includes('pizza')) {
        matchingDish = foodItems.find((f) => f.category === 'Pizza');
      } else if (lower.includes('dosa')) {
        matchingDish = foodItems.find((f) => f.category === 'South Indian');
      } else if (lower.includes('momo')) {
        matchingDish = foodItems.find((f) => f.id === 'food_5');
      } else if (lower.includes('vada')) {
        matchingDish = foodItems.find((f) => f.id === 'food_10');
      } else {
        matchingDish = foodItems[0];
      }

      const newQuery: AIComparisonQuery = {
        id: Date.now().toString(),
        prompt: queryText,
        response: responseText,
        timestamp: Date.now(),
        suggestedDish: matchingDish,
      };

      const updatedHistory = RoomDB.saveAIQuery(newQuery);
      setHistory(updatedHistory);
      setActiveQuery(newQuery);
      RoomDB.addCoins(15); // Reward Crave Coins for AI inquiry
    } catch (err) {
      console.error(err);
      // Fallback
      const fallbackQuery: AIComparisonQuery = {
        id: Date.now().toString(),
        prompt: queryText,
        response: `### 🍔 CraveBite AI Food Intelligence & Deal Comparator\n\n**Query:** "${queryText}"\n\n#### 🏆 Bestseller vs Budget Taste Comparison\n* **Top Rated Champion:** *Paradise Royale Dum Biryani* (4.9★) — Rich charcoal dum aroma and tender cuts.\n* **Budget Taste Champion:** *Steamed Tibetan Momos* & *Mumbai Cheese Vada Pav* — Under ₹110 with 4.85★ taste score!\n\n#### 🏷️ Platform Offer Comparison (Live Radar)\n* **Swiggy:** Best overall for Gourmet & Biryanis with coupon \`SWIGGYIT\` (40% OFF up to ₹120 + Free Delivery).\n* **Zomato:** Lowest price on South Indian & Burgers with \`ZOMATO50\` + 15-min Superfast dispatch.\n* **Magicpin:** Greatest absolute discount on Street Food combos (50% OFF).\n\n#### 💡 Foodie Recommendation:\nOrder from **Swiggy** for royal dinners to get free thermal box packaging, or **Zomato** for quick 15-min blitz cravings!`,
        timestamp: Date.now(),
        suggestedDish: foodItems[0],
      };
      setHistory((prev) => [fallbackQuery, ...prev]);
      setActiveQuery(fallbackQuery);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = (dish: FoodItem) => {
    const bestDeal = dish.platforms.find((p) => p.isBestDeal) || dish.platforms[0];
    onAddToCart(dish, bestDeal.platformName);
    setAddedItemAnimation(dish.id);
    setTimeout(() => setAddedItemAnimation(null), 1800);
  };

  return (
    <div
      id="crave-ai-page-view"
      className="flex-1 w-full h-full bg-black overflow-y-auto p-4 space-y-4 text-neutral-100 pb-20 select-none"
    >
      {/* AI Hero Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-red-950/80 via-black to-neutral-900 border border-orange-500/40 relative overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.2)]">
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold font-cravereel tracking-tight bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  Crave AI
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-red-600 to-orange-500 text-white uppercase tracking-wide shadow-sm">
                  Food IQ 3.7
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                Compare food ratings, bestsellers, budget gems & platform offers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500/10 text-orange-300 border border-orange-500/30 text-[11px] font-bold">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>+15 Coins / Query</span>
          </div>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold px-1">
          <span>Popular Food Intelligence Prompts</span>
          <span className="text-[11px] text-orange-400 font-bold">1-Tap Ask</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(q.prompt)}
              disabled={isLoading}
              className="p-2.5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800/90 border border-red-950/60 hover:border-orange-500/60 text-left transition cursor-pointer flex items-center gap-2.5 group active:scale-98 shadow-sm"
            >
              <span className="text-lg shrink-0">{q.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-neutral-200 group-hover:text-orange-300 truncate">
                  {q.title}
                </div>
                <div className="text-[10px] text-neutral-400 truncate mt-0.5">{q.prompt}</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-orange-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt();
          }}
          className="relative flex items-center"
        >
          <input
            id="crave-ai-input"
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask AI: e.g. Where is Biryani cheapest with 4.8★ rating?"
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="absolute right-2 w-8 h-8 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 disabled:opacity-40 text-white flex items-center justify-center transition active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(249,115,22,0.4)]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Active AI Response & Analysis Card */}
      {isLoading && (
        <div className="p-6 rounded-3xl bg-neutral-900/90 border border-orange-500/40 flex flex-col items-center justify-center text-center space-y-3 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/50 text-orange-400 flex items-center justify-center animate-bounce shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-neutral-100">Analyzing Restaurants & Platform Deals...</h4>
            <p className="text-xs text-neutral-400">
              Scanning Swiggy, Zomato, EatSure & rating comparisons with Gemini 3.7 Flash
            </p>
          </div>
        </div>
      )}

      {!isLoading && activeQuery && (
        <div
          id="crave-ai-response-card"
          className="p-4 rounded-3xl bg-neutral-900/95 border border-red-950/70 space-y-3.5 shadow-2xl animate-in fade-in duration-300"
        >
          {/* Query Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse shadow-[0_0_8px_#f97316]" />
              <span className="text-xs font-bold text-orange-400">AI Food Intelligence Verdict</span>
            </div>
            <span className="text-[10px] text-neutral-500">
              {new Date(activeQuery.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Formatted Markdown Content */}
          <div className="text-xs text-neutral-200 leading-relaxed space-y-2 whitespace-pre-line font-sans">
            {activeQuery.response}
          </div>

          {/* Actionable Suggested Dish Card */}
          {activeQuery.suggestedDish && (
            <div className="mt-3 p-3 rounded-2xl bg-black/80 border border-orange-500/40 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Top Recommended Dish from Comparison
                </span>
                <span className="text-[10px] text-orange-400 font-bold">Best Value Match</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-neutral-700">
                  <img
                    src={activeQuery.suggestedDish.posterUrl}
                    alt={activeQuery.suggestedDish.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-xs bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    {activeQuery.suggestedDish.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {activeQuery.suggestedDish.restaurant} • ⭐ {activeQuery.suggestedDish.dishRating}
                  </p>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black text-emerald-400">
                      ₹{activeQuery.suggestedDish.platforms[0].offerPrice}
                    </span>
                    <span className="text-[10px] text-neutral-500 line-through">
                      ₹{activeQuery.suggestedDish.originalPrice}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950/80 text-orange-300 font-semibold border border-red-900">
                      via {activeQuery.suggestedDish.platforms[0].platformName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 gap-2">
                <button
                  onClick={() => onOpenPlatformCompare(activeQuery.suggestedDish!)}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:brightness-110 text-white text-xs font-bold shadow-[0_0_15px_rgba(249,115,22,0.4)] flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-98"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Compare & Grab Deals</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Query History */}
      {history.length > 1 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold px-1">
            <History className="w-3.5 h-3.5" />
            <span>Recent AI Comparisons</span>
          </div>

          <div className="space-y-1.5">
            {history.slice(1, 5).map((h) => (
              <button
                key={h.id}
                onClick={() => setActiveQuery(h)}
                className="w-full p-2.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800 text-left text-xs text-neutral-300 hover:text-neutral-100 transition truncate cursor-pointer flex items-center justify-between"
              >
                <span className="truncate max-w-[280px]">"{h.prompt}"</span>
                <span className="text-[10px] text-orange-400 shrink-0 font-bold">View &rarr;</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
