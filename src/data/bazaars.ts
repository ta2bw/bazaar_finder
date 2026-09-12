import allBazaarsRaw from './allBazaars.json';
import { BazaarItem } from '../types';

export const OFFLINE_BAZAARS: BazaarItem[] = allBazaarsRaw as BazaarItem[];

export const DAY_NAMES = [
  'Pazar',
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
];

export const DAY_NAMES_SHORT = [
  'Paz',
  'Pzt',
  'Sal',
  'Çrş',
  'Prş',
  'Cum',
  'Cmt',
];

/**
 * Returns clean array of full day names for a bazaar
 */
export function getBazaarDayNames(bazaar: BazaarItem): string[] {
  if (Array.isArray(bazaar.openDays) && bazaar.openDays.length > 0) {
    return bazaar.openDays.map((d) => DAY_NAMES[d] || `Gün ${d}`);
  }

  // Fallback to parsing daysRaw if openDays is empty
  if (bazaar.daysRaw) {
    return bazaar.daysRaw
      .split(/[,;\/\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return ['Belirtilmemiş'];
}

/**
 * Formats full address to a safe Google Maps reference link
 */
export function getMapReferenceUrl(bazaar: BazaarItem): string {
  const queryParts = [
    bazaar.name,
    bazaar.address,
    bazaar.neighborhood,
    bazaar.district,
    bazaar.city,
    'Türkiye',
  ].filter(Boolean);

  const query = encodeURIComponent(queryParts.join(', '));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
