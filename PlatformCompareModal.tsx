import React from 'react';
import { X, CheckCircle2, Zap, Tag, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { FoodItem, PlatformDeal, PlatformName } from '../types';

interface PlatformCompareModalProps {
  foodItem: FoodItem;
  onClose: () => void;
  onSelectPlatformAndOrder: (item: FoodItem, platform: PlatformName) => void;
}

export const PlatformCompareModal: React.FC<PlatformCompareModalProps> = ({
  foodItem,
  onClose,
  onSelectPlatformAndOrder,
}) => {
  const bestDeal = foodItem.platforms.find((p) => p.isBestDeal) || foodItem.platforms[0];

  return (
    <div
      id="platform-compare-modal-overlay"
      className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="platform-compare-modal-content"
        className="w-full sm:max-w-lg bg-neutral-900 border border-red-950/70 rounded-t-[32px] sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] max-h-[88vh] flex flex-col overflow-hidden text-neutral-100 animate-in slide-in-from-bottom duration-250"
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-black/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-neutral-700">
              <img
                src={foodItem.posterUrl}
                alt={foodItem.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  {foodItem.name}
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gradient-to-r from-red-950 to-orange-950 text-orange-400 font-bold border border-orange-500/40">
                  Deal Radar
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Comparing 5 delivery apps • Best price: <span className="text-emerald-400 font-black">₹{bestDeal.offerPrice}</span>
              </p>
            </div>
          </div>
          <button
            id="close-platform-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-200 transition cursor-pointer border border-neutral-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Deals List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {/* Best Deal Highlight Banner */}
          <div
            id="best-deal-highlight-banner"
            className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/80 via-orange-950/80 to-black border border-orange-500/50 flex items-center justify-between shadow-[0_0_20px_rgba(249,115,22,0.2)]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                👑
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-orange-300">CraveBite Verified Best Deal</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-600/30 text-red-300 border border-red-500/40">
                    Save ₹{foodItem.originalPrice - bestDeal.offerPrice}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300">
                  Order via <strong className="text-white">{bestDeal.platformName}</strong> with coupon <code className="text-amber-300 font-mono bg-black/80 px-1 rounded border border-neutral-800">{bestDeal.promoCode}</code>
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectPlatformAndOrder(foodItem, bestDeal.platformName)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:brightness-110 text-white font-black text-xs shadow-[0_0_15px_rgba(249,115,22,0.4)] transition active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <span>Grab ₹{bestDeal.offerPrice}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Platform Cards */}
          <div className="space-y-2.5 pt-1">
            {foodItem.platforms.map((deal) => {
              const totalCost = deal.offerPrice + deal.deliveryFee;
              const savings = foodItem.originalPrice - deal.offerPrice;

              return (
                <div
                  key={deal.platformName}
                  id={`platform-deal-card-${deal.platformName.toLowerCase()}`}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    deal.isBestDeal
                      ? 'bg-gradient-to-r from-red-950/40 via-neutral-900 to-black border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.2)] ring-1 ring-orange-500/40'
                      : 'bg-neutral-900/90 border-neutral-800 hover:border-red-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    {/* Platform Brand & Promo */}
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md"
                        style={{ backgroundColor: deal.platformColor }}
                      >
                        {deal.platformName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-neutral-100">{deal.platformName}</span>
                          {deal.badge && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
                              {deal.badge}
                            </span>
                          )}
                        </div>

                        {/* Promo info */}
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-amber-300/90 font-medium">
                          <Tag className="w-3 h-3 text-orange-400" />
                          <span>{deal.discountText}</span>
                        </div>

                        {/* Delivery Time & Fees */}
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            {deal.deliveryTimeMins} mins
                          </span>
                          <span>•</span>
                          <span className={deal.deliveryFee === 0 ? 'text-emerald-400 font-semibold' : ''}>
                            {deal.deliveryFee === 0 ? 'Free Delivery' : `₹${deal.deliveryFee} Delivery`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="text-right shrink-0 flex flex-col items-end">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-emerald-400">₹{deal.offerPrice}</span>
                        <span className="text-xs text-neutral-500 line-through">₹{deal.originalPrice}</span>
                      </div>
                      <span className="text-[10px] text-orange-400 font-semibold">
                        You Save ₹{savings}
                      </span>

                      <button
                        onClick={() => onSelectPlatformAndOrder(foodItem, deal.platformName)}
                        className={`mt-2 px-3 py-1 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer ${
                          deal.isBestDeal
                            ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white shadow-md'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                        }`}
                      >
                        Order on {deal.platformName}
                      </button>
                    </div>
                  </div>

                  {/* Perks list */}
                  {deal.perks && deal.perks.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-800 flex flex-wrap gap-1.5">
                      {deal.perks.map((perk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-black/60 text-neutral-300 text-[10px] flex items-center gap-1 border border-neutral-800"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-orange-400" />
                          {perk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-black border-t border-neutral-800 text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
          <span>Real-time coupon auto-applied across Swiggy, Zomato & partner networks</span>
        </div>
      </div>
    </div>
  );
};
