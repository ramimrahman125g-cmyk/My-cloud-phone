import React from 'react';
import { Trash2 } from 'lucide-react';
import { CloudAppId, CloudAppInfo } from '../types';

interface RecentsDrawerProps {
  apps: CloudAppInfo[];
  onSelectApp: (id: CloudAppId) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const RecentsDrawer: React.FC<RecentsDrawerProps> = ({
  apps,
  onSelectApp,
  onClearAll,
  onClose,
}) => {
  const installedApps = apps.filter((a) => a.isInstalled);

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex flex-col justify-between p-6 select-none"
    >
      <div className="text-center pt-2">
        <h3 className="text-sm font-bold text-white">Active Cloud Tasks (4.0 GB RAM)</h3>
        <p className="text-[11px] text-slate-400">Swipe or tap an app to switch</p>
      </div>

      {/* Cards Carousel */}
      <div className="flex space-x-4 overflow-x-auto py-4 px-2 no-scrollbar">
        {installedApps.map((app) => (
          <div
            key={app.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectApp(app.id);
            }}
            className="w-48 h-64 bg-slate-900 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between shrink-0 shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                style={{
                  backgroundColor: `${app.color}20`,
                  color: app.color,
                  border: `1px solid ${app.color}50`,
                }}
              >
                {app.name.charAt(0)}
              </div>
              <div className="text-xs font-bold text-white truncate">{app.name}</div>
            </div>

            <div className="flex-1 bg-slate-950 rounded-xl my-3 p-3 flex flex-col items-center justify-center text-center">
              <div className="text-[10px] text-slate-400 font-mono">
                {app.ramUsageMb} MB RAM Used
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1">
                Cloud VM Active
              </div>
            </div>

            <div className="text-[10px] text-sky-400 text-center font-medium">
              Tap to switch
            </div>
          </div>
        ))}
      </div>

      {/* Clear All */}
      <div className="flex justify-center pb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClearAll();
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-full shadow-lg transition-all"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Clear All Tasks</span>
        </button>
      </div>
    </div>
  );
};
