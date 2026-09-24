import { CloudAppInfo, CloudPackage, YouTubeVideo, VirtualFile } from '../types';

export const INITIAL_APPS: CloudAppInfo[] = [
  {
    id: 'terminal',
    packageName: 'com.termux.cloud',
    name: 'Termux Linux',
    summary: 'Full Linux bash terminal, pkg manager, ssh & python',
    iconName: 'Terminal',
    color: '#00E676',
    appSizeMb: 48,
    ramUsageMb: 280,
    category: 'Development',
    rating: 4.9,
    downloads: '50M+',
    isInstalled: true,
    isSystemApp: true,
  },
  {
    id: 'playstore',
    packageName: 'com.android.vending.cloud',
    name: 'Play Store',
    summary: 'Virtual Cloud App Store (Uses 64GB Cloud Storage)',
    iconName: 'ShoppingBag',
    color: '#00C853',
    appSizeMb: 65,
    ramUsageMb: 390,
    category: 'System',
    rating: 4.8,
    downloads: '1B+',
    isInstalled: true,
    isSystemApp: true,
  },
  {
    id: 'youtube',
    packageName: 'com.google.android.youtube.cloud',
    name: 'YouTube Cloud',
    summary: 'Watch videos, tutorials, tech streams & music',
    iconName: 'PlaySquare',
    color: '#FF1744',
    appSizeMb: 85,
    ramUsageMb: 520,
    category: 'Entertainment',
    rating: 4.7,
    downloads: '5B+',
    isInstalled: true,
    isSystemApp: false,
  },
  {
    id: 'drive',
    packageName: 'com.google.android.apps.docs.cloud',
    name: 'Cloud Drive',
    summary: '64GB Google Cloud ROM Explorer • 0MB on phone',
    iconName: 'Folder',
    color: '#2979FF',
    appSizeMb: 32,
    ramUsageMb: 140,
    category: 'Productivity',
    rating: 4.6,
    downloads: '100M+',
    isInstalled: true,
    isSystemApp: true,
  },
  {
    id: 'settings',
    packageName: 'com.android.settings.cloud',
    name: 'Cloud Specs',
    summary: '4GB RAM & 64GB ROM specs, network & RAM booster',
    iconName: 'Settings',
    color: '#94A3B8',
    appSizeMb: 18,
    ramUsageMb: 110,
    category: 'System',
    rating: 4.9,
    downloads: 'Pre-installed',
    isInstalled: true,
    isSystemApp: true,
  },
  {
    id: 'code',
    packageName: 'com.clouddroid.ide',
    name: 'Cloud Code IDE',
    summary: 'Python, Bash & Web script editor with instant run',
    iconName: 'Code',
    color: '#FF9100',
    appSizeMb: 55,
    ramUsageMb: 240,
    category: 'Development',
    rating: 4.8,
    downloads: '10M+',
    isInstalled: true,
    isSystemApp: false,
  },
  {
    id: 'ssh',
    packageName: 'com.clouddroid.ssh',
    name: 'SSH Connect',
    summary: 'Remote server manager & secure shell client',
    iconName: 'KeyRound',
    color: '#00B0FF',
    appSizeMb: 22,
    ramUsageMb: 95,
    category: 'Network',
    rating: 4.7,
    downloads: '5M+',
    isInstalled: true,
    isSystemApp: false,
  },
  {
    id: 'snake',
    packageName: 'com.clouddroid.snake',
    name: 'Retro Snake',
    summary: 'Classic retro arcade snake in cloud container',
    iconName: 'Gamepad2',
    color: '#FFD600',
    appSizeMb: 12,
    ramUsageMb: 75,
    category: 'Games',
    rating: 4.9,
    downloads: '2M+',
    isInstalled: true,
    isSystemApp: false,
  },
  {
    id: 'ram_monitor',
    packageName: 'com.clouddroid.taskmanager',
    name: 'RAM Monitor',
    summary: '4GB RAM process monitor and cloud task killer',
    iconName: 'Cpu',
    color: '#D500F9',
    appSizeMb: 15,
    ramUsageMb: 80,
    category: 'System',
    rating: 4.9,
    downloads: '15M+',
    isInstalled: true,
    isSystemApp: true,
  },
];

export const INITIAL_PACKAGES: CloudPackage[] = [
  { id: 'neofetch', name: 'Neofetch', version: '7.1.0', sizeMb: 0.8, description: 'CLI system information tool', isInstalled: true, category: 'System' },
  { id: 'curl', name: 'Curl', version: '8.5.0', sizeMb: 3.2, description: 'Command line tool for transferring data with URLs', isInstalled: true, category: 'Network' },
  { id: 'openssh', name: 'OpenSSH', version: '9.6p1', sizeMb: 8.4, description: 'Secure Shell client for remote server connectivity', isInstalled: true, category: 'Network' },
  { id: 'python3', name: 'Python 3.12', version: '3.12.2', sizeMb: 48.5, description: 'Modern interpreted high-level programming language', isInstalled: true, category: 'Development' },
  { id: 'git', name: 'Git', version: '2.44.0', sizeMb: 32.1, description: 'Distributed version control system', isInstalled: true, category: 'Development' },
  { id: 'cmatrix', name: 'CMatrix', version: '2.0', sizeMb: 1.2, description: 'Matrix digital rain animation in terminal', isInstalled: false, category: 'Fun' },
  { id: 'htop', name: 'Htop', version: '3.3.0', sizeMb: 4.1, description: 'Interactive process monitor for 4GB RAM', isInstalled: false, category: 'System' },
  { id: 'nodejs', name: 'Node.js', version: '20.11.1', sizeMb: 72.0, description: "JavaScript runtime built on Chrome's V8 engine", isInstalled: false, category: 'Development' },
  { id: 'nmap', name: 'Nmap', version: '7.94', sizeMb: 24.6, description: 'Network exploration tool and security / port scanner', isInstalled: false, category: 'Security' },
  { id: 'vim', name: 'Vim', version: '9.1.0', sizeMb: 18.2, description: 'Vi IMproved advanced text editor', isInstalled: false, category: 'Editor' },
  { id: 'nano', name: 'GNU nano', version: '7.2', sizeMb: 2.9, description: 'Simple, friendly command line text editor', isInstalled: false, category: 'Editor' },
  { id: 'tree', name: 'Tree', version: '2.1.1', sizeMb: 0.5, description: 'Recursive directory listing command', isInstalled: false, category: 'Utilities' },
];

export const INITIAL_FILES: VirtualFile[] = [
  {
    name: 'welcome.sh',
    path: '/home/cloud/welcome.sh',
    content: `#!/bin/bash
echo "=================================================="
echo "🚀 WELCOME TO CLOUDDROID TERMINAL & LINUX OS 🚀"
echo "=================================================="
echo "Specs: 4.0 GB RAM | 64.0 GB Cloud ROM (Google Cloud)"
echo "Status: Zero device storage used! 100% Cloud-Powered."
echo ""
echo "Quick commands:"
echo "  neofetch       - Display cloud phone specs & system info"
echo "  pkg install    - Install packages (python, node, git, etc.)"
echo "  curl <url>     - Query real internet APIs / websites"
echo "  ssh <host>     - Connect to remote servers"
echo "  free -h / df -h- Check RAM and 64GB Cloud Storage"
echo "  ./sys_bench.sh - Run 4GB RAM cloud benchmark"
echo "=================================================="`,
    isDirectory: false,
    sizeBytes: 680,
    modified: 'Sep 23 19:40',
    isExecutable: true,
  },
  {
    name: 'sys_bench.sh',
    path: '/home/cloud/sys_bench.sh',
    content: `#!/bin/bash
echo "[*] Initializing CloudDroid 4GB RAM & 64GB ROM Benchmark..."
echo "[+] Allocating 1024MB Cloud Virtual Buffer..."
echo "[+] Testing Google Cloud NVMe I/O Speed..."
echo "[+] Read: 2450 MB/s | Write: 1890 MB/s (100% Cloud-Backed)"
echo "[+] CPU: 8-Core Virtual Xeon @ 3.4GHz"
echo "[+] Benchmark Score: 9840 pts (OPTIMAL PERFORMANCE)"`,
    isDirectory: false,
    sizeBytes: 345,
    modified: 'Sep 23 19:45',
    isExecutable: true,
  },
  {
    name: 'matrix.sh',
    path: '/home/cloud/matrix.sh',
    content: `#!/bin/bash
echo "Connecting to CloudDroid Matrix Stream..."
echo "01010100 01100101 01110010 01101101 01110101 01111000"
echo "01000011 01101100 01101111 01110101 01100100 01010000"
echo "System secure: 4GB RAM Allocated. Google Cloud Connected."`,
    isDirectory: false,
    sizeBytes: 250,
    modified: 'Sep 23 19:50',
    isExecutable: true,
  },
  {
    name: 'cloud_test.py',
    path: '/home/cloud/cloud_test.py',
    content: `# Python Cloud Script
import sys
print("Python 3.12 Cloud Runtime")
print("Cloud Memory: 4096 MB LPDDR4x")
print("Cloud ROM: 64 GB NVMe")
print("Status: Cloud VM operational on Google Cloud!")`,
    isDirectory: false,
    sizeBytes: 195,
    modified: 'Sep 23 19:52',
    isExecutable: true,
  },
  {
    name: 'CLOUD_STORAGE_INFO.txt',
    path: '/storage/google-cloud-drive/CLOUD_STORAGE_INFO.txt',
    content: `====================================================
GOOGLE CLOUD STORAGE VIRTUAL MOUNT
====================================================
Total Quota: 64.0 GB NVMe Cloud Disk
Physical Device Impact: 0.0 MB (Zero local storage used)
Sync Status: Connected to Google Cloud Platform Datacenter
Latency: 4ms • 10 Gbps Cloud Link

All packages, bash scripts, videos, and Play Store apps
run entirely in your remote cloud environment!
====================================================`,
    isDirectory: false,
    sizeBytes: 420,
    modified: 'Sep 23 19:30',
    isExecutable: false,
  },
];

export const INITIAL_VIDEOS: YouTubeVideo[] = [
  {
    id: 'termux_101',
    title: 'Termux Complete Linux Guide on Android Cloud: Bash & Pkg',
    channel: 'Linux Cloud Master',
    views: '842K views',
    timeAgo: '2 weeks ago',
    duration: '18:42',
    category: 'Linux & Termux',
    description: 'Learn how to master Termux in a 4GB RAM Cloud Phone environment with 64GB storage! We cover package management, bash scripting, SSH servers, and running Python.',
    likes: '54K',
    comments: [
      { author: 'DevNinja', text: 'Cloud phone terminal is crazy fast, zero lag on bash scripts!', time: '1 day ago', likes: '1.2K' },
      { author: 'Sarah Connor', text: 'Finally an environment with 64GB cloud storage that doesn\'t consume my phone memory!', time: '3 days ago', likes: '890' },
      { author: 'CodeCrafter', text: 'neofetch and curl work like a charm.', time: '5 days ago', likes: '412' }
    ]
  },
  {
    id: 'cloud_phone_review',
    title: 'Cloud Phone vs Physical Phone: 64GB ROM & 4GB RAM Tested!',
    channel: 'Tech Cloud Daily',
    views: '1.4M views',
    timeAgo: '1 month ago',
    duration: '14:15',
    category: 'Tech Reviews',
    description: 'Can a virtual cloud phone replace local storage? We test Google Cloud container hosting, 64GB NVMe ROM, and 4GB LPDDR4x RAM performance.',
    likes: '98K',
    comments: [
      { author: 'Alex G', text: 'Zero storage taken on my actual phone is the best part.', time: '2 weeks ago', likes: '3.4K' },
      { author: 'CloudArchitect', text: 'The 10Gbps cloud datacenter pipe makes downloads instant.', time: '3 weeks ago', likes: '1.1K' }
    ]
  },
  {
    id: 'python_cloud_lab',
    title: 'Build & Run Python 3 Scripts on Cloud Linux Terminal',
    channel: 'Python Hacker',
    views: '520K views',
    timeAgo: '3 weeks ago',
    duration: '22:10',
    category: 'Python & Coding',
    description: 'Full tutorial writing Python scripts, HTTP clients, and background tasks inside the CloudDroid terminal with real-time terminal output.',
    likes: '38K',
    comments: [
      { author: 'PyDev99', text: 'Loving the virtual file system and instant execution.', time: '4 days ago', likes: '210' },
      { author: 'Markus', text: 'Tested pkg install python3 and it runs perfectly.', time: '1 week ago', likes: '145' }
    ]
  },
  {
    id: 'ssh_remote_guide',
    title: 'SSH Remote Server Connection & Server Management on Android',
    channel: 'SysAdmin Pro',
    views: '310K views',
    timeAgo: '4 days ago',
    duration: '12:05',
    category: 'Linux & Termux',
    description: 'How to connect from your Android Cloud Terminal to remote Linux VPS servers using SSH keys, port forwarding, and tmux.',
    likes: '26K',
    comments: [
      { author: 'CloudAdmin', text: 'Saved my life during server maintenance on the go.', time: '2 days ago', likes: '430' },
      { author: 'TerminalFan', text: 'The shortcut bar with ESC and TAB is so handy.', time: '3 days ago', likes: '190' }
    ]
  },
  {
    id: 'lofi_cyberpunk',
    title: 'Lo-Fi Beats to Code / Termux Hacking Chill Mix [24/7]',
    channel: 'Chill Cloud Radio',
    views: '3.8M views',
    timeAgo: 'Live',
    duration: 'LIVE',
    category: 'Music / Lo-Fi',
    description: 'Relaxing synthwave and lo-fi hip hop beats to code, hack, and study with in your CloudDroid terminal.',
    likes: '240K',
    comments: [
      { author: 'NightCoder', text: 'Coding bash scripts with this in the background is elite.', time: '1 hour ago', likes: '56' },
      { author: 'Neo', text: 'Entering the Matrix...', time: '3 hours ago', likes: '120' }
    ]
  },
  {
    id: 'gcp_architecture',
    title: 'How Google Cloud Hosts Virtual Android Containers & 64GB ROM',
    channel: 'Google Cloud Tech',
    views: '920K views',
    timeAgo: '1 month ago',
    duration: '19:50',
    category: 'Cloud Phone & GCP',
    description: 'Deep dive into microVM sandboxing, NVMe cloud storage block devices, memory overcommit, and zero local footprint architecture.',
    likes: '72K',
    comments: [
      { author: 'EngineerBob', text: 'High availability and distributed storage explained clearly.', time: '10 days ago', likes: '670' }
    ]
  }
];
