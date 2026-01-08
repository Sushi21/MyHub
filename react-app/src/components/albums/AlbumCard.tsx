import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Album } from '@/types/album';
import { usePlayer } from '@/contexts/PlayerContext';
import { useFilters } from '@/contexts/FilterContext';
import { useHearts } from '@/contexts/HeartsContext';
import { useNSFW } from '@/contexts/NSFWContext';
import { TracksList } from './TracksList';

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  const [showTracks, setShowTracks] = useState(false);
  const navigate = useNavigate();
  const { play } = usePlayer();
  const { setSearchTerm } = useFilters();
  const { toggleHeart, isHearted } = useHearts();
  const { isNSFW, isRevealed, revealAlbum } = useNSFW();

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    play(album.artist, album.album, album.year);
  };

  const handleTracksToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTracks(!showTracks);
  };

  const handleArtistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchTerm(album.artist);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHeart(album.artist, album.album);
  };

  const handleRevealClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    revealAlbum(album.artist, album.album);
  };

  const handleAlbumClick = () => {
    navigate(`/album/${encodeURIComponent(album.artist)}/${encodeURIComponent(album.album)}`);
  };

  const hearted = isHearted(album.artist, album.album);
  const nsfw = isNSFW(album.artist, album.album);
  const revealed = isRevealed(album.artist, album.album);

  return (
    <div className="album" onClick={handleAlbumClick} style={{ cursor: 'pointer' }}>
      <div className="album-cover-container">
        <img
          src={`/output/${album.cover}`}
          alt={album.album}
          className={nsfw && !revealed ? 'nsfw-blur' : ''}
        />
        {nsfw && !revealed && (
          <div className="nsfw-overlay" onClick={handleRevealClick}>
            <div className="nsfw-badge">NSFW</div>
            <div className="nsfw-reveal-text">Click to reveal</div>
          </div>
        )}
      </div>
      <div className="album-info">
        <strong>{album.album}</strong>
        <p>
          <button
            className="artist-link"
            onClick={handleArtistClick}
          >
            {album.artist}
          </button>{' '}
          • {album.year}
        </p>
      </div>
      <small className="genre">{album.genre}</small>
      <div className="album-actions">
        <button
          className={`heart-button ${hearted ? 'hearted' : ''}`}
          title={hearted ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleHeartClick}
        >
          {hearted ? '❤️' : '🤍'}
        </button>
        <button
          className="preview"
          title="Play Preview"
          onClick={handlePreviewClick}
        >
          ▶
        </button>
        <button
          className={`tracks-toggle ${showTracks ? 'active' : ''}`}
          title="Show Tracks"
          onClick={handleTracksToggle}
        >
          ☰
        </button>
      </div>
      <TracksList tracks={album.tracks} isVisible={showTracks} />
    </div>
  );
}
