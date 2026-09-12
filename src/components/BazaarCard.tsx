import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Tag,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { BazaarItem } from '../types';
import { getBazaarDayNames, getMapReferenceUrl } from '../data/bazaars';

interface BazaarCardProps {
  bazaar: BazaarItem;
  onSelect: (bazaar: BazaarItem) => void;
  isOpenToday: boolean;
  todayIndex: number;
}

export const BazaarCard: React.FC<BazaarCardProps> = ({
  bazaar,
  onSelect,
  isOpenToday,
  todayIndex,
}) => {
  const [copied, setCopied] = useState(false);

  const dayNames = getBazaarDayNames(bazaar);
  const mapUrl = getMapReferenceUrl(bazaar);

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullText = `${bazaar.name}, ${bazaar.address}, ${bazaar.district}/${bazaar.city}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id={`bazaar-card-${bazaar.id}`}
      onClick={() => onSelect(bazaar)}
      className="bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md"
    >
      <div className="flex flex-col gap-2.5">
        {/* Top Badges & Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Open Today Status */}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isOpenToday
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700/50'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOpenToday ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              {isOpenToday ? 'Bugün Açık' : 'Bugün Kapalı'}
            </span>

            {/* Market Type */}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 flex items-center gap-1">
              <Tag className="w-3 h-3 text-orange-400" />
              {bazaar.type || 'Semt Pazarı'}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
            {bazaar.city} / {bazaar.district}
          </span>
        </div>

        {/* Market Name */}
        <div>
          <h3 className="font-bold text-white text-base leading-snug group-hover:text-orange-400 transition-colors">
            {bazaar.name}
          </h3>
          {bazaar.neighborhood && (
            <p className="text-xs text-slate-400 mt-0.5">
              Semt / Mahalle: <span className="text-slate-300 font-medium">{bazaar.neighborhood}</span>
            </p>
          )}
        </div>

        {/* Address Entry - Linked to Map Reference */}
        <div className="flex items-start justify-between gap-2 text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-start gap-1.5 flex-1 hover:text-orange-400 transition-colors group/addr"
            title="Harita referansını yeni sekmede aç"
          >
            <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5 group-hover/addr:scale-110 transition-transform" />
            <span className="line-clamp-2 leading-relaxed underline-offset-2 group-hover/addr:underline">
              {bazaar.address || `${bazaar.district}, ${bazaar.city}`}
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500 group-hover/addr:text-orange-400 shrink-0 mt-1" />
          </a>

          {/* Copy Address Button */}
          <button
            type="button"
            onClick={handleCopyAddress}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors shrink-0 bg-slate-900 border border-slate-800"
            title="Adresi Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* "Kuruluş Günleri" - Multiple Entries Handled Individually */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 text-[11px] font-medium">
              <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Kuruluş Günleri:</span>
            </span>

            <div className="flex items-center gap-1 text-slate-400 group-hover:text-orange-400 text-xs font-semibold transition-colors">
              <span>Detaylar</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Individual Day Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {bazaar.openDays.map((d) => {
              const isThisDayToday = d === todayIndex;
              const dayLabel = dayNames[bazaar.openDays.indexOf(d)] || `Gün ${d}`;
              return (
                <span
                  key={d}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    isThisDayToday
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 ring-1 ring-emerald-500/30 shadow-xs'
                      : 'bg-slate-950 text-slate-300 border border-slate-800'
                  }`}
                >
                  {isThisDayToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                  {dayLabel}
                  {isThisDayToday && <span className="text-[10px] text-emerald-300 font-semibold">(Bugün)</span>}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
