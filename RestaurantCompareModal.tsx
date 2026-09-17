import React from 'react';
import { X, Star, Award, ShieldCheck, MapPin, Sparkles, ChefHat } from 'lucide-react';
import { FoodItem, AlternativeRestaurant } from '../types';

interface RestaurantCompareModalProps {
  foodItem: FoodItem;
  onClose: () => void;
}

export const RestaurantCompareModal: React.FC<RestaurantCompareModalProps> = ({
  foodItem,
  onClose,
}) => {
  return (
    <div
      id="restaurant-compare-modal-overlay"
      className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="restaurant-compare-modal-content"
        className="w-full sm:max-w-lg bg-slate-900 border border-slate-700/80 rounded-t-[32px] sm:rounded-3xl shadow-2xl max-h-[88vh] flex flex-col overflow-hidden text-slate-100 animate-in slide-in-from-bottom duration-250"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Which Restaurant Makes It Best?</h3>
              <p className="text-xs text-slate-400">
                Culinary rating & technique battle for <span className="font-black bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">{foodItem.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Competitors */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {foodItem.restaurantCompetitors && foodItem.restaurantCompetitors.length > 0 ? (
            foodItem.restaurantCompetitors.map((comp, idx) => (
              <div
                key={comp.id}
                id={`competitor-card-${comp.id}`}
                className={`p-4 rounded-2xl border transition-all ${
                  idx === 0
                    ? 'bg-slate-800/90 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40'
                    : 'bg-slate-800/40 border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                      <img
                        src={comp.imageUrl}
                        alt={comp.restaurantName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-100">{comp.restaurantName}</span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            #1 Foodie Choice
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-black bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent mt-0.5">{comp.dishVariation}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1 text-amber-300 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {comp.rating} ({comp.reviewsCount.toLocaleString()}+ reviews)
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {comp.distanceKm} km away
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Culinary Signature */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-semibold">Signature Cooking Style: </span>
                      <span className="text-slate-200">{comp.signatureStyle}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChefHat className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-semibold">Why Foodies Love It: </span>
                      <span className="text-emerald-300">{comp.whyBetter}</span>
                    </div>
                  </div>
                </div>

                {/* Hygiene & Price bar */}
                <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-slate-700/50">
                  <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Hygiene Score: <strong className="text-slate-200">{comp.hygieneScore}</strong>
                  </span>
                  <span className="font-bold text-slate-100 text-sm">
                    Avg. Price: <span className="text-emerald-400 font-black">₹{comp.price}</span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              This specialty dish is exclusively prepared by {foodItem.restaurant}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
