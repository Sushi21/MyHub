import { Routes, Route, Link, useLocation } from 'react-router-dom';
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
import { ScrobblingHistory } from '@/components/lastfm/ScrobblingHistory';
import { CollectionStats } from '@/components/stats/CollectionStats';
import { MostPopular } from '@/components/favorites/MostPopular';
import { WorldMap } from '@/components/map/WorldMap';
import { About } from '@/components/about/About';

function Navigation() {
  const location = useLocation();
  const isMapPage = location.pathname.startsWith('/map');
  const isScrobblesPage = location.pathname.startsWith('/scrobbles');
  const isAboutPage = location.pathname.startsWith('/about');
  const isCollectionPage = !isMapPage && !isScrobblesPage && !isAboutPage;

  return (
    <nav className="main-nav">
      <Link to="/">
        <button className={isCollectionPage ? 'active' : ''}>
          Records Collection on Vinyl
        </button>
      </Link>
      <Link to="/map">
        <button className={isMapPage ? 'active' : ''}>
          Collection World Map
        </button>
      </Link>
      <Link to="/scrobbles">
        <button className={isScrobblesPage ? 'active' : ''}>
          Scrobbles
        </button>
      </Link>
      <Link to="/about">
        <button className={isAboutPage ? 'active' : ''}>
          About
        </button>
      </Link>
    </nav>
  );
}

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
      <Navigation />

      <Routes>
        <Route path="/" element={
          <>
            <CollectionStats />
            <MostPopular />
            <FilterBar />
            <AlbumGrid />
            <PreviewBar />
          </>
        } />
        <Route path="/map" element={<WorldMap />} />
        <Route path="/map/:countryCode" element={<WorldMap />} />
        <Route path="/scrobbles" element={
          <ScrobblingHistory
            username="SushiBzh"
            apiKey="ad0685eb4544fa12c9c113c3f28fcd38"
          />
        } />
        <Route path="/about" element={<About />} />
      </Routes>

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
