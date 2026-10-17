import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Disc3, Sparkles } from 'lucide-react';
import { soundManager, SOUND_TRACKS, SoundTrackType } from '../utils/audioEngine';

interface AudioPlayerProps {
  onInteract?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ onInteract }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.45);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [previousVolume, setPreviousVolume] = useState<number>(0.45);
  const [currentTrack, setCurrentTrack] = useState<SoundTrackType>('piano');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    soundManager.setOnStateChange((playing) => {
      setIsPlaying(playing);
    });
  }, []);

  const handleTogglePlay = () => {
    onInteract?.();
    const nextState = soundManager.toggle();
    setIsPlaying(nextState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    soundManager.setVolume(val);
  };

  const handleToggleMute = () => {
    onInteract?.();
    if (isMuted) {
      const restored = previousVolume > 0 ? previousVolume : 0.45;
      setVolume(restored);
      setIsMuted(false);
      soundManager.setVolume(restored);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
      soundManager.setVolume(0);
    }
  };

  const handleSelectTrack = (trackId: SoundTrackType) => {
    onInteract?.();
    setCurrentTrack(trackId);
    soundManager.setTrack(trackId);
  };

  const activeTrackInfo = SOUND_TRACKS.find((t) => t.id === currentTrack) || SOUND_TRACKS[0];

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <div className="relative">
        {/* Main Floating Capsule */}
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-full bg-stone-900/75 backdrop-blur-md text-stone-100 border border-stone-700/50 shadow-xl transition-all duration-300 hover:bg-stone-900/85">
          {/* Animated Vinyl / Disc Button */}
          <button
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền nhẹ nhàng'}
            className="relative w-8 h-8 rounded-full flex items-center justify-center bg-stone-800 text-amber-200 hover:text-amber-100 transition-transform active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Disc3
              className={`w-6 h-6 transition-all ${
                isPlaying ? 'animate-spin-slow text-amber-300' : 'text-stone-400 group-hover:text-stone-200'
              }`}
            />
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/60 rounded-full">
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-white translate-x-0.5" />}
            </span>
          </button>

          {/* Track Info & Visualizer */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer select-none text-left flex flex-col justify-center max-w-[130px] sm:max-w-[160px]"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium tracking-wide text-amber-100 truncate">
                {activeTrackInfo.name}
              </span>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-2.5">
                  <span className="w-0.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  <span className="w-0.5 h-2.5 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
            <span className="text-[10px] text-stone-400 truncate">
              {isPlaying ? 'Nhạc nền đang phát' : 'Nhấn để thưởng thức âm nhạc'}
            </span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 pl-1 border-l border-stone-700/60">
            <button
              onClick={handleToggleMute}
              aria-label={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
              className="p-1 rounded-full text-stone-400 hover:text-stone-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-stone-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-stone-200" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Âm lượng nhạc nền"
              className="w-14 sm:w-16 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-300 focus:outline-none"
            />
          </div>

          {/* Track Selector Trigger */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-full transition-colors ${
              isExpanded ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Đổi giai điệu nhạc nền"
            aria-label="Đổi giai điệu nhạc nền"
          >
            <Music className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dropdown Menu for Track Selection */}
        {isExpanded && (
          <div className="absolute bottom-full left-0 mb-3 w-64 p-3 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-stone-700/70 shadow-2xl text-stone-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
              <span className="text-xs font-semibold tracking-wider uppercase text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Giai điệu nhẹ nhàng
              </span>
              <span className="text-[10px] text-stone-400">Web Audio Hi-Fi</span>
            </div>

            <div className="space-y-1.5">
              {SOUND_TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleSelectTrack(track.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl transition-all flex items-center justify-between ${
                    currentTrack === track.id
                      ? 'bg-amber-400/15 text-amber-200 border border-amber-400/30 font-medium'
                      : 'hover:bg-stone-800/60 text-stone-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-medium">{track.name}</div>
                    <div className="text-[10px] text-stone-400">{track.description}</div>
                  </div>
                  {currentTrack === track.id && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 ml-2 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
