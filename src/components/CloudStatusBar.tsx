import React from 'react';
import { Wifi, Cloud, Battery, ShieldCheck } from 'lucide-react';

interface CloudStatusBarProps {
  ramUsedMb: number;
}

export const CloudStatusBar: React.FC<CloudStatusBarProps> = ({ ramUsedMb }) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full bg-slate-950/90 backdrop-blur border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs select-none z-20">
      {/* Left: Time & Cloud OS indicator */}
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-slate-200">{currentTime}</span>
        <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
          <Cloud className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Google Cloud</span>
        </div>
      </div>

      {/* Center: Camera Notch simulation */}
      <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800"></div>

      {/* Right: Hardware specs indicators */}
      <div className="flex items-center space-x-2.5 font-mono text-[11px]">
        {/* RAM badge */}
        <div className="flex items-center space-x-1 text-sky-400 bg-sky-950/50 px-1.5 py-0.5 rounded border border-sky-500/20">
          <span>{ramUsedMb}MB / 4GB</span>
        </div>

        {/* 64GB ROM badge */}
        <div className="hidden sm:flex items-center space-x-1 text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
          <span>64GB ROM</span>
        </div>

        {/* 10Gbps Wifi */}
        <div className="flex items-center space-x-0.5 text-emerald-400" title="10Gbps Cloud Datacenter Pipe">
          <Wifi className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">10G</span>
        </div>

        {/* 100% Battery */}
        <div className="flex items-center space-x-1 text-slate-300">
          <span className="text-[10px]">100%</span>
          <Battery className="w-3.5 h-3.5 text-emerald-400 rotate-90" />
        </div>
      </div>
    </div>
  );
};
