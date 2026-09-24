import React, { useState } from 'react';
import { Search, Star, Download, Check, ShieldCheck, HardDrive, ShoppingBag } from 'lucide-react';
import { CloudAppId, CloudAppInfo } from '../types';

interface PlayStoreProps {
  apps: CloudAppInfo[];
  onToggleInstall: (id: CloudAppId) => void;
  onOpenApp: (id: CloudAppId) => void;
}

export const PlayStore: React.FC<PlayStoreProps> = ({
  apps,
  onToggleInstall,
  onOpenApp,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [installingId, setInstallingId] = useState<string | null>(null);

  const categories = ['All', 'Development', 'System', 'Entertainment', 'Productivity', 'Games', 'Network'];

  const filteredApps = apps.filter((app) => {
    const matchesCat = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch =
      search === '' ||
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleInstallClick = (app: CloudAppInfo) => {
    if (app.isInstalled) {
      if (!app.isSystemApp) {
        onToggleInstall(app.id);
      }
    } else {
      setInstallingId(app.id);
      setTimeout(() => {
        onToggleInstall(app.id);
        setInstallingId(null);
      }, 700);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Play Store Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 space-y-2.5">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 64GB Cloud Play Store..."
              className="w-full bg-slate-950 border border-slate-800 rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
            C
          </div>
        </div>

        {/* 64GB ROM Isolation Guarantee Banner */}
        <div className="bg-emerald-950/80 border border-emerald-500/30 rounded-xl px-2.5 py-1.5 flex items-center space-x-2 text-[11px] text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Apps install directly to 64GB Google Cloud ROM • 0 MB taken on device</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-slate-900/60 px-3 py-2 flex space-x-2 overflow-x-auto border-b border-slate-800/60 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* App List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between hover:border-slate-700 transition-all shadow-md"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 shadow"
                style={{
                  backgroundColor: `${app.color}20`,
                  border: `1px solid ${app.color}50`,
                  color: app.color,
                }}
              >
                {app.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-white truncate">{app.name}</h3>
                <p className="text-[11px] text-slate-400 truncate">{app.summary}</p>
                <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-500 font-mono">
                  <span className="flex items-center text-amber-400 font-semibold">
                    <Star className="w-3 h-3 fill-current mr-0.5" />
                    {app.rating}
                  </span>
                  <span>•</span>
                  <span>{app.appSizeMb} MB Cloud</span>
                  <span>•</span>
                  <span>{app.downloads}</span>
                </div>
              </div>
            </div>

            {/* Install / Open Buttons */}
            <div className="flex items-center space-x-1.5 shrink-0">
              {installingId === app.id ? (
                <div className="w-16 py-1 bg-emerald-950 border border-emerald-500/40 rounded-full flex items-center justify-center text-[10px] text-emerald-400 font-bold animate-pulse">
                  Installing...
                </div>
              ) : app.isInstalled ? (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onOpenApp(app.id)}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-500 rounded-full text-xs font-bold text-white shadow-sm transition-all"
                  >
                    Open
                  </button>
                  {!app.isSystemApp && (
                    <button
                      onClick={() => handleInstallClick(app)}
                      className="px-2 py-1 bg-rose-950/60 border border-rose-500/30 hover:bg-rose-900 rounded-full text-[10px] text-rose-300 transition-all"
                    >
                      Uninstall
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleInstallClick(app)}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 active:scale-95 rounded-full text-xs font-bold text-black shadow-md transition-all flex items-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Install</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
