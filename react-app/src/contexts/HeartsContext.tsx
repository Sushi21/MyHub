import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getAlbumKey, incrementHeartCount, decrementHeartCount } from '../services/firebase';

interface HeartData {
  artist: string;
  album: string;
  timestamp: number;
}

interface HeartsContextType {
  heartedAlbums: Set<string>;
  heartedAlbumsWithData: HeartData[];
  toggleHeart: (artist: string, album: string) => void;
  isHearted: (artist: string, album: string) => boolean;
}

const HeartsContext = createContext<HeartsContextType | undefined>(undefined);

const STORAGE_KEY = 'vinyl-collection-hearts';
const STORAGE_KEY_DATA = 'vinyl-collection-hearts-data';

export function HeartsProvider({ children }: { children: ReactNode }) {
  const [heartedAlbums, setHeartedAlbums] = useState<Set<string>>(() => {
    // Load hearts from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading hearts from localStorage:', error);
    }
    return new Set();
  });

  const [heartedAlbumsWithData, setHeartedAlbumsWithData] = useState<HeartData[]>(() => {
    // Load heart data from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading heart data from localStorage:', error);
    }
    return [];
  });

  // Save to localStorage whenever hearts change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(heartedAlbums)));
    } catch (error) {
      console.error('Error saving hearts to localStorage:', error);
    }
  }, [heartedAlbums]);

  // Save heart data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(heartedAlbumsWithData));
    } catch (error) {
      console.error('Error saving heart data to localStorage:', error);
    }
  }, [heartedAlbumsWithData]);

  const toggleHeart = (artist: string, album: string) => {
    const albumKey = getAlbumKey(artist, album);
    const isCurrentlyHearted = heartedAlbums.has(albumKey);

    setHeartedAlbums(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyHearted) {
        newSet.delete(albumKey);
        // Decrement Firebase counter (async, non-blocking)
        decrementHeartCount(artist, album);
      } else {
        newSet.add(albumKey);
        // Increment Firebase counter (async, non-blocking)
        incrementHeartCount(artist, album);
      }
      return newSet;
    });

    // Update heart data
    setHeartedAlbumsWithData(prev => {
      if (isCurrentlyHearted) {
        // Remove from data
        return prev.filter(h => getAlbumKey(h.artist, h.album) !== albumKey);
      } else {
        // Add to data with timestamp
        return [...prev, { artist, album, timestamp: Date.now() }];
      }
    });
  };

  const isHearted = (artist: string, album: string): boolean => {
    const albumKey = getAlbumKey(artist, album);
    return heartedAlbums.has(albumKey);
  };

  return (
    <HeartsContext.Provider value={{ heartedAlbums, heartedAlbumsWithData, toggleHeart, isHearted }}>
      {children}
    </HeartsContext.Provider>
  );
}

export function useHearts() {
  const context = useContext(HeartsContext);
  if (!context) {
    throw new Error('useHearts must be used within a HeartsProvider');
  }
  return context;
}
