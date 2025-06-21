
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Music, X } from 'lucide-react';

interface MusicItem {
  id: string;
  title: string;
  file_url: string;
  order_index: number;
  is_active: boolean;
}

interface MusicSettings {
  autoplay: boolean;
  loop: boolean;
  default_volume: number;
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [playlist, setPlaylist] = useState<MusicItem[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch playlist from localStorage (in a real app, this would come from the database)
  useEffect(() => {
    const fetchPlaylist = () => {
      const savedPlaylist = localStorage.getItem('musicPlaylist');
      if (savedPlaylist) {
        const parsedPlaylist = JSON.parse(savedPlaylist);
        setPlaylist(parsedPlaylist);
      }
    };

    fetchPlaylist();
    
    // Refresh playlist every 5 seconds to pick up changes from admin panel
    const interval = setInterval(fetchPlaylist, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('musicSettings');
    if (savedSettings) {
      const settings: MusicSettings = JSON.parse(savedSettings);
      setVolume(settings.default_volume);
      
      if (settings.autoplay && playlist.length > 0) {
        setTimeout(() => {
          setIsVisible(true);
          handlePlay();
        }, 2000); // Delay autoplay by 2 seconds
      } else if (playlist.length > 0) {
        setIsVisible(true);
      }
    } else if (playlist.length > 0) {
      setIsVisible(true);
    }
  }, [playlist]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handlePlay = () => {
    if (audioRef.current && playlist[currentTrack]) {
      audioRef.current.src = playlist[currentTrack].file_url;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    if (currentTrack < playlist.length - 1) {
      setCurrentTrack(currentTrack + 1);
    } else {
      setCurrentTrack(0); // Loop to first track
    }
  };

  const prevTrack = () => {
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1);
    } else {
      setCurrentTrack(playlist.length - 1); // Loop to last track
    }
  };

  const closePlayer = () => {
    handlePause();
    setIsVisible(false);
  };

  if (!isVisible || playlist.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700 shadow-xl">
        {isMinimized ? (
          <div className="p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
              className="text-white hover:bg-white/10"
            >
              <Music className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-sm font-medium">Now Playing</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="text-white hover:bg-white/10 h-6 w-6 p-0"
                >
                  —
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePlayer}
                  className="text-white hover:bg-white/10 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 min-w-[250px] sm:min-w-[300px]">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevTrack}
                  className="text-white hover:bg-white/10 h-8 w-8 p-0"
                  disabled={playlist.length <= 1}
                >
                  <SkipBack className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="text-white hover:bg-white/10 h-8 w-8 p-0"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTrack}
                  className="text-white hover:bg-white/10 h-8 w-8 p-0"
                  disabled={playlist.length <= 1}
                >
                  <SkipForward className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {playlist[currentTrack]?.title || 'No track selected'}
                </p>
                <p className="text-slate-300 text-xs">
                  {currentTrack + 1} of {playlist.length}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/10 h-8 w-8 p-0"
                >
                  {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </Button>
                
                <div className="w-12 sm:w-16">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={([value]) => {
                      setVolume(value);
                      setIsMuted(false);
                    }}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onEnded={nextTrack}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          preload="metadata"
        />
      </Card>
    </div>
  );
};

export default MusicPlayer;
