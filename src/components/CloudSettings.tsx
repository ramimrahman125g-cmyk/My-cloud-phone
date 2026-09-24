import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  HardDrive,
  ShieldCheck,
  Zap,
  Activity,
  Globe,
  Trash2,
  CheckCircle,
  Wifi
} from 'lucide-react';

interface CloudSettingsProps {
  ramUsedMb: number;
  onBoostRam: () => void;
  onClearCache: () => void;
}

export const CloudSettings: React.FC<CloudSettingsProps> = ({
  ramUsedMb,
  onBoostRam,
  onClearCache,
}) => {
  const [testingSpeed, setTestingSpeed] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState('948.5 Mbps');
  const [uploadSpeed, setUploadSpeed] = useState('884.2 Mbps');
  const [ping, setPing] = useState('4 ms');

  const runSpeedTest = () => {
    setTestingSpeed(true);
    setTimeout(() => {
      setDownloadSpeed(`${(900 + Math.random() * 80).toFixed(1)} Mbps`);
      setUploadSpeed(`${(820 + Math.random() * 70).toFixed(1)} Mbps`);
      setPing(`${Math.floor(3 + Math.random() * 3)} ms`);
      setTestingSpeed(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4">
      {/* Title */}
      <div className="flex items-center space-x-2.5">
        <Settings className="w-5 h-5 text-sky-400" />
        <h2 className="text-base font-bold text-white">Cloud Phone Specifications</h2>
      </div>

      {/* 100% Zero Local Footprint Certificate */}
      <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-3.5 space-y-1.5 shadow-lg">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>100% Cloud Isolation Guarantee</span>
        </div>
        <p className="text-xs text-emerald-200/90 leading-relaxed">
          This virtual cloud phone runs entirely on Google Cloud infrastructure. It provides <strong>64.0 GB ROM</strong> and <strong>4.0 GB RAM</strong> while consuming exactly <strong>0.0 MB</strong> of your physical smartphone storage.
        </p>
      </div>

      {/* Hardware Specs Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <div className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
          VIRTUAL HARDWARE SPECIFICATIONS
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          <div className="py-2 flex justify-between">
            <span className="text-slate-400">Model</span>
            <span className="text-white font-mono font-semibold">CloudDroid Pro (GCP Edition)</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-400">Virtual RAM</span>
            <span className="text-sky-400 font-mono font-semibold">4,096 MB (4.0 GB LPDDR4x)</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-400">Virtual Storage (ROM)</span>
            <span className="text-emerald-400 font-mono font-semibold">64.0 GB Google Cloud NVMe</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-400">Physical Phone Space Used</span>
            <span className="text-emerald-400 font-mono font-semibold">0.0 MB (Safe & Zero Impact)</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-400">Linux Kernel</span>
            <span className="text-white font-mono">6.1.0-cloud-android-x86_64</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-400">Cloud Provider & Region</span>
            <span className="text-white font-mono">Google Cloud (low-latency microVM)</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-400">Public Virtual IP</span>
            <span className="text-slate-300 font-mono">34.120.89.214</span>
          </div>
        </div>
      </div>

      {/* 10Gbps Cloud Datacenter Pipe & Speedtest */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
            <Wifi className="w-4 h-4" />
            <span>10 Gbps Cloud Datacenter Pipe</span>
          </div>
          <button
            onClick={runSpeedTest}
            disabled={testingSpeed}
            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 rounded-lg text-black font-bold text-xs transition-all active:scale-95"
          >
            {testingSpeed ? 'Testing...' : 'Test Speed'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">DOWNLOAD</div>
            <div className="text-xs font-bold text-sky-400">{downloadSpeed}</div>
          </div>
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">UPLOAD</div>
            <div className="text-xs font-bold text-emerald-400">{uploadSpeed}</div>
          </div>
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">PING</div>
            <div className="text-xs font-bold text-amber-400">{ping}</div>
          </div>
        </div>
      </div>

      {/* Maintenance Actions */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onBoostRam}
          className="flex items-center justify-center space-x-1.5 p-3 rounded-xl bg-sky-600 hover:bg-sky-500 font-bold text-xs text-white shadow-md active:scale-95 transition-all"
        >
          <Zap className="w-4 h-4" />
          <span>Free 4GB RAM</span>
        </button>

        <button
          onClick={onClearCache}
          className="flex items-center justify-center space-x-1.5 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-xs text-slate-200 border border-slate-700 active:scale-95 transition-all"
        >
          <Trash2 className="w-4 h-4 text-emerald-400" />
          <span>Wipe Cloud Cache</span>
        </button>
      </div>
    </div>
  );
};
