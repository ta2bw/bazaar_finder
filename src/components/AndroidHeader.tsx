import React from 'react';
import {
  MapPin,
  Compass,
  Calendar,
  Wifi,
  Battery,
  Navigation,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import { UserLocation } from '../types';
import { DAY_NAMES } from '../utils/geo';

interface AndroidHeaderProps {
  userLocation: UserLocation;
  onOpenLocationPicker: () => void;
  onRefreshLocation: () => void;
  isLocating: boolean;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  openCount: number;
  totalCount: number;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  userLocation,
  onOpenLocationPicker,
  onRefreshLocation,
  isLocating,
  selectedDate,
  onDateChange,
  openCount,
  totalCount,
  activeFilter,
  onFilterChange,
}) => {
  // Format current system time
  const [currentTime, setCurrentTime] = React.useState<string>('12:52');

  React.useEffect(() => {
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

  const dayIndex = selectedDate.getDay();
  const dayName = DAY_NAMES[dayIndex];
  const isToday = new Date().toDateString() === selectedDate.toDateString();

  const filterChips = [
    { id: 'all', label: 'All Bazaars' },
    { id: 'open_now', label: '🟢 Open Now' },
    { id: 'groceries', label: '🥬 Groceries' },
    { id: 'textiles', label: '👗 Textiles' },
    { id: 'food', label: '🍲 Food' },
    { id: 'parking', label: '🅿️ With Parking' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Android System Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 text-xs font-medium text-slate-400 select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-200 font-semibold tracking-tight">{currentTime}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="GPS Active" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-300">5G</span>
          <Wifi className="w-3.5 h-3.5 text-slate-300" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400">94%</span>
            <Battery className="w-3.5 h-3.5 text-slate-200 fill-slate-200" />
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="px-4 pt-2.5 pb-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-orange-500/20 text-orange-400 text-[11px] font-bold px-2 py-0.5 rounded-full border border-orange-500/30 uppercase tracking-wider">
                Android App
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-orange-400" />
                {isToday ? `Today (${dayName})` : `${dayName}`}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5 mt-0.5">
              <span>Bazaar Finder</span>
              <span className="text-xs font-normal text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {openCount} open today
              </span>
            </h1>
          </div>

          {/* Location Button */}
          <button
            id="location-picker-btn"
            onClick={onOpenLocationPicker}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 text-xs px-2.5 py-1.5 rounded-xl transition-all shadow-sm max-w-[170px]"
            title="Change or refresh device location"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="truncate text-left font-medium text-[11px]">
              {userLocation.name}
            </span>
            <RefreshCw
              className={`w-3 h-3 text-slate-400 shrink-0 ${isLocating ? 'animate-spin text-orange-400' : ''}`}
            />
          </button>
        </div>

        {/* Day of Week Selector Bar (Allows testing other days or staying on Today) */}
        <div className="mt-2.5 flex items-center justify-between bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onDateChange(new Date())}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              isToday
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Today ({DAY_NAMES[new Date().getDay()].slice(0, 3)})
          </button>
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
              const d = new Date();
              d.setDate(d.getDate() + dayOffset);
              const isSelected =
                d.getDay() === selectedDate.getDay() &&
                d.getDate() === selectedDate.getDate();
              return (
                <button
                  key={dayOffset}
                  onClick={() => onDateChange(d)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-700 text-orange-300 font-bold border border-orange-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {DAY_NAMES[d.getDay()].slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Category / Feature Filter Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 mt-1">
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => onFilterChange(chip.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                activeFilter === chip.id
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/60 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
