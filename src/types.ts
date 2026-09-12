export interface BazaarItem {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  district: string;
  neighborhood?: string;
  daysRaw: string; // "Kuruluş Günleri" field from hal.gov.tr
  openDays: number[]; // [0 = Pazar, 1 = Pzt, 2 = Salı, 3 = Çrş, 4 = Prş, 5 = Cuma, 6 = Cmt]
  plate: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'Sebze' | 'Meyve' | 'Yeşillik' | 'Şarküteri' | 'Kuru Gıda' | 'Diğer';
  quantity?: string;
  bazaarName?: string;
  createdAt: number;
}

export interface ProvinceInfo {
  plate: number;
  name: string;
  displayName: string;
  count?: number;
}
