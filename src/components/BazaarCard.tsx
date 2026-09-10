import React from 'react';
import {
  Navigation,
  Clock,
  MapPin,
  Star,
  Car,
  ShoppingBag,
  Shirt,
  Utensils,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { BazaarWithComputedDistance } from '../types';
import { getGoogleMapsNavigationUrl } from '../utils/geo';

interface BazaarCardProps {
  bazaar: BazaarWithComputedDistance;
  onSelect: (bazaar: BazaarWithComputedDistance) => void;
  onOpenReviews: (bazaar: BazaarWithComputedDistance) => void;
  isClosest?: boolean;
}

export const BazaarCard: React.FC<BazaarCardProps> = ({
  bazaar,
  onSelect,
  onOpenReviews,
  isClosest = false,
}) => {
  const googleMapsUrl = getGoogleMapsNavigationUrl(
    bazaar.lat,
    bazaar.lng,
    'driving'
  );

  return (
    <div
      id={`bazaar-card-${bazaar.id}`}
      className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 rounded-2xl overflow-hidden transition-all shadow-md group"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail Image */}
        <div className="relative sm:w-40 h-36 sm:h-auto shrink-0 overflow-hidden">
          <img
            src={bazaar.image}
            alt={bazaar.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-900/70 via-transparent to-transparent" />

          {/* Distance pill on image */}
          <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-white/10 shadow-xs">
            📍 {bazaar.distanceFormatted}
          </div>

          {/* Status badge */}
          <div className="absolute bottom-2.5 left-2.5">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-md ${
                bazaar.isOpenNow
                  ? 'bg-emerald-500 text-white'
                  : bazaar.isOpenToday
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              {bazaar.isOpenNow ? 'Open Now' : bazaar.isOpenToday ? 'Opens Later' : 'Closed Today'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
          <div>
            {/* Top row: Name and Rating */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-base leading-snug group-hover:text-orange-400 transition-colors">
                  {bazaar.name}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{bazaar.district}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-300 font-medium">~{bazaar.drivingMinutes}m drive</span>
                </p>
              </div>

              <button
                onClick={() => onOpenReviews(bazaar)}
                className="flex items-center gap-1 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-400 shrink-0 transition-colors"
                title="View reviews"
              >
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{bazaar.rating.toFixed(1)}</span>
                <span className="text-slate-400 text-[10px]">({bazaar.reviewCount})</span>
              </button>
            </div>

            {/* Hours & Status */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              {bazaar.isOpenToday ? (
                <span>
                  Hours Today: <strong className="text-white">{bazaar.openingTimeToday} – {bazaar.closingTimeToday}</strong> ({bazaar.statusText})
                </span>
              ) : (
                <span className="text-slate-400">Closed on this day</span>
              )}
            </div>

            {/* Feature Badges (Groceries, Textiles, Food) */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {bazaar.features.groceries && (
                <span className="inline-flex items-center gap-1 bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                  <ShoppingBag className="w-3 h-3 text-emerald-400" />
                  Groceries
                </span>
              )}
              {bazaar.features.textiles && (
                <span className="inline-flex items-center gap-1 bg-indigo-950/50 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                  <Shirt className="w-3 h-3 text-indigo-400" />
                  Textiles
                </span>
              )}
              {bazaar.features.food && (
                <span className="inline-flex items-center gap-1 bg-amber-950/50 text-amber-300 border border-amber-500/30 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                  <Utensils className="w-3 h-3 text-amber-400" />
                  Food Stalls
                </span>
              )}
            </div>

            {/* Parking info inline */}
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-2 bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-800">
              <Car className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate">
                <strong className="text-slate-300">{bazaar.parking.available ? 'Parking:' : 'No Parking:'}</strong>{' '}
                {bazaar.parking.title} ({bazaar.parking.capacity || 'Limited'})
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/50">
            <button
              onClick={() => onSelect(bazaar)}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-0.5"
            >
              <span>See Details & Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white border border-orange-500/40 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs"
              title="Open Google Maps Navigation"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate</span>
              <ExternalLink className="w-3 h-3 opacity-75" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
