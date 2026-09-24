import React from 'react';
import {
  Terminal,
  ShoppingBag,
  PlaySquare,
  Folder,
  Settings,
  Code,
  KeyRound,
  Gamepad2,
  Cpu,
  Zap,
  HardDrive,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { CloudAppId, CloudAppInfo } from '../types';

interface CloudHomeScreenProps {
  apps: CloudAppInfo[];
  ramUsedMb: number;
  onOpenApp: (id: CloudAppId) => void;
  onBoostRam: () => void;
}

export const CloudHomeScreen: React.FC<CloudHomeScreenProps> = ({
  apps,
  ramUsedMb,
  onOpenApp,
  onBoostRam,
}) => {
  const ramPercent = Math.round((ramUsedMb / 4096) * 100);

  const getIcon = (iconName: string, color: string) => {
    const props = { className: 'w-6 h-6', style: { color } };
    switch (iconName) {
      case 'Terminal': return <Terminal {...props} />;
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      case 'PlaySquare': return <PlaySquare {...props} />;
      case 'Folder': return <Folder {...props} />;
      case 'Settings': return <Settings {...props} />;
      case 'Code': return <Code {...props} />;
      case 'KeyRound': return <KeyRound {...props} />;
      case 'Gamepad2': return <Gamepad2 {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      default: return <Terminal {...props} />;
    }
  };

  const dockApps = apps.filter(a => ['terminal', 'playstore', 'youtube', 'drive'].includes(a.id));

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
      {/* Top Section: Date & Cloud Widgets */}
      <div className="space-y-3.5">
        {/* Date and Greeting */}
        <div className="flex justify-between items-end px-1 pt-1">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs text-emerald-300 font-semibold shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>0 MB Phone Storage</span>
          </div>
        </div>

        {/* 4GB RAM & 64GB ROM Hardware Widgets */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* 4GB RAM Widget */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-sky-400">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">4GB RAM</span>
              </div>
              <button
                onClick={onBoostRam}
                className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[10px] font-semibold transition-all active:scale-95"
                title="Free 4GB Cloud RAM"
              >
                <Zap className="w-3 h-3 text-sky-400" />
                <span>Boost</span>
              </button>
            </div>

            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Used:</span>
                <span className="text-white font-medium">{ramUsedMb} MB ({ramPercent}%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-sky-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${ramPercent}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500">Virtual LPDDR4x Memory</div>
            </div>
          </div>

          {/* 64GB Cloud ROM Widget */}
          <div
            onClick={() => onOpenApp('drive')}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-lg cursor-pointer hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <HardDrive className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">64GB ROM</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                Google Cloud
              </span>
            </div>

            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Free NVMe:</span>
                <span className="text-emerald-400 font-medium">53.8 GB</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '16%' }} />
              </div>
              <div className="text-[10px] text-emerald-500/80">0 MB on your phone</div>
            </div>
          </div>
        </div>

        {/* Quick Launch Terminal Banner */}
        <div
          onClick={() => onOpenApp('terminal')}
          className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:border-emerald-400/50 transition-all shadow-md group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-base shadow-inner">
              &gt;_
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Termux Linux Terminal
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                cloud@gcp:~$ bash, pkg, python3, ssh
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 pt-2">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center group active:scale-95 transition-all text-center focus:outline-none"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border transition-all duration-200 group-hover:scale-105"
                style={{
                  backgroundColor: `${app.color}15`,
                  borderColor: `${app.color}40`,
                }}
              >
                {getIcon(app.iconName, app.color)}
              </div>
              <span className="mt-1.5 text-[11px] font-medium text-slate-200 group-hover:text-white line-clamp-1 max-w-[72px]">
                {app.name}
              </span>
              <span className="text-[9px] text-slate-500 font-mono">
                {app.category === 'Games' ? 'Game' : app.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Floating Dock */}
      <div className="mt-4 pt-2">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-2.5 flex items-center justify-around shadow-2xl">
          {dockApps.map((app) => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{
                backgroundColor: `${app.color}20`,
                border: `1px solid ${app.color}50`,
              }}
              title={app.name}
            >
              {getIcon(app.iconName, app.color)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
