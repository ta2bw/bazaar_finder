import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  Navigation,
  Search,
  Filter,
  Star,
  Clock,
  Car,
  ShoppingBag,
  Shirt,
  Utensils,
  Layers,
  Map as MapIcon,
  ListFilter,
  CheckCircle2,
} from 'lucide-react';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidHeader } from './components/AndroidHeader';
import { ClosestBazaarHero } from './components/ClosestBazaarHero';
import { BazaarCard } from './components/BazaarCard';
import { BazaarDetailModal } from './components/BazaarDetailModal';
import { AddReviewModal } from './components/AddReviewModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { InteractiveMap } from './components/InteractiveMap';
import { INITIAL_BAZAARS } from './data/bazaars';
import { LOCATION_PRESETS } from './data/locations';
import {
  Bazaar,
  BazaarWithComputedDistance,
  UserLocation,
  Review,
} from './types';
import {
  enrichBazaarWithDistance,
  DAY_NAMES,
} from './utils/geo';

const REVIEWS_STORAGE_KEY = 'bazaar_finder_custom_reviews_v1';

export default function App() {
  // User location state
  const [userLocation, setUserLocation] = useState<UserLocation>(
    LOCATION_PRESETS[0]
  );
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState<boolean>(false);

  // Date selection (Defaults to current local date)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Active view tab ('list' | 'map')
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  // Filter & Search
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [detailBazaar, setDetailBazaar] = useState<BazaarWithComputedDistance | null>(null);
  const [reviewBazaar, setReviewBazaar] = useState<BazaarWithComputedDistance | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bazaars base data with local reviews integration
  const [bazaarsData, setBazaarsData] = useState<Bazaar[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        const extraReviews: Record<string, Review[]> = JSON.parse(saved);
        return INITIAL_BAZAARS.map((b) => {
          const added = extraReviews[b.id] || [];
          if (added.length === 0) return b;
          const allReviews = [...added, ...b.reviews];
          const avg =
            allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
          return {
            ...b,
            reviews: allReviews,
            rating: Math.round(avg * 10) / 10,
            reviewCount: allReviews.length,
          };
        });
      }
    } catch {
      // fallback
    }
    return INITIAL_BAZAARS;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Attempt real device GPS on initial mount if available
  const requestDeviceGps = (showToastNotice = true) => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newLoc: UserLocation = {
          name: 'Device Current Location',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          isSimulated: false,
        };
        setUserLocation(newLoc);
        if (showToastNotice) {
          showToast('Updated location to device GPS coordinates');
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationError(
          err.code === 1
            ? 'GPS permission denied. Using selected district.'
            : 'Unable to acquire accurate GPS fix. Using selected district.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    // Attempt device GPS on mount silently; falls back to preset if not allowed
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            name: 'Device Current Location',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            isSimulated: false,
          });
        },
        () => {
          // silently keep Kadıköy preset
        },
        { enableHighAccuracy: false, timeout: 4000 }
      );
    }
  }, []);

  // Compute distances and open states for all bazaars from current location & date
  const enrichedBazaars = useMemo(() => {
    return bazaarsData.map((b) =>
      enrichBazaarWithDistance(b, userLocation.lat, userLocation.lng, selectedDate)
    );
  }, [bazaarsData, userLocation, selectedDate]);

  // Deep-linking: Automatically open shared bazaar from URL query parameter '?bazaar=<id>'
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const bazaarParam = params.get('bazaar');
      if (bazaarParam && enrichedBazaars.length > 0) {
        const found = enrichedBazaars.find(
          (b) => b.id.toLowerCase() === bazaarParam.toLowerCase()
        );
        if (found) {
          setDetailBazaar(found);
        }
      }
    } catch {
      // ignore
    }
  }, [enrichedBazaars]);

  // Synchronize URL with active bazaar detail view for seamless link sharing
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (detailBazaar) {
        url.searchParams.set('bazaar', detailBazaar.id);
      } else {
        url.searchParams.delete('bazaar');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  }, [detailBazaar]);

  // Closest bazaar open today
  const bazaarsOpenToday = useMemo(() => {
    return enrichedBazaars
      .filter((b) => b.isOpenToday)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [enrichedBazaars]);

  const closestBazaarOpenToday = bazaarsOpenToday.length > 0 ? bazaarsOpenToday[0] : null;

  // Filtered list for display
  const displayBazaars = useMemo(() => {
    return enrichedBazaars
      .filter((b) => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = b.name.toLowerCase().includes(q);
          const matchesDistrict = b.district.toLowerCase().includes(q);
          const matchesFeatures =
            (b.features.groceries && 'groceries produce vegetables'.includes(q)) ||
            (b.features.textiles && 'textiles clothes fabrics'.includes(q)) ||
            (b.features.food && 'food stalls kebabs tea'.includes(q));
          if (!matchesName && !matchesDistrict && !matchesFeatures) return false;
        }

        // Feature filter chip
        if (activeFilter === 'open_now') return b.isOpenNow;
        if (activeFilter === 'groceries') return b.features.groceries;
        if (activeFilter === 'textiles') return b.features.textiles;
        if (activeFilter === 'food') return b.features.food;
        if (activeFilter === 'parking') return b.parking.available;

        return true;
      })
      .sort((a, b) => {
        // Prioritize open today, then closest distance
        if (a.isOpenToday && !b.isOpenToday) return -1;
        if (!a.isOpenToday && b.isOpenToday) return 1;
        return a.distanceKm - b.distanceKm;
      });
  }, [enrichedBazaars, activeFilter, searchQuery]);

  // Handle Review Submission
  const handleAddReview = (
    bazaarId: string,
    reviewData: {
      author: string;
      rating: number;
      comment: string;
      tags: string[];
    }
  ) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: reviewData.author,
      rating: reviewData.rating,
      date: 'Just now',
      comment: reviewData.comment,
      tags: reviewData.tags,
      helpfulCount: 0,
    };

    setBazaarsData((prev) => {
      const updated = prev.map((b) => {
        if (b.id !== bazaarId) return b;
        const newReviews = [newRev, ...b.reviews];
        const newAvg =
          newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return {
          ...b,
          reviews: newReviews,
          rating: Math.round(newAvg * 10) / 10,
          reviewCount: newReviews.length,
        };
      });

      // Save to localStorage
      try {
        const stored = JSON.parse(
          localStorage.getItem(REVIEWS_STORAGE_KEY) || '{}'
        );
        stored[bazaarId] = [newRev, ...(stored[bazaarId] || [])];
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(stored));
      } catch (e) {
        console.error('Failed to save review to storage', e);
      }

      return updated;
    });

    showToast(`Thanks ${reviewData.author}! Your review was published.`);
  };

  // Handle helpful vote click
  const handleHelpfulClick = (bazaarId: string, reviewId: string) => {
    setBazaarsData((prev) =>
      prev.map((b) => {
        if (b.id !== bazaarId) return b;
        return {
          ...b,
          reviews: b.reviews.map((r) =>
            r.id === reviewId
              ? { ...r, helpfulCount: r.helpfulCount + 1 }
              : r
          ),
        };
      })
    );
    showToast('Marked review as helpful');
  };

  const dayName = DAY_NAMES[selectedDate.getDay()];

  return (
    <AndroidFrame>
      {/* Android Top System Bar & App Bar */}
      <AndroidHeader
        userLocation={userLocation}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        onRefreshLocation={() => requestDeviceGps(true)}
        isLocating={isLocating}
        selectedDate={selectedDate}
        onDateChange={(d) => setSelectedDate(d)}
        openCount={bazaarsOpenToday.length}
        totalCount={enrichedBazaars.length}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-4 space-y-4 pb-20">
        {/* Search Bar & View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bazaar, district, food, textiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Toggle between List and Map Radar */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-slate-700/80">
            <button
              onClick={() => setActiveTab('list')}
              className={`p-1.5 rounded-xl transition-all ${
                activeTab === 'list'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <ListFilter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`p-1.5 rounded-xl transition-all ${
                activeTab === 'map'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Map Radar View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab View Switch */}
        {activeTab === 'map' ? (
          <div className="space-y-3">
            <InteractiveMap
              bazaars={displayBazaars}
              userLocation={userLocation}
              closestBazaar={closestBazaarOpenToday}
              onSelectBazaar={(b) => setDetailBazaar(b)}
            />
          </div>
        ) : (
          <>
            {/* Featured Section: The Closest Bazaar Open Today */}
            {!searchQuery && activeFilter === 'all' && closestBazaarOpenToday && (
              <section className="space-y-2">
                <ClosestBazaarHero
                  bazaar={closestBazaarOpenToday}
                  onSelect={(b) => setDetailBazaar(b)}
                  onOpenReviews={(b) => {
                    setDetailBazaar(b);
                  }}
                />
              </section>
            )}

            {/* If no bazaar is open today */}
            {bazaarsOpenToday.length === 0 && (
              <div className="bg-slate-800/90 border border-amber-500/40 p-4 rounded-2xl text-center space-y-2">
                <Clock className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="font-bold text-white text-sm">
                  No Bazaars Scheduled on {dayName}
                </h3>
                <p className="text-xs text-slate-300">
                  Weekly street markets typically run on specific days. Select
                  another day on the top bar (such as Tuesday, Wednesday, Friday,
                  or Saturday) or check daily covered bazaars!
                </p>
              </div>
            )}

            {/* List of All Other Bazaars */}
            <section className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1 pt-1">
                <span>
                  {searchQuery || activeFilter !== 'all'
                    ? `Matching Bazaars (${displayBazaars.length})`
                    : `Nearby Bazaars (${displayBazaars.length})`}
                </span>
                <span className="text-[11px] text-orange-400 font-normal lowercase">
                  sorted by distance from device
                </span>
              </div>

              <div className="space-y-3">
                {displayBazaars.map((bazaar) => {
                  const isClosest = bazaar.id === closestBazaarOpenToday?.id;
                  return (
                    <BazaarCard
                      key={bazaar.id}
                      bazaar={bazaar}
                      onSelect={(b) => setDetailBazaar(b)}
                      onOpenReviews={(b) => setDetailBazaar(b)}
                      isClosest={isClosest}
                    />
                  );
                })}

                {displayBazaars.length === 0 && (
                  <div className="bg-slate-800/50 rounded-2xl p-8 text-center text-slate-400 text-xs">
                    No bazaars found matching your filter criteria.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Floating Action Button (FAB) for Quick Map / Navigation View */}
      <div className="fixed bottom-4 right-4 z-20 sm:hidden">
        <button
          onClick={() => setActiveTab(activeTab === 'list' ? 'map' : 'list')}
          className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold p-3.5 rounded-full shadow-2xl flex items-center gap-1.5 border border-orange-400/30"
        >
          {activeTab === 'list' ? (
            <>
              <MapIcon className="w-5 h-5" />
              <span className="text-xs pr-1">Radar Map</span>
            </>
          ) : (
            <>
              <ListFilter className="w-5 h-5" />
              <span className="text-xs pr-1">List View</span>
            </>
          )}
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-orange-500/50 text-white text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <BazaarDetailModal
        bazaar={detailBazaar}
        onClose={() => setDetailBazaar(null)}
        onWriteReview={(b) => setReviewBazaar(b)}
        onHelpfulClick={handleHelpfulClick}
        selectedDate={selectedDate}
      />

      <AddReviewModal
        bazaar={reviewBazaar}
        onClose={() => setReviewBazaar(null)}
        onSubmitReview={handleAddReview}
      />

      <LocationPickerModal
        currentLocation={userLocation}
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onSelectLocation={(loc) => {
          setUserLocation(loc);
          showToast(`Set device location to ${loc.name}`);
        }}
        onUseGps={() => {
          requestDeviceGps(true);
          setIsLocationPickerOpen(false);
        }}
        isLocating={isLocating}
        locationError={locationError}
      />
    </AndroidFrame>
  );
}
