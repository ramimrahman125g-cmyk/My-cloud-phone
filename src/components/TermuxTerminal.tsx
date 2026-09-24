import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Send, Sparkles, Trash2, HelpCircle, ShieldAlert } from 'lucide-react';
import { TerminalLine, VirtualFile, CloudPackage } from '../types';

interface TermuxTerminalProps {
  lines: TerminalLine[];
  packages: CloudPackage[];
  files: VirtualFile[];
  onExecuteCommand: (cmd: string) => Promise<void>;
  onClear: () => void;
  isExecuting: boolean;
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
      // Autocomplete files or packages
      const parts = input.split(' ');
      const last = parts[parts.length - 1];
      if (last) {
        const match = files.find(f => f.name.startsWith(last))?.name ||
                      packages.find(p => p.id.startsWith(last))?.id;
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
    } else {
      setInput(prev => prev + key);
    }
    inputRef.current?.focus();
  };

  const quickCommands = [
    'neofetch',
    './welcome.sh',
    './sys_bench.sh',
    'pkg list',
    'pkg install cmatrix',
    'free -h',
    'df -h',
    'curl wttr.in/Tokyo?format=3',
    'ping google.com',
    'cmatrix',
    'ls -la',
    'help',
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#070b14] text-slate-100 font-mono text-xs overflow-hidden select-text">
      {/* Top Terminal Bar */}
      <div className="bg-[#0f172a] border-b border-slate-800 px-3 py-1.5 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white text-[11px] tracking-wide">
            Termux Linux (Cloud VM)
          </span>
          <span className="px-1.5 py-0.2 rounded bg-sky-950 border border-sky-500/30 text-sky-400 text-[10px]">
            4GB RAM
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onExecuteCommand('help')}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Help"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClear}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400"
            title="Clear Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Command Chips */}
      <div className="bg-[#0a0f1d] border-b border-slate-800/80 px-2 py-1.5 flex space-x-1.5 overflow-x-auto select-none no-scrollbar">
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => onExecuteCommand(cmd)}
            className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-emerald-400 text-[10px] whitespace-nowrap active:scale-95 transition-all"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Output Console Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {lines.map((line, idx) => {
          let colorClass = 'text-slate-200';
          if (line.type === 'command') colorClass = 'text-sky-400 font-bold';
          if (line.type === 'success') colorClass = 'text-emerald-400 font-semibold';
          if (line.type === 'error') colorClass = 'text-rose-400';
          if (line.type === 'system') colorClass = 'text-amber-400';

          return (
            <div key={idx} className={`leading-relaxed whitespace-pre-wrap break-all ${colorClass}`}>
              {line.text}
            </div>
          );
        })}

        {isExecuting && (
          <div className="flex items-center space-x-2 text-emerald-400 py-1 text-[11px] animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Executing task in 4GB cloud container...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Termux Modifier Key Bar */}
      <div className="bg-[#111827] border-t border-slate-800 px-2 py-1 flex items-center space-x-1.5 overflow-x-auto select-none">
        {['ESC', 'TAB', 'CTRL', 'ALT', 'UP', 'DOWN', '-', '~', '/', '|'].map((key) => (
          <button
            key={key}
            onClick={() => handleModifierKey(key)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded text-[10px] font-bold text-slate-300 min-w-[28px] text-center transition-colors"
          >
            {key}
          </button>
        ))}
      </div>

      {/* Terminal Input Row */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#0b1120] border-t border-slate-800 px-3 py-2 flex items-center space-x-2"
      >
        <span className="text-emerald-400 font-bold select-none text-xs">
          cloud@gcp:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type bash command, e.g. neofetch, pkg install python3..."
          className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono placeholder:text-slate-600"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!input.trim() || isExecuting}
          className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-black font-bold transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
