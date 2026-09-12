import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'pill' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, isInIframe, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already running as an installed standalone app, suppress the button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    // If native prompt is ready and not in an iframe, try direct prompt
    if (isInstallable && !isInIframe) {
      const outcome = await install();
      if (!outcome) {
        setIsModalOpen(true);
      }
    } else {
      // In an iframe (like AI Studio preview screen) or iOS Safari, show the install helper modal
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {variant === 'pill' ? (
        <button
          id="pwa-install-pill-btn"
          onClick={handleClick}
          className={`bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition-all active:scale-95 border border-orange-400/40 ${className}`}
          title="Semt Pazarı Bulucu'yu cihazınıza yükleyin"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Uygulamayı Yükle</span>
        </button>
      ) : variant === 'banner' ? (
        <div
          id="pwa-install-banner"
          className={`bg-gradient-to-r from-slate-900 to-slate-800 border border-orange-500/40 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Semt Pazarı Bulucu'yu Yükle</span>
                <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-orange-500/40">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ana ekrandan hızlı erişim, çevrimdışı radar & anlık yol tarifi
              </p>
            </div>
          </div>
          <button
            onClick={handleClick}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3 py-2 rounded-xl shrink-0 flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Yükle</span>
          </button>
        </div>
      ) : (
        <button
          id="pwa-install-compact-btn"
          onClick={handleClick}
          className={`bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 ${className}`}
          title="Android'e Yükle & Native Proje Rehberi"
        >
          <Smartphone className="w-3.5 h-3.5 text-orange-400" />
          <span>Android / Yükle</span>
        </button>
      )}

      {/* Guide & Launcher Modal */}
      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNativeInstall={isInstallable ? install : undefined}
        isInstallable={isInstallable}
        isInIframe={isInIframe}
        isIOS={isIOS}
      />
    </>
  );
};
