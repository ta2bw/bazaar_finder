import { Bazaar, BazaarWithComputedDistance, TravelMode } from '../types';

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

export function estimateTravelMinutes(
  distanceKm: number,
  mode: TravelMode
): number {
  const speeds: Record<TravelMode, number> = {
    driving: 28,
    walking: 4.8,
    transit: 22,
    bicycling: 14,
  };
  const hours = distanceKm / speeds[mode];
  return Math.max(1, Math.round(hours * 60));
}

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function computeBazaarStatus(
  bazaar: Bazaar,
  referenceDate: Date = new Date()
): {
  isOpenToday: boolean;
  isOpenNow: boolean;
  openingTimeToday?: string;
  closingTimeToday?: string;
  statusText: string;
  statusBadgeColor: 'emerald' | 'amber' | 'rose' | 'slate';
} {
  const currentDay = referenceDate.getDay();
  const currentMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes();

  const isOpenToday = bazaar.openDays.includes(currentDay);
  if (!isOpenToday) {
    return {
      isOpenToday: false,
      isOpenNow: false,
      statusText: 'Closed Today',
      statusBadgeColor: 'slate',
    };
  }

  const schedule = bazaar.schedule[currentDay] || { open: '08:00', close: '19:30' };
  const openMin = timeToMinutes(schedule.open);
  const closeMin = timeToMinutes(schedule.close);

  if (currentMinutes < openMin) {
    const diff = openMin - currentMinutes;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    const openInText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    return {
      isOpenToday: true,
      isOpenNow: false,
      openingTimeToday: schedule.open,
      closingTimeToday: schedule.close,
      statusText: `Opens at ${schedule.open} (in ${openInText})`,
      statusBadgeColor: 'amber',
    };
  } else if (currentMinutes >= openMin && currentMinutes <= closeMin) {
    const remaining = closeMin - currentMinutes;
    if (remaining <= 45) {
      return {
        isOpenToday: true,
        isOpenNow: true,
        openingTimeToday: schedule.open,
        closingTimeToday: schedule.close,
        statusText: `Closing soon (${remaining}m left)`,
        statusBadgeColor: 'amber',
      };
    } else {
      return {
        isOpenToday: true,
        isOpenNow: true,
        openingTimeToday: schedule.open,
        closingTimeToday: schedule.close,
        statusText: `Open Now · Closes at ${schedule.close}`,
        statusBadgeColor: 'emerald',
      };
    }
  } else {
    return {
      isOpenToday: true,
      isOpenNow: false,
      openingTimeToday: schedule.open,
      closingTimeToday: schedule.close,
      statusText: `Closed for today (at ${schedule.close})`,
      statusBadgeColor: 'rose',
    };
  }
}

export function enrichBazaarWithDistance(
  bazaar: Bazaar,
  userLat: number,
  userLng: number,
  referenceDate: Date = new Date()
): BazaarWithComputedDistance {
  const distKm = calculateDistanceKm(userLat, userLng, bazaar.lat, bazaar.lng);
  const status = computeBazaarStatus(bazaar, referenceDate);

  return {
    ...bazaar,
    distanceKm: distKm,
    distanceFormatted: formatDistance(distKm),
    walkingMinutes: estimateTravelMinutes(distKm, 'walking'),
    drivingMinutes: estimateTravelMinutes(distKm, 'driving'),
    ...status,
  };
}

export function getGoogleMapsNavigationUrl(
  destinationLat: number,
  destinationLng: number,
  travelMode: TravelMode = 'driving'
): string {
  const modeParamMap: Record<TravelMode, string> = {
    driving: 'driving',
    walking: 'walking',
    transit: 'transit',
    bicycling: 'bicycling',
  };
  const destination = `${destinationLat},${destinationLng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=${modeParamMap[travelMode]}&dir_action=navigate`;
}

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const DAY_SHORT_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
