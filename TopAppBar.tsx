import React, { useState } from 'react';
import { MapPin, Coins, ChevronDown } from 'lucide-react';
import { ActiveTab, DietaryFilter } from '../types';

interface TopAppBarProps {
  activeTab: ActiveTab;
  coins: number;
  dietaryFilter: DietaryFilter;
  onSelectDietaryFilter: (filter: DietaryFilter) => void;
}

const LOCATIONS = [
  'Indiranagar 100ft Rd, Bengaluru',
  'Koramangala 4th Block, Bengaluru',
  'HSR Layout Sector 2, Bengaluru',
  'Cyber City, Gurugram',
  'Bandra West, Mumbai',
];

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab,
  coins,
  dietaryFilter,
  onSelectDietaryFilter,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const handleVegClick = () => {
    onSelectDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg');
  };

  const handleNonVegClick = () => {
    onSelectDietaryFilter(dietaryFilter === 'non-veg' ? 'all' : 'non-veg');
  };

  return (
    <header
      id="top-app-bar"
      className="w-full px-3 sm:px-4 py-2.5 bg-black/95 backdrop-blur-xl border-b border-red-950/60 flex items-center justify-between z-30 shrink-0 gap-2 shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
    >
      {/* Location Dropdown */}
      <div className="relative flex-1 min-w-0">
        <button
          id="location-picker-btn"
          onClick={() => setIsLocationOpen(!isLocationOpen)}
          className="flex items-center gap-2 text-left w-full group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 text-white flex items-center justify-center shrink-0 border border-orange-400/40 shadow-[0_0_12px_rgba(249,115,22,0.4)] group-hover:scale-105 transition">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-white tracking-wide truncate">Deliver to Home</span>
              <ChevronDown className={`w-3.5 h-3.5 text-orange-400 transition-transform duration-200 ${isLocationOpen ? 'rotate-180 text-red-500' : ''}`} />
            </div>
            <span className="text-[10px] text-neutral-400 font-medium truncate max-w-[140px] xs:max-w-[170px] sm:max-w-[240px]">
              {selectedLocation}
            </span>
          </div>
        </button>

        {/* Location Dropdown Modal */}
        {isLocationOpen && (
          <div
            id="location-dropdown-menu"
            className="absolute top-11 left-0 w-72 bg-neutral-950/98 backdrop-blur-2xl border border-red-900/60 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-orange-500/20"
          >
            <div className="text-[10px] font-black uppercase tracking-wider text-orange-400 px-2 py-1 flex items-center justify-between">
              <span>Select Delivery Address</span>
              <span className="text-red-400">⚡ Live ETA</span>
            </div>
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setSelectedLocation(loc);
                  setIsLocationOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-all duration-150 ${
                  selectedLocation === loc
                    ? 'bg-gradient-to-r from-red-950/80 via-orange-950/60 to-neutral-900 text-orange-300 font-bold border border-orange-500/50 shadow-sm'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${selectedLocation === loc ? 'bg-gradient-to-tr from-red-600 to-orange-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                  <MapPin className="w-3 h-3" />
                </div>
                <span className="truncate">{loc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Unified Veg & Non-Veg Pure Symbol Control + Coins */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Unified Dietary Capsule (Veg + Non-Veg icons only) */}
        <div
          id="dietary-segmented-control"
          className="flex items-center bg-neutral-950/90 border border-neutral-800/90 p-1 rounded-2xl shadow-inner gap-1"
        >
          {/* Veg Symbol Segment */}
          <button
            id="veg-filter-btn"
            onClick={handleVegClick}
            className={`p-1.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
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

          {/* Non-Veg Symbol Segment */}
          <button
            id="non-veg-filter-btn"
            onClick={handleNonVegClick}
            className={`p-1.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
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

        {/* Crave Coins Badge with Orange & Red flame glow */}
        <div
          id="crave-coins-badge"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-red-950/80 via-orange-950/70 to-amber-950/80 border border-orange-500/50 text-orange-300 text-[11px] font-black shadow-[0_0_15px_rgba(249,115,22,0.35)]"
          title="Crave Coins (Earned on deals & orders)"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="font-brand font-black bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">{coins}</span>
        </div>
      </div>
    </header>
  );
};
