import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';
import { Player } from '@/components/Player';
import { SearchResults } from '@/components/SearchResults';

export interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl: string;
  trackTimeMillis: number;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'library'>('home');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Main Layout */}
      <div className="flex flex-1 gap-2 p-2">
        {/* Sidebar */}
        <Sidebar 
          currentView={currentView}
          onViewChange={setCurrentView}
          onSearch={setSearchQuery}
        />
        
        {/* Main Content */}
        <div className="flex-1 bg-gradient-main rounded-lg overflow-hidden">
          {currentView === 'search' && searchQuery ? (
            <SearchResults 
              query={searchQuery}
              results={searchResults}
              onResultsChange={setSearchResults}
              onTrackSelect={handleTrackSelect}
            />
          ) : (
            <MainContent 
              onTrackSelect={handleTrackSelect}
            />
          )}
        </div>
      </div>

      {/* Player */}
      <Player 
        track={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onTrackEnd={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default Index;