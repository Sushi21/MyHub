import { useMemo, useEffect, useRef } from 'react';
import { useAlbums } from '@/contexts/AlbumsContext';
import { useFilters } from '@/contexts/FilterContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { AlbumCard } from './AlbumCard';

export function AlbumGrid() {
  const { albums } = useAlbums();
  const { selectedCategory, selectedGenre, searchTerm, shouldAutoPlay, setShouldAutoPlay } = useFilters();
  const { play, activePreview } = usePlayer();
  const lastPlayedAlbumRef = useRef<string | null>(null);

  // Filter albums based on current filters
  const filteredAlbums = useMemo(() => {
    return albums.filter(album => {
      const categoryMatch = selectedCategory === 'all' || album.category === selectedCategory;
      const genreMatch = !selectedGenre ||
        album.genre.split(',').map(g => g.trim()).includes(selectedGenre);
      const searchMatch = !searchTerm ||
        album.album.toLowerCase().includes(searchTerm.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchTerm.toLowerCase());

      return categoryMatch && genreMatch && searchMatch;
    });
  }, [albums, selectedCategory, selectedGenre, searchTerm]);

  const isSingleResult = filteredAlbums.length === 1;

  // Auto-play preview when there's only one album showing AND shouldAutoPlay flag is set
  useEffect(() => {
    if (isSingleResult && filteredAlbums[0] && shouldAutoPlay) {
      const album = filteredAlbums[0];
      const albumKey = `${album.artist}-${album.album}`;

      // Only auto-play if this album isn't already playing and we haven't just played it
      if (!activePreview && lastPlayedAlbumRef.current !== albumKey) {
        lastPlayedAlbumRef.current = albumKey;

        // Small delay to let the UI update first
        const timer = setTimeout(() => {
          play(album.artist, album.album, album.year);
          setShouldAutoPlay(false); // Reset the flag after auto-playing
        }, 300);

        return () => clearTimeout(timer);
      } else if (lastPlayedAlbumRef.current === albumKey) {
        // Reset the flag if we already played this album
        setShouldAutoPlay(false);
      }
    }
    // Note: setShouldAutoPlay is stable and doesn't need to be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSingleResult, filteredAlbums, play, activePreview, shouldAutoPlay]);

  return (
    <div className={`grid ${isSingleResult ? 'single-result' : ''}`} id="albumGrid">
      {filteredAlbums.map((album, index) => (
        <AlbumCard key={`${album.artist}-${album.album}-${index}`} album={album} />
      ))}
    </div>
  );
}
