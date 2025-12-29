import { useState, useEffect } from 'react';

interface LastFmTrack {
  name: string;
  artist: {
    '#text': string;
  };
  album: {
    '#text': string;
  };
  image: Array<{
    '#text': string;
    size: string;
  }>;
  '@attr'?: {
    nowplaying: string;
  };
}

interface NowPlayingProps {
  username: string;
  apiKey: string;
}

export function NowPlaying({ username, apiKey }: NowPlayingProps) {
  const [track, setTrack] = useState<LastFmTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch from Last.fm');
        }

        const data = await response.json();
        const recentTrack = data.recenttracks?.track?.[0];

        if (recentTrack) {
          setTrack(recentTrack);
        }
        setLoading(false);
      } catch (err) {
        console.error('Last.fm API error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchNowPlaying();

    // Poll every 10 seconds for updates
    const interval = setInterval(fetchNowPlaying, 10000);

    return () => clearInterval(interval);
  }, [username, apiKey]);

  if (loading) {
    return <div className="now-playing">Loading...</div>;
  }

  if (error) {
    return <div className="now-playing error">Failed to load Last.fm data</div>;
  }

  if (!track) {
    return null;
  }

  const isNowPlaying = track['@attr']?.nowplaying === 'true';

  // Only show widget if something is currently playing
  if (!isNowPlaying) {
    return null;
  }

  const albumArt = track.image.find(img => img.size === 'large')?.['#text'] || '';

  return (
    <div className="now-playing">
      <span className="now-playing-badge">🎵 Right Now I'm Listening To</span>
      {albumArt && <img src={albumArt} alt={track.album['#text']} className="album-art" />}
      <div className="track-info">
        <div className="track-name">{track.name}</div>
        <div className="track-artist">{track.artist['#text']}</div>
        {track.album['#text'] && <div className="track-album">{track.album['#text']}</div>}
      </div>
    </div>
  );
}
