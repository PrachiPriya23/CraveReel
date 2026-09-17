import React, { useState } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  Flame,
  Clock,
  Coins,
  ArrowRight,
  Plus,
  Check,
  Tag,
  Star,
  Layers,
  ChefHat
} from 'lucide-react';
import { FoodItem, UserPreferences, PlatformName } from '../types';
import { MOOD_OPTIONS, CRAVING_OPTIONS, BUDGET_TIERS, PREP_TIME_OPTIONS } from '../data/foodItems';

interface SmartCraveEngineProps {
  foodItems: FoodItem[];
  preferences: UserPreferences;
  onUpdatePreferences: (pref: UserPreferences) => void;
  onAddToCart: (item: FoodItem, platform: PlatformName) => void;
  onOpenPlatformCompare: (item: FoodItem) => void;
  onOpenRestaurantCompare: (item: FoodItem) => void;
  onAskAIAboutDish: (item: FoodItem) => void;
}

export const SmartCraveEngine: React.FC<SmartCraveEngineProps> = ({
  foodItems,
  preferences,
  onUpdatePreferences,
  onAddToCart,
  onOpenPlatformCompare,
  onOpenRestaurantCompare,
  onAskAIAboutDish,
}) => {
  const [selectedMood, setSelectedMood] = useState(preferences.mood);
  const [selectedCraving, setSelectedCraving] = useState(preferences.craving);
  const [selectedBudget, setSelectedBudget] = useState(preferences.budget);
  const [maxPrepTime, setMaxPrepTime] = useState(preferences.maxPrepTime);
  const [addedItemAnimation, setAddedItemAnimation] = useState<string | null>(null);

  // Apply preference updates
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    onUpdatePreferences({ ...preferences, mood });
  };

  const handleCravingSelect = (craving: string) => {
    setSelectedCraving(craving);
    onUpdatePreferences({ ...preferences, craving });
  };

  const handleBudgetSelect = (budget: string) => {
    setSelectedBudget(budget);
    onUpdatePreferences({ ...preferences, budget });
  };

  const handlePrepTimeSelect = (time: number) => {
    setMaxPrepTime(time);
    onUpdatePreferences({ ...preferences, maxPrepTime: time });
  };

  // Rule-based Recommendation Scoring Algorithm
  const scoredItems = foodItems
    .map((item) => {
      let score = 50; // base score
      let matchReasons: string[] = [];

      // Mood match (+25)
      if (item.moods.includes(selectedMood)) {
        score += 25;
        matchReasons.push(`Matches your ${selectedMood} mood`);
      }

      // Craving match (+25)
      if (item.cravings.some((c) => c.toLowerCase().includes(selectedCraving.toLowerCase()))) {
        score += 25;
        matchReasons.push(`Hits the ${selectedCraving} spot`);
      }

      // Budget tier match (+20)
      if (item.budgetTier === selectedBudget) {
        score += 20;
        matchReasons.push(`Fits your ${selectedBudget} budget`);
      } else if (
        (selectedBudget === 'mid' && item.budgetTier === 'budget') ||
        (selectedBudget === 'premium' && item.budgetTier === 'mid')
      ) {
        score += 10;
      }

      // Prep Time match (+15)
      if (item.prepTimeMins <= maxPrepTime) {
        score += 15;
        matchReasons.push(`Fast delivery in ${item.prepTimeMins}m`);
      }

      // Veg / Non-Veg filter constraint
      if (preferences.dietaryFilter === 'veg' && !item.isVeg) {
        score = 0;
      } else if (preferences.dietaryFilter === 'non-veg' && item.isVeg) {
        score = 0;
      } else if (preferences.vegOnly && !item.isVeg) {
        score = 0;
      }

      // Normalization
      const matchPercentage = Math.min(Math.round((score / 135) * 100), 99);

      return {
        item,
        score,
        matchPercentage,
        matchReasons,
      };
    })
    .filter((res) => res.score > 0)
    .sort((a, b) => b.score - a.score);

  const handleAdd = (item: FoodItem) => {
    const bestDeal = item.platforms.find((p) => p.isBestDeal) || item.platforms[0];
    onAddToCart(item, bestDeal ? bestDeal.platformName : 'Swiggy');
    setAddedItemAnimation(item.id);
    setTimeout(() => setAddedItemAnimation(null), 1800);
  };

  return (
    <div
      id="smart-crave-engine-view"
      className="flex-1 w-full h-full bg-black overflow-y-auto p-4 space-y-4 text-neutral-100 pb-20 select-none"
    >
      {/* Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-red-950/80 via-black to-neutral-900 border border-orange-500/40 relative overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.2)]">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base font-black font-brand tracking-tight bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              Personalized Craving Matcher
            </h2>
          </div>
          <p className="text-xs text-neutral-300 mt-1">
            Rule-based intelligence matching your exact mood, craving, budget & time with best multi-platform deals!
          </p>
        </div>
      </div>

      {/* Interactive Mood Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>1. How are you feeling right now? (Mood)</span>
          <span className="text-orange-400 text-[11px] font-semibold">{selectedMood}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MOOD_OPTIONS.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMoodSelect(m.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-orange-500/20 border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.2)] ring-1 ring-orange-500/40'
                    : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${isSelected ? 'text-orange-300' : 'text-slate-200'}`}>
                    {m.id}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">{m.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Craving Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>2. What is your tongue craving?</span>
          <span className="text-amber-400 text-[11px] font-semibold">{selectedCraving}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CRAVING_OPTIONS.map((c) => {
            const isSelected = selectedCraving === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleCravingSelect(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black scale-105'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget & Prep Time Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Budget Tier */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">3. Target Budget</label>
          <div className="grid grid-cols-3 gap-1.5">
            {BUDGET_TIERS.map((b) => {
              const isSelected = selectedBudget === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => handleBudgetSelect(b.id)}
                  className={`p-2 rounded-xl text-center border text-[11px] font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div>{b.emoji} {b.label}</div>
                  <div className="text-[9px] text-slate-400 font-normal mt-0.5">{b.priceRange}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Max Delivery Time */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">4. Available Time</label>
          <div className="grid grid-cols-3 gap-1.5">
            {PREP_TIME_OPTIONS.map((t) => {
              const isSelected = maxPrepTime === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => handlePrepTimeSelect(t.value)}
                  className={`p-2 rounded-xl text-center border text-[11px] font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500/20 border-orange-500/60 text-orange-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 mx-auto mb-0.5 text-orange-400" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommendation Results List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm text-slate-100">Recommended For You</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              {scoredItems.length} Matched Dishes
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {scoredItems.map(({ item, matchPercentage, matchReasons }) => {
            const bestDeal = item.platforms.find((p) => p.isBestDeal) || item.platforms[0];

            return (
              <div
                key={item.id}
                id={`crave-match-card-${item.id}`}
                className="p-3.5 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition shadow-lg space-y-3"
              >
                {/* Top Info */}
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 relative border border-slate-700">
                    <img
                      src={item.posterUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-slate-950/80 backdrop-blur-md text-[9px] font-black text-emerald-400 border border-emerald-500/40">
                      {matchPercentage}% MATCH
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black font-brand text-sm bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-slate-300 font-medium">{item.restaurant}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {item.dishRating}
                      </span>
                    </div>

                    {/* Match Reasons */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {matchReasons.slice(0, 2).map((reason, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-300 text-[9px] font-medium border border-orange-500/20"
                        >
                          ✓ {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Best Platform Deal Pill */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shrink-0"
                      style={{ backgroundColor: bestDeal.platformColor }}
                    >
                      {bestDeal.platformName.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-slate-200 truncate">
                        Best Deal on <strong className="text-orange-400">{bestDeal.platformName}</strong>
                      </div>
                      <div className="text-[10px] text-amber-300 font-mono">
                        Code: {bestDeal.promoCode} ({bestDeal.discountText})
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-emerald-400">₹{bestDeal.offerPrice}</div>
                    <div className="text-[9px] text-slate-500 line-through">₹{item.originalPrice}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenRestaurantCompare(item)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1 cursor-pointer"
                      title="Compare Restaurant Ratings"
                    >
                      <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                      <span>Best Spot</span>
                    </button>

                    <button
                      onClick={() => onOpenPlatformCompare(item)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-orange-400" />
                      <span>Compare Apps</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleAdd(item)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-1 ${
                      addedItemAnimation === item.id
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white shadow-orange-500/20'
                    }`}
                  >
                    {addedItemAnimation === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add ₹{bestDeal.offerPrice}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
