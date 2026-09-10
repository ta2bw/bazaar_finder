import React, { useState } from 'react';
import {
  Navigation,
  ExternalLink,
  MapPin,
  Clock,
  Car,
  Star,
  ShoppingBag,
  Shirt,
  Utensils,
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
} from 'lucide-react';
import { BazaarWithComputedDistance, UserLocation } from '../types';
import { getGoogleMapsNavigationUrl } from '../utils/geo';

interface InteractiveMapProps {
  bazaars: BazaarWithComputedDistance[];
  userLocation: UserLocation;
  closestBazaar: BazaarWithComputedDistance | null;
  onSelectBazaar: (bazaar: BazaarWithComputedDistance) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  bazaars,
  userLocation,
  closestBazaar,
  onSelectBazaar,
}) => {
  const [selectedBazaarId, setSelectedBazaarId] = useState<string | null>(
    closestBazaar ? closestBazaar.id : null
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Calculate bounding box for SVG projection
  const allLats = [userLocation.lat, ...bazaars.map((b) => b.lat)];
  const allLngs = [userLocation.lng, ...bazaars.map((b) => b.lng)];

  const minLat = Math.min(...allLats) - 0.02;
  const maxLat = Math.max(...allLats) + 0.02;
  const minLng = Math.min(...allLngs) - 0.02;
  const maxLng = Math.max(...allLngs) + 0.02;

  // Convert lat/lng to SVG percentages (0 to 100)
  const projectX = (lng: number) => {
    return ((lng - minLng) / (maxLng - minLng)) * 88 + 6;
  };
  const projectY = (lat: number) => {
    // Invert lat because higher lat is up (lower Y in SVG)
    return (1 - (lat - minLat) / (maxLat - minLat)) * 84 + 8;
  };

  const activeBazaar =
    bazaars.find((b) => b.id === selectedBazaarId) || closestBazaar;

  const userX = projectX(userLocation.lng);
  const userY = projectY(userLocation.lat);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 shadow-xl flex flex-col h-[480px]">
      {/* Map Header / Map Controls */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs text-white px-3 py-1.5 rounded-xl pointer-events-auto flex items-center gap-1.5 shadow-md">
          <Compass className="w-4 h-4 text-orange-400" />
          <span className="font-bold">Interactive Bazaar Radar</span>
          <span className="text-[10px] text-slate-400">({bazaars.length} locations)</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-1 rounded-xl pointer-events-auto shadow-md">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
            className="p-1 text-slate-300 hover:text-white"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="p-1 text-slate-300 hover:text-white"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Surface */}
      <div className="flex-1 w-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
        {/* Background Grid Pattern resembling navigation tiles */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #ea580c 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Abstract Coastline / Waterway Graphic for Istanbul / Urban feeling */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 160 Q 120 180, 200 130 T 400 90 T 600 120"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M 220 130 Q 300 240, 360 380"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="28"
            strokeLinecap="round"
          />
        </svg>

        {/* Dynamic Interactive SVG Map with Markers */}
        <svg
          className="w-full h-full select-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* Connecting dashed route line between User and Closest Bazaar */}
          {closestBazaar && (
            <g>
              <line
                x1={userX}
                y1={userY}
                x2={projectX(closestBazaar.lng)}
                y2={projectY(closestBazaar.lat)}
                stroke="#ea580c"
                strokeWidth="0.8"
                strokeDasharray="2 1.5"
                className="animate-pulse"
              />
              {/* Midpoint distance pill label */}
              <rect
                x={(userX + projectX(closestBazaar.lng)) / 2 - 6}
                y={(userY + projectY(closestBazaar.lat)) / 2 - 2.5}
                width="12"
                height="5"
                rx="2"
                fill="#ea580c"
              />
              <text
                x={(userX + projectX(closestBazaar.lng)) / 2}
                y={(userY + projectY(closestBazaar.lat)) / 2 + 1}
                fill="#ffffff"
                fontSize="2.2"
                fontWeight="bold"
                textAnchor="middle"
              >
                {closestBazaar.distanceFormatted}
              </text>
            </g>
          )}

          {/* User Location Radar Pulse */}
          <g transform={`translate(${userX}, ${userY})`}>
            <circle
              r="6"
              fill="#3b82f6"
              fillOpacity="0.25"
              className="animate-ping"
            />
            <circle r="3.5" fill="#1d4ed8" fillOpacity="0.5" />
            <circle r="1.8" fill="#60a5fa" stroke="#ffffff" strokeWidth="0.6" />
            <text
              y="-3"
              fill="#93c5fd"
              fontSize="2.2"
              fontWeight="bold"
              textAnchor="middle"
            >
              Your Device
            </text>
          </g>

          {/* Bazaar Markers */}
          {bazaars.map((b) => {
            const bx = projectX(b.lng);
            const by = projectY(b.lat);
            const isSelected = b.id === (activeBazaar?.id || '');
            const isClosest = b.id === closestBazaar?.id;

            return (
              <g
                key={b.id}
                transform={`translate(${bx}, ${by})`}
                className="cursor-pointer group"
                onClick={() => setSelectedBazaarId(b.id)}
              >
                {/* Highlight ring if selected */}
                {isSelected && (
                  <circle
                    r="4.5"
                    fill="none"
                    stroke="#ea580c"
                    strokeWidth="0.8"
                    strokeDasharray="1 1"
                  />
                )}

                {/* Marker body */}
                <circle
                  r={isSelected ? '3.2' : isClosest ? '2.8' : '2.3'}
                  fill={
                    b.isOpenNow
                      ? '#10b981' // emerald
                      : b.isOpenToday
                      ? '#f59e0b' // amber
                      : '#64748b' // slate
                  }
                  stroke={isSelected ? '#ffffff' : '#0f172a'}
                  strokeWidth="0.6"
                  className="transition-transform duration-150 group-hover:scale-125"
                />

                {/* Star icon for closest */}
                {isClosest && (
                  <circle r="1" fill="#ffffff" />
                )}

                {/* Name label */}
                <text
                  y="4.8"
                  fill={isSelected ? '#f97316' : '#cbd5e1'}
                  fontSize="2"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow-md"
                >
                  {b.name.split(' ')[0]} ({b.distanceFormatted})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-24 left-3 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[10px] space-y-1 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Open Now</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Open Later Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Your Device</span>
          </div>
        </div>
      </div>

      {/* Selected Bazaar Bottom Preview Card */}
      {activeBazaar && (
        <div className="bg-slate-900 border-t border-slate-800 p-3 z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeBazaar.isOpenNow
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : activeBazaar.isOpenToday
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {activeBazaar.statusText}
                </span>
                <span className="text-[10px] font-bold text-orange-400">
                  📍 {activeBazaar.distanceFormatted} away
                </span>
              </div>

              <h4 className="font-bold text-white text-sm truncate mt-1">
                {activeBazaar.name}
              </h4>

              {/* Hours & Parking */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {activeBazaar.openingTimeToday} – {activeBazaar.closingTimeToday}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Car className="w-3 h-3 text-blue-400" />
                  {activeBazaar.parking.available ? 'Parking Available' : 'No Parking'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onSelectBazaar(activeBazaar)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-2 rounded-xl border border-slate-700 transition-colors"
              >
                Details
              </button>
              <a
                href={getGoogleMapsNavigationUrl(
                  activeBazaar.lat,
                  activeBazaar.lng,
                  'driving'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-md transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
