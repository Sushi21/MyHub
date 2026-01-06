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
  date?: {
    uts: string;
    '#text': string;
  };
  '@attr'?: {
    nowplaying: string;
  };
  playcount?: string;
}

interface LastFmTopAlbum {
  name: string;
  artist: {
    name: string;
  };
  playcount: string;
  image: Array<{
    '#text': string;
    size: string;
  }>;
}

interface LastFmRecentAlbum {
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
  date?: {
    uts: string;
    '#text': string;
  };
  '@attr'?: {
    nowplaying: string;
  };
}

interface ScrobblingHistoryProps {
  username: string;
  apiKey: string;
}

type TimeRange = 'week' | 'month' | 'year';
type SortBy = 'date' | 'playcount';

export function ScrobblingHistory({ username, apiKey }: ScrobblingHistoryProps) {
  const [tracks, setTracks] = useState<LastFmTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [page, setPage] = useState(1);
  const [topAlbum, setTopAlbum] = useState<LastFmTopAlbum | null>(null);
  const [obsessionLoading, setObsessionLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('date');

  // Fetch top album from last month for "My Current Obsession"
  useEffect(() => {
    const fetchTopAlbum = async () => {
      setObsessionLoading(true);
      try {
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${apiKey}&format=json&period=1month&limit=1`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch top albums');
        }

        const data = await response.json();
        const topAlbumData = data.topalbums?.album?.[0];

        if (topAlbumData) {
          setTopAlbum(topAlbumData);
        }
        setObsessionLoading(false);
      } catch (err) {
        console.error('Failed to fetch top album:', err);
        setObsessionLoading(false);
      }
    };

    fetchTopAlbum();
  }, [username, apiKey]);

  useEffect(() => {
    const fetchScrobbles = async () => {
      setLoading(true);
      setError(null);

      try {
        if (sortBy === 'playcount') {
          // Fetch top albums sorted by play count
          let period: string;
          switch (timeRange) {
            case 'week':
              period = '7day';
              break;
            case 'month':
              period = '1month';
              break;
            case 'year':
              period = '12month';
              break;
          }

          const response = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${apiKey}&format=json&period=${period}&limit=50&page=${page}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch from Last.fm');
          }

          const data = await response.json();
          const topAlbums = data.topalbums?.album || [];

          const albumTracks = topAlbums.map((album: LastFmTopAlbum) => ({
            name: album.name,
            artist: { '#text': album.artist.name },
            album: { '#text': album.name },
            image: album.image,
            playcount: album.playcount
          }));

          setTracks(albumTracks);
          setTotalPages(parseInt(data.topalbums['@attr']?.totalPages || '1'));
        } else {
          // Fetch recent tracks and group by album (sorted by date)
          const now = Math.floor(Date.now() / 1000);
          let fromTimestamp: number | undefined;

          switch (timeRange) {
            case 'week':
              fromTimestamp = now - (7 * 24 * 60 * 60);
              break;
            case 'month':
              fromTimestamp = now - (30 * 24 * 60 * 60);
              break;
            case 'year':
              fromTimestamp = now - (365 * 24 * 60 * 60);
              break;
          }

          const fromParam = fromTimestamp ? `&from=${fromTimestamp}` : '';
          const response = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=200${fromParam}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch from Last.fm');
          }

          const data = await response.json();
          const recentTracks = data.recenttracks?.track || [];

          // Group tracks by album and get the most recent scrobble date for each
          const albumMap = new Map<string, LastFmTrack>();

          recentTracks.forEach((track: LastFmRecentAlbum) => {
            if (track['@attr']?.nowplaying) return; // Skip now playing

            const albumKey = `${track.album['#text']}-${track.artist['#text']}`;
            const existing = albumMap.get(albumKey);

            if (!existing || (track.date && existing.date && parseInt(track.date.uts) > parseInt(existing.date.uts))) {
              albumMap.set(albumKey, {
                name: track.album['#text'],
                artist: track.artist,
                album: track.album,
                image: track.image,
                date: track.date
              });
            }
          });

          // Convert to array and sort by most recent
          const albumTracks = Array.from(albumMap.values())
            .sort((a, b) => {
              if (!a.date || !b.date) return 0;
              return parseInt(b.date.uts) - parseInt(a.date.uts);
            })
            .slice((page - 1) * 50, page * 50); // Manual pagination

          setTracks(albumTracks);
          setTotalPages(Math.ceil(albumMap.size / 50));
        }

        setLoading(false);
      } catch (err) {
        console.error('Last.fm API error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchScrobbles();
  }, [username, apiKey, timeRange, page, sortBy]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (error) {
    return (
      <div className="scrobbling-history">
        <div className="error-message">Failed to load scrobbling history: {error}</div>
      </div>
    );
  }

  return (
    <div className="scrobbling-history">
      {/* My Current Obsession Section */}
      {topAlbum && !obsessionLoading && (
        <div className="current-obsession">
          <h2>My Current Obsession</h2>
          <div className="obsession-content">
            <div className="obsession-artwork">
              <img
                src={topAlbum.image.find(img => img.size === 'extralarge')?.['#text'] || topAlbum.image.find(img => img.size === 'large')?.['#text'] || ''}
                alt={topAlbum.name}
              />
            </div>
            <div className="obsession-info">
              <div className="obsession-album">{topAlbum.name}</div>
              <div className="obsession-artist">{topAlbum.artist.name}</div>
              <div className="obsession-playcount">{topAlbum.playcount} tracks plays this month</div>
            </div>
          </div>
        </div>
      )}

      <div className="scrobbling-header">
        <h2>Scrobbling History</h2>
        <p className="scrobbling-disclaimer">This is showing scrobble by albums and not tracks since I never listen to playlists or tracks.</p>
        <div className="scrobbling-controls">
          <div className="time-range-filters">
            <button
              className={timeRange === 'week' ? 'active' : ''}
              onClick={() => handleTimeRangeChange('week')}
            >
              Last Week
            </button>
            <button
              className={timeRange === 'month' ? 'active' : ''}
              onClick={() => handleTimeRangeChange('month')}
            >
              Last Month
            </button>
            <button
              className={timeRange === 'year' ? 'active' : ''}
              onClick={() => handleTimeRangeChange('year')}
            >
              Last Year
            </button>
          </div>
          <div className="sort-toggle">
            <button
              className={sortBy === 'date' ? 'active' : ''}
              onClick={() => setSortBy('date')}
              title="Sort by most recently played"
            >
              📅 Recent
            </button>
            <button
              className={sortBy === 'playcount' ? 'active' : ''}
              onClick={() => setSortBy('playcount')}
              title="Sort by play count"
            >
              🔢 Most Played
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="scrobbles-loading">Loading albums...</div>
      ) : (
        <>
          <div className="scrobbles-list">
            {tracks.map((track, index) => {
              const albumArt = track.image.find(img => img.size === 'medium')?.['#text'] || '';

              return (
                <div key={`${track.name}-${track.artist['#text']}-${index}`} className="scrobble-row">
                  <div className="scrobble-artwork">
                    {albumArt ? (
                      <img src={albumArt} alt={track.album['#text']} />
                    ) : (
                      <div className="scrobble-artwork-placeholder">♪</div>
                    )}
                  </div>
                  <div className="scrobble-track">{track.name}</div>
                  <div className="scrobble-artist">{track.artist['#text']}</div>
                  <div className="scrobble-date">
                    {sortBy === 'playcount' && track.playcount && `${track.playcount} tracks plays`}
                    {sortBy === 'date' && track.date?.uts && formatDate(track.date.uts)}
                  </div>
                </div>
              );
            })}
          </div>

          {tracks.length === 0 && (
            <div className="no-scrobbles">No albums found for this time period</div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={page === 1}>
                Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button onClick={handleNextPage} disabled={page === totalPages}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
