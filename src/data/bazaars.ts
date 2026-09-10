import { Bazaar } from '../types';

export const INITIAL_BAZAARS: Bazaar[] = [
  {
    id: 'kadikoy-tuesday-bazaar',
    name: 'Kadıköy Historic Market (Tarihi Salı Pazarı)',
    localName: 'Kadıköy Salı & Cuma Pazarı',
    city: 'Istanbul',
    district: 'Kadıköy / Fikirtepe',
    address: 'Dumlupınar Mah. Mandıra Cad. No:1, 34720 Kadıköy/İstanbul',
    lat: 40.9984,
    lng: 29.0528,
    description:
      'One of the oldest, largest, and most vibrant open-air bazaars in Istanbul. Spread across a massive dedicated market complex, famous for fresh farm produce, vast fabric rolls, and traditional culinary stalls.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    // Open Tuesday (2) and Friday (5), and Sunday (0) flea market
    openDays: [0, 2, 4, 5],
    schedule: {
      0: { open: '08:30', close: '18:30' },
      2: { open: '08:00', close: '19:30' },
      4: { open: '08:30', close: '19:00' },
      5: { open: '08:00', close: '19:30' },
    },
    features: {
      groceries: true,
      textiles: true,
      food: true,
      antiques: true,
    },
    featureDescriptions: {
      groceries:
        'Farm-direct organic seasonal vegetables, Aegean olives, sun-dried tomatoes, fresh butter, artisan village cheeses, honeycomb, and heirloom herbs.',
      textiles:
        'Huge textile section with premium cotton towels, silk scarves, roll fabrics by the meter, Turkish bedding, curtain drapery, and high-quality export apparel.',
      food:
        'Live wood-fired gözleme (stuffed flatbreads) with spinach & cheese, freshly brewed samovar tea, roasted chestnuts, fresh pomegranate juice, and hot simit.',
      specialties: ['Aegean Olives', 'Turkish Pestemal Towels', 'Fresh Gözleme', 'Sunday Flea Market Antiques'],
    },
    parking: {
      available: true,
      type: 'dedicated_lot',
      title: 'Dedicated Municipal Open-Air & Multi-Storey Parking',
      details: 'Large paved surface lot directly adjacent to the western bazaar gate with automated barrier entry and security.',
      capacity: '450 vehicle spots',
      fee: 'First 30 mins free, ₺30/hour ($1.00), Flat ₺90 full-day',
      walkingDistance: '1 min walk (Direct covered ramp to market stalls)',
      tips: 'Arrive before 10:30 AM on Tuesdays to guarantee a spot; attendant directs traffic during peak afternoon hours.',
    },
    rating: 4.8,
    reviewCount: 318,
    reviews: [
      {
        id: 'rev-k1',
        author: 'Emre Karaca',
        rating: 5,
        date: '3 days ago',
        comment:
          'Absolute paradise for fresh produce and Turkish textiles! The olive selection alone has over 20 regional varieties. Parked in the official lot right by the gate without hassle.',
        tags: ['Fresh Groceries', 'Great Textiles', 'Easy Parking'],
        helpfulCount: 24,
      },
      {
        id: 'rev-k2',
        author: 'Elena Rostova',
        rating: 5,
        date: '1 week ago',
        comment:
          'Do not miss the elderly ladies baking fresh gözleme with hot tea in the middle lane. The prices on textiles are one-third of the shopping malls.',
        tags: ['Delicious Food', 'Bargain Textiles'],
        helpfulCount: 19,
      },
      {
        id: 'rev-k3',
        author: 'David Chen',
        rating: 4,
        date: '2 weeks ago',
        comment:
          'Huge variety and friendly vendors. It gets packed after 2 PM, so early morning is best. Google Maps directions led straight to the parking gate.',
        tags: ['Good Parking', 'Fresh Produce'],
        helpfulCount: 8,
      },
    ],
  },
  {
    id: 'grand-bazaar-historic',
    name: 'Grand Bazaar (Kapalıçarşı)',
    localName: 'Kapalı Çarşı',
    city: 'Istanbul',
    district: 'Fatih / Beyazıt',
    address: 'Beyazıt, Kalpakçılar Cad. No:22, 34126 Fatih/İstanbul',
    lat: 41.0108,
    lng: 28.968,
    description:
      'The legendary covered market founded in 1461 with 61 covered streets and over 4,000 shops. World-renowned for luxury textiles, jewelry, spices, ceramics, leather goods, and Turkish delight.',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1000&q=80',
    // Open Monday through Saturday (1,2,3,4,5,6)
    openDays: [1, 2, 3, 4, 5, 6],
    schedule: {
      1: { open: '08:30', close: '19:00' },
      2: { open: '08:30', close: '19:00' },
      3: { open: '08:30', close: '19:00' },
      4: { open: '08:30', close: '19:00' },
      5: { open: '08:30', close: '19:00' },
      6: { open: '08:30', close: '19:00' },
    },
    features: {
      groceries: false,
      textiles: true,
      food: true,
      antiques: true,
      handicrafts: true,
      spices: true,
    },
    featureDescriptions: {
      textiles:
        'World-famous hand-woven silk carpets, vintage kilims, cashmere shawls, Turkish hamam pestemals, and bespoke leather jackets.',
      food:
        'Historic wood-fired coffee roasted over hot sand, Ottoman sherbet, authentic pistachios and lokum (Turkish delight), and hidden courtyard kebabs (Sark Kahvesi).',
      specialties: ['Handmade Carpets', 'Gold & Silver Filigree', 'Turkish Sand Coffee', 'Leather Apparel'],
    },
    parking: {
      available: true,
      type: 'nearby_garage',
      title: 'Beyazıt Underground Public Car Park (İSPARK)',
      details: 'Multi-level automated municipal parking located under Beyazıt Square, just outside the Grand Bazaar Gate 1.',
      capacity: '600 underground spots',
      fee: '₺40 for 1 hour, ₺120 for 4 hours',
      walkingDistance: '3 min walk (220 meters through Beyazıt Gate)',
      tips: 'Historic pedestrian zone is closed to vehicular traffic. Follow Google Maps to Beyazıt İSPARK Garage for direct underground parking.',
    },
    rating: 4.7,
    reviewCount: 1420,
    reviews: [
      {
        id: 'rev-gb1',
        author: 'Sarah Jenkins',
        rating: 5,
        date: 'Yesterday',
        comment:
          'A feast for all senses! We found the most incredible hand-woven silk rug and sampled roasted Turkish coffee inside Sark Kahvesi. Parked at Beyazıt Square underground garage effortlessly.',
        tags: ['Luxury Textiles', 'Coffee & Food', 'Good Garage'],
        helpfulCount: 42,
      },
      {
        id: 'rev-gb2',
        author: 'Murat Yılmaz',
        rating: 5,
        date: '4 days ago',
        comment:
          'Bargaining is expected and friendly. Beautiful leather crafts and pestemal towels. Don’t drive into the alleys—use the Beyazıt parking garage recommended in the app.',
        tags: ['Textiles', 'Historic Vibe'],
        helpfulCount: 31,
      },
    ],
  },
  {
    id: 'spice-bazaar-misir',
    name: 'Spice Bazaar (Mısır Çarşısı)',
    localName: 'Mısır Çarşısı',
    city: 'Istanbul',
    district: 'Eminönü / Fatih',
    address: 'Rüstem Paşa, Erzak Ambarı Sok. No:92, 34116 Fatih/İstanbul',
    lat: 41.0166,
    lng: 28.9706,
    description:
      'Historic 17th-century covered culinary and spice market next to the Golden Horn. Famous for rare spices, saffron, dried fruits, Turkish delight, caviar, and traditional herbal teas.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    // Open 7 days a week!
    openDays: [0, 1, 2, 3, 4, 5, 6],
    schedule: {
      0: { open: '09:30', close: '19:00' },
      1: { open: '08:00', close: '19:30' },
      2: { open: '08:00', close: '19:30' },
      3: { open: '08:00', close: '19:30' },
      4: { open: '08:00', close: '19:30' },
      5: { open: '08:00', close: '19:30' },
      6: { open: '08:00', close: '19:30' },
    },
    features: {
      groceries: true,
      textiles: false,
      food: true,
      spices: true,
    },
    featureDescriptions: {
      groceries:
        'Gourmet specialty groceries: Persian saffron, Anatolian sumac, pul biber chili flakes, roasted pistachios, dried figs, dates, Turkish mountain honey, and aged cheeses.',
      food:
        'Freshly made artisanal lokum (pomegranate & pistachio Turkish delight), spiced herbal winter teas, kurukahveci Mehmet Efendi fresh coffee, and grilled balik ekmek (fish sandwiches) on the quay.',
      specialties: ['Iranian & Turkish Saffron', 'Pistachio Turkish Delight', 'Medicinal Herbal Teas', 'Fresh Ground Coffee'],
    },
    parking: {
      available: true,
      type: 'nearby_garage',
      title: 'Eminönü Port İSPARK Car Park',
      details: 'Surface waterfront parking directly across from the Eminönü ferry docks and Spice Bazaar entrance.',
      capacity: '280 vehicles',
      fee: '₺35/hr, valet available',
      walkingDistance: '2 min walk (180 meters via pedestrian underpass)',
      tips: 'Traffic along Ragıp Gümüşpala Caddesi can be slow in late afternoon; the waterfront parking has quick access from the coastal highway.',
    },
    rating: 4.9,
    reviewCount: 890,
    reviews: [
      {
        id: 'rev-sb1',
        author: 'Amina Al-Mansoor',
        rating: 5,
        date: '2 days ago',
        comment:
          'The aromas hit you before you even enter! The vendors offer samples of dried mulberries, apricots stuffed with walnuts, and Turkish delight. Easy walk from the Eminönü parking.',
        tags: ['Gourmet Food', 'Fresh Spices', 'Open Today'],
        helpfulCount: 29,
      },
    ],
  },
  {
    id: 'besiktas-saturday-market',
    name: 'Beşiktaş Weekly Market & Fish Bazaar',
    localName: 'Beşiktaş Cumartesi Pazarı & Balık Çarşısı',
    city: 'Istanbul',
    district: 'Beşiktaş / Türkali',
    address: 'Türkali Mah. Nüzhetiye Cad. No:44, 34357 Beşiktaş/İstanbul',
    lat: 41.0425,
    lng: 29.0019,
    description:
      'Modern two-story municipal market hall. The ground level features an energetic produce and food market, while the upper deck houses one of the city’s best fashion and textile sales.',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=80',
    // Open Thursday (4) and Saturday (6) and Sunday (0)
    openDays: [0, 4, 6],
    schedule: {
      0: { open: '09:00', close: '19:00' },
      4: { open: '08:30', close: '19:30' },
      6: { open: '07:30', close: '20:00' },
    },
    features: {
      groceries: true,
      textiles: true,
      food: true,
    },
    featureDescriptions: {
      groceries:
        'Fresh daily seafood straight from the Bosphorus, seasonal field berries, organic microgreens, Aegean olive oils, and farm-fresh eggs.',
      textiles:
        'Famous 2nd floor garment bazaar with genuine brand overflow clothes, linen shirts, winter knits, shoes, and luxury bed linens at clearance rates.',
      food:
        'Freshly fried anchovies (hamsi tava), street kokoreç, stuffed mussels (midye dolma) with lemon, and hot tea stands.',
      specialties: ['Fresh Bosphorus Fish', '2nd-Floor Textile Outlet', 'Midye Dolma', 'Artisan Village Butter'],
    },
    parking: {
      available: true,
      type: 'multistorey_garage',
      title: 'Beşiktaş Evlendirme Dairesi Multi-Story Parking',
      details: 'Covered multi-level garage located 150m from the bazaar entrance, operated by the municipality.',
      capacity: '320 vehicle bays with elevator',
      fee: '₺25/hour, credit card accepted',
      walkingDistance: '2 min walk (150 meters)',
      tips: 'Features electric vehicle charging spots (ZES / Eşarj) on Level -1.',
    },
    rating: 4.6,
    reviewCount: 215,
    reviews: [
      {
        id: 'rev-b1',
        author: 'Caner Demir',
        rating: 5,
        date: '5 days ago',
        comment:
          'Best place in European Istanbul for quality clothing bargains upstairs and fresh seafood downstairs. Very organized multi-storey parking nearby.',
        tags: ['Outlet Textiles', 'Fresh Groceries', 'Covered Parking'],
        helpfulCount: 17,
      },
    ],
  },
  {
    id: 'ferikoy-organic-antique',
    name: 'Feriköy Organic Food & Antique Bazaar',
    localName: 'Feriköy Organik & Antika Pazarı (Bomonti)',
    city: 'Istanbul',
    district: 'Şişli / Bomonti',
    address: 'Cumhuriyet Mah. Lala Şahin Sok. No:8, 34380 Şişli/İstanbul',
    lat: 41.0561,
    lng: 28.9818,
    description:
      'Covered modern market pavilion known on Saturdays as the certified 100% Organic Food Bazaar, and on Sundays as Istanbul’s most renowned Antique & Retro Flea Market.',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1000&q=80',
    // Open Wednesday (3), Saturday (6), Sunday (0)
    openDays: [0, 3, 6],
    schedule: {
      0: { open: '08:30', close: '19:00' }, // Sunday Antiques
      3: { open: '09:00', close: '18:30' },
      6: { open: '07:30', close: '18:00' }, // Saturday 100% Organic
    },
    features: {
      groceries: true,
      textiles: true,
      food: true,
      antiques: true,
    },
    featureDescriptions: {
      groceries:
        'Certified 100% organic Anatolian agriculture: heirloom unpolished grains, wild thyme honey, pesticide-free strawberries, sourdough breads, and raw milk.',
      textiles:
        'Vintage denim, retro leather jackets, handmade macramé, authentic Ottoman embroidery, and reclaimed textiles.',
      food:
        'Renowned freshly rolled organic potato & herb gözleme, brewed Turkish tea served on wooden stools, cold-pressed juices, and homemade vegan cakes.',
      specialties: ['Certified Organic Produce', 'Vinyl Records & Vintage Cameras', 'Organic Gözleme', 'Heirloom Honey'],
    },
    parking: {
      available: true,
      type: 'dedicated_lot',
      title: 'Bomontiada & Market Dedicated Surface Lot',
      details: 'Designated open-air parking lot right in front of the covered market gates with on-site staff.',
      capacity: '180 vehicles',
      fee: '₺30/hour, ₺80 flat weekend rate',
      walkingDistance: 'Direct entrance (0 min walk)',
      tips: 'Sunday antique mornings get crowded by 11:00 AM. Arrive by 9:00 AM for the best vintage pickings and effortless parking.',
    },
    rating: 4.9,
    reviewCount: 412,
    reviews: [
      {
        id: 'rev-f1',
        author: 'Zeynep Aksoy',
        rating: 5,
        date: 'Last Sunday',
        comment:
          'The organic food Saturday is unbeatable, and Sunday antique hunting is legendary. The parking lot attendants are helpful. Loved the fresh gözleme!',
        tags: ['Organic Groceries', 'Antique Textiles', 'On-site Parking'],
        helpfulCount: 38,
      },
    ],
  },
  {
    id: 'fatih-wednesday-bazaar',
    name: 'Fatih Historic Wednesday Bazaar (Çarşamba Pazarı)',
    localName: 'Tarihi Fatih Çarşamba Pazarı',
    city: 'Istanbul',
    district: 'Fatih / Çarşamba',
    address: 'Ali Kuşçu, Darüşşafaka Cad. No:14, 34083 Fatih/İstanbul',
    lat: 41.0195,
    lng: 28.9482,
    description:
      'Massive traditional Wednesday bazaar covering dozens of historic streets behind the imperial Fatih Mosque. Known as the largest street market in Turkey with over 1,200 stalls.',
    image: 'https://images.unsplash.com/photo-1506485338663-c7d02b4b66d7?auto=format&fit=crop&w=1000&q=80',
    // Open Wednesday (3) and Thursday (4)
    openDays: [3, 4],
    schedule: {
      3: { open: '07:30', close: '19:30' },
      4: { open: '08:00', close: '18:00' },
    },
    features: {
      groceries: true,
      textiles: true,
      food: true,
    },
    featureDescriptions: {
      groceries:
        'Huge mounds of fresh watermelons, citrus, Black Sea hazelnuts, village eggs, pickles in barrels, and seasonal garden vegetables at unbeatable wholesale-like prices.',
      textiles:
        'Endless rows of drapery, curtains, kitchen linens, Turkish towels, modest clothing, sportswear, fabrics by the bolt, and rugs.',
      food:
        'Freshly made hot flatbreads, street döner kebabs, traditional pickle juice (turşu suyu), roasted corn on the cob, and sherbet.',
      specialties: ['Barrel Pickles & Olives', 'Low-Priced Bulk Produce', 'Huge Curtain & Drapery Row', 'Traditional Tea Stalls'],
    },
    parking: {
      available: false,
      type: 'street_parking',
      title: 'No On-Site Parking (Street Parking Highly Congested)',
      details: 'Due to bazaar stalls spanning 18 interconnected streets, vehicles cannot enter the market perimeter.',
      capacity: 'Nearby Fatih Complex underground parking (400m away)',
      fee: '₺30/hr at Fatih Camii İSPARK lot',
      walkingDistance: '6 min walk (400m)',
      tips: 'Do NOT attempt to drive directly onto Darüşşafaka Cad. Use Google Maps to navigate to "Fatih Camii İSPARK Otoparkı", then walk 5 minutes into the bazaar.',
    },
    rating: 4.5,
    reviewCount: 388,
    reviews: [
      {
        id: 'rev-fa1',
        author: 'Burak Keskin',
        rating: 5,
        date: '2 weeks ago',
        comment:
          'If you want the real, authentic, bustling Turkish bazaar experience, this is it! The prices on fresh produce are unbelievable. Note the parking tip: park at the Fatih Mosque lot and walk.',
        tags: ['Cheap Groceries', 'Huge Textiles', 'Authentic Vibe'],
        helpfulCount: 22,
      },
    ],
  },
  {
    id: 'yesilkoy-wednesday-market',
    name: 'Yeşilköy Wednesday Market (Sosyete Pazarı)',
    localName: 'Yeşilköy Çarşamba Pazarı',
    city: 'Istanbul',
    district: 'Bakırköy / Yeşilköy',
    address: 'Yeşilköy Mah. Çiroz Parkı Yanı, 34149 Bakırköy/İstanbul',
    lat: 40.9634,
    lng: 28.8247,
    description:
      'Coastal fashion and gourmet bazaar by the Marmara Sea. Renowned across Istanbul for top-tier European textile overstocks, designer cosmetics, and boutique delicacies.',
    image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=1000&q=80',
    // Open Wednesday (3) and Saturday (6)
    openDays: [3, 6],
    schedule: {
      3: { open: '08:00', close: '19:30' },
      6: { open: '08:30', close: '19:00' },
    },
    features: {
      groceries: true,
      textiles: true,
      food: true,
    },
    featureDescriptions: {
      groceries:
        'Imported gourmet condiments, truffles, local farm strawberries, boutique olive oils, Aegean wild asparagus, and artisanal goat cheeses.',
      textiles:
        'Famous "Sosyete" designer clothing stalls: European brand sample coats, linen dresses, cashmere sweaters, silk pyjamas, and leather handbags.',
      food:
        'Seaside food court with Turkish gözleme, döner wraps, freshly squeezed orange juice, and waffle stalls.',
      specialties: ['Boutique European Apparel', 'Gourmet Cheeses', 'Coastal Sea Breeze Atmosphere'],
    },
    parking: {
      available: true,
      type: 'dedicated_lot',
      title: 'Yeşilköy Bazaar Official Municipal Parking & Seaside Lot',
      details: 'Large open paved parking lot directly bordering the bazaar perimeter with shuttle carts for heavy shopping bags.',
      capacity: '500+ parking spaces',
      fee: '₺40 flat fee for the whole day',
      walkingDistance: '1 min walk (Direct market turnstiles)',
      tips: 'Spacious and very well-organized. Has dedicated handicap bays and security attendants.',
    },
    rating: 4.8,
    reviewCount: 276,
    reviews: [
      {
        id: 'rev-y1',
        author: 'Selin Erdem',
        rating: 5,
        date: '1 week ago',
        comment:
          'My absolute favorite market for clothes and linens. The parking lot is huge and right in front of the gate, so you do not have to carry heavy bags far. Great food court as well.',
        tags: ['Designer Textiles', 'Great Parking', 'Delicious Food'],
        helpfulCount: 33,
      },
    ],
  },
  {
    id: 'ulus-sosyete-bazaar',
    name: 'Ulus High-Society Fashion Bazaar (Ortaköy Pazarı)',
    localName: 'Ulus / Ortaköy Sosyete Pazarı',
    city: 'Istanbul',
    district: 'Beşiktaş / Ortaköy',
    address: 'Levazım Mah. Çayır Sok. No:5, 34340 Beşiktaş/İstanbul',
    lat: 41.0635,
    lng: 29.0182,
    description:
      'The premier fashion and lifestyle bazaar in Istanbul. Attracts trendsetters seeking export surplus garments, shoes, cosmetics, home decor, and gourmet street snacks.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80',
    // Open Thursday (4) and Sunday (0)
    openDays: [0, 4],
    schedule: {
      0: { open: '08:30', close: '19:30' },
      4: { open: '08:00', close: '19:30' },
    },
    features: {
      groceries: false,
      textiles: true,
      food: true,
    },
    featureDescriptions: {
      textiles:
        'Curated fashion stalls featuring current-season European brand dresses, denim, activewear, silk loungewear, leather boots, and designer home textiles.',
      food:
        'Freshly made gözleme, grilled kofte sandwiches, simit with melted kaşar, specialty iced Turkish coffees, and freshly baked churros.',
      specialties: ['Export Surplus High Fashion', 'Handmade Leather Shoes', 'Gourmet Street Snacks'],
    },
    parking: {
      available: true,
      type: 'dedicated_lot',
      title: 'Bazaar Ground-Level Parking & Valet Service',
      details: 'Paved parking zone managed by market administration with valet parking attendants at the main gate.',
      capacity: '220 vehicles',
      fee: '₺50 standard, ₺100 valet service',
      walkingDistance: 'Direct ramp entry',
      tips: 'Free municipality shuttle minibuses also run every 15 minutes between Ortaköy pier / Zincirlikuyu Metrobus and the bazaar.',
    },
    rating: 4.7,
    reviewCount: 198,
    reviews: [
      {
        id: 'rev-u1',
        author: 'Leyla Günay',
        rating: 5,
        date: '3 days ago',
        comment:
          'If you want stylish jackets, linen shirts, and bags, there is no better place. Valet parking made visiting super convenient. Loved the iced coffee and gözleme!',
        tags: ['Top Textiles', 'Valet Parking', 'Great Vibe'],
        helpfulCount: 16,
      },
    ],
  },
  {
    id: 'bakirkoy-saturday-market',
    name: 'Bakırköy Saturday Textile & Food Bazaar',
    localName: 'Bakırköy Cumartesi Pazarı',
    city: 'Istanbul',
    district: 'Bakırköy / Osmaniye',
    address: 'Osmaniye, Adliye Karşısı Pazar Alanı, 34146 Bakırköy/İstanbul',
    lat: 40.9902,
    lng: 28.8791,
    description:
      'Massive marketplace situated directly in front of the Bakırköy Justice Palace. Features hundreds of meters of fresh agricultural stalls alongside dense textile alleys.',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80',
    // Open Saturday (6), Monday (1), Thursday (4)
    openDays: [1, 4, 6],
    schedule: {
      1: { open: '08:30', close: '19:00' },
      4: { open: '08:30', close: '19:00' },
      6: { open: '07:30', close: '20:00' },
    },
    features: {
      groceries: true,
      textiles: true,
      food: true,
    },
    featureDescriptions: {
      groceries:
        'Thracian cheeses, freshly churned butter, village honey, organic tomatoes, fresh mint, parsley, and seasonal fruits directly from farmers.',
      textiles:
        'Huge selection of household textiles, bath towels, bedsheets, children’s clothing, sportswear, and fashion fabrics.',
      food:
        'Hot gözleme stands, döner kebab wraps, freshly pressed orange and pomegranate juices, and hot tea.',
      specialties: ['Thracian Artisan Cheeses', 'Bedsheets & Towels', 'Hot Gözleme'],
    },
    parking: {
      available: true,
      type: 'nearby_garage',
      title: 'Bakırköy Courthouse Multi-Story Parking (İSPARK)',
      details: 'Modern underground parking garage with 800+ spaces directly opposite the bazaar area.',
      capacity: '850 spaces',
      fee: '₺30/hour, ₺90 full day',
      walkingDistance: '2 min walk (Crossing pedestrian lights)',
      tips: 'Very spacious garage with security and camera monitoring.',
    },
    rating: 4.6,
    reviewCount: 165,
    reviews: [
      {
        id: 'rev-bk1',
        author: 'Hakan Varol',
        rating: 5,
        date: '6 days ago',
        comment:
          'Easy parking at the courthouse garage and the variety of fresh produce was exceptional. Don’t miss the village cheese stall near gate 3.',
        tags: ['Fresh Groceries', 'Huge Garage', 'Good Prices'],
        helpfulCount: 14,
      },
    ],
  },
  {
    id: 'fatih-kadinlar-pazari',
    name: "Kadınlar Pazarı (Women's Culinary Bazaar)",
    localName: 'Fatih Kadınlar Pazarı (Büryan & Bal Çarşısı)',
    city: 'Istanbul',
    district: 'Fatih / Zeyrek',
    address: 'Zeyrek Mah. İtfaiye Cad. No:28, 34083 Fatih/İstanbul',
    lat: 41.0183,
    lng: 28.9554,
    description:
      'Historic pedestrian food haven flanked by the 4th-century Roman Aqueduct of Valens. Renowned throughout the country for southeastern Anatolian culinary treasures, pit-roasted lamb (Büryan), herbs, and rare mountain cheeses.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    // Open 7 days a week!
    openDays: [0, 1, 2, 3, 4, 5, 6],
    schedule: {
      0: { open: '08:00', close: '23:00' },
      1: { open: '08:00', close: '23:00' },
      2: { open: '08:00', close: '23:00' },
      3: { open: '08:00', close: '23:00' },
      4: { open: '08:00', close: '23:00' },
      5: { open: '08:00', close: '23:00' },
      6: { open: '08:00', close: '23:00' },
    },
    features: {
      groceries: true,
      textiles: false,
      food: true,
      spices: true,
    },
    featureDescriptions: {
      groceries:
        'Siirt wild mountain thyme, herb cheeses (otlu peynir), Anatolian cured pastırma, dried okra, black sumac, sun-dried tomato pastes, and raw mountain honeycombs.',
      food:
        'Famous pit-roasted lamb Büryan kebab roasted underground for 3 hours, Perde pilaf in pastry, and hot black tea with walnut baklava under the Roman aqueduct.',
      specialties: ['Büryan Pit Kebab', 'Van Herb Cheese (Otlu Peynir)', 'Valens Aqueduct Views', 'Mountain Honey'],
    },
    parking: {
      available: true,
      type: 'nearby_garage',
      title: 'İtfaiye Caddesi & Saraçhane Underground Parking',
      details: 'Municipal parking facility located 200m from the pedestrianized culinary street.',
      capacity: '200 spaces',
      fee: '₺35/hour',
      walkingDistance: '3 min walk (200m)',
      tips: 'The street itself is pedestrian-only with scenic outdoor terrace seating beneath the historic stone arches.',
    },
    rating: 4.9,
    reviewCount: 520,
    reviews: [
      {
        id: 'rev-kp1',
        author: 'Tariq Al-Sabah',
        rating: 5,
        date: 'Yesterday',
        comment:
          'The single best culinary food experience in the city! The lamb büryan was meltingly tender, and I bought 2 kilos of Van otlu peynir to take home. Open late every day.',
        tags: ['Gourmet Food', 'Open Today', 'Must Visit'],
        helpfulCount: 35,
      },
    ],
  },
];
