import React, { useState } from 'react';
import { Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const [isFrameActive, setIsFrameActive] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center sm:p-4 text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Top Desktop Frame Control Pill */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-2 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-3.5 h-3.5 text-orange-400" />
          <span>Android Device Simulation</span>
        </div>
        <button
          onClick={() => setIsFrameActive(!isFrameActive)}
          className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-all font-semibold"
          title={isFrameActive ? 'Expand to Full Viewport' : 'Constrain to Android Phone Frame'}
        >
          {isFrameActive ? (
            <>
              <Maximize2 className="w-3 h-3" />
              <span>Full Width</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3 h-3" />
              <span>Android Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isFrameActive
            ? 'max-w-md sm:rounded-[42px] sm:border-[10px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden bg-slate-900 min-h-screen sm:min-h-[860px] flex flex-col relative'
            : 'max-w-4xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-900 min-h-screen flex flex-col'
        }`}
      >
        {/* Top Camera Punch Hole (Android Style) */}
        {isFrameActive && (
          <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 z-50 pointer-events-none items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>
          </div>
        )}

        {/* Inner App Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">{children}</div>

        {/* Android Bottom Gesture Navigation Pill */}
        {isFrameActive && (
          <div className="hidden sm:flex h-5 w-full bg-slate-900 items-center justify-center shrink-0">
            <div className="w-28 h-1 rounded-full bg-slate-700/80" />
          </div>
        )}
      </div>
    </div>
  );
};
