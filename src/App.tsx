import React, { useState } from 'react';
import { CloudStatusBar } from './components/CloudStatusBar';
import { AndroidNavBar } from './components/AndroidNavBar';
import { CloudHomeScreen } from './components/CloudHomeScreen';
import { TermuxTerminal } from './components/TermuxTerminal';
import { PlayStore } from './components/PlayStore';
import { YouTubeCloud } from './components/YouTubeCloud';
import { CloudDrive } from './components/CloudDrive';
import { CloudSettings } from './components/CloudSettings';
import { RetroSnake } from './components/RetroSnake';
import { CloudCodeIde } from './components/CloudCodeIde';
import { SshClient } from './components/SshClient';
import { TaskManager } from './components/TaskManager';
import { RecentsDrawer } from './components/RecentsDrawer';
import {
  INITIAL_APPS,
  INITIAL_PACKAGES,
  INITIAL_FILES,
  INITIAL_VIDEOS
} from './data/defaultData';
import { CloudAppId, TerminalLine, CloudPackage, VirtualFile } from './types';
import { Smartphone, Maximize2, Minimize2 } from 'lucide-react';

export function App() {
  const [activeApp, setActiveApp] = useState<CloudAppId>('home');
  const [navStack, setNavStack] = useState<CloudAppId[]>(['home']);
  const [showRecents, setShowRecents] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // System State
  const [ramUsedMb, setRamUsedMb] = useState(1480);
  const [apps, setApps] = useState(INITIAL_APPS);
  const [packages, setPackages] = useState<CloudPackage[]>(INITIAL_PACKAGES);
  const [files, setFiles] = useState<VirtualFile[]>(INITIAL_FILES);
  const [isExecuting, setIsExecuting] = useState(false);

  // Terminal Lines
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { text: '==================================================', type: 'system' },
    { text: '🐧 Termux Linux Environment (Google Cloud MicroVM)', type: 'success' },
    { text: 'Hardware: 4.0 GB LPDDR4x RAM • 64.0 GB Cloud NVMe ROM', type: 'system' },
    { text: 'Zero Phone Storage: 100% Hosted on Google Cloud Platform', type: 'success' },
    { text: 'Type "help", "neofetch", or "./welcome.sh" to begin.', type: 'normal' },
    { text: '==================================================', type: 'system' },
  ]);

  // Navigation handlers
  const openApp = (id: CloudAppId) => {
    setShowRecents(false);
    setActiveApp(id);
    setNavStack(prev => [...prev.filter(x => x !== id), id]);
  };

  const handleBack = () => {
    if (showRecents) {
      setShowRecents(false);
      return;
    }
    if (activeApp !== 'home') {
      setActiveApp('home');
    }
  };

  const handleHome = () => {
    setShowRecents(false);
    setActiveApp('home');
  };

  const handleRecents = () => {
    setShowRecents(!showRecents);
  };

  const boostRam = () => {
    setRamUsedMb(780);
  };

  const clearCache = () => {
    setRamUsedMb(prev => Math.max(700, prev - 240));
  };

  // Play Store install toggle
  const toggleInstallApp = (id: CloudAppId) => {
    setApps(prev =>
      prev.map(app => {
        if (app.id === id) {
          const nextState = !app.isInstalled;
          if (nextState) {
            setRamUsedMb(r => Math.min(3800, r + app.ramUsageMb));
          } else {
            setRamUsedMb(r => Math.max(700, r - app.ramUsageMb));
          }
          return { ...app, isInstalled: nextState };
        }
        return app;
      })
    );
  };

  // Terminal Command Interpreter
  const executeTerminalCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newLines: TerminalLine[] = [
      ...terminalLines,
      { text: `cloud@gcp:~$ ${trimmed}`, type: 'command' },
    ];

    setIsExecuting(true);

    if (cmd === 'clear') {
      setTerminalLines([]);
      setIsExecuting(false);
      return;
    }

    if (cmd === 'help') {
      newLines.push({
        text: `Termux Cloud Commands:
  neofetch             Display Cloud Phone specs & ASCII system info
  pkg list             List available virtual Linux packages
  pkg install <name>   Install package (cmatrix, htop, nodejs, nmap, etc.)
  pkg remove <name>    Remove package from 64GB Cloud ROM
  free -h              Inspect 4.0 GB virtual RAM allocation
  df -h                Inspect 64.0 GB Google Cloud NVMe ROM
  curl <url>           Fetch live HTTP API / website data
  ping <host>          Test datacenter network latency
  ssh <host>           Open remote SSH terminal session
  python3 -c "..."     Execute Python 3 script
  ls -la               List files in current cloud directory
  cat <file>           Display content of cloud file
  ./<script.sh>        Execute virtual bash script
  cmatrix              Display green matrix terminal cascade
  clear                Clear terminal output`,
        type: 'normal',
      });
    } else if (cmd === 'neofetch') {
      newLines.push({
        text: `       _,met$$$$$gg.          cloud@google-cloud-microvm
    ,g$$$$$$$$$$$$$$$P.       --------------------------
  ,g$$P" ""     """Y$$.".     OS: CloudDroid Linux 6.1 (Debian GNU/Linux 12)
 ,$$P'              \`$$$.     Host: Google Cloud Compute Engine (MicroVM)
',$$P       ,ggs.     \`$$b:   Kernel: 6.1.0-cloud-android-x86_64
\`d$$'     ,$P"'   .    $$$    Uptime: 24 days, 16 hours
 $$P      d$'     ,    $$$P   Packages: ${packages.filter(p => p.isInstalled).length + 42} (dpkg/pkg)
 $$:      $$.   -    ,d$$'    Shell: bash 5.2.21 (Termux Cloud Build)
 $$;      Y$b._   _,d$P'      Display: Virtual 1080x2400 (60Hz)
 Y$$.    \`."Y$$$$P"'          CPU: 8-Core Virtual Xeon @ 3.40GHz
 \`$$b      "-.__              Memory: ${ramUsedMb}MiB / 4096MiB (4.0 GB RAM)
  \`Y$$                        Disk: 10.2GiB / 64.0GiB (Google Cloud NVMe)
   \`$$b.                      Local Phone Disk: 0.0 MB (Zero storage used)
     \`Y$$b.                   IP: 34.120.89.214 (Datacenter Link: 10Gbps)`,
        type: 'normal',
      });
    } else if (cmd === 'free' || (cmd === 'free' && args[0] === '-h')) {
      newLines.push({
        text: `               total        used        free      shared  buff/cache   available
Mem:           4.0Gi       ${(ramUsedMb / 1024).toFixed(1)}Gi       ${((4096 - ramUsedMb) / 1024).toFixed(1)}Gi       128Mi       512Mi       ${((4096 - ramUsedMb) / 1024).toFixed(1)}Gi
Swap:          2.0Gi        64Mi       1.9Gi
(Cloud LPDDR4x RAM Allocation: 4096 MB Virtual Environment)`,
        type: 'normal',
      });
    } else if (cmd === 'df' || (cmd === 'df' && args[0] === '-h')) {
      newLines.push({
        text: `Filesystem      Size  Used Avail Use% Mounted on
/dev/gcp-nvme   64G   10G   54G  16% /
tmpfs          2.0G     0  2.0G   0% /dev/shm
/dev/gdrive     64G  1.4G   62G   3% /storage/google-cloud-drive
(Device storage used: 0.0 MB • 100% remote Google Cloud SSD)`,
        type: 'normal',
      });
    } else if (cmd === 'pkg' || cmd === 'apt') {
      const sub = args[0];
      const target = args[1];

      if (sub === 'list') {
        newLines.push({
          text: `Installed packages (64GB Cloud Storage):
${packages
  .map(
    p =>
      `  ${p.id} [${p.isInstalled ? 'INSTALLED' : 'AVAILABLE'}] - v${p.version} (${p.sizeMb}MB): ${p.description}`
  )
  .join('\n')}`,
          type: 'normal',
        });
      } else if (sub === 'install') {
        if (!target) {
          newLines.push({ text: 'Usage: pkg install <package_name>', type: 'error' });
        } else {
          const pkg = packages.find(p => p.id === target || p.name.toLowerCase() === target.toLowerCase());
          if (!pkg) {
            newLines.push({ text: `E: Unable to locate package "${target}" in Google Cloud mirrors.`, type: 'error' });
          } else if (pkg.isInstalled) {
            newLines.push({ text: `${pkg.name} is already installed in the cloud container.`, type: 'system' });
          } else {
            // Install it
            setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, isInstalled: true } : p));
            newLines.push({
              text: `Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  ${pkg.id} (${pkg.version})
Need to get ${pkg.sizeMb}MB of archives from gcp.termux.org...
Fetched ${pkg.sizeMb}MB in 0.04s (10Gbps Cloud Pipe)
Unpacking ${pkg.id} into /data/data/com.termux/files/usr...
Setting up ${pkg.id} (${pkg.version})...
Processing triggers for man-db...
[SUCCESS] ${pkg.name} installed successfully into 64GB Cloud ROM!`,
              type: 'success',
            });
          }
        }
      } else if (sub === 'remove' || sub === 'uninstall') {
        if (!target) {
          newLines.push({ text: 'Usage: pkg remove <package_name>', type: 'error' });
        } else {
          setPackages(prev => prev.map(p => p.id === target ? { ...p, isInstalled: false } : p));
          newLines.push({ text: `Removed package ${target} and freed disk space on 64GB ROM.`, type: 'success' });
        }
      } else {
        newLines.push({ text: 'Available commands: pkg list, pkg install <pkg>, pkg remove <pkg>', type: 'normal' });
      }
    } else if (cmd.startsWith('./') || cmd === 'bash' || cmd === 'sh') {
      const scriptName = cmd.startsWith('./') ? cmd.replace('./', '') : args[0];
      const targetFile = files.find(f => f.name === scriptName || f.name === `${scriptName}.sh`);

      if (targetFile) {
        newLines.push({
          text: `Executing script "${targetFile.name}" on Cloud VM:\n----------------------------------------\n${targetFile.content}\n----------------------------------------\n[Finished with exit code 0]`,
          type: 'success',
        });
      } else {
        newLines.push({ text: `bash: ${scriptName}: No such file or directory`, type: 'error' });
      }
    } else if (cmd === 'curl') {
      const url = args[0];
      if (!url) {
        newLines.push({ text: 'Usage: curl <url> (e.g. curl wttr.in/Tokyo?format=3)', type: 'error' });
      } else {
        newLines.push({
          text: `Connecting to ${url} via 10Gbps Google Cloud datacenter link...\nHTTP/2 200 OK\nContent-Type: text/plain\n\nTokyo: ☀️ +19°C ↗ 14km/h\n(Fetched 124 bytes in 8ms via Google Cloud egress)`,
          type: 'success',
        });
      }
    } else if (cmd === 'ping') {
      const host = args[0] || 'google.com';
      newLines.push({
        text: `PING ${host} (142.250.190.46) 56(84) bytes of data.
64 bytes from 142.250.190.46: icmp_seq=1 ttl=118 time=2.41 ms
64 bytes from 142.250.190.46: icmp_seq=2 ttl=118 time=2.83 ms
64 bytes from 142.250.190.46: icmp_seq=3 ttl=118 time=2.19 ms
--- ${host} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max = 2.19/2.47/2.83 ms (Google Cloud Datacenter Pipe)`,
        type: 'normal',
      });
    } else if (cmd === 'ssh') {
      const target = args[0] || 'cloud@34.120.89.1';
      newLines.push({
        text: `OpenSSH_9.6p1, OpenSSL 3.0.13
Connecting to ${target}...
Authenticated to ${target} (using publickey via cloud agent).
Last login: Wed Sep 24 02:40:12 2026 from 34.120.89.214
Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)
* Documentation:  https://help.ubuntu.com
* Management:     https://landscape.canonical.com
Session verified. Remote server connection active.`,
        type: 'success',
      });
    } else if (cmd === 'cmatrix') {
      newLines.push({
        text: `01010100 01100101 01110010 01101101 01110101 01111000
10101100 00110101 11001101 01010101 11110000 00001111
01100011 01101100 01101111 01110101 01100100 01110000
11010101 00101011 11011011 00011100 11011101 10101010
MATRIX RAIN: 4GB RAM Cloud Instance Running Smoothly.`,
        type: 'success',
      });
    } else if (cmd === 'ls') {
      newLines.push({
        text: files
          .map(f => `${f.isDirectory ? 'drwxr-xr-x' : '-rw-r--r--'} 1 cloud cloud ${f.sizeBytes} ${f.modified} ${f.name}`)
          .join('\n'),
        type: 'normal',
      });
    } else if (cmd === 'cat') {
      const fileName = args[0];
      const target = files.find(f => f.name === fileName);
      if (target) {
        newLines.push({ text: target.content, type: 'normal' });
      } else {
        newLines.push({ text: `cat: ${fileName}: No such file or directory`, type: 'error' });
      }
    } else if (cmd === 'python3') {
      if (args[0] === '-c' && args.length > 1) {
        newLines.push({ text: `Python 3.12: Executed -> ${args.slice(1).join(' ')}`, type: 'success' });
      } else {
        newLines.push({
          text: `Python 3.12.2 (main, Feb 20 2026, 14:20:00) [GCC 13.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 4 * 1024 # 4GB RAM Available
4096`,
          type: 'normal',
        });
      }
    } else {
      newLines.push({
        text: `bash: ${cmd}: command not found. Try "help" or "pkg install ${cmd}".`,
        type: 'error',
      });
    }

    setTerminalLines(newLines);
    setIsExecuting(false);
  };

  // Cloud Drive File actions
  const handleSaveFile = (path: string, content: string) => {
    setFiles(prev =>
      prev.map(f => (f.path === path ? { ...f, content, sizeBytes: content.length, modified: 'Just now' } : f))
    );
  };

  const handleCreateFile = (name: string, content: string) => {
    const newFile: VirtualFile = {
      name,
      path: `/home/cloud/${name}`,
      content,
      isDirectory: false,
      sizeBytes: content.length,
      modified: 'Just now',
      isExecutable: name.endsWith('.sh'),
    };
    setFiles(prev => [...prev, newFile]);
  };

  const handleDeleteFile = (path: string) => {
    setFiles(prev => prev.filter(f => f.path !== path));
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-0 sm:p-4 overflow-hidden">
      {/* Top Outer Bar for Viewport Toggle */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-2 px-2 text-xs text-slate-400 select-none">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-white">CloudPhone OS</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
            64GB ROM • 4GB RAM
          </span>
        </div>
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center space-x-1 hover:text-white px-2 py-1 bg-slate-900 rounded-lg border border-slate-800 transition-colors"
          title="Toggle Fullscreen View"
        >
          {isPhoneFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          <span>{isPhoneFrame ? 'Fullscreen' : 'Phone Frame'}</span>
        </button>
      </div>

      {/* Main Android Phone Body */}
      <div
        className={`w-full flex flex-col bg-slate-950 overflow-hidden relative ${
          isPhoneFrame
            ? 'sm:max-w-[430px] sm:h-[860px] sm:rounded-[42px] sm:border-[10px] sm:border-slate-800 sm:shadow-[0_0_50px_rgba(0,0,0,0.8)]'
            : 'h-full max-w-none'
        }`}
      >
        {/* Android Cloud Status Bar */}
        <CloudStatusBar ramUsedMb={ramUsedMb} />

        {/* Dynamic Active App Screen */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeApp === 'home' && (
            <CloudHomeScreen
              apps={apps}
              ramUsedMb={ramUsedMb}
              onOpenApp={openApp}
              onBoostRam={boostRam}
            />
          )}

          {activeApp === 'terminal' && (
            <TermuxTerminal
              lines={terminalLines}
              packages={packages}
              files={files}
              onExecuteCommand={executeTerminalCommand}
              onClear={() => setTerminalLines([])}
              isExecuting={isExecuting}
            />
          )}

          {activeApp === 'playstore' && (
            <PlayStore
              apps={apps}
              onToggleInstall={toggleInstallApp}
              onOpenApp={openApp}
            />
          )}

          {activeApp === 'youtube' && (
            <YouTubeCloud videos={INITIAL_VIDEOS} />
          )}

          {activeApp === 'drive' && (
            <CloudDrive
              files={files}
              onSaveFile={handleSaveFile}
              onCreateFile={handleCreateFile}
              onDeleteFile={handleDeleteFile}
            />
          )}

          {activeApp === 'settings' && (
            <CloudSettings
              ramUsedMb={ramUsedMb}
              onBoostRam={boostRam}
              onClearCache={clearCache}
            />
          )}

          {activeApp === 'code' && (
            <CloudCodeIde
              onRunInTerminal={(code) => {
                openApp('terminal');
                executeTerminalCommand(code);
              }}
            />
          )}

          {activeApp === 'ssh' && (
            <SshClient
              onConnectSsh={(cmd) => {
                openApp('terminal');
                executeTerminalCommand(cmd);
              }}
            />
          )}

          {activeApp === 'snake' && <RetroSnake />}

          {activeApp === 'ram_monitor' && (
            <TaskManager ramUsedMb={ramUsedMb} onBoostRam={boostRam} />
          )}

          {/* Recents Multitasking Carousel */}
          {showRecents && (
            <RecentsDrawer
              apps={apps}
              onSelectApp={openApp}
              onClearAll={() => {
                boostRam();
                handleHome();
              }}
              onClose={() => setShowRecents(false)}
            />
          )}
        </div>

        {/* 3-Button Android Navigation Bar */}
        <AndroidNavBar
          onBack={handleBack}
          onHome={handleHome}
          onRecents={handleRecents}
        />
      </div>
    </div>
  );
}
