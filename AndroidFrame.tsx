import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2, Sparkles } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isFramed: boolean;
  onToggleFrame: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isFramed,
  onToggleFrame,
}) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="app-root-container"
      className="min-h-screen bg-black text-neutral-100 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 select-none font-sans"
    >
      {/* Top Banner with Device Mode Toggle & Quick Status */}
      <header
        id="device-mode-header"
        className="w-full max-w-5xl flex items-center justify-between px-4 py-2 mb-2 bg-neutral-950/90 border border-red-950/60 backdrop-blur-md rounded-xl text-xs shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="font-bold font-cravereel text-xs tracking-tight bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            CraveReels
          </span>
          <span className="text-orange-400/80 font-bold hidden xs:inline">| Live Deal Radar &amp; Smart Cravings</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-neutral-900 text-orange-400 text-[10px] font-bold border border-orange-500/30 shadow-sm">
            ⚡ 5-App Price Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-950/60 via-orange-950/50 to-neutral-900 text-orange-300 border border-orange-500/30 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>Swiggy vs Zomato vs Magicpin vs EatSure</span>
          </div>

          <button
            id="toggle-device-frame-btn"
            onClick={onToggleFrame}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-neutral-200 border border-neutral-700 hover:border-orange-500/50 transition cursor-pointer"
            title={isFramed ? 'Switch to Fullscreen Responsive View' : 'Switch to Android Pixel Frame View'}
          >
            {isFramed ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-bold">Expand View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-red-500" />
                <span className="font-bold">Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main
        id="android-device-shell"
        className={`w-full transition-all duration-300 relative flex flex-col ${
          isFramed
            ? 'max-w-[430px] h-[890px] max-h-[94vh] rounded-[44px] border-[10px] border-neutral-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden bg-black ring-2 ring-red-950/60'
            : 'max-w-4xl h-[92vh] rounded-3xl border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden bg-black'
        }`}
      >
        {/* Android Punch-hole Camera & Top Speaker (in frame mode) */}
        {isFramed && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-50 flex items-center justify-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700/60" />
            <div className="w-10 h-1 rounded-full bg-neutral-800" />
          </div>
        )}

        {/* Android Status Bar */}
        <div
          id="android-status-bar"
          className="w-full h-8 px-6 flex items-center justify-between text-[11px] font-semibold text-neutral-300 bg-black/90 backdrop-blur-md z-40 shrink-0 border-b border-red-950/30"
        >
          <div className="flex items-center gap-1.5">
            <span className="tracking-tight text-white font-bold">{currentTime || '12:45'}</span>
            <span className="text-[10px] text-orange-400 font-black px-1 rounded bg-orange-950/80 border border-orange-500/40">5G</span>
          </div>

          <div className="flex items-center gap-2 text-neutral-300">
            <Signal className="w-3.5 h-3.5 text-neutral-300" />
            <Wifi className="w-3.5 h-3.5 text-neutral-300" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-neutral-200 font-bold">98%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            </div>
          </div>
        </div>

        {/* App Content Window */}
        <div className="flex-1 w-full h-[calc(100%-32px)] flex flex-col relative overflow-hidden bg-black">
          {children}
        </div>

        {/* Android Navigation Gesture Pill */}
        {isFramed && (
          <div className="w-full h-5 bg-black flex items-center justify-center shrink-0 z-40 border-t border-neutral-900">
            <div className="w-32 h-1 bg-neutral-600/60 rounded-full" />
          </div>
        )}
      </main>
    </div>
  );
};
