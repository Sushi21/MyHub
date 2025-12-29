/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode, useRef } from 'react';
import type { DeezerTrack } from '@/types/album';
import { fetchDeezerPreview } from '@/utils/deezerJsonp';

interface ActivePreview {
  track: DeezerTrack;
  year: number;
}

interface PlayerContextValue {
  activePreview: ActivePreview | null;
  isPlaying: boolean;
  play: (artist: string, album: string, year: number) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [activePreview, setActivePreview] = useState<ActivePreview | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = async (artist: string, album: string, year: number) => {
    try {
      // Try with artist and album first
      const query = `artist:"${artist}" album:"${album}"`;
      const response = await fetchDeezerPreview(query);

      if (response.data && response.data.length > 0) {
        setActivePreview({ track: response.data[0], year });
        setIsPlaying(true);
        return;
      }

      // Retry with album only
      const retryQuery = `album:"${album}"`;
      const retryResponse = await fetchDeezerPreview(retryQuery);

      if (retryResponse.data && retryResponse.data.length > 0) {
        setActivePreview({ track: retryResponse.data[0], year });
        setIsPlaying(true);
      } else {
        alert('No preview found for this album.');
      }
    } catch (error) {
      console.error('Preview fetch error:', error);
      alert('Failed to load preview');
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setActivePreview(null);
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider
      value={{
        activePreview,
        isPlaying,
        play,
        pause,
        resume,
        stop,
        audioRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
