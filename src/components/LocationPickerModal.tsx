import React, { useState } from 'react';
import {
  X,
  MapPin,
  Compass,
  Navigation,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { UserLocation } from '../types';
import { LOCATION_PRESETS } from '../data/locations';

interface LocationPickerModalProps {
  currentLocation: UserLocation;
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: UserLocation) => void;
  onUseGps: () => void;
  isLocating: boolean;
  locationError: string | null;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  currentLocation,
  isOpen,
  onClose,
  onSelectLocation,
  onUseGps,
  isLocating,
  locationError,
}) => {
  const [customLat, setCustomLat] = useState('');
  const [customLng, setCustomLng] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      onSelectLocation({
        name: `Custom (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
        lat,
        lng,
        isSimulated: true,
      });
      onClose();
    }
  };

  return (
    <div
      id="location-picker-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-800/90 px-5 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="font-bold text-white text-base">Device Location</h3>
              <p className="text-[11px] text-slate-400">
                Determines the closest open bazaar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {locationError && (
            <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-3 rounded-2xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block">GPS Notice:</span>
                {locationError}
              </div>
            </div>
          )}

          {/* Real Device GPS Button */}
          <button
            id="use-real-gps-btn"
            onClick={onUseGps}
            disabled={isLocating}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white font-bold p-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="p-2 bg-white/20 rounded-xl">
                <Navigation
                  className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`}
                />
              </div>
              <div>
                <span className="font-extrabold text-sm block">
                  {isLocating ? 'Accessing Device GPS...' : 'Use Real Device GPS'}
                </span>
                <span className="text-[11px] text-orange-100 font-normal">
                  Auto-detect current coordinates
                </span>
              </div>
            </div>
            {!currentLocation.isSimulated && (
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>

          {/* Quick Location Presets */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Or Test From Different Districts:
            </label>
            <div className="space-y-1.5">
              {LOCATION_PRESETS.map((preset) => {
                const isSelected =
                  currentLocation.lat === preset.lat &&
                  currentLocation.lng === preset.lng;
                return (
                  <button
                    key={preset.name}
                    onClick={() => {
                      onSelectLocation(preset);
                      onClose();
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-orange-500/20 border-orange-500 text-orange-200'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-orange-400' : 'text-slate-500'
                        }`}
                      />
                      <div>
                        <span className="font-semibold text-xs block">
                          {preset.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {preset.lat.toFixed(4)}, {preset.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-orange-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Coordinates Toggle */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => setShowCustom(!showCustom)}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
            >
              {showCustom ? 'Hide Custom Coordinates' : '+ Enter Custom Coordinates'}
            </button>

            {showCustom && (
              <form onSubmit={handleCustomSubmit} className="mt-2.5 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs"
                    required
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={customLng}
                    onChange={(e) => setCustomLng(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                >
                  Set Location
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
