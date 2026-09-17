import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  Flame,
  Tag,
  Plus,
  Check,
  ChefHat,
  Sparkles,
  MapPin
} from 'lucide-react';
import { FoodItem, PlatformName, DietaryFilter } from '../types';

interface SearchExploreViewProps {
  foodItems: FoodItem[];
  dietaryFilter?: DietaryFilter;
  onSelectDietaryFilter?: (filter: DietaryFilter) => void;
  onAddToCart: (item: FoodItem, platform: PlatformName) => void;
  onOpenPlatformCompare: (item: FoodItem) => void;
  onOpenRestaurantCompare: (item: FoodItem) => void;
  onAskAIAboutDish: (item: FoodItem) => void;
}

const CUISINE_TAGS = [
  'All',
  'Biryani',
  'Burger',
  'Pizza',
  'North Indian',
  'South Indian',
  'Chinese',
  'Street Food',
  'Dessert',
  'Mexican',
];

export const SearchExploreView: React.FC<SearchExploreViewProps> = ({
  foodItems,
  dietaryFilter = 'all',
  onSelectDietaryFilter,
  onAddToCart,
  onOpenPlatformCompare,
  onOpenRestaurantCompare,
  onAskAIAboutDish,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'prep_time' | 'deals'>('deals');
  const [addedItemAnimation, setAddedItemAnimation] = useState<string | null>(null);

  const filteredItems = foodItems
    .filter((item) => {
      // Search query filter
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.restaurant.toLowerCase().includes(q) ||
        item.cuisine.toLowerCase().includes(q) ||
        item.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q);

      // Category filter
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.dishRating - a.dishRating;
      if (sortBy === 'price_low') {
        const aBest = Math.min(...a.platforms.map((p) => p.offerPrice));
        const bBest = Math.min(...b.platforms.map((p) => p.offerPrice));
        return aBest - bBest;
      }
      if (sortBy === 'prep_time') return a.prepTimeMins - b.prepTimeMins;
      if (sortBy === 'deals') {
        const aDiscount = a.originalPrice - Math.min(...a.platforms.map((p) => p.offerPrice));
        const bDiscount = b.originalPrice - Math.min(...b.platforms.map((p) => p.offerPrice));
        return bDiscount - aDiscount;
      }
      return 0;
    });

  const handleAdd = (item: FoodItem) => {
    const bestDeal = item.platforms.find((p) => p.isBestDeal) || item.platforms[0];
    onAddToCart(item, bestDeal.platformName);
    setAddedItemAnimation(item.id);
    setTimeout(() => setAddedItemAnimation(null), 1800);
  };

  return (
    <div
      id="search-explore-view"
      className="flex-1 w-full h-full bg-black overflow-y-auto p-4 space-y-4 text-neutral-100 pb-20"
    >
      {/* Search Input Bar & Quick Dietary Selector */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-orange-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-food-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes, restaurants, cravings, biryani, burgers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-900/90 border border-red-950/60 focus:border-orange-500 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none shadow-inner ring-1 focus:ring-orange-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-orange-400 hover:text-orange-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dietary Filter Bar with Pure Symbols */}
        {onSelectDietaryFilter && (
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[11px] font-semibold text-neutral-400">Dietary:</span>
            <div className="flex items-center bg-neutral-950/90 border border-neutral-800/90 p-1 rounded-2xl shadow-inner gap-1">
              <button
                onClick={() => onSelectDietaryFilter('all')}
                className={`px-3 py-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition cursor-pointer select-none ${
                  dietaryFilter === 'all'
                    ? 'bg-neutral-800 border border-neutral-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                }`}
              >
                ALL
              </button>
              {/* Veg Symbol Button */}
              <button
                onClick={() => onSelectDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
                className={`p-1.5 rounded-xl border transition cursor-pointer select-none flex items-center justify-center ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)] ring-1 ring-emerald-400/50 scale-105'
                    : 'text-neutral-400 hover:text-emerald-400 border-transparent bg-neutral-900/60 opacity-75 hover:opacity-100'
                }`}
                title={dietaryFilter === 'veg' ? 'Showing Vegetarian only (Click to show all)' : 'Filter Vegetarian only'}
                aria-label="Filter Vegetarian only"
              >
                <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-emerald-500 flex items-center justify-center p-[2px] bg-black/80">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                </div>
              </button>
              {/* Non-Veg Symbol Button */}
              <button
                onClick={() => onSelectDietaryFilter(dietaryFilter === 'non-veg' ? 'all' : 'non-veg')}
                className={`p-1.5 rounded-xl border transition cursor-pointer select-none flex items-center justify-center ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-red-950/90 border-red-400 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.5)] ring-1 ring-red-400/50 scale-105'
                    : 'text-neutral-400 hover:text-red-400 border-transparent bg-neutral-900/60 opacity-75 hover:opacity-100'
                }`}
                title={dietaryFilter === 'non-veg' ? 'Showing Non-Vegetarian only (Click to show all)' : 'Filter Non-Vegetarian only'}
                aria-label="Filter Non-Vegetarian only"
              >
                <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-red-500 flex items-center justify-center p-[2px] bg-black/80">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]" />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cuisine Categories Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
        {CUISINE_TAGS.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 border-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-red-950'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sort By Filter Pills */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span className="font-semibold text-neutral-300">Sort dishes by:</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSortBy('deals')}
            className={`px-2 py-0.8 rounded-lg text-[10px] font-bold transition ${
              sortBy === 'deals' ? 'bg-gradient-to-r from-red-950/80 to-orange-950/80 text-orange-300 border border-orange-500/50 shadow-sm' : 'text-neutral-400'
            }`}
          >
            Max Savings
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`px-2 py-0.8 rounded-lg text-[10px] font-bold transition ${
              sortBy === 'rating' ? 'bg-gradient-to-r from-red-950/80 to-orange-950/80 text-orange-300 border border-orange-500/50 shadow-sm' : 'text-neutral-400'
            }`}
          >
            Rating 4.8★+
          </button>
          <button
            onClick={() => setSortBy('price_low')}
            className={`px-2 py-0.8 rounded-lg text-[10px] font-bold transition ${
              sortBy === 'price_low' ? 'bg-gradient-to-r from-red-950/80 to-orange-950/80 text-orange-300 border border-orange-500/50 shadow-sm' : 'text-neutral-400'
            }`}
          >
            Price: Low
          </button>
          <button
            onClick={() => setSortBy('prep_time')}
            className={`px-2 py-0.8 rounded-lg text-[10px] font-bold transition ${
              sortBy === 'prep_time' ? 'bg-gradient-to-r from-red-950/80 to-orange-950/80 text-orange-300 border border-orange-500/50 shadow-sm' : 'text-neutral-400'
            }`}
          >
            Fastest ETA
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-[11px] text-neutral-400">
        Showing <strong className="text-orange-400">{filteredItems.length}</strong> delicious options
      </div>

      {/* Dishes Grid */}
      <div className="space-y-3">
        {filteredItems.map((dish) => {
          const bestDeal = dish.platforms.find((p) => p.isBestDeal) || dish.platforms[0];

          return (
            <div
              key={dish.id}
              id={`search-food-card-${dish.id}`}
              className="p-3.5 rounded-3xl bg-neutral-900/90 border border-red-950/60 hover:border-orange-500/50 transition shadow-[0_4px_20px_rgba(0,0,0,0.7)] space-y-3"
            >
              {/* Main row */}
              <div className="flex items-start gap-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-neutral-700 relative">
                  <img
                    src={dish.posterUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black ${
                      dish.isVeg ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/50' : 'bg-red-950/90 text-red-400 border border-red-500/50'
                    }`}
                  >
                    {dish.isVeg ? 'VEG' : 'NON-VEG'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-black text-xs sm:text-sm bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      {dish.name}
                    </h3>
                    <button
                      onClick={() => onAskAIAboutDish(dish)}
                      className="text-[10px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-0.5 shrink-0"
                    >
                      <Sparkles className="w-3 h-3 text-orange-400" />
                      AI Compare
                    </button>
                  </div>

                  <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                    {dish.restaurant} • {dish.cuisine}
                  </p>

                  <div className="flex items-center gap-2.5 text-[10px] text-neutral-400 mt-1">
                    <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {dish.dishRating}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-400" />
                      {dish.prepTimeMins}m
                    </span>
                    <span>•</span>
                    <span>{dish.calories} kcal</span>
                  </div>
                </div>
              </div>

              {/* Multi-platform quick summary */}
              <div className="p-2 rounded-xl bg-black/80 border border-neutral-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                    style={{ backgroundColor: bestDeal.platformColor }}
                  >
                    {bestDeal.platformName.slice(0, 2)}
                  </span>
                  <div className="text-[11px] text-neutral-300 truncate">
                    Cheapest on <strong className="text-orange-400">{bestDeal.platformName}</strong>: <code className="text-amber-300 font-mono text-[10px]">{bestDeal.promoCode}</code>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-emerald-400">₹{bestDeal.offerPrice}</span>
                  <span className="text-[9px] text-neutral-500 line-through ml-1">₹{dish.originalPrice}</span>
                </div>
              </div>

              {/* Bottom buttons */}
              <div className="flex items-center justify-between pt-1 gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenRestaurantCompare(dish)}
                    className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-medium border border-neutral-700 flex items-center gap-1 cursor-pointer"
                  >
                    <ChefHat className="w-3 h-3 text-amber-400" />
                    <span>Best Spot</span>
                  </button>
                  <button
                    onClick={() => onOpenPlatformCompare(dish)}
                    className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-medium border border-neutral-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Tag className="w-3 h-3 text-orange-400" />
                    <span>Compare 5 Apps</span>
                  </button>
                </div>

                <button
                  onClick={() => handleAdd(dish)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1 ${
                    addedItemAnimation === dish.id
                      ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
                      : 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                  }`}
                >
                  {addedItemAnimation === dish.id ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
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
  );
};
