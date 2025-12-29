import { useEffect } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';

export function AudioPreview() {
  const { activePreview, isPlaying, pause, resume, stop, audioRef } = usePlayer();

  useEffect(() => {
    if (activePreview && audioRef.current) {
      audioRef.current.src = activePreview.track.preview;
      audioRef.current.play();
    }
  }, [activePreview, audioRef]);

  // Auto-close when song ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      stop();
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, stop]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  if (!activePreview) return null;

  return (
    <>
      <button id="playPauseBtn" onClick={handlePlayPause}>
        {isPlaying ? '⏸' : '▶️'}
      </button>
      <button id="closeBtn" onClick={stop} title="Close preview">
        ✕
      </button>
      <audio ref={audioRef} autoPlay />
    </>
  );
}
