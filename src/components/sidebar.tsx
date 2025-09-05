import { useState } from 'react';
import { Home, Search, Library, Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentView: 'home' | 'search' | 'library';
  onViewChange: (view: 'home' | 'search' | 'library') => void;
  onSearch: (query: string) => void;
}

export function Sidebar({ currentView, onViewChange, onSearch }: SidebarProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (value: string) => {
    setSearchInput(value);
    onSearch(value);
    if (value) {
      onViewChange('search');
    }
  };

  const menuItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'search' as const, label: 'Search', icon: Search },
    { id: 'library' as const, label: 'Your Library', icon: Library },
  ];

  return (
    <div className="w-80 bg-sidebar rounded-lg p-6 flex flex-col gap-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-primary-foreground rounded-full"></div>
        </div>
        <span className="text-xl font-bold text-foreground">stormmusic</span>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-4 h-12 text-sidebar-foreground hover:text-foreground",
                currentView === item.id && "bg-sidebar-accent text-foreground"
              )}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Search Input */}
      <div className="space-y-4">
        <Input
          placeholder="Search for songs, artists..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Library Section */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-sidebar-foreground">Recently Played</span>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Playlist Items */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent cursor-pointer transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-foreground">Liked Songs</p>
              <p className="text-sm text-sidebar-foreground">Playlist • 0 songs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}