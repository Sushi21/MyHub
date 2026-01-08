import { useNavigate } from 'react-router-dom';
import { useAlbums } from '@/contexts/AlbumsContext';
import { usePlayer } from '@/contexts/PlayerContext';

export function RandomButton() {
  const { albums } = useAlbums();
  const { play } = usePlayer();
  const navigate = useNavigate();

  const handleRandomAlbum = () => {
    if (albums.length === 0) return;

    // Pick a random album
    const randomIndex = Math.floor(Math.random() * albums.length);
    const randomAlbum = albums[randomIndex];

    // Navigate to album details page
    navigate(`/album/${encodeURIComponent(randomAlbum.artist)}/${encodeURIComponent(randomAlbum.album)}`);

    // Auto-play preview after a short delay to allow page to load
    setTimeout(() => {
      play(randomAlbum.artist, randomAlbum.album, randomAlbum.year);
    }, 500);
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
