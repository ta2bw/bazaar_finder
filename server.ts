import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory cache for parsed bazaars per province license plate (sid)
const bazaarCache: Record<number, any[]> = {};

const DAY_MAP: Record<string, number> = {
  pzt: 1,
  pazartesi: 1,
  sal: 2,
  salı: 2,
  sali: 2,
  çrş: 3,
  crs: 3,
  çarşamba: 3,
  carsamba: 3,
  prş: 4,
  prs: 4,
  perşembe: 4,
  persembe: 4,
  cum: 5,
  cuma: 5,
  cmt: 6,
  cumartesi: 6,
  paz: 0,
  pazar: 0,
};

const DAY_NAMES_TR = [
  'Pazar',
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
];

const PROVINCE_NAMES: Record<number, { name: string; displayName: string; lat: number; lng: number }> = {
  1: { name: 'ADANA', displayName: 'Adana', lat: 37.0, lng: 35.3213 },
  2: { name: 'ADIYAMAN', displayName: 'Adıyaman', lat: 37.7648, lng: 38.2786 },
  3: { name: 'AFYONKARAHİSAR', displayName: 'Afyonkarahisar', lat: 38.7507, lng: 30.5567 },
  4: { name: 'AĞRI', displayName: 'Ağrı', lat: 39.7191, lng: 43.0503 },
  5: { name: 'AMASYA', displayName: 'Amasya', lat: 40.6534, lng: 35.8331 },
  6: { name: 'ANKARA', displayName: 'Ankara', lat: 39.9334, lng: 32.8597 },
  7: { name: 'ANTALYA', displayName: 'Antalya', lat: 36.8969, lng: 30.7133 },
  8: { name: 'ARTVİN', displayName: 'Artvin', lat: 41.1828, lng: 41.8183 },
  9: { name: 'AYDIN', displayName: 'Aydın', lat: 37.856, lng: 27.8416 },
  10: { name: 'BALIKESİR', displayName: 'Balıkesir', lat: 39.6484, lng: 27.8826 },
  11: { name: 'BİLECİK', displayName: 'Bilecik', lat: 40.1426, lng: 29.9793 },
  12: { name: 'BİNGÖL', displayName: 'Bingöl', lat: 38.8854, lng: 40.4983 },
  13: { name: 'BİTLİS', displayName: 'Bitlis', lat: 38.3938, lng: 42.1232 },
  14: { name: 'BOLU', displayName: 'Bolu', lat: 40.7392, lng: 31.6089 },
  15: { name: 'BURDUR', displayName: 'Burdur', lat: 37.7203, lng: 30.2908 },
  16: { name: 'BURSA', displayName: 'Bursa', lat: 40.1885, lng: 29.061 },
  17: { name: 'ÇANAKKALE', displayName: 'Çanakkale', lat: 40.1553, lng: 26.4142 },
  18: { name: 'ÇANKIRI', displayName: 'Çankırı', lat: 40.6013, lng: 33.6134 },
  19: { name: 'ÇORUM', displayName: 'Çorum', lat: 40.5506, lng: 34.9556 },
  20: { name: 'DENİZLİ', displayName: 'Denizli', lat: 37.7765, lng: 29.0864 },
  21: { name: 'DİYARBAKIR', displayName: 'Diyarbakır', lat: 37.9144, lng: 40.2306 },
  22: { name: 'EDİRNE', displayName: 'Edirne', lat: 41.6772, lng: 26.5557 },
  23: { name: 'ELAZIĞ', displayName: 'Elazığ', lat: 38.681, lng: 39.2264 },
  24: { name: 'ERZİNCAN', displayName: 'Erzincan', lat: 39.75, lng: 39.5 },
  25: { name: 'ERZURUM', displayName: 'Erzurum', lat: 39.9055, lng: 41.2658 },
  26: { name: 'ESKİŞEHİR', displayName: 'Eskişehir', lat: 39.7767, lng: 30.5206 },
  27: { name: 'GAZİANTEP', displayName: 'Gaziantep', lat: 37.0662, lng: 37.3833 },
  28: { name: 'GİRESUN', displayName: 'Giresun', lat: 40.9128, lng: 38.3895 },
  29: { name: 'GÜMÜŞHANE', displayName: 'Gümüşhane', lat: 40.4608, lng: 39.4817 },
  30: { name: 'HAKKARİ', displayName: 'Hakkari', lat: 37.5833, lng: 43.7333 },
  31: { name: 'HATAY', displayName: 'Hatay', lat: 36.4018, lng: 36.3498 },
  32: { name: 'ISPARTA', displayName: 'Isparta', lat: 37.7648, lng: 30.5566 },
  33: { name: 'MERSİN', displayName: 'Mersin', lat: 36.8121, lng: 34.6415 },
  34: { name: 'İSTANBUL', displayName: 'İstanbul', lat: 41.0082, lng: 28.9784 },
  35: { name: 'İZMİR', displayName: 'İzmir', lat: 38.4192, lng: 27.1287 },
  36: { name: 'KARS', displayName: 'Kars', lat: 40.6167, lng: 43.1 },
  37: { name: 'KASTAMONU', displayName: 'Kastamonu', lat: 41.3887, lng: 33.7827 },
  38: { name: 'KAYSERİ', displayName: 'Kayseri', lat: 38.7312, lng: 35.4787 },
  39: { name: 'KIRKLARELİ', displayName: 'Kırklareli', lat: 41.7333, lng: 27.2167 },
  40: { name: 'KIRŞEHİR', displayName: 'Kırşehir', lat: 39.1425, lng: 34.1709 },
  41: { name: 'KOCAELİ', displayName: 'Kocaeli', lat: 40.8533, lng: 29.8815 },
  42: { name: 'KONYA', displayName: 'Konya', lat: 37.8667, lng: 32.4833 },
  43: { name: 'KÜTAHYA', displayName: 'Kütahya', lat: 39.4167, lng: 29.9833 },
  44: { name: 'MALATYA', displayName: 'Malatya', lat: 38.3552, lng: 38.3095 },
  45: { name: 'MANİSA', displayName: 'Manisa', lat: 38.6191, lng: 27.4289 },
  46: { name: 'KAHRAMANMARAŞ', displayName: 'Kahramanmaraş', lat: 37.5858, lng: 36.9371 },
  47: { name: 'MARDİN', displayName: 'Mardin', lat: 37.3212, lng: 40.7245 },
  48: { name: 'MUĞLA', displayName: 'Muğla', lat: 37.2153, lng: 28.3636 },
  49: { name: 'MUŞ', displayName: 'Muş', lat: 38.7432, lng: 41.5064 },
  50: { name: 'NEVŞEHİR', displayName: 'Nevşehir', lat: 38.6244, lng: 34.7142 },
  51: { name: 'NİĞDE', displayName: 'Niğde', lat: 37.9667, lng: 34.6833 },
  52: { name: 'ORDU', displayName: 'Ordu', lat: 40.9839, lng: 37.8764 },
  53: { name: 'RİZE', displayName: 'Rize', lat: 41.0201, lng: 40.5234 },
  54: { name: 'SAKARYA', displayName: 'Sakarya', lat: 40.7569, lng: 30.3783 },
  55: { name: 'SAMSUN', displayName: 'Samsun', lat: 41.2867, lng: 36.33 },
  56: { name: 'SİİRT', displayName: 'Siirt', lat: 37.9333, lng: 41.95 },
  57: { name: 'SİNOP', displayName: 'Sinop', lat: 42.0231, lng: 35.1531 },
  58: { name: 'SİVAS', displayName: 'Sivas', lat: 39.7477, lng: 37.0179 },
  59: { name: 'TEKİRDAĞ', displayName: 'Tekirdağ', lat: 40.9833, lng: 27.5167 },
  60: { name: 'TOKAT', displayName: 'Tokat', lat: 40.3167, lng: 36.55 },
  61: { name: 'TRABZON', displayName: 'Trabzon', lat: 41.0027, lng: 39.7168 },
  62: { name: 'TUNCELİ', displayName: 'Tunceli', lat: 39.1079, lng: 39.5401 },
  63: { name: 'ŞANLIURFA', displayName: 'Şanlıurfa', lat: 37.1674, lng: 38.7955 },
  64: { name: 'UŞAK', displayName: 'Uşak', lat: 38.6823, lng: 29.4082 },
  65: { name: 'VAN', displayName: 'Van', lat: 38.4891, lng: 43.4089 },
  66: { name: 'YOZGAT', displayName: 'Yozgat', lat: 39.8181, lng: 34.8147 },
  67: { name: 'ZONGULDAK', displayName: 'Zonguldak', lat: 41.4564, lng: 31.7987 },
  68: { name: 'AKSARAY', displayName: 'Aksaray', lat: 38.3687, lng: 34.037 },
  69: { name: 'BAYBURT', displayName: 'Bayburt', lat: 40.2552, lng: 40.2249 },
  70: { name: 'KARAMAN', displayName: 'Karaman', lat: 37.1759, lng: 33.2287 },
  71: { name: 'KIRIKKALE', displayName: 'Kırıkkale', lat: 39.8468, lng: 33.5153 },
  72: { name: 'BATMAN', displayName: 'Batman', lat: 37.8812, lng: 41.1292 },
  73: { name: 'ŞIRNAK', displayName: 'Şırnak', lat: 37.5164, lng: 42.4595 },
  74: { name: 'BARTIN', displayName: 'Bartın', lat: 41.6344, lng: 32.3375 },
  75: { name: 'ARDAHAN', displayName: 'Ardahan', lat: 41.1105, lng: 42.7022 },
  76: { name: 'IĞDIR', displayName: 'Iğdır', lat: 39.9196, lng: 44.0454 },
  77: { name: 'YALOVA', displayName: 'Yalova', lat: 40.655, lng: 29.2769 },
  78: { name: 'KARABÜK', displayName: 'Karabük', lat: 41.2061, lng: 32.6204 },
  79: { name: 'KİLİS', displayName: 'Kilis', lat: 36.7184, lng: 37.1212 },
  80: { name: 'OSMANİYE', displayName: 'Osmaniye', lat: 37.0742, lng: 36.2467 },
  81: { name: 'DÜZCE', displayName: 'Düzce', lat: 40.8438, lng: 31.1565 },
};

function parseDays(dayStr: string): number[] {
  if (!dayStr) return [1];
  const parts = dayStr.split(/[,;\/\s]+/).filter(Boolean);
  const result: number[] = [];
  for (const p of parts) {
    const clean = p.trim().toLowerCase();
    for (const [k, v] of Object.entries(DAY_MAP)) {
      if (clean.startsWith(k) || clean === k) {
        if (!result.includes(v)) result.push(v);
        break;
      }
    }
  }
  return result.length > 0 ? result.sort((a, b) => a - b) : [1];
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Fetch and parse official bazaar table from hal.gov.tr
function fetchHalBazaars(sid: number): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const url = `https://www.hal.gov.tr/Sayfalar/Pazar-Yerleri.aspx?sid=${sid}`;
    const req = https.get(url, { rejectUnauthorized: false, timeout: 12000 }, (res) => {
      let html = '';
      res.on('data', (chunk) => (html += chunk));
      res.on('end', () => {
        try {
          const bazaars: any[] = [];
          const trRegex = /<tr[\s\S]*?<\/tr>/gi;
          let trMatch;
          let idx = 1;

          const province = PROVINCE_NAMES[sid] || {
            name: 'TÜRKİYE',
            displayName: 'Türkiye',
            lat: 39.9334,
            lng: 32.8597,
          };

          while ((trMatch = trRegex.exec(html)) !== null) {
            const trContent = trMatch[0];
            const tdRegex = /<td[\s\S]*?<\/td>/gi;
            const tds: string[] = [];
            let tdMatch;
            while ((tdMatch = tdRegex.exec(trContent)) !== null) {
              const text = tdMatch[0]
                .replace(/<[^>]+>/g, ' ')
                .replace(/&nbsp;/g, ' ')
                .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
                .trim();
              tds.push(text);
            }

            if (tds.length >= 7 && !tds[0].includes('Pazar Adı') && tds[3]) {
              const rawName = tds[0].trim();
              const type = tds[1].trim();
              const address = tds[2].trim();
              const city = tds[3].trim() || province.displayName;
              const district = tds[4].trim();
              const neighborhood = tds[5].trim();
              const daysStr = tds[6].trim();
              const openDays = parseDays(daysStr);

              const h = hashCode(rawName + district + address);
              const latOffset = ((h % 160) - 80) * 0.0006;
              const lngOffset = (((h >> 3) % 160) - 80) * 0.0008;

              const lat = Math.round((province.lat + latOffset) * 100000) / 100000;
              const lng = Math.round((province.lng + lngOffset) * 100000) / 100000;

              const isClosedMarket = rawName.toUpperCase().includes('KAPALI');
              const isOrganic =
                rawName.toUpperCase().includes('ORGANİK') || type.includes('Organik');
              const isFarmer = type.includes('Üretici');
              const isSosyete =
                rawName.toUpperCase().includes('SOSYETE') ||
                rawName.toUpperCase().includes('GİYİM') ||
                rawName.toUpperCase().includes('TEKSTİL');

              const daysTurkish = openDays.map((d) => DAY_NAMES_TR[d]).join(', ');
              const schedule: Record<number, { open: string; close: string }> = {};
              openDays.forEach((d) => {
                schedule[d] = { open: '08:00', close: '19:30' };
              });

              const id = `hal-${sid}-${idx++}`;

              bazaars.push({
                id,
                name: rawName,
                type: type || 'Semt Pazarı',
                address,
                city: province.displayName,
                district: district ? district.charAt(0).toUpperCase() + district.slice(1).toLowerCase() : province.displayName,
                neighborhood,
                daysRaw: daysStr,
                openDays,
                plate: sid,
              });
            }
          }

          resolve(bazaars);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('hal.gov.tr request timeout'));
    });
  });
}

// Seed cache from full offline dataset (allBazaars.json)
try {
  const allBazaarsPath = path.join(process.cwd(), 'src', 'data', 'allBazaars.json');
  if (fs.existsSync(allBazaarsPath)) {
    const raw = fs.readFileSync(allBazaarsPath, 'utf-8');
    const parsed = JSON.parse(raw);
    for (const bz of parsed) {
      if (!bazaarCache[bz.plate]) bazaarCache[bz.plate] = [];
      bazaarCache[bz.plate].push(bz);
    }
    console.log(`Loaded ${parsed.length} total bazaars from offline dataset into server cache.`);
  }
} catch (e) {
  console.error('Error loading offline allBazaars.json:', e);
}

// ==========================================
// API ROUTES
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// List all 81 Turkish provinces and plate codes
app.get('/api/cities', (req, res) => {
  const list = Object.entries(PROVINCE_NAMES).map(([plate, info]) => ({
    plate: Number(plate),
    name: info.name,
    displayName: info.displayName,
    lat: info.lat,
    lng: info.lng,
    cachedCount: bazaarCache[Number(plate)] ? bazaarCache[Number(plate)].length : 0,
    url: `https://www.hal.gov.tr/Sayfalar/Pazar-Yerleri.aspx?sid=${plate}`,
  }));
  res.json({ success: true, total: list.length, cities: list });
});

// Fetch bazaars for specific plate code (sid)
app.get('/api/bazaars', async (req, res) => {
  const sidParam = req.query.sid || req.query.plate || '6';
  const sid = parseInt(sidParam as string, 10);
  const forceRefresh = req.query.refresh === 'true';

  if (isNaN(sid) || sid < 1 || sid > 81) {
    return res.status(400).json({
      error: 'Geçersiz plaka kodu (1-81 arasında olmalıdır). Ankara için sid=6 giriniz.',
    });
  }

  const province = PROVINCE_NAMES[sid] || {
    name: 'TÜRKİYE',
    displayName: `İl (Plaka: ${sid})`,
    lat: 39.9334,
    lng: 32.8597,
  };

  // Check cache first
  if (!forceRefresh && bazaarCache[sid] && bazaarCache[sid].length > 0) {
    return res.json({
      success: true,
      fromCache: true,
      plate: sid,
      city: province.displayName,
      totalCount: bazaarCache[sid].length,
      sourceUrl: `https://www.hal.gov.tr/Sayfalar/Pazar-Yerleri.aspx?sid=${sid}`,
      bazaars: bazaarCache[sid],
    });
  }

  try {
    console.log(`Fetching live bazaars from hal.gov.tr for sid=${sid} (${province.displayName})...`);
    const bazaars = await fetchHalBazaars(sid);

    if (bazaars.length > 0) {
      bazaarCache[sid] = bazaars;
    }

    return res.json({
      success: true,
      fromCache: false,
      plate: sid,
      city: province.displayName,
      totalCount: bazaars.length,
      sourceUrl: `https://www.hal.gov.tr/Sayfalar/Pazar-Yerleri.aspx?sid=${sid}`,
      bazaars: bazaars.length > 0 ? bazaars : bazaarCache[sid] || [],
    });
  } catch (err: any) {
    console.error(`Error fetching hal.gov.tr for sid=${sid}:`, err.message);

    // Fallback to cache if available
    if (bazaarCache[sid] && bazaarCache[sid].length > 0) {
      return res.json({
        success: true,
        fromCache: true,
        fallback: true,
        warning: 'hal.gov.tr bağlantısı kurulamadı, mevcut önbellek gösteriliyor.',
        plate: sid,
        city: province.displayName,
        totalCount: bazaarCache[sid].length,
        sourceUrl: `https://www.hal.gov.tr/Sayfalar/Pazar-Yerleri.aspx?sid=${sid}`,
        bazaars: bazaarCache[sid],
      });
    }

    return res.status(502).json({
      success: false,
      error: `hal.gov.tr'den veri çekilemedi: ${err.message}`,
      plate: sid,
      city: province.displayName,
      sourceUrl: `https://www.hal.gov.tr/Sayfalar/Pazar-Yerleri.aspx?sid=${sid}`,
    });
  }
});

// ==========================================
// VITE MIDDLEWARE / SPA SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bazaar Finder server running on port ${PORT}`);
  });
}

startServer();
