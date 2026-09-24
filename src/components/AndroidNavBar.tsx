import React from 'react';

interface AndroidNavBarProps {
  onBack: () => void;
  onHome: () => void;
  onRecents: () => void;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({ onBack, onHome, onRecents }) => {
  return (
    <div className="w-full bg-slate-950/95 border-t border-slate-850 px-8 py-2 flex items-center justify-around z-20">
      {/* Back Triangle */}
      <button
        onClick={onBack}
        className="w-12 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800/60 active:scale-90 transition-all text-slate-400 hover:text-white"
        title="Back"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 12a1 1 0 0 1-1 1H8.414l4.293 4.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 1.414L8.414 11H18a1 1 0 0 1 1 1z" />
        </svg>
      </button>

      {/* Home Circle */}
      <button
        onClick={onHome}
        className="w-12 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800/60 active:scale-90 transition-all text-slate-400 hover:text-white"
        title="Home"
      >
        <div className="w-4 h-4 rounded-full border-2 border-current"></div>
      </button>

      {/* Recents Square */}
      <button
        onClick={onRecents}
        className="w-12 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800/60 active:scale-90 transition-all text-slate-400 hover:text-white"
        title="Recent Cloud Tasks"
      >
        <div className="w-3.5 h-3.5 rounded-sm border-2 border-current"></div>
      </button>
    </div>
  );
};
