/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Album } from '@/types/album';

interface AlbumsContextValue {
  albums: Album[];
  loading: boolean;
  error: string | null;
}

const AlbumsContext = createContext<AlbumsContextValue | undefined>(undefined);

export function AlbumsProvider({ children }: { children: ReactNode }) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use /output path which works in both dev (via Vite middleware) and production
    fetch('/output/collection.json')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load albums: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data: Album[]) => {
        // Sort albums by artist name (case-insensitive), then by year
        const sortedAlbums = [...data].sort((a, b) => {
          const artistCompare = a.artist.toLowerCase().localeCompare(b.artist.toLowerCase());
          if (artistCompare !== 0) {
            return artistCompare;
          }
          // If same artist, sort by year
          return a.year - b.year;
        });
        setAlbums(sortedAlbums);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading albums:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <AlbumsContext.Provider value={{ albums, loading, error }}>
      {children}
    </AlbumsContext.Provider>
  );
}

export function useAlbums() {
  const context = useContext(AlbumsContext);
  if (context === undefined) {
    throw new Error('useAlbums must be used within an AlbumsProvider');
  }
  return context;
}
