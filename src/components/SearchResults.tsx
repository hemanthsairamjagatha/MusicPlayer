import { useState, useEffect } from 'react';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Track } from '@/pages/Index';

interface SearchResultsProps {
  query: string;
  results: Track[];
  onResultsChange: (results: Track[]) => void;
  onTrackSelect: (track: Track) => void;
}

export function SearchResults({ query, results, onResultsChange, onTrackSelect }: SearchResultsProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      searchTracks(query);
    } else {
      onResultsChange([]);
    }
  }, [query]);

  const searchTracks = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=50`
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
      
      onResultsChange(tracks);
    } catch (error) {
      console.error('Error searching tracks:', error);
      onResultsChange([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!query.trim()) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Start searching</h2>
          <p className="text-muted-foreground">Find your favorite songs and artists</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Search results</h1>
        <p className="text-muted-foreground">
          {loading ? 'Searching...' : `${results.length} results for "${query}"`}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 p-4 animate-pulse">
              <div className="col-span-1 bg-muted rounded h-4"></div>
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
              <div className="col-span-4 bg-muted rounded h-4"></div>
              <div className="col-span-1 bg-muted rounded h-4"></div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
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
          {results.map((track, index) => (
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
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{track.trackName}</p>
                  <p className="text-sm text-muted-foreground truncate">{track.artistName}</p>
                </div>
              </div>
              
              <div className="col-span-4 flex items-center min-w-0">
                <p className="text-muted-foreground truncate">{track.collectionName}</p>
              </div>
              
              <div className="col-span-1 text-center text-muted-foreground">
                {formatDuration(track.trackTimeMillis)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
          <p className="text-muted-foreground">Try searching for something else</p>
        </div>
      )}
    </div>
  );
}