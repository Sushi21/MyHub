import { useMemo, useState } from 'react';
import { useHearts } from '@/contexts/HeartsContext';
import { useAlbums } from '@/contexts/AlbumsContext';
import type { Album } from '@/types/album';

export function MostPopular() {
  const { heartedAlbumsWithData } = useHearts();
  const { albums } = useAlbums();
  const [isExpanded, setIsExpanded] = useState(true);

  const favoriteAlbums = useMemo(() => {
    if (heartedAlbumsWithData.length === 0) {
      return [];
    }

    // Map hearted albums to full album data
    const favAlbums = heartedAlbumsWithData
      .map(heartData => {
        return albums.find(
          a => a.artist.toLowerCase() === heartData.artist.toLowerCase() &&
               a.album.toLowerCase() === heartData.album.toLowerCase()
        );
      })
      .filter((album): album is Album => album !== undefined);

    // Sort by timestamp (most recent first)
    return favAlbums.sort((a, b) => {
      const aData = heartedAlbumsWithData.find(
        h => h.artist.toLowerCase() === a.artist.toLowerCase() &&
             h.album.toLowerCase() === a.album.toLowerCase()
      );
      const bData = heartedAlbumsWithData.find(
        h => h.artist.toLowerCase() === b.artist.toLowerCase() &&
             h.album.toLowerCase() === b.album.toLowerCase()
      );
      return (bData?.timestamp || 0) - (aData?.timestamp || 0);
    });
  }, [heartedAlbumsWithData, albums]);

  if (favoriteAlbums.length === 0) {
    return null;
  }

  return (
    <div className={`most-popular ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="most-popular-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>❤️ Your Favorite Albums</h3>
        <div className="most-popular-header-right">
          <span className="favorite-count">{favoriteAlbums.length} album{favoriteAlbums.length !== 1 ? 's' : ''}</span>
          <button className="collapse-toggle">
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="most-popular-grid">
          {favoriteAlbums.slice(0, 12).map((album) => (
            <div key={`${album.artist}-${album.album}`} className="favorite-album">
              <img src={`/output/${album.cover}`} alt={album.album} />
              <div className="favorite-album-info">
                <div className="favorite-album-title">{album.album}</div>
                <div className="favorite-album-artist">{album.artist}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
