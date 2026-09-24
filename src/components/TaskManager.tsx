import React, { useState } from 'react';
import { Cpu, Zap, X, ShieldAlert } from 'lucide-react';

interface TaskManagerProps {
  ramUsedMb: number;
  onBoostRam: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ ramUsedMb, onBoostRam }) => {
  const [tasks, setTasks] = useState([
    { pid: 101, name: 'clouddroid-system-core', ram: 420, cpu: 2.1, killable: false },
    { pid: 215, name: 'termux-bash-daemon', ram: 280, cpu: 1.4, killable: true },
    { pid: 342, name: 'google-playstore-cloud', ram: 390, cpu: 3.2, killable: true },
    { pid: 408, name: 'youtube-media-service', ram: 520, cpu: 4.5, killable: true },
    { pid: 519, name: 'python3-runtime-worker', ram: 190, cpu: 0.8, killable: true },
    { pid: 620, name: 'sshd-remote-server', ram: 85, cpu: 0.2, killable: true },
    { pid: 711, name: 'cloud-storage-sync-daemon', ram: 140, cpu: 1.0, killable: false },
  ]);

  const killTask = (pid: number) => {
    setTasks(tasks.filter((t) => t.pid !== pid));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 p-3 space-y-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-bold text-white">4GB RAM & Task Monitor</h2>
        </div>
        <button
          onClick={onBoostRam}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-xl text-xs font-bold text-white shadow-sm transition-all"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Kill Inactive</span>
        </button>
      </div>

      {/* RAM Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-400">4.0 GB Cloud Allocation</span>
          <span className="text-purple-400 font-bold">{ramUsedMb} MB / 4096 MB</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
          <div
            className="bg-purple-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(ramUsedMb / 4096) * 100}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        <div className="text-[11px] font-bold text-slate-400 font-mono">
          ACTIVE CLOUD PROCESSES ({tasks.length})
        </div>
        {tasks.map((task) => (
          <div
            key={task.pid}
            className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between shadow-sm"
          >
            <div>
              <div className="text-xs font-semibold text-white font-mono">{task.name}</div>
              <div className="text-[10px] text-slate-400 font-mono">
                PID: {task.pid} • RAM: {task.ram} MB • CPU: {task.cpu}%
              </div>
            </div>

            {task.killable ? (
              <button
                onClick={() => killTask(task.pid)}
                className="p-1 hover:bg-rose-950/70 text-rose-400 rounded-lg"
                title="End Task"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-[9px] font-mono text-slate-600 font-bold uppercase">System</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
