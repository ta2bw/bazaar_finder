export interface TurkeyProvince {
  plate: number;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  popular?: boolean;
}

export const TURKEY_PROVINCES: TurkeyProvince[] = [
  { plate: 1, name: 'ADANA', displayName: 'Adana', lat: 37.0, lng: 35.3213 },
  { plate: 2, name: 'ADIYAMAN', displayName: 'Adıyaman', lat: 37.7648, lng: 38.2786 },
  { plate: 3, name: 'AFYONKARAHİSAR', displayName: 'Afyonkarahisar', lat: 38.7507, lng: 30.5567 },
  { plate: 4, name: 'AĞRI', displayName: 'Ağrı', lat: 39.7191, lng: 43.0503 },
  { plate: 5, name: 'AMASYA', displayName: 'Amasya', lat: 40.6534, lng: 35.8331 },
  { plate: 6, name: 'ANKARA', displayName: 'Ankara', lat: 39.9334, lng: 32.8597, popular: true },
  { plate: 7, name: 'ANTALYA', displayName: 'Antalya', lat: 36.8969, lng: 30.7133, popular: true },
  { plate: 8, name: 'ARTVİN', displayName: 'Artvin', lat: 41.1828, lng: 41.8183 },
  { plate: 9, name: 'AYDIN', displayName: 'Aydın', lat: 37.856, lng: 27.8416 },
  { plate: 10, name: 'BALIKESİR', displayName: 'Balıkesir', lat: 39.6484, lng: 27.8826 },
  { plate: 11, name: 'BİLECİK', displayName: 'Bilecik', lat: 40.1426, lng: 29.9793 },
  { plate: 12, name: 'BİNGÖL', displayName: 'Bingöl', lat: 38.8854, lng: 40.4983 },
  { plate: 13, name: 'BİTLİS', displayName: 'Bitlis', lat: 38.3938, lng: 42.1232 },
  { plate: 14, name: 'BOLU', displayName: 'Bolu', lat: 40.7392, lng: 31.6089 },
  { plate: 15, name: 'BURDUR', displayName: 'Burdur', lat: 37.7203, lng: 30.2908 },
  { plate: 16, name: 'BURSA', displayName: 'Bursa', lat: 40.1885, lng: 29.061, popular: true },
  { plate: 17, name: 'ÇANAKKALE', displayName: 'Çanakkale', lat: 40.1553, lng: 26.4142 },
  { plate: 18, name: 'ÇANKIRI', displayName: 'Çankırı', lat: 40.6013, lng: 33.6134 },
  { plate: 19, name: 'ÇORUM', displayName: 'Çorum', lat: 40.5506, lng: 34.9556 },
  { plate: 20, name: 'DENİZLİ', displayName: 'Denizli', lat: 37.7765, lng: 29.0864 },
  { plate: 21, name: 'DİYARBAKIR', displayName: 'Diyarbakır', lat: 37.9144, lng: 40.2306, popular: true },
  { plate: 22, name: 'EDİRNE', displayName: 'Edirne', lat: 41.6772, lng: 26.5557 },
  { plate: 23, name: 'ELAZIĞ', displayName: 'Elazığ', lat: 38.681, lng: 39.2264 },
  { plate: 24, name: 'ERZİNCAN', displayName: 'Erzincan', lat: 39.75, lng: 39.5 },
  { plate: 25, name: 'ERZURUM', displayName: 'Erzurum', lat: 39.9055, lng: 41.2658 },
  { plate: 26, name: 'ESKİŞEHİR', displayName: 'Eskişehir', lat: 39.7767, lng: 30.5206, popular: true },
  { plate: 27, name: 'GAZİANTEP', displayName: 'Gaziantep', lat: 37.0662, lng: 37.3833, popular: true },
  { plate: 28, name: 'GİRESUN', displayName: 'Giresun', lat: 40.9128, lng: 38.3895 },
  { plate: 29, name: 'GÜMÜŞHANE', displayName: 'Gümüşhane', lat: 40.4608, lng: 39.4817 },
  { plate: 30, name: 'HAKKARİ', displayName: 'Hakkari', lat: 37.5833, lng: 43.7333 },
  { plate: 31, name: 'HATAY', displayName: 'Hatay', lat: 36.4018, lng: 36.3498 },
  { plate: 32, name: 'ISPARTA', displayName: 'Isparta', lat: 37.7648, lng: 30.5566 },
  { plate: 33, name: 'MERSİN', displayName: 'Mersin', lat: 36.8121, lng: 34.6415 },
  { plate: 34, name: 'İSTANBUL', displayName: 'İstanbul', lat: 41.0082, lng: 28.9784, popular: true },
  { plate: 35, name: 'İZMİR', displayName: 'İzmir', lat: 38.4192, lng: 27.1287, popular: true },
  { plate: 36, name: 'KARS', displayName: 'Kars', lat: 40.6167, lng: 43.1 },
  { plate: 37, name: 'KASTAMONU', displayName: 'Kastamonu', lat: 41.3887, lng: 33.7827 },
  { plate: 38, name: 'KAYSERİ', displayName: 'Kayseri', lat: 38.7312, lng: 35.4787, popular: true },
  { plate: 39, name: 'KIRKLARELİ', displayName: 'Kırklareli', lat: 41.7333, lng: 27.2167 },
  { plate: 40, name: 'KIRŞEHİR', displayName: 'Kırşehir', lat: 39.1425, lng: 34.1709 },
  { plate: 41, name: 'KOCAELİ', displayName: 'Kocaeli', lat: 40.8533, lng: 29.8815, popular: true },
  { plate: 42, name: 'KONYA', displayName: 'Konya', lat: 37.8667, lng: 32.4833, popular: true },
  { plate: 43, name: 'KÜTAHYA', displayName: 'Kütahya', lat: 39.4167, lng: 29.9833 },
  { plate: 44, name: 'MALATYA', displayName: 'Malatya', lat: 38.3552, lng: 38.3095 },
  { plate: 45, name: 'MANİSA', displayName: 'Manisa', lat: 38.6191, lng: 27.4289 },
  { plate: 46, name: 'KAHRAMANMARAŞ', displayName: 'Kahramanmaraş', lat: 37.5858, lng: 36.9371 },
  { plate: 47, name: 'MARDİN', displayName: 'Mardin', lat: 37.3212, lng: 40.7245 },
  { plate: 48, name: 'MUĞLA', displayName: 'Muğla', lat: 37.2153, lng: 28.3636, popular: true },
  { plate: 49, name: 'MUŞ', displayName: 'Muş', lat: 38.7432, lng: 41.5064 },
  { plate: 50, name: 'NEVŞEHİR', displayName: 'Nevşehir', lat: 38.6244, lng: 34.7142 },
  { plate: 51, name: 'NİĞDE', displayName: 'Niğde', lat: 37.9667, lng: 34.6833 },
  { plate: 52, name: 'ORDU', displayName: 'Ordu', lat: 40.9839, lng: 37.8764 },
  { plate: 53, name: 'RİZE', displayName: 'Rize', lat: 41.0201, lng: 40.5234 },
  { plate: 54, name: 'SAKARYA', displayName: 'Sakarya', lat: 40.7569, lng: 30.3783 },
  { plate: 55, name: 'SAMSUN', displayName: 'SAMSUN', lat: 41.2867, lng: 36.33, popular: true },
  { plate: 56, name: 'SİİRT', displayName: 'Siirt', lat: 37.9333, lng: 41.95 },
  { plate: 57, name: 'SİNOP', displayName: 'Sinop', lat: 42.0231, lng: 35.1531 },
  { plate: 58, name: 'SİVAS', displayName: 'Sivas', lat: 39.7477, lng: 37.0179 },
  { plate: 59, name: 'TEKİRDAĞ', displayName: 'Tekirdağ', lat: 40.9833, lng: 27.5167 },
  { plate: 60, name: 'TOKAT', displayName: 'Tokat', lat: 40.3167, lng: 36.55 },
  { plate: 61, name: 'TRABZON', displayName: 'Trabzon', lat: 41.0027, lng: 39.7168, popular: true },
  { plate: 62, name: 'TUNCELİ', displayName: 'Tunceli', lat: 39.1079, lng: 39.5401 },
  { plate: 63, name: 'ŞANLIURFA', displayName: 'Şanlıurfa', lat: 37.1674, lng: 38.7955, popular: true },
  { plate: 64, name: 'UŞAK', displayName: 'Uşak', lat: 38.6823, lng: 29.4082 },
  { plate: 65, name: 'VAN', displayName: 'Van', lat: 38.4891, lng: 43.4089 },
  { plate: 66, name: 'YOZGAT', displayName: 'Yozgat', lat: 39.8181, lng: 34.8147 },
  { plate: 67, name: 'ZONGULDAK', displayName: 'Zonguldak', lat: 41.4564, lng: 31.7987 },
  { plate: 68, name: 'AKSARAY', displayName: 'Aksaray', lat: 38.3687, lng: 34.037 },
  { plate: 69, name: 'BAYBURT', displayName: 'Bayburt', lat: 40.2552, lng: 40.2249 },
  { plate: 70, name: 'KARAMAN', displayName: 'Karaman', lat: 37.1759, lng: 33.2287 },
  { plate: 71, name: 'KIRIKKALE', displayName: 'Kırıkkale', lat: 39.8468, lng: 33.5153 },
  { plate: 72, name: 'BATMAN', displayName: 'Batman', lat: 37.8812, lng: 41.1292 },
  { plate: 73, name: 'ŞIRNAK', displayName: 'Şırnak', lat: 37.5164, lng: 42.4595 },
  { plate: 74, name: 'BARTIN', displayName: 'Bartın', lat: 41.6344, lng: 32.3375 },
  { plate: 75, name: 'ARDAHAN', displayName: 'Ardahan', lat: 41.1105, lng: 42.7022 },
  { plate: 76, name: 'IĞDIR', displayName: 'Iğdır', lat: 39.9196, lng: 44.0454 },
  { plate: 77, name: 'YALOVA', displayName: 'Yalova', lat: 40.655, lng: 29.2769 },
  { plate: 78, name: 'KARABÜK', displayName: 'Karabük', lat: 41.2061, lng: 32.6204 },
  { plate: 79, name: 'KİLİS', displayName: 'Kilis', lat: 36.7184, lng: 37.1212 },
  { plate: 80, name: 'OSMANİYE', displayName: 'Osmaniye', lat: 37.0742, lng: 36.2467 },
  { plate: 81, name: 'DÜZCE', displayName: 'Düzce', lat: 40.8438, lng: 31.1565 },
];

export function getProvinceByPlate(plate: number): TurkeyProvince | undefined {
  return TURKEY_PROVINCES.find((p) => p.plate === plate);
}

export function getProvinceByName(name: string): TurkeyProvince | undefined {
  const norm = name.trim().toUpperCase();
  return TURKEY_PROVINCES.find(
    (p) => p.name === norm || p.displayName.toUpperCase() === norm
  );
}
