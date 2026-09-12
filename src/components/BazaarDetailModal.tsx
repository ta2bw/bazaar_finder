import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Tag,
  Copy,
  Check,
  ExternalLink,
  ShoppingBag,
  Building2,
  Navigation,
} from 'lucide-react';
import { BazaarItem } from '../types';
import { getBazaarDayNames, getMapReferenceUrl, DAY_NAMES } from '../data/bazaars';

interface BazaarDetailModalProps {
  bazaar: BazaarItem | null;
  onClose: () => void;
  isOpenToday: boolean;
  todayIndex: number;
  onOpenShoppingList: (bazaarName?: string) => void;
}

export const BazaarDetailModal: React.FC<BazaarDetailModalProps> = ({
  bazaar,
  onClose,
  isOpenToday,
  todayIndex,
  onOpenShoppingList,
}) => {
  const [copied, setCopied] = useState(false);

  if (!bazaar) return null;

  const dayNames = getBazaarDayNames(bazaar);
  const mapUrl = getMapReferenceUrl(bazaar);

  const handleCopyDetails = () => {
    const text = `${bazaar.name}\nTürü: ${bazaar.type}\nİl / İlçe: ${bazaar.city} / ${bazaar.district}${bazaar.neighborhood ? ` (${bazaar.neighborhood})` : ''}\nKuruluş Günleri: ${dayNames.join(', ')}\nAdres: ${bazaar.address}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const halGovTrUrl = `https://www.hal.gov.tr/Sayfalar/Pazar-Yerleri.aspx?sid=${bazaar.plate}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isOpenToday
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOpenToday ? 'bg-emerald-400' : 'bg-slate-500'
                  }`}
                />
                {isOpenToday ? 'Bugün Açık' : 'Bugün Kapalı'}
              </span>

              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                {bazaar.type || 'Semt Pazarı'}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white pt-1">
              {bazaar.name}
            </h2>
            <p className="text-xs text-slate-400">
              {bazaar.city} &bull; {bazaar.district}
              {bazaar.neighborhood ? ` (${bazaar.neighborhood})` : ''}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors shrink-0"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlighted "Kuruluş Günleri" with each day as distinct entry */}
        <div className="bg-orange-500/10 border border-orange-500/25 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-orange-400 font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Kuruluş Günleri (Açık Olduğu Günler)</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {bazaar.openDays.length} Gün Belirlendi
            </span>
          </div>

          {/* Distinct Day Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {bazaar.openDays.map((d) => {
              const isToday = d === todayIndex;
              const name = DAY_NAMES[d] || `Gün ${d}`;
              return (
                <div
                  key={d}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    isToday
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900 text-white border-slate-700'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  <span>{name}</span>
                  {isToday && (
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded-md font-extrabold">
                      Bugün Kuruluyor
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-300 pt-1 border-t border-orange-500/15">
            {isOpenToday
              ? 'Bu pazar bugün açıktır. Taze ürünler için ziyaret edebilirsiniz.'
              : `Bu pazar ${dayNames.join(' ve ')} günleri kurulmaktadır.`}
          </p>
        </div>

        {/* Location & Address Info with Map Reference Link */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              Adres ve Konum
            </h3>

            {/* Direct Map Reference Link */}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 text-xs hover:underline"
            >
              <span>Harita Referansını Aç</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-3">
            {/* Address clickable link */}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-sm text-slate-200 leading-relaxed hover:text-orange-300 transition-colors"
            >
              <span>{bazaar.address || 'Adres bilgisi sistemde kayıtlı değildir.'}</span>
              <div className="flex items-center gap-1 text-[11px] text-orange-400/80 mt-1 group-hover:underline">
                <MapPin className="w-3 h-3" />
                <span>Harita konumu referansını görüntüle &rarr;</span>
              </div>
            </a>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">İl:</span>
                <span className="font-semibold text-slate-300">{bazaar.city} (Plaka: {bazaar.plate})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">İlçe:</span>
                <span className="font-semibold text-slate-300">{bazaar.district || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Semt / Mahalle:</span>
                <span className="font-semibold text-slate-300">{bazaar.neighborhood || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Pazar Türü:</span>
                <span className="font-semibold text-slate-300">{bazaar.type || 'Semt Pazarı'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Official Source Banner */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-300">T.C. Ticaret Bakanlığı HKS</div>
              <div className="text-[11px] text-slate-500">hal.gov.tr resmi pazar yerleri kaydı</div>
            </div>
          </div>
          <a
            href={halGovTrUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 text-[11px] shrink-0"
          >
            <span>hal.gov.tr</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleCopyDetails}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-300" />
                <span>Bilgileri Kopyala</span>
              </>
            )}
          </button>

          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
          >
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>Haritada Aç</span>
          </a>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenShoppingList(bazaar.name);
            }}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Alışveriş Listem</span>
          </button>
        </div>
      </div>
    </div>
  );
};
