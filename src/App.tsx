import React, { useState, useEffect, useMemo } from 'react';
import {
  Store,
  Calendar,
  Search,
  RefreshCw,
  ShoppingBag,
  ListFilter,
  CheckCircle2,
  WifiOff,
  SlidersHorizontal,
  X,
  Info,
} from 'lucide-react';
import { AndroidFrame } from './components/AndroidFrame';
import { BazaarCard } from './components/BazaarCard';
import { BazaarDetailModal } from './components/BazaarDetailModal';
import { ShoppingTodoList } from './components/ShoppingTodoList';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OFFLINE_BAZAARS, DAY_NAMES, getBazaarDayNames } from './data/bazaars';
import { TURKEY_PROVINCES } from './data/provinces';
import { BazaarItem } from './types';

const OFFLINE_CACHE_KEY = 'bazaar_offline_data_v2';
const SELECTED_PLATE_KEY = 'bazaar_selected_plate_v2';

export default function App() {
  // Current active tab: 'bazaars' or 'shopping'
  const [activeTab, setActiveTab] = useState<'bazaars' | 'shopping'>('bazaars');

  // Selected province plate (Default: 6 = Ankara)
  const [selectedPlate, setSelectedPlate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(SELECTED_PLATE_KEY);
      if (saved) {
        const val = parseInt(saved, 10);
        if (val >= 1 && val <= 81) return val;
      }
    } catch {
      // fallback
    }
    return 6; // Default to Ankara
  });

  // Selected district filter
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Selected day filter ('today', 'all', or day index 0..6)
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('today');

  // Selected market type filter ('all', 'Semt Pazarı', 'Üretici Pazarı')
  const [selectedType, setSelectedType] = useState<string>('all');

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected bazaar for detail modal
  const [selectedBazaar, setSelectedBazaar] = useState<BazaarItem | null>(null);

  // Optional live update loading state & message
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Offline dataset with user local updates merged
  const [allBazaars, setAllBazaars] = useState<BazaarItem[]>(() => {
    try {
      const localUpdates = localStorage.getItem(OFFLINE_CACHE_KEY);
      if (localUpdates) {
        const customMap: Record<string, BazaarItem[]> = JSON.parse(localUpdates);
        // Merge customMap with bundled OFFLINE_BAZAARS
        const merged = [...OFFLINE_BAZAARS];
        for (const [plateStr, bazaars] of Object.entries(customMap)) {
          const plate = Number(plateStr);
          const filtered = merged.filter((b) => b.plate !== plate);
          filtered.push(...bazaars);
          return filtered;
        }
      }
    } catch (e) {
      console.error('Error loading cached bazaars:', e);
    }
    return OFFLINE_BAZAARS;
  });

  // Current system day index (0 = Sunday, 1 = Monday, ...)
  const todayIndex = new Date().getDay();
  const todayName = DAY_NAMES[todayIndex];

  // Remember selected province
  useEffect(() => {
    try {
      localStorage.setItem(SELECTED_PLATE_KEY, selectedPlate.toString());
    } catch {
      // fallback
    }
    setSelectedDistrict('all'); // Reset district when city changes
  }, [selectedPlate]);

  // Toast auto dismiss
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Optional manual sync / update with hal.gov.tr
  const handleOptionalUpdate = async () => {
    setIsUpdating(true);
    const provinceObj = TURKEY_PROVINCES.find((p) => p.plate === selectedPlate);
    const cityName = provinceObj ? provinceObj.displayName : `İl (Plaka: ${selectedPlate})`;

    try {
      showToast(`${cityName} için hal.gov.tr'den güncel veriler sorgulanıyor...`, 'info');
      const response = await fetch(`/api/bazaars?sid=${selectedPlate}&refresh=true`);
      
      if (!response.ok) {
        throw new Error('Bağlantı kurulamadı');
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.bazaars) && data.bazaars.length > 0) {
        // Save to state and localStorage
        setAllBazaars((prev) => {
          const others = prev.filter((b) => b.plate !== selectedPlate);
          const next = [...others, ...data.bazaars];
          return next;
        });

        // Store update locally
        try {
          const localUpdatesStr = localStorage.getItem(OFFLINE_CACHE_KEY);
          const localUpdates = localUpdatesStr ? JSON.parse(localUpdatesStr) : {};
          localUpdates[selectedPlate] = data.bazaars;
          localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(localUpdates));
        } catch (e) {
          console.error('LocalStorage write error:', e);
        }

        showToast(`${cityName} pazar yerleri hal.gov.tr üzerinden başarıyla güncellendi (${data.bazaars.length} pazar).`, 'success');
      } else {
        showToast(`${cityName} için yeni kayıt bulunamadı, mevcut çevrimdışı veriler kullanılıyor.`, 'info');
      }
    } catch (err) {
      console.warn('Network update failed, remaining offline:', err);
      showToast('Çevrimdışı moddasınız. Kayıtlı çevrimdışı pazar verileri kullanılmaya devam ediyor.', 'info');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter bazaars belonging to selected province
  const provinceBazaars = useMemo(() => {
    return allBazaars.filter((b) => b.plate === selectedPlate);
  }, [allBazaars, selectedPlate]);

  // Extract unique districts for the selected province
  const availableDistricts = useMemo(() => {
    const districts = new Set<string>();
    provinceBazaars.forEach((b) => {
      if (b.district && b.district.trim()) {
        districts.add(b.district.trim());
      }
    });
    return Array.from(districts).sort((a, b) => a.localeCompare(b, 'tr'));
  }, [provinceBazaars]);

  // Filter bazaars by district, day, search, type
  const filteredBazaars = useMemo(() => {
    return provinceBazaars.filter((bazaar) => {
      // District filter
      if (selectedDistrict !== 'all' && bazaar.district !== selectedDistrict) {
        return false;
      }

      // Market Type filter
      if (selectedType !== 'all') {
        if (!bazaar.type || !bazaar.type.toLowerCase().includes(selectedType.toLowerCase())) {
          return false;
        }
      }

      // Day filter
      if (selectedDayFilter === 'today') {
        if (!bazaar.openDays.includes(todayIndex)) {
          return false;
        }
      } else if (selectedDayFilter !== 'all') {
        const targetDay = parseInt(selectedDayFilter, 10);
        if (!bazaar.openDays.includes(targetDay)) {
          return false;
        }
      }

      // Search query filter (matches name, address, district, neighborhood, full day names, or abbreviations)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = bazaar.name.toLowerCase().includes(q);
        const inAddress = bazaar.address.toLowerCase().includes(q);
        const inDistrict = bazaar.district.toLowerCase().includes(q);
        const inNeighborhood = bazaar.neighborhood ? bazaar.neighborhood.toLowerCase().includes(q) : false;
        const dayNames = getBazaarDayNames(bazaar);
        const inDayNames = dayNames.some((d) => d.toLowerCase().includes(q));
        const inDaysRaw = bazaar.daysRaw ? bazaar.daysRaw.toLowerCase().includes(q) : false;
        if (!inName && !inAddress && !inDistrict && !inNeighborhood && !inDayNames && !inDaysRaw) {
          return false;
        }
      }

      return true;
    });
  }, [provinceBazaars, selectedDistrict, selectedType, selectedDayFilter, searchQuery, todayIndex]);

  const currentProvinceInfo = TURKEY_PROVINCES.find((p) => p.plate === selectedPlate);
  const totalInProvince = provinceBazaars.length;
  const openTodayInProvince = provinceBazaars.filter((b) => b.openDays.includes(todayIndex)).length;

  return (
    <AndroidFrame>
      <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 font-sans pb-10">
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-md">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
                    Bazaar Finder
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Çevrimdışı
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  hal.gov.tr resmi semt pazarları kayıtları
                </p>
              </div>
            </div>

            {/* Top Right Controls */}
            <div className="flex items-center gap-1.5">
              <PWAInstallButton />
              
              {/* Optional live update button */}
              <button
                type="button"
                onClick={handleOptionalUpdate}
                disabled={isUpdating}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1 text-xs font-semibold disabled:opacity-50"
                title="hal.gov.tr'den verileri isteğe bağlı güncelle"
              >
                <RefreshCw className={`w-4 h-4 text-orange-400 ${isUpdating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline text-[11px]">Güncelle</span>
              </button>
            </div>
          </div>

          {/* Primary View Switcher Tabs (Pazarlar / Alışveriş Listesi) */}
          <div className="flex gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setActiveTab('bazaars')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'bazaars'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Semt Pazarları ({filteredBazaars.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shopping')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'shopping'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Alışveriş Listem</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 space-y-4 flex-1">
          {/* TOAST MESSAGE */}
          {toastMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 border shadow-lg animate-in slide-in-from-top duration-200 ${
                toastMessage.type === 'success'
                  ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
                  : toastMessage.type === 'error'
                  ? 'bg-rose-950/90 text-rose-200 border-rose-500/40'
                  : 'bg-slate-900 text-slate-200 border-slate-700'
              }`}
            >
              <span>{toastMessage.text}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 1: BAZAARS LIST */}
          {activeTab === 'bazaars' && (
            <div className="space-y-3.5">
              {/* Filter Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-sm">
                {/* City & District Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* City (İl / Plaka) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      İl / Plaka Seçiniz (81 İl):
                    </label>
                    <select
                      value={selectedPlate}
                      onChange={(e) => setSelectedPlate(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 text-white text-xs font-semibold rounded-xl px-3 py-2.5 outline-none transition-colors"
                    >
                      {TURKEY_PROVINCES.map((prov) => {
                        const count = allBazaars.filter((b) => b.plate === prov.plate).length;
                        return (
                          <option key={prov.plate} value={prov.plate}>
                            {prov.plate.toString().padStart(2, '0')} - {prov.displayName} ({count} Pazar)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* District (İlçe) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      İlçe Filtresi:
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 text-white text-xs font-semibold rounded-xl px-3 py-2.5 outline-none transition-colors"
                    >
                      <option value="all">Tüm İlçeler ({totalInProvince})</option>
                      {availableDistricts.map((dist) => {
                        const distCount = provinceBazaars.filter((b) => b.district === dist).length;
                        return (
                          <option key={dist} value={dist}>
                            {dist} ({distCount})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pazar adı, mahalle veya cadde ara..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Day Filter Chips */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-orange-400" />
                      Kuruluş Günü Filtresi:
                    </span>
                    <span className="text-[10px] text-slate-500">Bugün: {todayName}</span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSelectedDayFilter('today')}
                      className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                        selectedDayFilter === 'today'
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Bugün Açık ({openTodayInProvince})
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDayFilter('all')}
                      className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
                        selectedDayFilter === 'all'
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      Tüm Günler ({totalInProvince})
                    </button>

                    {/* Monday to Sunday buttons */}
                    {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                      const name = DAY_NAMES[d];
                      const count = provinceBazaars.filter((b) => b.openDays.includes(d)).length;
                      const isSelected = selectedDayFilter === d.toString();
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedDayFilter(d.toString())}
                          className={`px-2.5 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                            isSelected
                              ? 'bg-orange-500 text-white font-bold'
                              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {name} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Market Type Filter */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-500 text-[10px] uppercase font-bold shrink-0">Tür:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedType('all')}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      selectedType === 'all'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tümü
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedType('Semt Pazarı')}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      selectedType === 'Semt Pazarı'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Semt Pazarı
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedType('Üretici')}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      selectedType === 'Üretici'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Üretici Pazarı
                  </button>
                </div>
              </div>

              {/* Status Header */}
              <div className="flex items-center justify-between text-xs px-1 text-slate-400">
                <span className="font-semibold text-white">
                  {currentProvinceInfo?.displayName || 'İl'} &bull; {filteredBazaars.length} Pazar Listeleniyor
                </span>
                <span className="text-[11px] text-slate-500">
                  {selectedDayFilter === 'today' ? `Bugün (${todayName}) Açık Olanlar` : 'Filtrelenmiş Liste'}
                </span>
              </div>

              {/* Bazaars List */}
              {filteredBazaars.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                    <Store className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Pazar Yeri Bulunamadı</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Seçili filtre kriterlerine uygun pazar bulunamadı. Gün filtresini "Tüm Günler" olarak değiştirebilir veya arama terimini temizleyebilirsiniz.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDayFilter('all');
                      setSelectedDistrict('all');
                      setSelectedType('all');
                      setSearchQuery('');
                    }}
                    className="mt-2 text-xs font-bold text-orange-400 hover:text-orange-300 py-1 px-3 rounded-lg border border-orange-500/30"
                  >
                    Filtreleri Sıfırla
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBazaars.map((bazaar) => {
                    const isOpenToday = bazaar.openDays.includes(todayIndex);
                    return (
                      <BazaarCard
                        key={bazaar.id}
                        bazaar={bazaar}
                        onSelect={(bz) => setSelectedBazaar(bz)}
                        isOpenToday={isOpenToday}
                        todayIndex={todayIndex}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SHOPPING TODO LIST */}
          {activeTab === 'shopping' && (
            <ShoppingTodoList />
          )}
        </main>

        {/* Footer Info Notice */}
        <footer className="mt-8 px-4 text-center text-[11px] text-slate-500 space-y-1">
          <p>
            Veri Kaynağı: T.C. Ticaret Bakanlığı Hal Kayıt Sistemi (HKS) &bull; hal.gov.tr
          </p>
          <p>
            Tüm pazar listesi ve alışveriş maddeleri çevrimdışı yerel hafızanızda çalışır.
          </p>
        </footer>

        {/* Bazaar Detail Modal */}
        {selectedBazaar && (
          <BazaarDetailModal
            bazaar={selectedBazaar}
            onClose={() => setSelectedBazaar(null)}
            isOpenToday={selectedBazaar.openDays.includes(todayIndex)}
            todayIndex={todayIndex}
            onOpenShoppingList={() => {
              setActiveTab('shopping');
            }}
          />
        )}
      </div>
    </AndroidFrame>
  );
}
