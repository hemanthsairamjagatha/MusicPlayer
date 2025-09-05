import { useState, useEffect } from 'react';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Track } from '@/pages/Index';

interface MainContentProps {
  onTrackSelect: (track: Track) => void;
}

export function MainContent({ onTrackSelect }: MainContentProps) {
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch some popular tracks on load
    fetchTracks('popular music 2024');
  }, []);

  const fetchTracks = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`
      );
      const data = await response.json();
      
      const tracks: Track[] = data.results
        .filter((item: any) => item.previewUrl)
        .map((item: any) => ({
          trackId: item.trackId,
          trackName: item.trackName,
          artistName: item.artistName,
          collectionName: item.collectionName,
          artworkUrl100: item.artworkUrl100,
          previewUrl: item.previewUrl,
          trackTimeMillis: item.trackTimeMillis,
        }));
      
      setFeaturedTracks(tracks);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Good evening</h1>
        <p className="text-muted-foreground">Discover new music and enjoy your favorites</p>
      </div>

      {/* Featured Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Popular Today</h2>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-md mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {featuredTracks.slice(0, 8).map((track) => (
              <div
                key={track.trackId}
                className="bg-card hover:bg-card/80 rounded-lg p-4 cursor-pointer transition-all duration-200 group shadow-card hover:shadow-glow"
                onClick={() => onTrackSelect(track)}
              >
                <div className="relative mb-4">
                  <img
                    src={track.artworkUrl100}
                    alt={track.trackName}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary hover:bg-primary-foreground text-primary-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <Play className="w-4 h-4 ml-0.5" />
                  </Button>
                </div>
                <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                  {track.trackName}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {track.artistName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Track List */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Recently Played</h2>
        
        <div className="bg-card rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 text-sm text-muted-foreground border-b border-border">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-4">Album</div>
            <div className="col-span-1 text-center">
              <Clock className="w-4 h-4 mx-auto" />
            </div>
          </div>

          {/* Track Rows */}
          {featuredTracks.map((track, index) => (
            <div
              key={track.trackId}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/50 cursor-pointer group transition-colors"
              onClick={() => onTrackSelect(track)}
            >
              <div className="col-span-1 text-center text-muted-foreground group-hover:hidden">
                {index + 1}
              </div>
              <div className="col-span-1 text-center hidden group-hover:block">
                <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                  <Play className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="col-span-6 flex items-center gap-3">
                <img
                  src={track.artworkUrl100}
                  alt={track.trackName}
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{track.trackName}</p>
                  <p className="text-sm text-muted-foreground">{track.artistName}</p>
                </div>
              </div>
              
              <div className="col-span-4 flex items-center">
                <p className="text-muted-foreground truncate">{track.collectionName}</p>
              </div>
              
              <div className="col-span-1 text-center text-muted-foreground">
                {formatDuration(track.trackTimeMillis)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}