import { useMemo } from 'react';
import { useAlbums } from '@/contexts/AlbumsContext';
import { useFilters } from '@/contexts/FilterContext';

export function GenreDropdown() {
  const { albums } = useAlbums();
  const { selectedCategory, selectedGenre, setSelectedGenre } = useFilters();

  // Filter genres based on current category
  const genres = useMemo(() => {
    const filteredAlbums = selectedCategory === 'all'
      ? albums
      : albums.filter(a => a.category === selectedCategory);

    const allGenres = filteredAlbums.flatMap(a =>
      a.genre.split(',').map(g => g.trim()).filter(Boolean)
    );

    return [...new Set(allGenres)].sort();
  }, [albums, selectedCategory]);

  return (
    <select
      id="genreFilter"
      value={selectedGenre}
      onChange={(e) => setSelectedGenre(e.target.value)}
    >
      <option value="">Filter by Genre</option>
      {genres.map(genre => (
        <option key={genre} value={genre}>
          {genre}
        </option>
      ))}
    </select>
  );
}
