import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlbums } from '@/contexts/AlbumsContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { useNSFW } from '@/contexts/NSFWContext';
import type { Album } from '@/types/album';

interface LastFmTrack {
  name: string;
  duration: string;
  url: string;
  '@attr'?: { rank: string };
}

interface LastFmTag {
  name: string;
  url: string;
}

interface LastFmAlbumInfo {
  name: string;
  artist: string;
  url: string;
  image: Array<{ '#text': string; size: string }>;
  listeners?: string;
  playcount?: string;
  tracks?: {
    track: LastFmTrack | LastFmTrack[]; // Can be single object or array
  };
  tags?: {
    tag: LastFmTag | LastFmTag[]; // Can be single object or array
  };
  wiki?: {
    published: string;
    summary: string;
    content: string;
  };
}


export function AlbumDetails() {
  const { artist, album: albumName } = useParams<{ artist: string; album: string }>();
  const navigate = useNavigate();
  const { albums } = useAlbums();
  const { play } = usePlayer();
  const { isNSFW, isRevealed, revealAlbum } = useNSFW();
  const [album, setAlbum] = useState<Album | null>(null);
  const [lastFmData, setLastFmData] = useState<LastFmAlbumInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artist || !albumName) {
      navigate('/');
      return;
    }

    // Find album in local collection
    const foundAlbum = albums.find(
      (a) => a.artist === decodeURIComponent(artist) && a.album === decodeURIComponent(albumName)
    );

    if (!foundAlbum) {
      navigate('/');
      return;
    }

    setAlbum(foundAlbum);

    // Fetch data from APIs
    const fetchAlbumData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch from Last.fm
        try {
          const lastFmResponse = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=ad0685eb4544fa12c9c113c3f28fcd38&artist=${encodeURIComponent(
              foundAlbum.artist
            )}&album=${encodeURIComponent(foundAlbum.album)}&format=json`
          );

          if (lastFmResponse.ok) {
            const lastFmJson = await lastFmResponse.json();
            if (lastFmJson.album) {
              console.log('Last.fm album data:', lastFmJson.album);
              console.log('Tracks structure:', lastFmJson.album.tracks);
              console.log('Tags structure:', lastFmJson.album.tags);
              setLastFmData(lastFmJson.album);
            } else if (lastFmJson.error) {
              console.warn('Last.fm error:', lastFmJson.message);
            }
          }
        } catch (err) {
          console.warn('Failed to fetch from Last.fm:', err);
        }

      } catch (err) {
        console.error('Error fetching album data:', err);
        setError('Failed to fetch some album information');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [artist, albumName, albums, navigate]);

  if (!album) {
    return null;
  }

  const nsfw = isNSFW(album.artist, album.album);
  const revealed = isRevealed(album.artist, album.album);

  const handleRevealClick = () => {
    revealAlbum(album.artist, album.album);
  };

  const handleRandomAlbum = () => {
    if (albums.length === 0) return;

    // Pick a random album (different from current one if possible)
    let randomAlbum;
    if (albums.length > 1) {
      do {
        const randomIndex = Math.floor(Math.random() * albums.length);
        randomAlbum = albums[randomIndex];
      } while (randomAlbum.artist === album.artist && randomAlbum.album === album.album);
    } else {
      randomAlbum = albums[0];
    }

    // Navigate to the new album details page
    navigate(`/album/${encodeURIComponent(randomAlbum.artist)}/${encodeURIComponent(randomAlbum.album)}`);

    // Auto-play preview after a short delay to allow page to load
    setTimeout(() => {
      play(randomAlbum.artist, randomAlbum.album, randomAlbum.year);
    }, 500);
  };

  const formatDuration = (seconds: string | number | undefined) => {
    if (!seconds) return '';
    const sec = typeof seconds === 'string' ? parseInt(seconds) : seconds;
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    if (lastFmData?.tracks?.track) {
      const tracks = Array.isArray(lastFmData.tracks.track)
        ? lastFmData.tracks.track
        : [lastFmData.tracks.track];

      const total = tracks.reduce((sum: number, track: LastFmTrack) => {
        return sum + (parseInt(track.duration) || 0);
      }, 0);
      const mins = Math.floor(total / 60);
      return `${mins} min`;
    }
    return null;
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<a[^>]*>/g, '').replace(/<\/a>/g, '').replace(/&quot;/g, '"');
  };

  return (
    <div className="album-details-page">
      <div className="album-details-nav">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Collection
        </button>
        <button className="random-btn" onClick={handleRandomAlbum} title="Pick a random album from the collection">
          🎲 Surprise Me!
        </button>
      </div>

      <div className="album-details-container">
        <div className="album-details-cover">
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

        <div className="album-details-info">
          <div className="album-header">
            <div>
              <h1>{album.album}</h1>
              <h2>{album.artist}</h2>
            </div>
            <button
              className="play-preview-button"
              onClick={() => play(album.artist, album.album, album.year)}
              title="Play Preview"
            >
              ▶ Play Preview
            </button>
          </div>

          <div className="album-meta">
            <span className="meta-item">
              <strong>Year:</strong> {album.year}
            </span>
            <span className="meta-item">
              <strong>Genre:</strong> {album.genre}
            </span>
            {getTotalDuration() && (
              <span className="meta-item">
                <strong>Duration:</strong> {getTotalDuration()}
              </span>
            )}
            {lastFmData?.listeners && (
              <span className="meta-item">
                <strong>Listeners:</strong> {parseInt(lastFmData.listeners).toLocaleString()}
              </span>
            )}
            {lastFmData?.playcount && (
              <span className="meta-item">
                <strong>Scrobbles:</strong> {parseInt(lastFmData.playcount).toLocaleString()}
              </span>
            )}
          </div>

          {lastFmData?.wiki?.summary && (
            <div className="album-description">
              <h3>About</h3>
              <p>{stripHtmlTags(lastFmData.wiki.summary)}</p>
            </div>
          )}

          {lastFmData?.tags?.tag && (() => {
            // Handle case where Last.fm returns single tag as object instead of array
            const tags = Array.isArray(lastFmData.tags.tag)
              ? lastFmData.tags.tag
              : [lastFmData.tags.tag];

            if (tags.length === 0) return null;

            return (
              <div className="album-tags">
                <h3>Tags</h3>
                <div className="tags-list">
                  {tags.slice(0, 5).map((tag, index) => (
                    <span key={index} className="tag">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {loading && (
        <div className="loading-indicator">Loading additional information...</div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}

      {lastFmData?.tracks?.track && (() => {
        // Handle case where Last.fm returns single track as object instead of array
        const tracks = Array.isArray(lastFmData.tracks.track)
          ? lastFmData.tracks.track
          : [lastFmData.tracks.track];

        if (tracks.length === 0) return null;

        return (
          <div className="tracklist-section">
            <h3>Track List</h3>
            <div className="tracklist">
              {tracks.map((track, index) => (
                <div key={index} className="track-item">
                  <span className="track-number">{index + 1}</span>
                  <span className="track-name">{track.name}</span>
                  <span className="track-duration">{formatDuration(track.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {album.tracks && album.tracks.length > 0 && !lastFmData?.tracks?.track && (
        <div className="tracklist-section">
          <h3>Track List</h3>
          <div className="tracklist">
            {album.tracks.map((track, index) => (
              <div key={index} className="track-item">
                <span className="track-number">{typeof track === 'string' ? index + 1 : track.track}</span>
                <span className="track-name">{typeof track === 'string' ? track : track.title}</span>
                {typeof track === 'object' && track.length && (
                  <span className="track-duration">{track.length}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {lastFmData?.url && (
        <div className="external-links">
          <a href={lastFmData.url} target="_blank" rel="noopener noreferrer" className="external-link">
            View on Last.fm →
          </a>
        </div>
      )}
    </div>
  );
}
