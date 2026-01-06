interface GearItem {
  name: string;
  description: string;
  image?: string;
}

interface ListeningStation {
  title: string;
  gear: GearItem[];
}

export function About() {
  const listeningStations: ListeningStation[] = [
    {
      title: "Living Room",
      gear: [
        {
          name: "Turntable",
          description: "Technic Quartz SL-Q2",
          image : "/output/images/About/turntable.JPG"
        },
        {
          name: "Cartridge",
          description: "Nagaoka MP-110",
          image: "/output/images/About/mp-110.jpg"
        },
        {
          name: "Speakers",
          description: "Polk Reserve R200",
          image: "/output/images/About/polk.jpg"
        },
        {
          name: "Amplifier",
          description: "Sansui AU-7500",
          image: "/output/images/About/Sansui_AU-7500.jpg"
        },
        {
          name: "Audio Source",
          description: "Records",
          image: "/output/images/About/vinyl-cover.jpg"
        },
                {
          name: "Audio Source bis",
          description: "Tidal Subscription via bluetooth receiver",
          image: "/output/images/About/tidal.jpg"
        },
      ]
    },
    {
      title: "WorkStation",
      gear: [
        {
          name: "Headphones",
          description: "Hifiman Sundara",
          image : "/output/images/About/sundara.jpg"
        },
        {
          name: "Audio Interface",
          description: "Schiit Stack Magni Heresy, Modi 3E, Loki Mini+ (DAC + EQUALIZER + AMP -> Headphones)",
          image: "/output/images/About/schiit-stack-modi-3-magni-heresy-loki-mini.jpg"
        },
        {
          name: "Audio Interface bis",
          description: "Focusrite Scarlett Solo + (power the KALI)",
          image: "/output/images/About/scarlett.jpg"
        },
        {
          name: "Speakers",
          description: "KALI AUDIO LP6 Monitor",
          image: "/output/images/About/kali.jpg"
        },
        {
          name: "Audio Source",
          description: "Tidal Subscription",
          image: "/output/images/About/tidal.jpg"
        },
        {
          name: "Audio Source bis",
          description: "Local Flac Lossless File (Winamp)",
          image: "/output/images/About/winamp.png"
        }
      ]
    },
    {
      title: "Traveling/Roaming",
      gear: [
        {
          name: "SmartPhone",
          description: "Google Pixel 4a",
          image: "/output/images/About/pixel4a.png"
        },
        {
          name: "Headphones",
          description: "Beyerdynamic DT 770 PRO (80 Ohms)",
          image: "/output/images/About/dt770pro.jpg"
        },
        {
          name: "Audio Source",
          description: "Tidal Subscription",
          image: "/output/images/About/tidal.jpg"
        }
      ]
    }
  ];

  return (
    <div className="about-page">
      {/* Music Gear Section */}
      <section className="music-gear-section">
        <h1>My Music Gear</h1>
        <p className="section-intro">
          Here's a look at the equipment I use across my different listening stations.
        </p>

        {listeningStations.map((station, index) => (
          <div key={index} className="listening-station">
            <h2>{station.title}</h2>
            <div className="gear-grid">
              {station.gear.map((item, itemIndex) => (
                <div key={itemIndex} className="gear-card">
                  <div className="gear-image-placeholder">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="placeholder-icon">🎵</div>
                    )}
                  </div>
                  <div className="gear-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* About This Site Section */}
      <section className="site-info-section">
        <h1>About This Site</h1>
        <p className="section-intro">Tools and Hosting.</p>
        <div className="info-grid">
          <div className="info-card">
            <h3>🛠️ Tech Stack</h3>
            <ul>
              <li><strong>Frontend:</strong> React + TypeScript</li>
              <li><strong>Build Tool:</strong> Vite</li>
              <li><strong>Backend:</strong> No Backend</li>
              <li><strong>JSON Builder:</strong> C# & .net 8.0</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>🔌 APIs</h3>
            <ul>
              <li><strong><a href='https://www.last.fm/api' target='blank'>Last.fm API:</a></strong> Scrobbling data, now playing, listening history</li>
              <li><strong><a href='https://musicbrainz.org/doc/MusicBrainz_API' target='blank'>MusicBrainz API:</a></strong> Easy way to get meta data from albums like the country</li>
                <li><strong><a href='https://developers.deezer.com/' target='blank'>Deezer API:</a></strong> Free way to get a 30 seconds song preview.</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>🚀 Hosting</h3>
            <ul>
              <li><strong>Website Hosting:</strong> GitHub Page</li>
              <li><strong>Deployment:</strong> GitHub Pipeline</li>
              <li><strong>Versioning:</strong> Git + Github</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>📊 Data Sources</h3>
            <ul>
              <li>Personal vinyl collection manually created from my discogs data</li>
              <li>Real-time scrobbling data from Last.fm</li>
              <li>Geographic data from MusicBrains</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>⚙️ Softwares</h3>
            <ul>
              <li><strong><a href='https://www.mp3tag.de/' target='blank'>Mp3tag:</a></strong> Used to set Genre in metadata files pulling data from discogs API</li>
              <li><strong><a href='https://github.com/yaronzz/Tidal-Media-Downloader' target='blank'>Tidal-Media-Downloader:</a></strong> Used to download my vinyl collection in local flac</li>
            </ul>
          </div>
        </div>

        <div className="site-purpose">
          <h3>Purpose</h3>
          <p>
            This site is a personal project to showcase my vinyl collection and listening habits.
            It combines my love for music with web development, creating an interactive way to
            explore and visualize my musical journey.
          </p>
        </div>
      </section>
    </div>
  );
}
