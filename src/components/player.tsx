import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, Settings, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Track } from '@/pages/Index';

interface PlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onTrackEnd: () => void;
  queue?: Track[];
  onNext?: () => void;
  onPrevious?: () => void;
}

export function Player({ track, isPlaying, onPlayPause, onTrackEnd, queue = [], onNext, onPrevious }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [crossfade, setCrossfade] = useState(0);
  const [showQueue, setShowQueue] = useState(false);

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const handleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return '1';
    return '';
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && track?.previewUrl) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedData = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!track) {
    return (
      <div className="h-20 bg-player-background border-t border-border flex items-center justify-center">
        <p className="text-muted-foreground">No track selected</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 h-20 bg-player-background border border-border rounded-lg px-4 flex items-center justify-between shadow-lg z-50">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={track.previewUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onEnded={onTrackEnd}
      />

      {/* Currently Playing Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <img
          src={track.artworkUrl100}
          alt={track.trackName}
          className="w-14 h-14 rounded-md object-cover"
        />
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{track.trackName}</p>
          <p className="text-sm text-muted-foreground truncate">{track.artistName}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsLiked(!isLiked)}
          className="text-muted-foreground hover:text-primary"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-primary text-primary' : ''}`} />
        </Button>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleShuffle}
            className={`${isShuffled ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onPrevious}
            disabled={!onPrevious}
            className="text-foreground hover:text-primary disabled:opacity-50"
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button
            onClick={onPlayPause}
            className="w-8 h-8 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-all"
            size="sm"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onNext}
            disabled={!onNext}
            className="text-foreground hover:text-primary disabled:opacity-50"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRepeat}
            className={`${repeatMode !== 'off' ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground relative`}
          >
            <Repeat className="w-4 h-4" />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 text-xs font-bold">1</span>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 30}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(duration || 30)}
          </span>
        </div>
      </div>

      {/* Volume and Options Control */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        {/* Queue Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowQueue(!showQueue)}
          className={`${showQueue ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`}
        >
          <List className="w-4 h-4" />
        </Button>
        
        {/* Settings Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Settings className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Player Options</h3>
              
              {/* Crossfade */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="crossfade" className="text-sm">Crossfade</Label>
                  <span className="text-xs text-muted-foreground">{crossfade}s</span>
                </div>
                <Slider
                  id="crossfade"
                  value={[crossfade]}
                  max={12}
                  step={1}
                  onValueChange={(value) => setCrossfade(value[0])}
                  className="w-full"
                />
              </div>

              {/* Auto-play */}
              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay" className="text-sm">Autoplay similar tracks</Label>
                <Switch id="autoplay" />
              </div>

              {/* Normalize volume */}
              <div className="flex items-center justify-between">
                <Label htmlFor="normalize" className="text-sm">Normalize volume</Label>
                <Switch id="normalize" defaultChecked />
              </div>

              {/* Show track notifications */}
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-sm">Show track notifications</Label>
                <Switch id="notifications" defaultChecked />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Volume Control */}
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={(value) => setVolume(value[0])}
          className="w-24"
        />
      </div>
    </div>
  );
}