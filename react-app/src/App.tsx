import { AlbumsProvider, useAlbums } from '@/contexts/AlbumsContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { PlayerProvider } from '@/contexts/PlayerContext';
import { HeartsProvider } from '@/contexts/HeartsContext';
import { NSFWProvider } from '@/contexts/NSFWContext';
import { Header } from '@/components/layout/Header';
import { FilterBar } from '@/components/filters/FilterBar';
import { AlbumGrid } from '@/components/albums/AlbumGrid';
import { PreviewBar } from '@/components/layout/PreviewBar';
import { NowPlaying } from '@/components/lastfm/NowPlaying';
import { CollectionStats } from '@/components/stats/CollectionStats';
import { MostPopular } from '@/components/favorites/MostPopular';

function AppContent() {
  const { loading, error, albums } = useAlbums();

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading albums...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  console.log('Loaded albums:', albums.length);

  return (
    <>
      <Header />
      <CollectionStats />
      <MostPopular />
      <FilterBar />
      <AlbumGrid />
      <PreviewBar />
      <NowPlaying
        username="SushiBzh"
        apiKey="ad0685eb4544fa12c9c113c3f28fcd38"
      />
    </>
  );
}

function App() {
  return (
    <AlbumsProvider>
      <FilterProvider>
        <PlayerProvider>
          <HeartsProvider>
            <NSFWProvider>
              <AppContent />
            </NSFWProvider>
          </HeartsProvider>
        </PlayerProvider>
      </FilterProvider>
    </AlbumsProvider>
  );
}

export default App;
