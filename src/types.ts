export type CloudAppId =
  | 'home'
  | 'terminal'
  | 'playstore'
  | 'youtube'
  | 'drive'
  | 'settings'
  | 'code'
  | 'ssh'
  | 'snake'
  | 'ram_monitor';

export interface CloudAppInfo {
  id: CloudAppId;
  packageName: string;
  name: string;
  summary: string;
  iconName: string;
  color: string;
  appSizeMb: number;
  ramUsageMb: number;
  category: string;
  rating: number;
  downloads: string;
  isInstalled: boolean;
  isSystemApp?: boolean;
}

export interface CloudPackage {
  id: string;
  name: string;
  version: string;
  sizeMb: number;
  description: string;
  isInstalled: boolean;
  category: string;
}

export interface TerminalLine {
  text: string;
  type?: 'command' | 'success' | 'error' | 'system' | 'normal';
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  duration: string;
  category: string;
  description: string;
  likes: string;
  comments: {
    author: string;
    text: string;
    time: string;
    likes: string;
  }[];
}

export interface VirtualFile {
  name: string;
  path: string;
  content: string;
  isDirectory: boolean;
  sizeBytes: number;
  modified: string;
  isExecutable?: boolean;
}
