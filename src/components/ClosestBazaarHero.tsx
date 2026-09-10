import React, { useState } from 'react';
import {
  Navigation,
  Clock,
  MapPin,
  Star,
  Car,
  Utensils,
  Shirt,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Compass,
} from 'lucide-react';
import { BazaarWithComputedDistance, TravelMode } from '../types';
import { getGoogleMapsNavigationUrl } from '../utils/geo';

interface ClosestBazaarHeroProps {
  bazaar: BazaarWithComputedDistance;
  onSelect: (bazaar: BazaarWithComputedDistance) => void;
  onOpenReviews: (bazaar: BazaarWithComputedDistance) => void;
}

export const ClosestBazaarHero: React.FC<ClosestBazaarHeroProps> = ({
  bazaar,
  onSelect,
  onOpenReviews,
}) => {
  const [selectedTravelMode, setSelectedTravelMode] = useState<TravelMode>('driving');

  const navUrl = getGoogleMapsNavigationUrl(
    bazaar.lat,
    bazaar.lng,
    selectedTravelMode
  );

  const etaMinutes =
    selectedTravelMode === 'walking'
      ? bazaar.walkingMinutes
      : bazaar.drivingMinutes;

  return (
    <div
      id="closest-bazaar-hero"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border-2 border-orange-500/50 shadow-xl transition-all"
    >
      {/* Top Banner Tag */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 px-4 py-2 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center gap-1.5 font-extrabold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
          <span>#1 Closest Bazaar Open Today</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-0.5 rounded-full text-xs font-bold backdrop-blur-xs">
          <Compass className="w-3.5 h-3.5 text-amber-200" />
          <span>{bazaar.distanceFormatted} away</span>
        </div>
      </div>

      {/* Hero Image with Overlay */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={bazaar.image}
          alt={bazaar.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Operating status badge floating on image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md ${
              bazaar.isOpenNow
                ? 'bg-emerald-500/90 text-white'
                : bazaar.isOpenToday
                ? 'bg-amber-500/90 text-white'
                : 'bg-slate-700/90 text-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                bazaar.isOpenNow ? 'bg-white animate-ping' : 'bg-white'
              }`}
            />
            {bazaar.statusText}
          </span>

          <button
            onClick={() => onOpenReviews(bazaar)}
            className="flex items-center gap-1 bg-black/60 hover:bg-black/80 text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md transition-all border border-amber-500/30"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{bazaar.rating.toFixed(1)}</span>
            <span className="text-slate-300 text-[10px]">({bazaar.reviewCount})</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3.5">
        {/* Title & District */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold text-white leading-tight">
              {bazaar.name}
            </h2>
          </div>
          {bazaar.localName && (
            <p className="text-xs text-orange-400/90 font-medium">
              {bazaar.localName}
            </p>
          )}
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{bazaar.district} · {bazaar.address}</span>
          </p>
        </div>

        {/* Operating Hours Callout */}
        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Operating Hours Today
              </span>
              <span className="font-bold text-slate-200">
                {bazaar.openingTimeToday} – {bazaar.closingTimeToday}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Estimated Travel</span>
            <span className="font-bold text-emerald-400">
              ~{etaMinutes} min ({selectedTravelMode})
            </span>
          </div>
        </div>

        {/* Known Features Section: Groceries, Textiles, Food */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Available Known Features:
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {/* Groceries */}
            <div
              className={`p-2 rounded-xl border flex flex-col justify-between ${
                bazaar.features.groceries
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">Groceries</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {bazaar.features.groceries ? 'Produce & Farm Food' : 'None'}
              </span>
            </div>

            {/* Textiles */}
            <div
              className={`p-2 rounded-xl border flex flex-col justify-between ${
                bazaar.features.textiles
                  ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <Shirt className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate">Textiles</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {bazaar.features.textiles ? 'Fabrics & Clothes' : 'None'}
              </span>
            </div>

            {/* Food */}
            <div
              className={`p-2 rounded-xl border flex flex-col justify-between ${
                bazaar.features.food
                  ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <Utensils className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">Street Food</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {bazaar.features.food ? 'Hot Stalls & Tea' : 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Parking Facilities Callout */}
        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-700/70 text-xs">
          <div className="flex items-start gap-2">
            <div
              className={`p-1.5 rounded-lg shrink-0 ${
                bazaar.parking.available
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Car className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">
                  {bazaar.parking.available ? 'Parking Available' : 'No On-Site Parking'}
                </span>
                {bazaar.parking.fee && (
                  <span className="text-[10px] text-blue-300 font-medium">
                    {bazaar.parking.fee}
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5 font-medium">
                {bazaar.parking.title}
              </p>
              <p className="text-slate-400 text-[10px] mt-0.5 line-clamp-1">
                {bazaar.parking.details}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Mode Selector & Google Maps Launch Button */}
        <div className="space-y-2 pt-1">
          {/* Mode selector pills */}
          <div className="flex items-center justify-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['driving', 'walking', 'transit'] as TravelMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedTravelMode(mode)}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1 ${
                  selectedTravelMode === mode
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'driving' && '🚗 Drive'}
                {mode === 'walking' && '🚶 Walk'}
                {mode === 'transit' && '🚌 Transit'}
              </button>
            ))}
          </div>

          {/* Primary Navigation Button */}
          <div className="flex items-center gap-2">
            <a
              id="start-navigation-google-maps"
              href={navUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all text-sm group"
            >
              <Navigation className="w-4 h-4 fill-white animate-bounce" />
              <span>Navigate in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <button
              onClick={() => onSelect(bazaar)}
              className="bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 font-semibold py-3 px-3.5 rounded-xl text-xs transition-all border border-slate-600 flex items-center gap-1"
              title="View full details and all reviews"
            >
              <Info className="w-4 h-4 text-orange-400" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
