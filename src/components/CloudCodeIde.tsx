import React, { useState } from 'react';
import { Code, Play, Terminal } from 'lucide-react';

interface CloudCodeIdeProps {
  onRunInTerminal: (code: string) => void;
}

export const CloudCodeIde: React.FC<CloudCodeIdeProps> = ({ onRunInTerminal }) => {
  const [code, setCode] = useState(
    `#!/bin/bash\necho "[+] Starting Cloud Phone 4GB RAM Workload..."\nfor i in 1 2 3; do\n   echo "Processing cloud batch #$i on Google Cloud NVMe..."\ndone\necho "[SUCCESS] Task finished. Zero phone memory used!"`
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 p-3 space-y-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-bold text-white">Cloud Code IDE</h2>
        </div>
        <button
          onClick={() => onRunInTerminal(code)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run in CloudTerm VM</span>
        </button>
      </div>

      {/* Editor Box */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-inner">
        <div className="bg-slate-950 border-b border-slate-800 px-3 py-1 text-[11px] font-mono text-slate-400">
          scratchpad.sh
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-transparent p-3 text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Presets */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setCode('python3 -c "print(\'Python 3.12 running in 4GB Cloud RAM!\')"')}
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] text-slate-300 font-mono text-center truncate"
        >
          Python Preset
        </button>
        <button
          onClick={() => setCode('curl https://wttr.in/NewYork?format=3')}
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] text-slate-300 font-mono text-center truncate"
        >
          Curl API Preset
        </button>
        <button
          onClick={() => setCode('./welcome.sh')}
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] text-slate-300 font-mono text-center truncate"
        >
          Bash Preset
        </button>
      </div>
    </div>
  );
};
