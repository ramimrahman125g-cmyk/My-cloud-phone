import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Send,
  Trash2,
  HelpCircle,
  Zap,
  RotateCcw,
  Camera,
  Layers,
  Package,
  Cpu,
  HardDrive,
  Wifi,
  X,
  Plus,
  CheckCircle,
  Play,
  Server,
  ShieldCheck
} from 'lucide-react';
import { TerminalLine, VirtualFile, CloudPackage } from '../types';

interface TermuxTerminalProps {
  lines: TerminalLine[];
  packages: CloudPackage[];
  files: VirtualFile[];
  onExecuteCommand: (cmd: string) => Promise<void>;
  onClear: () => void;
  isExecuting: boolean;
}

interface SessionTab {
  id: string;
  name: string;
  command: string;
}

export const TermuxTerminal: React.FC<TermuxTerminalProps> = ({
  lines,
  packages,
  files,
  onExecuteCommand,
  onClear,
  isExecuting,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTurbo, setIsTurbo] = useState(true);
  const [isSudo, setIsSudo] = useState(false);
  const [activeTab, setActiveTab] = useState('bash-1');
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [installedNotification, setInstalledNotification] = useState<string | null>(null);

  const [tabs, setTabs] = useState<SessionTab[]>([
    { id: 'bash-1', name: 'bash-1', command: '' },
    { id: 'speedtest', name: 'speedtest', command: 'speedtest' },
    { id: 'python3', name: 'python3', command: 'python3' },
    { id: 'docker', name: 'docker', command: 'docker ps' },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, isExecuting]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isExecuting) return;

    const cmd = input.trim();
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');
    onExecuteCommand(cmd);
  };

  const handleModifierKey = (key: string) => {
    if (key === 'ESC') {
      setInput('');
    } else if (key === 'TAB') {
      // Autocomplete files, packages, or common commands
      const parts = input.split(' ');
      const last = parts[parts.length - 1];
      if (last) {
        const commonCommands = ['speedtest', 'neofetch', 'docker', 'sysbench', 'cmatrix', 'python3', 'free', 'df'];
        const match =
          files.find(f => f.name.startsWith(last))?.name ||
          packages.find(p => p.id.startsWith(last))?.id ||
          commonCommands.find(c => c.startsWith(last));
        if (match) {
          parts[parts.length - 1] = match;
          setInput(parts.join(' '));
        }
      }
    } else if (key === 'UP') {
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx] || '');
      }
    } else if (key === 'DOWN') {
      if (history.length > 0 && historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < history.length) {
          setHistoryIndex(nextIdx);
          setInput(history[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInput('');
        }
      }
    } else if (key === 'SUDO') {
      setIsSudo(!isSudo);
    } else if (key === 'CLEAR') {
      onClear();
    } else {
      setInput(prev => prev + key);
    }
    inputRef.current?.focus();
  };

  const handleTabClick = (tab: SessionTab) => {
    setActiveTab(tab.id);
    if (tab.command) {
      onExecuteCommand(tab.command);
    }
  };

  const handleAddTab = () => {
    const newId = `bash-${tabs.length + 1}`;
    setTabs(prev => [...prev, { id: newId, name: newId, command: '' }]);
    setActiveTab(newId);
  };

  const handleFastInstall = (pkgId: string) => {
    setShowPkgModal(false);
    onExecuteCommand(`pkg install ${pkgId}`);
  };

  const fastChips = [
    { label: '⚡ speedtest', cmd: 'speedtest' },
    { label: '🐧 neofetch', cmd: 'neofetch' },
    { label: '🐳 docker ps', cmd: 'docker ps' },
    { label: '🚀 sysbench', cmd: 'sysbench' },
    { label: '🧠 free -h', cmd: 'free -h' },
    { label: '💾 df -h', cmd: 'df -h' },
    { label: '📦 pkg install cmatrix', cmd: 'pkg install cmatrix' },
    { label: '📊 htop', cmd: 'htop' },
    { label: '✨ cmatrix', cmd: 'cmatrix' },
    { label: '🐍 python3', cmd: 'python3' },
    { label: '🌐 ping google.com', cmd: 'ping google.com' },
    { label: '📜 ./welcome.sh', cmd: './welcome.sh' },
    { label: '⏱️ uptime', cmd: 'uptime' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#070b14] text-slate-100 font-mono text-xs overflow-hidden select-text relative">
      {/* Top VM Control Header */}
      <div className="bg-[#0c1322] border-b border-slate-800/90 px-3 py-2 flex items-center justify-between select-none shadow-md">
        {/* Left: VM Identity & Status */}
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 shadow-inner">
            <TerminalIcon className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-white text-xs tracking-wide">
                CloudTerm VM
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                RUNNING
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-400">
              <span className="text-emerald-400/90">0.2ms latency</span>
              <span>•</span>
              <span>4GB RAM</span>
              <span>•</span>
              <span>64GB ROM</span>
            </div>
          </div>
        </div>

        {/* Right: Quick VM Actions & Turbo Button */}
        <div className="flex items-center space-x-1.5">
          {/* Turbo Toggle */}
          <button
            onClick={() => setIsTurbo(!isTurbo)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${
              isTurbo
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Fast Turbo VM Execution"
          >
            <Zap className={`w-3 h-3 ${isTurbo ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
            <span>{isTurbo ? 'TURBO ON' : 'TURBO OFF'}</span>
          </button>

          {/* Fast Reboot Button */}
          <button
            onClick={() => onExecuteCommand('reboot')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all active:scale-95"
            title="Fast Reboot VM (0.4s)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* VM Snapshot Button */}
          <button
            onClick={() => onExecuteCommand('snapshot')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all active:scale-95"
            title="Instant VM Snapshot"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* Pkg Manager Modal Button */}
          <button
            onClick={() => setShowPkgModal(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700/60 transition-all active:scale-95"
            title="Fast Package Manager"
          >
            <Package className="w-3.5 h-3.5" />
          </button>

          {/* Specs Info Button */}
          <button
            onClick={() => setShowSpecsModal(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-slate-700/60 transition-all active:scale-95"
            title="CloudTerm VM Hardware Specs"
          >
            <Cpu className="w-3.5 h-3.5" />
          </button>

          {/* Clear Button */}
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-all active:scale-95"
            title="Clear Screen"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Multi-Session Tabs Bar */}
      <div className="bg-[#090e1a] border-b border-slate-800 px-2 py-1 flex items-center space-x-1.5 overflow-x-auto select-none no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono flex items-center space-x-1.5 transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{tab.name}</span>
          </button>
        ))}
        <button
          onClick={handleAddTab}
          className="p-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] border border-slate-800 transition-all"
          title="Open New Shell Session"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Fast Command Launcher Chips */}
      <div className="bg-[#090f1e] border-b border-slate-800/80 px-2 py-1.5 flex space-x-1.5 overflow-x-auto select-none no-scrollbar">
        {fastChips.map((item) => (
          <button
            key={item.cmd}
            onClick={() => onExecuteCommand(item.cmd)}
            className="px-2 py-0.5 rounded-md bg-slate-800/90 hover:bg-slate-700 border border-slate-700/70 text-emerald-400 hover:text-emerald-300 text-[10px] whitespace-nowrap active:scale-95 transition-all shadow-sm flex items-center space-x-1"
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Console Output Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 select-text font-mono text-xs">
        {lines.map((line, idx) => {
          let colorClass = 'text-slate-200';
          if (line.type === 'command') colorClass = 'text-sky-300 font-bold';
          if (line.type === 'success') colorClass = 'text-emerald-400 font-semibold';
          if (line.type === 'error') colorClass = 'text-rose-400 font-semibold';
          if (line.type === 'system') colorClass = 'text-amber-300';

          return (
            <div key={idx} className={`leading-relaxed whitespace-pre-wrap break-all ${colorClass}`}>
              {line.text}
            </div>
          );
        })}

        {isExecuting && (
          <div className="flex items-center space-x-2 text-emerald-400 py-1 text-[11px] animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>CloudTerm VM: processing command via 10Gbps Google Cloud link...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Termux Mobile Modifier Key Bar */}
      <div className="bg-[#0d1424] border-t border-slate-800 px-2 py-1 flex items-center space-x-1.5 overflow-x-auto select-none no-scrollbar">
        {['ESC', 'TAB', 'CTRL', 'ALT', 'UP', 'DOWN', 'SUDO', '-', '~', '/', '|', 'CLEAR'].map((key) => (
          <button
            key={key}
            onClick={() => handleModifierKey(key)}
            className={`px-2 py-1 rounded text-[10px] font-bold min-w-[28px] text-center transition-all active:scale-95 ${
              key === 'SUDO' && isSudo
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Terminal Input Row */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#080d18] border-t border-slate-800 px-3 py-2 flex items-center space-x-2"
      >
        <span className={`font-bold select-none text-xs ${isSudo ? 'text-rose-400' : 'text-emerald-400'}`}>
          {isSudo ? 'root@gcp:~#' : 'cloud@gcp:~$'}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="fast command: speedtest, docker, sysbench, pkg install..."
          className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono placeholder:text-slate-600"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!input.trim() || isExecuting}
          className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-black font-bold transition-all active:scale-95 flex items-center space-x-1 shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Package Manager Fast Modal */}
      {showPkgModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-slate-950 border-b border-slate-800 p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-xs font-bold text-white">CloudTerm Fast Package Manager</h3>
                  <p className="text-[10px] text-slate-400">Installs directly to 64GB Cloud ROM • 0MB Phone Storage</p>
                </div>
              </div>
              <button
                onClick={() => setShowPkgModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-white">{pkg.name}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">v{pkg.version}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[9px]">
                        {pkg.sizeMb} MB
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{pkg.description}</p>
                  </div>

                  <button
                    onClick={() => handleFastInstall(pkg.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                      pkg.isInstalled
                        ? 'bg-slate-800 text-emerald-400 hover:bg-rose-950/60 hover:text-rose-400'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow'
                    }`}
                  >
                    {pkg.isInstalled ? 'Installed' : 'Fast Install'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VM Specs Modal */}
      {showSpecsModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">CloudTerm VM Virtual Hardware</h3>
              </div>
              <button
                onClick={() => setShowSpecsModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Cloud Processor</div>
                <div className="text-white font-bold mt-0.5">8-Core vCPU (3.4GHz)</div>
                <div className="text-sky-400 text-[10px]">KVM Hardware Virtualized</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Cloud RAM</div>
                <div className="text-white font-bold mt-0.5">4.0 GB LPDDR4x</div>
                <div className="text-emerald-400 text-[10px]">Fast ZRAM Compression</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Cloud Storage</div>
                <div className="text-white font-bold mt-0.5">64.0 GB Google Cloud NVMe</div>
                <div className="text-emerald-400 text-[10px]">0.0 MB on phone</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Network Backbone</div>
                <div className="text-white font-bold mt-0.5">10 Gbps Cloud Fiber</div>
                <div className="text-sky-400 text-[10px]">0.2ms Datacenter Latency</div>
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 flex items-center space-x-2 text-emerald-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Zero physical device storage or memory consumption. 100% powered in Google Cloud MicroVM container.
              </span>
            </div>

            <button
              onClick={() => setShowSpecsModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all"
            >
              Close Hardware Specs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
