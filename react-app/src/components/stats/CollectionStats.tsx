import { useMemo, useState } from 'react';
import { useAlbums } from '@/contexts/AlbumsContext';

export function CollectionStats() {
  const { albums } = useAlbums();
  const [isExpanded, setIsExpanded] = useState(false);

  const stats = useMemo(() => {
    const totalAlbums = albums.length;

    // Count unique artists
    const uniqueArtists = new Set(albums.map(album => album.artist)).size;

    // Count unique genres (split by comma and trim)
    const allGenres = albums.flatMap(album =>
      album.genre.split(',').map(g => g.trim())
    );
    const uniqueGenres = new Set(allGenres).size;

    // Count by category
    const categories = albums.reduce((acc, album) => {
      acc[album.category] = (acc[album.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate total tracks
    const totalTracks = albums.reduce((sum, album) => sum + album.tracks.length, 0);

    // Find most common genre
    const genreCounts = allGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topGenre = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)[0];

    // Count albums per artist and get top 5
    const artistCounts = albums.reduce((acc, album) => {
      acc[album.artist] = (acc[album.artist] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topArtists = Object.entries(artistCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([artist, count]) => ({ artist, count }));

    return {
      totalAlbums,
      uniqueArtists,
      uniqueGenres,
      categories,
      totalTracks,
      topGenre: topGenre ? topGenre[0] : 'Unknown',
      topGenreCount: topGenre ? topGenre[1] : 0,
      topArtists,
    };
  }, [albums]);

  if (albums.length === 0) return null;

  return (
    <div className={`collection-stats ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="stats-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Collection Overview</h3>
        <button className="collapse-toggle" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalAlbums}</div>
              <div className="stat-label">Albums</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{stats.uniqueArtists}</div>
              <div className="stat-label">Artists</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{stats.uniqueGenres}</div>
              <div className="stat-label">Genres</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{stats.totalTracks}</div>
              <div className="stat-label">Tracks</div>
            </div>

            <div className="stat-card wide">
              <div className="stat-value small">{stats.topGenre}</div>
              <div className="stat-label">Top Genre ({stats.topGenreCount} albums)</div>
            </div>
          </div>

          {stats.topArtists.length > 0 && (
            <div className="top-artists">
              <h4>Top 5 Artists</h4>
              <div className="top-artists-list">
                {stats.topArtists.map(({ artist, count }, index) => (
                  <div key={artist} className="top-artist-item">
                    <span className="artist-rank">#{index + 1}</span>
                    <span className="artist-name">{artist}</span>
                    <span className="artist-count">{count} album{count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(stats.categories).length > 1 && (
            <div className="category-breakdown">
              <h4>By Category</h4>
              <div className="category-bars">
                {Object.entries(stats.categories).map(([category, count]) => (
                  <div key={category} className="category-bar-item">
                    <span className="category-name">{category}</span>
                    <div className="category-bar-container">
                      <div
                        className="category-bar-fill"
                        style={{ width: `${(count / stats.totalAlbums) * 100}%` }}
                      />
                    </div>
                    <span className="category-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
