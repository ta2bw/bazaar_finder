# Bazaar Finder — Native Android App (Kotlin & Jetpack Compose)

Bu dizin, Bazaar Finder uygulamasının tam teşekküllü **Native Android (Kotlin + Jetpack Compose)** projesini içerir.

## Özellikler
- **%100 Çevrimdışı:** 81 ilin 2.741 semt pazarının tamamı `app/src/main/assets/allBazaars.json` dosyasında paketlenmiştir.
- **Jetpack Compose & Material 3:** Modern, performanslı declarative UI.
- **Kuruluş Günleri & Filtreler:** Bugün açık olanlar, gün bazlı filtreler, il/ilçe seçimi ve arama motoru.
- **Harita Referansı:** Pazar adresine tıklandığında Android'in native `geo:0,0?q=...` intent'i ile Google Haritalar veya varsayılan harita uygulamasını açar.
- **Checklist Alışveriş Listesi:** Onay kutulu, kategorili ve `Intent.ACTION_SEND` ile WhatsApp / SMS paylaşımı destekleyen yerel alışveriş listesi.

## Android Studio ile Çalıştırma & APK Oluşturma

1. Projeyi bilgisayarınıza indirin (Google AI Studio Settings -> **Export to ZIP** veya **GitHub**).
2. **Android Studio**'yu açın.
3. **Open Project** seçeneğiyle bu `android/` dizinini seçin.
4. Gradle senkronizasyonunun tamamlanmasını bekleyin.
5. Cihazınızı veya Emülatörünüzü seçip **Run (Shift+F10)** butonuna basın.
6. Doğrudan APK dosyası üretmek için:
   ```bash
   ./gradlew assembleDebug
   ```
   Çıktı APK dosyası: `app/build/outputs/apk/debug/app-debug.apk`

---

## Ayrıca: Android WebAPK / PWA Olarak Anında Yükleme

Eğer Android Studio kurmak istemiyorsanız, uygulama zaten bir **Progressive Web App (PWA)** standartlarına sahiptir:
1. Android telefonunuzda Chrome ile uygulamanın adresini açın.
2. Sağ üstteki üç nokta menüsünden **"Uygulamayı Yükle"** veya **"Ana Ekrana Ekle"** seçeneğine dokunun.
3. Google Play Services otomatik olarak bir **WebAPK** üretecektir.
4. Telefonunuzun uygulama çekmecesine kendi ikonuyla native bir uygulama gibi yerleşir ve internetsiz (çevrimdışı) çalışır.
