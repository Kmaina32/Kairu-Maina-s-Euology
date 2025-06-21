
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';

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
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sample playlist - in a real implementation, this would come from the database
  const playlist = [
    {
      title: "Peaceful Memories",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" // Placeholder URL
    }
  ];

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
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handlePlay = () => {
    if (audioRef.current) {
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

  if (!isVisible || playlist.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700 p-4 shadow-xl">
        <div className="flex items-center gap-3 min-w-[280px]">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTrack}
              className="text-white hover:bg-white/10"
              disabled={playlist.length <= 1}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              className="text-white hover:bg-white/10"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTrack}
              className="text-white hover:bg-white/10"
              disabled={playlist.length <= 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1">
            <p className="text-white text-sm font-medium truncate">
              {playlist[currentTrack]?.title || 'No track selected'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/10"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <div className="w-16">
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

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={playlist[currentTrack]?.url}
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
