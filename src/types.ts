export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  tags?: string[];
  helpfulCount: number;
}

export type ParkingType =
  | 'dedicated_lot'
  | 'multistorey_garage'
  | 'street_parking'
  | 'nearby_garage'
  | 'no_parking';

export interface ParkingFacility {
  available: boolean;
  type: ParkingType;
  title: string;
  details: string;
  capacity?: string;
  fee?: string;
  walkingDistance?: string;
  tips?: string;
}

export interface BazaarFeatures {
  groceries: boolean;
  textiles: boolean;
  food: boolean;
  antiques?: boolean;
  handicrafts?: boolean;
  spices?: boolean;
}

export interface BazaarFeatureDescriptions {
  groceries?: string;
  textiles?: string;
  food?: string;
  specialties?: string[];
}

export interface DaySchedule {
  open: string;  // e.g. "08:00"
  close: string; // e.g. "19:30"
}

export interface Bazaar {
  id: string;
  name: string;
  localName?: string;
  city: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  image: string;
  // Days of week it is open: 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  openDays: number[];
  // Specific schedules per active day (e.g., Tuesday market may have different hours from Friday)
  schedule: {
    [dayOfWeek: number]: DaySchedule;
  };
  features: BazaarFeatures;
  featureDescriptions: BazaarFeatureDescriptions;
  parking: ParkingFacility;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export interface UserLocation {
  lat: number;
  lng: number;
  name: string;
  accuracy?: number;
  isSimulated?: boolean;
}

export interface BazaarWithComputedDistance extends Bazaar {
  distanceKm: number;
  distanceFormatted: string;
  walkingMinutes: number;
  drivingMinutes: number;
  isOpenToday: boolean;
  isOpenNow: boolean;
  openingTimeToday?: string;
  closingTimeToday?: string;
  statusText: string;
  statusBadgeColor: 'emerald' | 'amber' | 'rose' | 'slate';
}

export type TravelMode = 'driving' | 'walking' | 'transit' | 'bicycling';
