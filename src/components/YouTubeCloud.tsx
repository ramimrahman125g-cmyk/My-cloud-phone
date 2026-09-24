import React, { useState } from 'react';
import {
  Play,
  Pause,
  Search,
  ThumbsUp,
  Share2,
  Download,
  Cast,
  Bell,
  ArrowLeft,
  X,
  MessageSquare
} from 'lucide-react';
import { YouTubeVideo } from '../types';

interface YouTubeCloudProps {
  videos: YouTubeVideo[];
}

export const YouTubeCloud: React.FC<YouTubeCloudProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [isLiked, setIsLiked] = useState(false);

  const categories = ['All', 'Linux & Termux', 'Cloud Phone & GCP', 'Python & Coding', 'Tech Reviews', 'Music / Lo-Fi'];

  const filteredVideos = videos.filter((v) => {
    const matchesCat = selectedCat === 'All' || v.category === selectedCat;
    const matchesSearch =
      search === '' ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.channel.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#0f0f0f] text-white overflow-hidden">
      {/* Video Player Modal/Overlay if a video is active */}
      {selectedVideo ? (
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f0f0f]">
          {/* Simulated Video Player Box */}
          <div className="w-full aspect-video bg-black relative flex items-center justify-center border-b border-zinc-800">
            {/* Top Close Button & Cloud Badge */}
            <div className="absolute top-2 left-2 z-10 flex items-center space-x-2">
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded bg-emerald-600/90 text-[10px] font-mono font-bold">
              1080p 60fps • 10Gbps Cloud Stream
            </div>

            {/* Simulated Animated Player Graphic */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-black/70 border border-white/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white shadow-2xl"
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
              </button>
              <span className="mt-2 text-[10px] text-zinc-400 font-mono">
                {isPlaying ? 'Playing via Google Cloud Stream' : 'Paused'}
              </span>
            </div>

            {/* Video Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex justify-between text-[10px] font-mono text-zinc-300 mb-1">
                <span>04:12</span>
                <span>{selectedVideo.duration}</span>
              </div>
              <div className="w-full bg-zinc-700 h-1 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full w-[35%]" />
              </div>
            </div>
          </div>

          {/* Video Metadata Section */}
          <div className="p-3 space-y-3">
            <h2 className="text-sm font-bold leading-snug">{selectedVideo.title}</h2>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>{selectedVideo.views} • {selectedVideo.timeAgo}</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-medium text-zinc-300">
                {selectedVideo.category}
              </span>
            </div>

            {/* Channel Info & Subscribe */}
            <div className="flex items-center justify-between py-1 border-y border-zinc-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-xs">
                  {selectedVideo.channel.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-semibold">{selectedVideo.channel}</div>
                  <div className="text-[10px] text-zinc-400">185K subscribers</div>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-white text-black font-bold text-xs rounded-full hover:bg-zinc-200 transition-colors">
                Subscribe
              </button>
            </div>

            {/* Action Buttons: Like, Share, Save */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isLiked ? 'bg-red-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{isLiked ? 'Liked' : selectedVideo.likes}</span>
              </button>
              <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-sky-400">
                <Download className="w-3.5 h-3.5" />
                <span>Save to 64GB ROM</span>
              </button>
            </div>

            {/* Description Card */}
            <div className="bg-zinc-900 rounded-xl p-2.5 text-xs text-zinc-300 leading-relaxed">
              {selectedVideo.description}
            </div>

            {/* Comments */}
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comments ({selectedVideo.comments.length})</span>
              </h3>
              {selectedVideo.comments.map((c, i) => (
                <div key={i} className="bg-zinc-900/60 rounded-xl p-2 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-semibold text-zinc-300">{c.author}</span>
                    <span>{c.time}</span>
                  </div>
                  <p className="text-zinc-200 text-[11px]">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Related Videos */}
            <div className="pt-2 space-y-2">
              <h3 className="text-xs font-bold text-white">Up Next</h3>
              {videos.filter(v => v.id !== selectedVideo.id).slice(0, 3).map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVideo(v)}
                  className="flex space-x-2.5 p-1.5 rounded-xl hover:bg-zinc-900 cursor-pointer transition-all"
                >
                  <div className="w-24 h-14 bg-zinc-800 rounded-lg shrink-0 relative flex items-center justify-center">
                    <Play className="w-5 h-5 text-white/70" />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[9px] font-mono">
                      {v.duration}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold line-clamp-2">{v.title}</h4>
                    <p className="text-[10px] text-zinc-400 mt-1">{v.channel} • {v.views}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Video Feed View */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top YouTube Header */}
          <div className="bg-[#0f0f0f] border-b border-zinc-800 px-3 py-2 space-y-2">
            <div className="flex items-center justify-between">
              {/* YouTube Logo */}
              <div className="flex items-center space-x-1.5">
                <div className="w-7 h-5 bg-red-600 rounded flex items-center justify-center shadow">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
                <span className="font-bold text-sm tracking-tight text-white">YouTube</span>
                <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-800 px-1 rounded">
                  CLOUD
                </span>
              </div>

              {/* Header icons */}
              <div className="flex items-center space-x-3 text-zinc-300">
                <Cast className="w-4 h-4" />
                <Bell className="w-4 h-4" />
                <div className="w-6 h-6 rounded-full bg-red-600 text-[10px] font-bold flex items-center justify-center">
                  C
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search YouTube Cloud videos..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="px-3 py-2 flex space-x-2 overflow-x-auto border-b border-zinc-800/80 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                  selectedCat === cat
                    ? 'bg-white text-black font-bold'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Videos Feed */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => {
                  setSelectedVideo(video);
                  setIsPlaying(true);
                }}
                className="p-3 space-y-2 cursor-pointer hover:bg-zinc-900/60 transition-all"
              >
                {/* Video Card Thumbnail */}
                <div className="w-full aspect-video bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-xl relative overflow-hidden flex items-center justify-center group shadow-md">
                  <div className="w-12 h-12 rounded-full bg-black/60 border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                  </div>

                  <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white">
                    {video.duration}
                  </span>

                  <span className="absolute top-2 left-2 bg-red-600 px-1.5 py-0.5 rounded text-[10px] font-semibold text-white">
                    {video.category}
                  </span>
                </div>

                {/* Video Details */}
                <div className="flex space-x-2.5 pt-1">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {video.channel.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {video.channel} • {video.views} • {video.timeAgo}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
