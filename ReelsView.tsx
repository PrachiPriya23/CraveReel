import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Heart,
  Bookmark,
  Share2,
  Tag,
  Star,
  Clock,
  Flame,
  Plus,
  Check,
  ChefHat,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Layers,
  ArrowRight,
  Play,
  Pause,
  Filter,
  Grid,
  Info,
  X,
  Dumbbell,
  Utensils
} from 'lucide-react';
import { FoodItem, PlatformName, DietaryFilter } from '../types';

interface ReelsViewProps {
  foodItems: FoodItem[];
  likedIds: string[];
  onToggleLike: (id: string) => void;
  onAddToCart: (item: FoodItem, platform: PlatformName) => void;
  onOpenPlatformCompare: (item: FoodItem) => void;
  onOpenRestaurantCompare: (item: FoodItem) => void;
  onAskAIAboutDish: (item: FoodItem) => void;
  dietaryFilter?: DietaryFilter;
  onSelectDietaryFilter?: (filter: DietaryFilter) => void;
  isVegOnly?: boolean;
  onToggleVegOnly?: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Reels', emoji: '✨' },
  { id: 'trending', label: 'Trending', emoji: '🔥' },
  { id: 'Biryani', label: 'Biryani', emoji: '🍚' },
  { id: 'Burger', label: 'Burgers', emoji: '🍔' },
  { id: 'Pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'North Indian', label: 'North Indian', emoji: '🍛' },
  { id: 'Chinese', label: 'Asian & Momos', emoji: '🥟' },
  { id: 'South Indian', label: 'South Indian', emoji: '🥞' },
  { id: 'Street Food', label: 'Street Food', emoji: '🌮' },
  { id: 'Dessert', label: 'Desserts', emoji: '🍫' },
];

export const ReelsView: React.FC<ReelsViewProps> = ({
  foodItems,
  likedIds,
  onToggleLike,
  onAddToCart,
  onOpenPlatformCompare,
  onOpenRestaurantCompare,
  onAskAIAboutDish,
  dietaryFilter = 'all',
  onSelectDietaryFilter,
  isVegOnly,
  onToggleVegOnly,
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [addedItemAnimation, setAddedItemAnimation] = useState<string | null>(null);
  const [showDoubleTapFeedback, setShowDoubleTapFeedback] = useState<string | null>(null);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<FoodItem | null>(null);

  // Filter items based on active category
  const filteredItems = React.useMemo(() => {
    if (activeCategory === 'all') return foodItems;
    if (activeCategory === 'trending') return foodItems.filter((i) => i.isTrending);
    return foodItems.filter((i) => i.category === activeCategory);
  }, [foodItems, activeCategory]);

  const containerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Keep index within bounds if filtered items change
  useEffect(() => {
    if (activeIndex >= filteredItems.length) {
      setActiveIndex(0);
      if (reelRefs.current[0]) {
        reelRefs.current[0].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [filteredItems.length, activeIndex]);

  // Scroll to active index
  const scrollToIndex = useCallback((index: number) => {
    if (index >= 0 && index < filteredItems.length && reelRefs.current[index]) {
      reelRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
      setActiveIndex(index);
    }
  }, [filteredItems.length]);

  const handleNext = () => {
    if (activeIndex < filteredItems.length - 1) {
      scrollToIndex(activeIndex + 1);
    } else {
      scrollToIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'm') {
        setIsMuted((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, filteredItems.length]);

  // Track active reel on scroll snap using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-reel-index'));
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.65,
      }
    );

    reelRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [filteredItems]);

  const handleQuickAdd = (item: FoodItem) => {
    const bestDeal = item.platforms.find((p) => p.isBestDeal) || item.platforms[0];
    const chosenPlatform = bestDeal ? bestDeal.platformName : 'Swiggy';
    onAddToCart(item, chosenPlatform);
    setAddedItemAnimation(item.id);
    setTimeout(() => setAddedItemAnimation(null), 1800);
  };

  const triggerDoubleTapAction = (item: FoodItem) => {
    handleQuickAdd(item);
    onOpenPlatformCompare(item);
    setShowDoubleTapFeedback(item.id);
    setTimeout(() => setShowDoubleTapFeedback(null), 1400);
  };

  if (filteredItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <Filter className="w-10 h-10 text-orange-400/60 mb-2 animate-bounce" />
        <p className="text-sm font-semibold text-slate-200">
          No {dietaryFilter === 'veg' ? 'Vegetarian' : dietaryFilter === 'non-veg' ? 'Non-Vegetarian' : ''} reels found in this category
        </p>
        <p className="text-xs text-slate-400 mt-1">Try resetting the category or switching dietary filters to view more dishes.</p>
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => {
              setActiveCategory('all');
              setIsCategoryDrawerOpen(false);
            }}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold text-xs shadow-lg active:scale-95 transition cursor-pointer hover:border-orange-500"
          >
            All Categories
          </button>
          {dietaryFilter !== 'all' && onSelectDietaryFilter && (
            <button
              onClick={() => onSelectDietaryFilter('all')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs shadow-lg active:scale-95 transition cursor-pointer"
            >
              Show Veg &amp; Non-Veg
            </button>
          )}
        </div>
      </div>
    );
  }

  const activeCategoryObj = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="relative flex-1 w-full h-full bg-black overflow-hidden flex flex-col">
      {/* Top Header Overlay: Minimalist CraveReel Brand + Discreet Category Filter */}
      <div className="absolute top-3 left-0 right-0 z-30 px-4 pointer-events-none flex items-center justify-between">
        {/* Clean CraveReels Logo Brand Text */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <span className="text-lg font-bold font-cravereel tracking-tight bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            CraveReels
          </span>
        </div>

        {/* Unified Veg / Non-Veg Pure Symbol Buttons on Top-Right */}
        <div className="flex items-center pointer-events-auto">
          {onSelectDietaryFilter && (
            <div className="flex items-center bg-black/85 backdrop-blur-md p-1 rounded-2xl border border-red-950/60 shadow-[0_4px_20px_rgba(0,0,0,0.8)] gap-1">
              {/* Veg Filter Symbol Button */}
              <button
                id="veg-filter-btn"
                onClick={() => onSelectDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
                className={`p-1.5 rounded-xl border transition-all active:scale-90 cursor-pointer flex items-center justify-center ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] ring-1 ring-emerald-400/50 scale-105'
                    : 'border-transparent bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-emerald-500/40 opacity-75 hover:opacity-100'
                }`}
                title={dietaryFilter === 'veg' ? 'Showing Vegetarian only (Click to show all)' : 'Filter Vegetarian only'}
                aria-label="Filter Vegetarian only"
              >
                <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-emerald-500 flex items-center justify-center p-[2px] bg-black/80">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                </div>
              </button>

              {/* Non-Veg Filter Symbol Button */}
              <button
                id="non-veg-filter-btn"
                onClick={() => onSelectDietaryFilter(dietaryFilter === 'non-veg' ? 'all' : 'non-veg')}
                className={`p-1.5 rounded-xl border transition-all active:scale-90 cursor-pointer flex items-center justify-center ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-red-950/90 border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)] ring-1 ring-red-400/50 scale-105'
                    : 'border-transparent bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-red-500/40 opacity-75 hover:opacity-100'
                }`}
                title={dietaryFilter === 'non-veg' ? 'Showing Non-Vegetarian only (Click to show all)' : 'Filter Non-Vegetarian only'}
                aria-label="Filter Non-Vegetarian only"
              >
                <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-red-500 flex items-center justify-center p-[2px] bg-black/80">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Snap Vertical Scroll Feed */}
      <div
        ref={containerRef}
        id="reels-snap-feed"
        className="flex-1 w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none relative bg-black"
      >
        {filteredItems.map((item, index) => {
          const isCurrent = index === activeIndex;
          const isAdjacent = Math.abs(index - activeIndex) <= 1;
          return (
            <div
              key={item.id}
              ref={(el) => (reelRefs.current[index] = el)}
              data-reel-index={index}
              className="w-full h-full snap-start snap-always relative shrink-0 flex flex-col justify-between overflow-hidden bg-black select-none"
            >
              <ReelItemCard
                item={item}
                index={index}
                totalCount={filteredItems.length}
                isActive={isCurrent}
                shouldPreload={isAdjacent}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
                onOpenPlatformCompare={() => onOpenPlatformCompare(item)}
                onAskAIAboutDish={() => onAskAIAboutDish(item)}
                onOpenFullDescription={() => setSelectedDetailItem(item)}
                onDoubleTap={() => triggerDoubleTapAction(item)}
                showDoubleTapFeedback={showDoubleTapFeedback === item.id}
              />
            </div>
          );
        })}
      </div>

      {/* Category Selection Drawer / Modal */}
      {isCategoryDrawerOpen && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-4 animate-in fade-in duration-200 border-t border-red-900/40">
          <div className="flex items-center justify-between pb-3 border-b border-red-950/60">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-orange-400" />
                <span>Explore Food Categories</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">Filter short-form food reels by craving or cuisine</p>
            </div>
            <button
              onClick={() => setIsCategoryDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 flex items-center justify-center transition cursor-pointer border border-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-orange-400 mb-2.5">
              Select Category
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.id;
                const count = cat.id === 'all'
                  ? foodItems.length
                  : cat.id === 'trending'
                  ? foodItems.filter((i) => i.isTrending).length
                  : foodItems.filter((i) => i.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      scrollToIndex(0);
                      setIsCategoryDrawerOpen(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-950/80 via-orange-950/60 to-neutral-900 border-orange-500 ring-1 ring-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                        : 'bg-neutral-900/90 border-neutral-800 hover:border-red-900 hover:bg-neutral-850'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{cat.emoji}</span>
                      <div>
                        <span className={`text-xs font-bold block ${isSelected ? 'text-orange-400' : 'text-neutral-200'}`}>
                          {cat.label}
                        </span>
                        <span className="text-[10px] text-neutral-400">{count} Reels</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_8px_#f97316]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-2 border-t border-neutral-800/80 scrollbar-thin">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Quick Jump to Dish
              </span>
              <span className="text-[11px] text-orange-400 font-bold">{filteredItems.length} Available</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    scrollToIndex(idx);
                    setIsCategoryDrawerOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                    idx === activeIndex
                      ? 'border-orange-500 bg-orange-950/40 shadow-sm'
                      : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/70'
                  }`}
                >
                  <img
                    src={item.posterUrl || item.mediaUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] font-black bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent block truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-black">
                      ₹{item.platforms.find((p) => p.isBestDeal)?.offerPrice || item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dish Detailed Description & Nutrition Modal */}
      {selectedDetailItem && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-4 animate-in fade-in duration-200 border-t border-red-900/50">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span
                className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                  selectedDetailItem.isVeg
                    ? 'border-emerald-500 bg-emerald-950/50'
                    : 'border-red-500 bg-red-950/50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${selectedDetailItem.isVeg ? 'bg-emerald-400' : 'bg-red-400'}`} />
              </span>
              <h3 className="text-base font-black bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent truncate max-w-[240px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {selectedDetailItem.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedDetailItem(null)}
              className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 flex items-center justify-center transition cursor-pointer border border-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-center">
                <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-sm font-black text-white block">{selectedDetailItem.prepTimeMins} mins</span>
                <span className="text-[10px] text-neutral-400">Prep & Cook Time</span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-center">
                <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-sm font-black text-white block">{selectedDetailItem.calories} kcal</span>
                <span className="text-[10px] text-neutral-400">Energy & Calories</span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-center">
                <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <span className="text-sm font-black text-white block">{selectedDetailItem.proteinGrams}g</span>
                <span className="text-[10px] text-neutral-400">Pure Protein</span>
              </div>
            </div>

            {/* Description Paragraph with Category & Cuisine Badges */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  About this Dish
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-red-950/80 to-orange-950/80 text-orange-300 border border-orange-500/40 text-[10px] font-bold">
                    {selectedDetailItem.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 text-[10px] font-semibold">
                    {selectedDetailItem.cuisine}
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {selectedDetailItem.description}
              </p>
            </div>

            {/* Chef Specialty & Restaurant */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5" />
                  Chef's Signature Secret
                </span>
                <span className="text-xs text-neutral-300 font-semibold">{selectedDetailItem.restaurant}</span>
              </div>
              <p className="text-xs text-neutral-300 italic">
                &ldquo;{selectedDetailItem.chefSpecialty}&rdquo;
              </p>
            </div>

            {/* Ingredients */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Key Ingredients
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedDetailItem.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Platform Price List */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                Live App Pricing Comparison
              </h4>
              <div className="space-y-1.5">
                {selectedDetailItem.platforms.map((plat) => (
                  <div
                    key={plat.platformName}
                    className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-neutral-800 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: plat.platformColor }}
                      />
                      <span className="font-bold text-white">{plat.platformName}</span>
                      {plat.isBestDeal && (
                        <span className="px-1.5 py-0.2 rounded bg-gradient-to-r from-red-600 to-orange-500 text-white text-[9px] font-black">
                          BEST DEAL
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 line-through text-[11px]">₹{plat.originalPrice}</span>
                      <span className="font-black text-emerald-400 text-xs">₹{plat.offerPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center gap-2">
            <button
              onClick={() => {
                handleQuickAdd(selectedDetailItem);
                setSelectedDetailItem(null);
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-black text-xs shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart at <strong className="text-emerald-300 font-black">₹{selectedDetailItem.platforms.find((p) => p.isBestDeal)?.offerPrice || selectedDetailItem.price}</strong></span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* Individual Reel Card Component with Video Player, Double Tap, Overlays */
interface ReelItemCardProps {
  item: FoodItem;
  index: number;
  totalCount: number;
  isActive: boolean;
  shouldPreload: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenPlatformCompare: () => void;
  onAskAIAboutDish: () => void;
  onOpenFullDescription: () => void;
  onDoubleTap: () => void;
  showDoubleTapFeedback: boolean;
}

const ReelItemCard: React.FC<ReelItemCardProps> = ({
  item,
  index,
  totalCount,
  isActive,
  shouldPreload,
  isMuted,
  onToggleMute,
  onOpenPlatformCompare,
  onAskAIAboutDish,
  onOpenFullDescription,
  onDoubleTap,
  showDoubleTapFeedback,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoSourceIndex, setVideoSourceIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [showPlayIcon, setShowPlayIcon] = useState(false);

  const videoSources = [
    item.videoUrl,
    item.fallbackVideoUrl,
    item.mediaUrl
  ].filter(Boolean) as string[];

  const currentVideoSrc = videoSources[videoSourceIndex] || item.videoUrl || item.mediaUrl;

  const bestDeal = item.platforms.find((p) => p.isBestDeal) || item.platforms[0];

  // Control video playback based on active state and mute settings
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.playsInline = true;

    if (isActive) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setVideoError(false);
          })
          .catch((err) => {
            console.log('Autoplay muted fallback attempt:', err);
            video.muted = true;
            video.play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, isMuted, videoSourceIndex]);

  // Video error handler with automatic fallback to secondary video stream
  const handleVideoError = () => {
    if (videoSourceIndex + 1 < videoSources.length) {
      console.log(`Video error on source ${videoSourceIndex}, trying fallback ${videoSourceIndex + 1}`);
      setVideoSourceIndex(prev => prev + 1);
    } else {
      console.log('All video sources failed, displaying high-res poster');
      setVideoError(true);
    }
  };

  // Video progress updater
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      setProgress((current / total) * 100);
    }
  };

  // Tap video to play/pause, or double tap to directly add to cart & compare
  const handleVideoTap = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      onDoubleTap();
      setLastTap(0);
    } else {
      setLastTap(now);
      // Single tap toggle play / pause
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
        setShowPlayIcon(true);
        setTimeout(() => setShowPlayIcon(false), 600);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-black">
      {/* Background Video Layer */}
      <div
        className="absolute inset-0 z-0 overflow-hidden bg-black cursor-pointer"
        onClick={handleVideoTap}
      >
        {!videoError ? (
          <video
            ref={videoRef}
            key={currentVideoSrc}
            src={currentVideoSrc}
            poster={item.posterUrl}
            autoPlay={isActive}
            loop
            muted={isMuted}
            playsInline
            preload={shouldPreload ? 'auto' : 'metadata'}
            onTimeUpdate={handleTimeUpdate}
            onError={handleVideoError}
            onLoadedData={() => setVideoError(false)}
            className="w-full h-full object-cover brightness-95 transform scale-[1.02] transition-transform duration-700"
          />
        ) : (
          <div className="relative w-full h-full overflow-hidden bg-black">
            <img
              src={item.posterUrl || item.mediaUrl}
              alt={item.name}
              className="w-full h-full object-cover brightness-95 animate-pulse"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Ambient Dark Obsidian Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />

        {/* Play / Pause Animated Overlay Indicator */}
        {showPlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 fade-out duration-500">
            <div className="w-16 h-16 rounded-full bg-black/85 backdrop-blur-md border border-orange-500/50 text-orange-400 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.6)]">
              {isPlaying ? <Play className="w-8 h-8 fill-orange-400 ml-1" /> : <Pause className="w-8 h-8 fill-orange-400" />}
            </div>
          </div>
        )}

        {/* Double Tap: Added to Cart & Compare Animation with Red-Orange glow */}
        {showDoubleTapFeedback && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-75 fade-in duration-200">
            <div className="px-6 py-4 rounded-2xl bg-black/95 border border-red-500/80 shadow-[0_0_60px_rgba(239,68,68,0.7)] backdrop-blur-xl flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 text-white flex items-center justify-center shadow-lg animate-bounce">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <span className="text-base font-black text-white tracking-wide">
                Added to Cart!
              </span>
              <span className="text-xs font-bold text-orange-300">
                Comparing All 5 Delivery Apps ⚡
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Food Detail Overlay: Pinned flush to the absolute bottom */}
      <div
        id={`reel-bottom-card-${item.id}`}
        onClick={onOpenFullDescription}
        className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-2 pt-14 bg-gradient-to-t from-black via-black/90 to-transparent text-neutral-100 cursor-pointer pointer-events-auto group"
      >
        <div className="flex items-start justify-between gap-3">
          {/* Dish & Restaurant Title */}
          <div className="flex-1 min-w-0 pr-1">
            <h2 className="text-base sm:text-lg font-black bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent tracking-normal leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              {item.name}
            </h2>
            <p className="text-sm sm:text-base font-medium text-neutral-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] mt-0.5">
              {item.restaurant}
            </p>

            {/* Line 2: Best Deal on [Platform]: ₹[Price] (Save ₹[Diff]) */}
            <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-neutral-300 drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)]">
              <span>
                Best Deal on {bestDeal ? bestDeal.platformName : 'Crave'}:{' '}
                <strong className="text-emerald-400 font-black text-sm sm:text-base">
                  ₹{bestDeal ? bestDeal.offerPrice : item.price}
                </strong>
              </span>
              {bestDeal && item.originalPrice > bestDeal.offerPrice && (
                <span className="text-[11px] font-bold text-red-400 bg-red-950/60 border border-red-800/60 px-1.5 py-0.2 rounded">
                  Save ₹{item.originalPrice - bestDeal.offerPrice}
                </span>
              )}
            </div>
          </div>

          {/* Right Floating Mute Action Button */}
          <div className="flex items-center shrink-0 pt-0.5">
            {/* Audio Mute/Unmute */}
            <button
              id={`reel-mute-btn-${item.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute();
              }}
              className="w-8 h-8 rounded-full bg-black/80 hover:bg-neutral-900 border border-red-900/50 text-white/90 flex items-center justify-center backdrop-blur-md shadow-lg transition active:scale-90 cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-400" /> : <Volume2 className="w-3.5 h-3.5 text-orange-400" />}
            </button>
          </div>
        </div>

        {/* Video Duration Progress Bar (Flush at bottom edge with Red to Orange gradient) */}
        <div className="w-full h-0.5 bg-neutral-800 rounded-full mt-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 transition-all duration-150 shadow-[0_0_8px_#f97316]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
