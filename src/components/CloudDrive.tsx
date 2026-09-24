import React, { useState } from 'react';
import {
  Folder,
  FileText,
  FileCode,
  HardDrive,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  ArrowLeft,
  Download
} from 'lucide-react';
import { VirtualFile } from '../types';

interface CloudDriveProps {
  files: VirtualFile[];
  onSaveFile: (path: string, content: string) => void;
  onCreateFile: (name: string, content: string) => void;
  onDeleteFile: (path: string) => void;
}

export const CloudDrive: React.FC<CloudDriveProps> = ({
  files,
  onSaveFile,
  onCreateFile,
  onDeleteFile,
}) => {
  const [currentFolder, setCurrentFolder] = useState('/home/cloud');
  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const currentFiles = files.filter((f) => {
    const parent = f.path.substring(0, f.path.lastIndexOf('/'));
    return parent === currentFolder || (currentFolder === '/' && parent === '');
  });

  const handleOpenFile = (f: VirtualFile) => {
    setSelectedFile(f);
    setEditorContent(f.content);
  };

  const handleSave = () => {
    if (selectedFile) {
      onSaveFile(selectedFile.path, editorContent);
      setSelectedFile(null);
    }
  };

  const handleCreate = () => {
    if (newFileName.trim()) {
      const defaultContent = newFileName.endsWith('.sh')
        ? '#!/bin/bash\necho "Running script on 64GB Cloud Storage!"\n'
        : '';
      onCreateFile(newFileName.trim(), defaultContent);
      setNewFileName('');
      setShowNewFileDialog(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* 64GB ROM Header & Breakdown */}
      <div className="bg-slate-900 border-b border-slate-800 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">64GB Cloud Storage</h2>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
            0 MB on Phone
          </div>
        </div>

        {/* Storage Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
            <div className="bg-sky-500 h-full" style={{ width: '8.1%' }} title="System: 5.2 GB" />
            <div className="bg-emerald-500 h-full" style={{ width: '5.6%' }} title="Apps: 3.6 GB" />
            <div className="bg-amber-500 h-full" style={{ width: '2.2%' }} title="User Files: 1.4 GB" />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Used: 10.2 GB / 64.0 GB</span>
            <span className="text-emerald-400 font-semibold">Free: 53.8 GB (Google Cloud NVMe)</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[10px] text-slate-400 pt-0.5">
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-sky-500 mr-1"></span>System</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>Apps</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>Scripts</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-700 mr-1"></span>Free NVMe</span>
        </div>
      </div>

      {/* Directory & Actions Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 truncate">
          {currentFolder !== '/home/cloud' && (
            <button
              onClick={() => setCurrentFolder('/home/cloud')}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
          <span>{currentFolder}</span>
        </div>

        <button
          onClick={() => setShowNewFileDialog(true)}
          className="flex items-center space-x-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-semibold text-white shadow transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New File</span>
        </button>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* Shortcut to Google Cloud Mount */}
        {currentFolder === '/home/cloud' && (
          <div
            onClick={() => setCurrentFolder('/storage/google-cloud-drive')}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between hover:border-sky-500/40 cursor-pointer transition-all shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <Folder className="w-6 h-6 text-sky-400" />
              <div>
                <div className="text-xs font-semibold text-white">/storage/google-cloud-drive</div>
                <div className="text-[10px] text-slate-400">Direct cloud storage mount point</div>
              </div>
            </div>
          </div>
        )}

        {currentFiles.map((file) => (
          <div
            key={file.path}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition-all shadow-sm"
          >
            <div
              onClick={() => handleOpenFile(file)}
              className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
            >
              {file.name.endsWith('.sh') || file.name.endsWith('.py') ? (
                <FileCode className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <FileText className="w-6 h-6 text-slate-400 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white font-mono truncate">{file.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {file.sizeBytes} B • {file.modified}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={() => handleOpenFile(file)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                title="Edit file"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteFile(file.path)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400"
                title="Delete file"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cloud File Editor Modal */}
      {selectedFile && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 p-4 flex flex-col">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono text-white truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-black shadow transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editor Area */}
            <textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              className="flex-1 bg-slate-950 text-slate-100 p-3 font-mono text-xs focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* New File Dialog */}
      {showNewFileDialog && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xs z-30 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 w-full max-w-sm space-y-3 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Create Cloud File (64GB ROM)</h3>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="e.g. script.sh, task.py, notes.txt"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              autoFocus
            />
            <div className="flex justify-end space-x-2 pt-1">
              <button
                onClick={() => setShowNewFileDialog(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newFileName.trim()}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 rounded-xl text-xs text-white font-bold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
