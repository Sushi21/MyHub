import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { useAlbums } from '@/contexts/AlbumsContext';
import { countryCoordinates, countryNames } from '@/data/countryCoordinates';
import type { Album } from '@/types/album';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface CountryData {
  code: string;
  name: string;
  count: number;
  coordinates: [number, number];
  albums: Album[];
}

interface NoCountryMapping {
  artist: string;
  album: string;
  country?: string;
}

// Convert country code to flag emoji
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function WorldMap() {
  const { albums } = useAlbums();
  const { countryCode } = useParams<{ countryCode: string }>();
  const navigate = useNavigate();
  const [noCountryMappings, setNoCountryMappings] = useState<NoCountryMapping[]>([]);
  const [manualPosition, setManualPosition] = useState<{ coordinates: [number, number]; zoom: number } | null>(null);

  // Load no-country.json mappings
  useEffect(() => {
    fetch('/output/no-country.json')
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data: NoCountryMapping[]) => {
        setNoCountryMappings(data || []);
      })
      .catch((err) => {
        console.warn('Could not load no-country.json:', err);
      });
  }, []);

  // Group albums by country with fallback to no-country.json
  const countryData = useMemo(() => {
    const dataMap = new Map<string, CountryData>();

    albums.forEach((album) => {
      let albumCountryCode = album.country?.toUpperCase();

      // If no country in collection.json, check no-country.json
      if (!albumCountryCode) {
        const mapping = noCountryMappings.find(
          (m) =>
            m.artist.toLowerCase() === album.artist.toLowerCase() &&
            m.album.toLowerCase() === album.album.toLowerCase()
        );
        albumCountryCode = mapping?.country?.toUpperCase();
      }

      // If still no country, skip this album
      if (!albumCountryCode) return;

      const coordinates = countryCoordinates[albumCountryCode];
      if (!coordinates) return;

      if (dataMap.has(albumCountryCode)) {
        const existing = dataMap.get(albumCountryCode)!;
        existing.count++;
        existing.albums.push(album);
      } else {
        dataMap.set(albumCountryCode, {
          code: albumCountryCode,
          name: countryNames[albumCountryCode] || albumCountryCode,
          count: 1,
          coordinates,
          albums: [album],
        });
      }
    });

    return Array.from(dataMap.values()).sort((a, b) => b.count - a.count);
  }, [albums, noCountryMappings]);

  // Derive selected country from URL parameter
  const selectedCountry = useMemo(() => {
    if (!countryCode) return null;
    return countryData.find((c) => c.code === countryCode.toUpperCase()) || null;
  }, [countryCode, countryData]);

  // Calculate position based on selected country or manual position
  const position = useMemo(() => {
    // If user manually moved the map, use that position
    if (manualPosition) return manualPosition;

    // Otherwise derive from selected country
    if (selectedCountry) {
      return {
        coordinates: selectedCountry.coordinates,
        zoom: 4,
      };
    }

    // Default world view
    return { coordinates: [0, 0] as [number, number], zoom: 1 };
  }, [selectedCountry, manualPosition]);

  const handleCountryClick = (country: CountryData) => {
    // Clear manual position so URL-based position takes over
    setManualPosition(null);
    // Update URL with country code
    navigate(`/map/${country.code}`);
  };

  const handleReset = () => {
    // Clear manual position
    setManualPosition(null);
    // Reset URL to just /map
    navigate('/map');
  };

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    // Store manual position when user moves the map
    setManualPosition(newPosition);
  };

  // Calculate marker size based on count and zoom level (logarithmic scale)
  const getMarkerSize = (count: number, zoom: number) => {
    const baseSize = 4;
    const scale = 3;
    const sizeByCount = baseSize + Math.log(count + 1) * scale;
    // Scale the marker size inversely with zoom level (smaller when zoomed in)
    return sizeByCount / zoom;
  };

  // Calculate stroke width based on zoom level
  const getStrokeWidth = (zoom: number) => {
    // Keep stroke width reasonable - scales inversely with zoom
    return Math.max(0.3, 1.5 / zoom);
  };

  // Calculate font size based on zoom level
  const getFontSize = (zoom: number) => {
    // Font gets smaller with zoom but not too small
    return Math.max(6, 10 / Math.sqrt(zoom));
  };

  return (
    <div className="world-map-container">
      <div className="world-map-header">
        <h2>Artists by Country</h2>
        {selectedCountry && (
          <button className="reset-button" onClick={handleReset}>
            ← Back to World View
          </button>
        )}
      </div>

      <div className="world-map-content">
        <div className="map-wrapper">
          <ComposableMap
            projectionConfig={{
              scale: 147,
            }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={handleMoveEnd}
            >
              <Geographies geography={geoUrl}>
                {({ geographies } : { geographies: any[] }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#DDD"
                      stroke="#FFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: '#CCC', outline: 'none' },
                        pressed: { fill: '#BBB', outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {countryData.map((country) => {
                const markerSize = getMarkerSize(country.count, position.zoom);
                const strokeWidth = getStrokeWidth(position.zoom);
                const fontSize = getFontSize(position.zoom);

                return (
                  <Marker
                    key={country.code}
                    coordinates={country.coordinates}
                    onClick={() => handleCountryClick(country)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      r={markerSize}
                      fill="#dc2626"
                      fillOpacity={0.7}
                      stroke="#fff"
                      strokeWidth={strokeWidth}
                      className="country-marker"
                    />
                    <text
                      textAnchor="middle"
                      y={markerSize + (8 / position.zoom)}
                      style={{
                        fontFamily: 'system-ui',
                        fontSize: `${fontSize}px`,
                        fill: '#333',
                        fontWeight: 'bold',
                      }}
                    >
                      {country.count}
                    </text>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {selectedCountry ? (
          <div className="country-details">
            <h3>
              <span className="country-flag">{getFlagEmoji(selectedCountry.code)}</span> {selectedCountry.name} ({selectedCountry.count} album{selectedCountry.count !== 1 ? 's' : ''})
            </h3>
            <div className="country-albums">
              {selectedCountry.albums.map((album) => (
                <div key={`${album.artist}-${album.album}`} className="country-album-card">
                  <img src={`/output/${album.cover}`} alt={album.album} />
                  <div className="country-album-info">
                    <strong>{album.album}</strong>
                    <span>{album.artist}</span>
                    <span className="year">{album.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="country-list">
            <h3>Countries</h3>
            <div className="country-list-items">
              {countryData.map((country) => (
                <button
                  key={country.code}
                  className="country-list-item"
                  onClick={() => handleCountryClick(country)}
                >
                  <span className="country-name">
                    <span className="country-flag">{getFlagEmoji(country.code)}</span> {country.name}
                  </span>
                  <span className="country-count">{country.count} albums</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
