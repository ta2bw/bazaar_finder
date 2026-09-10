import React, { useState } from 'react';
import {
  X,
  Navigation,
  Clock,
  MapPin,
  Star,
  Car,
  ShoppingBag,
  Shirt,
  Utensils,
  ExternalLink,
  Calendar,
  Sparkles,
  ThumbsUp,
  MessageSquarePlus,
  Share2,
  Copy,
  Check,
  Link2,
  Smartphone,
  CheckCheck,
} from 'lucide-react';
import { BazaarWithComputedDistance, TravelMode } from '../types';
import { DAY_NAMES, getGoogleMapsNavigationUrl } from '../utils/geo';

interface BazaarDetailModalProps {
  bazaar: BazaarWithComputedDistance | null;
  onClose: () => void;
  onWriteReview: (bazaar: BazaarWithComputedDistance) => void;
  onHelpfulClick: (bazaarId: string, reviewId: string) => void;
  selectedDate: Date;
}

export const BazaarDetailModal: React.FC<BazaarDetailModalProps> = ({
  bazaar,
  onClose,
  onWriteReview,
  onHelpfulClick,
  selectedDate,
}) => {
  const [travelMode, setTravelMode] = useState<TravelMode>('driving');
  const [showSharePanel, setShowSharePanel] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  if (!bazaar) return null;

  const navUrl = getGoogleMapsNavigationUrl(
    bazaar.lat,
    bazaar.lng,
    travelMode
  );

  const getShareUrl = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('bazaar', bazaar.id);
      return url.toString();
    } catch {
      return `${window.location.origin}${window.location.pathname}?bazaar=${bazaar.id}`;
    }
  };

  const copyTextToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // fallback to textarea
    }
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    } catch {
      return false;
    }
  };

  const handleCopyCoordinates = async () => {
    const coords = `${bazaar.lat.toFixed(5)}, ${bazaar.lng.toFixed(5)}`;
    await copyTextToClipboard(coords);
    setCopiedCoords(true);
    setShareFeedback('Coordinates copied to clipboard!');
    setTimeout(() => {
      setCopiedCoords(false);
      setShareFeedback(null);
    }, 2500);
  };

  const handleCopyShareLink = async () => {
    const shareUrl = getShareUrl();
    await copyTextToClipboard(shareUrl);
    setCopiedLink(true);
    setShareFeedback('Bazaar link copied to clipboard!');
    setTimeout(() => {
      setCopiedLink(false);
      setShareFeedback(null);
    }, 2500);
  };

  const handleSystemShare = async () => {
    const shareUrl = getShareUrl();
    const shareData = {
      title: `${bazaar.name} - Istanbul Bazaar Finder`,
      text: `Check out ${bazaar.name} in ${bazaar.district} (${bazaar.lat.toFixed(4)}, ${bazaar.lng.toFixed(4)}) · Address: ${bazaar.address}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareFeedback('Shared successfully via system dialog!');
        setTimeout(() => setShareFeedback(null), 3000);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          await handleCopyShareLink();
          setShareFeedback('System share not supported here; link copied to clipboard!');
          setTimeout(() => setShareFeedback(null), 3000);
        }
      }
    } else {
      await handleCopyShareLink();
      setShareFeedback('Link copied! (System share dialog not supported on this browser)');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  const currentDayOfWeek = selectedDate.getDay();

  return (
    <div
      id="bazaar-detail-modal"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header Bar with Image, Share & Close Button */}
        <div className="relative h-48 sm:h-56 shrink-0">
          <img
            src={bazaar.image}
            alt={bazaar.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/50" />

          {/* Action buttons (Share + Close) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              id="bazaar-header-share-btn"
              onClick={() => setShowSharePanel((prev) => !prev)}
              className={`px-3 py-1.5 rounded-full backdrop-blur-md transition-all border text-xs font-bold flex items-center gap-1.5 active:scale-95 shadow-md ${
                showSharePanel
                  ? 'bg-orange-500 text-white border-orange-400 ring-2 ring-orange-400/40'
                  : 'bg-black/60 hover:bg-black/80 text-white border-white/20'
              }`}
              title="Share bazaar location and coordinates"
            >
              <Share2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Share</span>
            </button>
            <button
              onClick={onClose}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/20 active:scale-95 shadow-md"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="bg-orange-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
              📍 {bazaar.distanceFormatted} away
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
                bazaar.isOpenNow
                  ? 'bg-emerald-500 text-white'
                  : bazaar.isOpenToday
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {bazaar.statusText}
            </span>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {bazaar.name}
            </h2>
            {bazaar.localName && (
              <p className="text-xs sm:text-sm text-orange-300 font-medium">
                {bazaar.localName}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-slate-200">
          {/* Quick Location & Share Action Bar */}
          <div className="bg-slate-800/90 rounded-2xl p-3.5 border border-slate-700/80 space-y-3">
            <div className="flex items-start justify-between gap-2 text-xs">
              <div className="flex items-start gap-1.5 text-slate-300 min-w-0">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{bazaar.address}</p>
                  <p className="text-slate-400 mt-0.5">
                    {bazaar.district}, {bazaar.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id="bazaar-location-share-btn"
                  onClick={() => setShowSharePanel((prev) => !prev)}
                  className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all shadow-xs ${
                    showSharePanel
                      ? 'bg-orange-500 text-white border-orange-400'
                      : 'text-orange-300 hover:text-orange-200 bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/40'
                  }`}
                  title="Share bazaar location link and coordinates"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </button>
                <button
                  onClick={handleCopyCoordinates}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-700 transition-colors"
                  title="Copy GPS coordinates"
                >
                  {copiedCoords ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Coordinates</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Expandable Share Panel */}
            {showSharePanel && (
              <div
                id="share-location-panel"
                className="bg-slate-900/95 border border-orange-500/40 rounded-2xl p-3.5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-inner"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-orange-400" />
                    <span className="font-bold text-white text-xs">
                      Share Bazaar Location
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSharePanel(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs"
                    title="Close share panel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Button: Open System Share Dialog */}
                <button
                  id="system-share-dialog-btn"
                  onClick={handleSystemShare}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold transition-all shadow-md shadow-orange-500/20 active:scale-[0.99] group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-white/20 rounded-lg shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold flex items-center gap-1.5">
                        <span>Open System Share Dialog</span>
                        <Share2 className="w-3 h-3 opacity-90" />
                      </div>
                      <div className="text-[10px] text-orange-100 font-normal">
                        WhatsApp, Telegram, Messages, or Social Apps
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                {/* Shareable Link Box */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Generated Location Link:
                  </label>
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <Link2 className="w-3.5 h-3.5 text-orange-400 shrink-0 ml-1" />
                    <input
                      type="text"
                      readOnly
                      value={getShareUrl()}
                      className="bg-transparent text-[11px] text-slate-300 font-mono flex-1 outline-none truncate select-all"
                    />
                    <button
                      id="copy-share-link-btn"
                      onClick={handleCopyShareLink}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                        copiedLink
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {copiedLink ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Coordinates Box */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Exact GPS Coordinates:
                  </label>
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 ml-1" />
                    <span className="text-[11px] text-slate-300 font-mono flex-1 truncate px-1">
                      {bazaar.lat.toFixed(5)}, {bazaar.lng.toFixed(5)}
                    </span>
                    <button
                      id="copy-coordinates-btn"
                      onClick={handleCopyCoordinates}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                        copiedCoords
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {copiedCoords ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Coordinates</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Instant Feedback Pill */}
                {shareFeedback && (
                  <div className="text-center py-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-xl animate-in fade-in">
                    ✓ {shareFeedback}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Mode Pill Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                <span>Google Maps Navigation:</span>
                <span className="text-emerald-400">
                  ~{travelMode === 'walking' ? bazaar.walkingMinutes : bazaar.drivingMinutes} mins ETA
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                {(['driving', 'walking', 'transit', 'bicycling'] as TravelMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTravelMode(mode)}
                    className={`py-1.5 rounded-lg capitalize transition-all text-center ${
                      travelMode === mode
                        ? 'bg-orange-500 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'driving' && '🚗 Drive'}
                    {mode === 'walking' && '🚶 Walk'}
                    {mode === 'transit' && '🚌 Transit'}
                    {mode === 'bicycling' && '🚲 Bike'}
                  </button>
                ))}
              </div>

              {/* Action Button: Launch Google Maps */}
              <a
                href={navUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all text-sm group"
              >
                <Navigation className="w-4 h-4 fill-white animate-bounce" />
                <span>Open Google Maps Directions ({travelMode})</span>
                <ExternalLink className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {bazaar.description}
          </p>

          {/* Operating Times Section */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Operating & Closing Times</span>
            </h3>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700 text-xs space-y-1.5">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/60">
                <span className="font-bold text-white text-sm">
                  Today ({DAY_NAMES[currentDayOfWeek]}):
                </span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-md ${
                    bazaar.isOpenToday
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {bazaar.isOpenToday
                    ? `${bazaar.openingTimeToday} – ${bazaar.closingTimeToday}`
                    : 'Closed Today'}
                </span>
              </div>

              {/* All Days Table */}
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-1 pt-1 text-[11px]">
                {[0, 1, 2, 3, 4, 5, 6].map((dayNum) => {
                  const isOpen = bazaar.openDays.includes(dayNum);
                  const sched = bazaar.schedule[dayNum];
                  const isCur = dayNum === currentDayOfWeek;
                  return (
                    <div
                      key={dayNum}
                      className={`p-2 rounded-xl text-center border ${
                        isCur
                          ? 'border-orange-500 bg-orange-500/10 font-bold'
                          : 'border-slate-800 bg-slate-900/60'
                      }`}
                    >
                      <div className="text-slate-400 text-[10px]">
                        {DAY_NAMES[dayNum].slice(0, 3)}
                      </div>
                      <div className="mt-1 font-semibold">
                        {isOpen ? (
                          <span className="text-emerald-400">
                            {sched?.open} - {sched?.close}
                          </span>
                        ) : (
                          <span className="text-slate-500">Closed</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Known Features Section: Groceries, Textiles, Food */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Available Known Features</span>
            </h3>

            <div className="space-y-2.5">
              {/* Groceries */}
              <div
                className={`p-3.5 rounded-2xl border ${
                  bazaar.features.groceries
                    ? 'bg-emerald-950/30 border-emerald-500/30'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        Groceries & Farm Produce
                      </h4>
                      <span className="text-[11px] font-semibold text-emerald-400">
                        {bazaar.features.groceries ? 'Available' : 'Not offered'}
                      </span>
                    </div>
                  </div>
                </div>
                {bazaar.featureDescriptions.groceries && (
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed bg-black/20 p-2.5 rounded-xl">
                    {bazaar.featureDescriptions.groceries}
                  </p>
                )}
              </div>

              {/* Textiles */}
              <div
                className={`p-3.5 rounded-2xl border ${
                  bazaar.features.textiles
                    ? 'bg-indigo-950/30 border-indigo-500/30'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                      <Shirt className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        Textiles & Clothing
                      </h4>
                      <span className="text-[11px] font-semibold text-indigo-400">
                        {bazaar.features.textiles ? 'Available' : 'Not offered'}
                      </span>
                    </div>
                  </div>
                </div>
                {bazaar.featureDescriptions.textiles && (
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed bg-black/20 p-2.5 rounded-xl">
                    {bazaar.featureDescriptions.textiles}
                  </p>
                )}
              </div>

              {/* Food */}
              <div
                className={`p-3.5 rounded-2xl border ${
                  bazaar.features.food
                    ? 'bg-amber-950/30 border-amber-500/30'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        Food & Culinary Stalls
                      </h4>
                      <span className="text-[11px] font-semibold text-amber-400">
                        {bazaar.features.food ? 'Available' : 'Not offered'}
                      </span>
                    </div>
                  </div>
                </div>
                {bazaar.featureDescriptions.food && (
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed bg-black/20 p-2.5 rounded-xl">
                    {bazaar.featureDescriptions.food}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Parking Facilities Section */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-orange-400" />
              <span>Parking Facilities</span>
            </h3>

            <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        bazaar.parking.available
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {bazaar.parking.available ? '✓ Parking Available' : '✕ No Dedicated Parking'}
                    </span>
                    {bazaar.parking.fee && (
                      <span className="text-xs text-slate-300 font-semibold">
                        {bazaar.parking.fee}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1.5">
                    {bazaar.parking.title}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {bazaar.parking.details}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                {bazaar.parking.capacity && (
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Capacity</span>
                    <strong className="text-white">{bazaar.parking.capacity}</strong>
                  </div>
                )}
                {bazaar.parking.walkingDistance && (
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Distance to Stalls</span>
                    <strong className="text-white">{bazaar.parking.walkingDistance}</strong>
                  </div>
                )}
              </div>

              {bazaar.parking.tips && (
                <div className="bg-orange-950/20 border border-orange-500/30 p-2.5 rounded-xl text-xs text-orange-200">
                  <strong className="text-orange-400">Driver Tip:</strong> {bazaar.parking.tips}
                </div>
              )}
            </div>
          </div>

          {/* User Ratings & Reviews Section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-orange-400" />
                <span>User Ratings & Reviews</span>
              </h3>
              <button
                onClick={() => onWriteReview(bazaar)}
                className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition-all"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Write Review</span>
              </button>
            </div>

            {/* Rating Summary Card */}
            <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 flex items-center justify-between gap-4">
              <div className="text-center shrink-0">
                <div className="text-3xl font-black text-white">
                  {bazaar.rating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-0.5 my-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(bazaar.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[11px] text-slate-400">
                  {bazaar.reviewCount} verified ratings
                </div>
              </div>

              <div className="flex-1 space-y-1 text-xs">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const pct =
                    stars === 5 ? 78 : stars === 4 ? 16 : stars === 3 ? 4 : 1;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-[10px]">
                      <span className="w-3 text-slate-400 font-semibold">{stars}★</span>
                      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-slate-400 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-2.5">
              {bazaar.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-xs block">
                        {rev.author}
                      </span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-700 text-xs font-bold text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Tags */}
                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rev.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-md"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Helpful Button */}
                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={() => onHelpfulClick(bazaar.id, rev.id)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-orange-400 transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
