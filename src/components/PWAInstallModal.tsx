import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  ExternalLink,
  Check,
  Copy,
  Info,
  Layers,
  Code2,
  Sparkles,
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall?: () => Promise<boolean>;
  isInstallable: boolean;
  isInIframe: boolean;
  isIOS: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onNativeInstall,
  isInstallable,
  isInIframe,
  isIOS,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeTab, setActiveTab] = useState<'android_web' | 'android_native' | 'ios'>(
    isIOS ? 'ios' : 'android_web'
  );

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText('./gradlew assembleDebug');
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleOpenNewTab = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="pwa-install-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 shadow-inner">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base leading-tight">Android Uygulama Rehberi</h3>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Android & Native
                </span>
              </div>
              <p className="text-[11px] text-orange-100">
                Telefona doğrudan yükleme veya Android Studio (Kotlin) APK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-200">
          {/* Platform Tab Switcher */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Kullanım ve Kurulum Yöntemi Seçin:
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
              <button
                onClick={() => setActiveTab('android_web')}
                className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all ${
                  activeTab === 'android_web'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Telefona Yükle
              </button>
              <button
                onClick={() => setActiveTab('android_native')}
                className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all ${
                  activeTab === 'android_native'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Native Kotlin (APK)
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all ${
                  activeTab === 'ios'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                iOS / PC
              </button>
            </div>

            {/* Tab Body */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 text-slate-300">
              {activeTab === 'android_web' && (
                <div className="space-y-2.5 text-[11.5px] leading-relaxed">
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Android Telefonda Native WebAPK Olarak Kullanım:</span>
                  </div>
                  <p className="text-slate-300">
                    Uygulama tam bir <strong>Progressive Web App (PWA)</strong> olarak hazırlanmıştır. Android'e yüklendiğinde Google Play Services tarafından bir <strong>WebAPK</strong> oluşturulur; telefonunuzun uygulama çekmecesine native bir uygulama gibi yerleşir ve <strong>%100 internetsiz (çevrimdışı)</strong> çalışır.
                  </p>

                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1.5">
                    <div className="font-semibold text-orange-400 text-xs">Adım Adım Yükleme:</div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300">
                      <li>Aşağıdaki <strong>"Yeni Sekmede Aç"</strong> butonuna basın veya bağlantıyı Android Chrome'da açın.</li>
                      <li>Chrome'un sağ üst köşesindeki <strong>üç nokta (⋮)</strong> menüsüne dokunun.</li>
                      <li><strong>"Uygulamayı Yükle"</strong> (veya <em>"Ana Ekrana Ekle"</em>) seçeneğine tıklayın.</li>
                      <li>Artık telefonunuzda kendi uygulama ikonuyla tam ekran başlar.</li>
                    </ol>
                  </div>
                </div>
              )}

              {activeTab === 'android_native' && (
                <div className="space-y-2.5 text-[11.5px] leading-relaxed">
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Code2 className="w-4 h-4 text-orange-400" />
                    <span>Native Android Studio (Kotlin + Jetpack Compose) Projesi:</span>
                  </div>
                  <p className="text-slate-300">
                    Proje içerisindeki <code className="bg-slate-900 px-1.5 py-0.5 rounded text-orange-300 font-mono">/android</code> klasöründe tam teşekküllü <strong>Native Android (Kotlin, Jetpack Compose, Material 3, Gson)</strong> kaynak kodları ve tüm 2.741 pazar yeri JSON varlığı oluşturulmuştur.
                  </p>

                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2">
                    <div className="font-semibold text-orange-400 text-xs">Android Studio ile APK Üretme:</div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300">
                      <li>Sağ üstteki AI Studio Ayarları menüsünden <strong>"Export to ZIP"</strong> veya <strong>"GitHub"</strong> ile projeyi bilgisayarınıza indirin.</li>
                      <li><strong>Android Studio</strong>'yu açıp <code className="text-orange-300">/android</code> klasörünü proje olarak açın.</li>
                      <li>Doğrudan APK derlemek için terminalde şunu çalıştırın:</li>
                    </ol>

                    <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
                      <span>./gradlew assembleDebug</span>
                      <button
                        type="button"
                        onClick={handleCopyCommand}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCmd ? 'Kopyalandı' : 'Kopyala'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Derlenen APK dosyası: <code className="text-slate-300">android/app/build/outputs/apk/debug/app-debug.apk</code>
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'ios' && (
                <div className="space-y-2 text-[11.5px] leading-relaxed">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>iPhone Safari veya Masaüstü Bilgisayar:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Bağlantıyı <strong>Safari</strong> veya <strong>Chrome</strong>'da açın.</li>
                    <li>iOS'ta: Alttaki <strong>Paylaş</strong> &rarr; <strong>"Ana Ekrana Ekle"</strong> butonuna basın.</li>
                    <li>Masaüstünde: Adres çubuğunun sağındaki <strong>(⊕ Yükle)</strong> simgesine tıklayın.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Quick Copy Link */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Uygulama Adresi:
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="bg-transparent text-[11px] text-slate-400 font-mono flex-1 outline-none truncate select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-800/80 px-5 py-3 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Kapat
          </button>
          <button
            onClick={handleOpenNewTab}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Yeni Sekmede Aç</span>
          </button>
        </div>
      </div>
    </div>
  );
};
