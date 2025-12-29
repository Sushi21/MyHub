import { useAlbums } from '@/contexts/AlbumsContext';
import { useFilters } from '@/contexts/FilterContext';
import { usePlayer } from '@/contexts/PlayerContext';

export function RandomButton() {
  const { albums } = useAlbums();
  const { setSearchTerm, setSelectedCategory, setSelectedGenre, setShouldAutoPlay } = useFilters();
  const { stop } = usePlayer();

  const handleRandomAlbum = () => {
    if (albums.length === 0) return;

    // Stop any currently playing preview
    stop();

    // Pick a random album
    const randomIndex = Math.floor(Math.random() * albums.length);
    const randomAlbum = albums[randomIndex];

    // Reset filters and search for the random album
    setSelectedCategory('all');
    setSelectedGenre('');
    setShouldAutoPlay(true); // Enable auto-play BEFORE setting search term
    setSearchTerm(randomAlbum.album);

    // Scroll to top to see the result
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className="random-btn"
      onClick={handleRandomAlbum}
      title="Pick a random album from the collection"
    >
      🎲 Surprise Me!
    </button>
  );
}
