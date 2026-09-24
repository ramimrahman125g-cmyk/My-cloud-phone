import React, { useState } from 'react';
import { KeyRound, Terminal, Plus, Server, Check } from 'lucide-react';

interface SshClientProps {
  onConnectSsh: (cmd: string) => void;
}

export const SshClient: React.FC<SshClientProps> = ({ onConnectSsh }) => {
  const [hosts, setHosts] = useState([
    { name: 'Google Cloud Ubuntu VM', host: '34.120.89.1', user: 'cloud', port: 22 },
    { name: 'Debian Production Server', host: '198.51.100.42', user: 'root', port: 22 },
    { name: 'Development Raspberry Pi', host: '192.168.1.150', user: 'pi', port: 22 },
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [user, setUser] = useState('');

  const handleAdd = () => {
    if (host.trim()) {
      setHosts([...hosts, { name: name.trim() || host, host: host.trim(), user: user.trim() || 'root', port: 22 }]);
      setName('');
      setHost('');
      setUser('');
      setShowAdd(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 p-3 space-y-3 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <KeyRound className="w-5 h-5 text-sky-400" />
          <h2 className="text-sm font-bold text-white">Remote SSH Manager</h2>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center space-x-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-semibold text-white shadow transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Server</span>
        </button>
      </div>

      {/* Add Server Form */}
      {showAdd && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
          <div className="text-xs font-bold text-white">New Remote SSH Server</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Server Name (e.g. AWS VPS)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
          />
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="IP / Hostname (e.g. 192.168.1.1)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
          />
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Username (e.g. ubuntu, root)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
          />
          <div className="flex justify-end space-x-2 pt-1">
            <button
              onClick={() => setShowAdd(false)}
              className="px-3 py-1 rounded-lg text-xs text-slate-400"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-3 py-1 bg-emerald-600 rounded-lg text-xs font-bold text-black"
            >
              Save Host
            </button>
          </div>
        </div>
      )}

      {/* Host Cards */}
      <div className="space-y-2">
        {hosts.map((h, i) => (
          <div
            key={i}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between hover:border-slate-700 transition-all shadow"
          >
            <div className="flex items-center space-x-3">
              <Server className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">{h.name}</div>
                <div className="text-[11px] text-sky-400 font-mono">
                  {h.user}@{h.host}:{h.port}
                </div>
              </div>
            </div>

            <button
              onClick={() => onConnectSsh(`ssh ${h.user}@${h.host}`)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-95"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Connect</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
