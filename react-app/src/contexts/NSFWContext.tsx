import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface NSFWAlbum {
  artist: string;
  album: string;
}

interface NSFWContextType {
  nsfwAlbums: NSFWAlbum[];
  revealedAlbums: Set<string>;
  nsfwEnabled: boolean;
  toggleNSFWFilter: () => void;
  isNSFW: (artist: string, album: string) => boolean;
  isRevealed: (artist: string, album: string) => boolean;
  revealAlbum: (artist: string, album: string) => void;
}

const NSFWContext = createContext<NSFWContextType | undefined>(undefined);

function getAlbumKey(artist: string, album: string): string {
  return `${artist.toLowerCase()}::${album.toLowerCase()}`;
}

const NSFW_FILTER_KEY = 'vinyl-collection-nsfw-filter';

export function NSFWProvider({ children }: { children: ReactNode }) {
  const [nsfwAlbums, setNsfwAlbums] = useState<NSFWAlbum[]>([]);
  const [revealedAlbums, setRevealedAlbums] = useState<Set<string>>(new Set());
  const [nsfwEnabled, setNsfwEnabled] = useState<boolean>(() => {
    // Load NSFW filter preference from localStorage (default: true/enabled)
    try {
      const stored = localStorage.getItem(NSFW_FILTER_KEY);
      return stored !== null ? JSON.parse(stored) : true;
    } catch (error) {
      console.error('Error loading NSFW filter preference:', error);
      return true;
    }
  });

  useEffect(() => {
    // Load NSFW list from /output/nsfw.json
    fetch('/output/nsfw.json')
      .then(res => {
        if (!res.ok) {
          console.warn('NSFW list not found, continuing without NSFW filtering');
          return [];
        }
        return res.json();
      })
      .then((data: NSFWAlbum[]) => {
        setNsfwAlbums(data || []);
      })
      .catch(err => {
        console.warn('Error loading NSFW list:', err);
      });
  }, []);

  // Save NSFW filter preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(NSFW_FILTER_KEY, JSON.stringify(nsfwEnabled));
    } catch (error) {
      console.error('Error saving NSFW filter preference:', error);
    }
  }, [nsfwEnabled]);

  const toggleNSFWFilter = () => {
    setNsfwEnabled(prev => !prev);
  };

  const isNSFW = (artist: string, album: string): boolean => {
    return nsfwAlbums.some(
      nsfw =>
        nsfw.artist.toLowerCase() === artist.toLowerCase() &&
        nsfw.album.toLowerCase() === album.toLowerCase()
    );
  };

  const isRevealed = (artist: string, album: string): boolean => {
    // If NSFW filter is disabled, consider all albums as revealed
    if (!nsfwEnabled) return true;

    const key = getAlbumKey(artist, album);
    return revealedAlbums.has(key);
  };

  const revealAlbum = (artist: string, album: string): void => {
    const key = getAlbumKey(artist, album);
    setRevealedAlbums(prev => new Set([...prev, key]));
  };

  return (
    <NSFWContext.Provider value={{ nsfwAlbums, revealedAlbums, nsfwEnabled, toggleNSFWFilter, isNSFW, isRevealed, revealAlbum }}>
      {children}
    </NSFWContext.Provider>
  );
}

export function useNSFW() {
  const context = useContext(NSFWContext);
  if (!context) {
    throw new Error('useNSFW must be used within an NSFWProvider');
  }
  return context;
}
