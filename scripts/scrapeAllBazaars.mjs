import https from 'https';
import fs from 'fs';
import path from 'path';

const PROVINCES = [
  { plate: 1, name: 'ADANA', displayName: 'Adana' },
  { plate: 2, name: 'ADIYAMAN', displayName: 'Adıyaman' },
  { plate: 3, name: 'AFYONKARAHİSAR', displayName: 'Afyonkarahisar' },
  { plate: 4, name: 'AĞRI', displayName: 'Ağrı' },
  { plate: 5, name: 'AMASYA', displayName: 'Amasya' },
  { plate: 6, name: 'ANKARA', displayName: 'Ankara' },
  { plate: 7, name: 'ANTALYA', displayName: 'Antalya' },
  { plate: 8, name: 'ARTVİN', displayName: 'Artvin' },
  { plate: 9, name: 'AYDIN', displayName: 'Aydın' },
  { plate: 10, name: 'BALIKESİR', displayName: 'Balıkesir' },
  { plate: 11, name: 'BİLECİK', displayName: 'Bilecik' },
  { plate: 12, name: 'BİNGÖL', displayName: 'Bingöl' },
  { plate: 13, name: 'BİTLİS', displayName: 'Bitlis' },
  { plate: 14, name: 'BOLU', displayName: 'Bolu' },
  { plate: 15, name: 'BURDUR', displayName: 'Burdur' },
  { plate: 16, name: 'BURSA', displayName: 'Bursa' },
  { plate: 17, name: 'ÇANAKKALE', displayName: 'Çanakkale' },
  { plate: 18, name: 'ÇANKIRI', displayName: 'Çankırı' },
  { plate: 19, name: 'ÇORUM', displayName: 'Çorum' },
  { plate: 20, name: 'DENİZLİ', displayName: 'Denizli' },
  { plate: 21, name: 'DİYARBAKIR', displayName: 'Diyarbakır' },
  { plate: 22, name: 'EDİRNE', displayName: 'Edirne' },
  { plate: 23, name: 'ELAZIĞ', displayName: 'Elazığ' },
  { plate: 24, name: 'ERZİNCAN', displayName: 'Erzincan' },
  { plate: 25, name: 'ERZURUM', displayName: 'Erzurum' },
  { plate: 26, name: 'ESKİŞEHİR', displayName: 'Eskişehir' },
  { plate: 27, name: 'GAZİANTEP', displayName: 'Gaziantep' },
  { plate: 28, name: 'GİRESUN', displayName: 'Giresun' },
  { plate: 29, name: 'GÜMÜŞHANE', displayName: 'Gümüşhane' },
  { plate: 30, name: 'HAKKARİ', displayName: 'Hakkari' },
  { plate: 31, name: 'HATAY', displayName: 'Hatay' },
  { plate: 32, name: 'ISPARTA', displayName: 'Isparta' },
  { plate: 33, name: 'MERSİN', displayName: 'Mersin' },
  { plate: 34, name: 'İSTANBUL', displayName: 'İstanbul' },
  { plate: 35, name: 'İZMİR', displayName: 'İzmir' },
  { plate: 36, name: 'KARS', displayName: 'Kars' },
  { plate: 37, name: 'KASTAMONU', displayName: 'Kastamonu' },
  { plate: 38, name: 'KAYSERİ', displayName: 'Kayseri' },
  { plate: 39, name: 'KIRKLARELİ', displayName: 'Kırklareli' },
  { plate: 40, name: 'KIRŞEHİR', displayName: 'Kırşehir' },
  { plate: 41, name: 'KOCAELİ', displayName: 'Kocaeli' },
  { plate: 42, name: 'KONYA', displayName: 'Konya' },
  { plate: 43, name: 'KÜTAHYA', displayName: 'Kütahya' },
  { plate: 44, name: 'MALATYA', displayName: 'Malatya' },
  { plate: 45, name: 'MANİSA', displayName: 'Manisa' },
  { plate: 46, name: 'KAHRAMANMARAŞ', displayName: 'Kahramanmaraş' },
  { plate: 47, name: 'MARDİN', displayName: 'Mardin' },
  { plate: 48, name: 'MUĞLA', displayName: 'Muğla' },
  { plate: 49, name: 'MUŞ', displayName: 'Muş' },
  { plate: 50, name: 'NEVŞEHİR', displayName: 'Nevşehir' },
  { plate: 51, name: 'NİĞDE', displayName: 'Niğde' },
  { plate: 52, name: 'ORDU', displayName: 'Ordu' },
  { plate: 53, name: 'RİZE', displayName: 'Rize' },
  { plate: 54, name: 'SAKARYA', displayName: 'Sakarya' },
  { plate: 55, name: 'SAMSUN', displayName: 'Samsun' },
  { plate: 56, name: 'SİİRT', displayName: 'Siirt' },
  { plate: 57, name: 'SİNOP', displayName: 'Sinop' },
  { plate: 58, name: 'SİVAS', displayName: 'Sivas' },
  { plate: 59, name: 'TEKİRDAĞ', displayName: 'Tekirdağ' },
  { plate: 60, name: 'TOKAT', displayName: 'Tokat' },
  { plate: 61, name: 'TRABZON', displayName: 'Trabzon' },
  { plate: 62, name: 'TUNCELİ', displayName: 'Tunceli' },
  { plate: 63, name: 'ŞANLIURFA', displayName: 'Şanlıurfa' },
  { plate: 64, name: 'UŞAK', displayName: 'Uşak' },
  { plate: 65, name: 'VAN', displayName: 'Van' },
  { plate: 66, name: 'YOZGAT', displayName: 'Yozgat' },
  { plate: 67, name: 'ZONGULDAK', displayName: 'Zonguldak' },
  { plate: 68, name: 'AKSARAY', displayName: 'Aksaray' },
  { plate: 69, name: 'BAYBURT', displayName: 'Bayburt' },
  { plate: 70, name: 'KARAMAN', displayName: 'Karaman' },
  { plate: 71, name: 'KIRIKKALE', displayName: 'Kırıkkale' },
  { plate: 72, name: 'BATMAN', displayName: 'Batman' },
  { plate: 73, name: 'ŞIRNAK', displayName: 'Şırnak' },
  { plate: 74, name: 'BARTIN', displayName: 'Bartın' },
  { plate: 75, name: 'ARDAHAN', displayName: 'Ardahan' },
  { plate: 76, name: 'IĞDIR', displayName: 'Iğdır' },
  { plate: 77, name: 'YALOVA', displayName: 'Yalova' },
  { plate: 78, name: 'KARABÜK', displayName: 'Karabük' },
  { plate: 79, name: 'KİLİS', displayName: 'Kilis' },
  { plate: 80, name: 'OSMANİYE', displayName: 'Osmaniye' },
  { plate: 81, name: 'DÜZCE', displayName: 'Düzce' },
];

const DAY_MAP = {
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

function parseDays(dayStr) {
  if (!dayStr) return [1];
  const parts = dayStr.split(/[,;\/\s]+/).filter(Boolean);
  const result = [];
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

function fetchProvince(plate, province) {
  return new Promise((resolve) => {
    const url = `https://www.hal.gov.tr/Sayfalar/Pazar-Yerleri.aspx?sid=${plate}`;
    const req = https.get(url, { rejectUnauthorized: false, timeout: 12000 }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        const trRegex = /<tr[\s\S]*?<\/tr>/gi;
        const list = [];
        let m;
        let idx = 1;
        while ((m = trRegex.exec(data)) !== null) {
          const row = m[0];
          const tdRegex = /<td[\s\S]*?<\/td>/gi;
          const tds = [];
          let tdM;
          while ((tdM = tdRegex.exec(row)) !== null) {
            const text = tdM[0]
              .replace(/<[^>]+>/g, ' ')
              .replace(/&nbsp;/g, ' ')
              .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
              .replace(/\s+/g, ' ')
              .trim();
            tds.push(text);
          }
          if (tds.length >= 7 && !tds[0].includes('Pazar Adı') && tds[3]) {
            const name = tds[0];
            const type = tds[1];
            const address = tds[2];
            const city = tds[3] || province.displayName;
            const district = tds[4] ? tds[4].charAt(0).toUpperCase() + tds[4].slice(1).toLowerCase() : '';
            const neighborhood = tds[5];
            const daysStr = tds[6];
            const openDays = parseDays(daysStr);

            list.push({
              id: `hal-${plate}-${idx++}`,
              name,
              type: type || 'Semt Pazarı',
              address,
              city: province.displayName,
              district,
              neighborhood,
              daysRaw: daysStr,
              openDays,
              plate,
            });
          }
        }
        resolve({ plate, name: province.displayName, count: list.length, list });
      });
    });

    req.on('error', (err) => {
      console.error(`Error fetching plate ${plate} (${province.displayName}):`, err.message);
      resolve({ plate, name: province.displayName, count: 0, list: [] });
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn(`Timeout fetching plate ${plate} (${province.displayName})`);
      resolve({ plate, name: province.displayName, count: 0, list: [] });
    });
  });
}

async function scrapeAll() {
  console.log('Starting full hal.gov.tr harvest for all 81 provinces...');
  const allBazaars = [];
  const BATCH_SIZE = 5;

  for (let i = 0; i < PROVINCES.length; i += BATCH_SIZE) {
    const batch = PROVINCES.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((p) => fetchProvince(p.plate, p)));
    for (const res of results) {
      console.log(`[Plaka ${res.plate.toString().padStart(2, '0')}] ${res.name.padEnd(16)}: ${res.count} pazar`);
      allBazaars.push(...res.list);
    }
  }

  console.log(`Total bazaars gathered: ${allBazaars.length}`);
  const outputPath = path.join(process.cwd(), 'src', 'data', 'allBazaars.json');
  fs.writeFileSync(outputPath, JSON.stringify(allBazaars, null, 2), 'utf-8');
  console.log(`Saved successfully to ${outputPath}`);
}

scrapeAll();
