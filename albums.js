let albums = [];
let selectedCategory = 'all';
let selectedGenre = '';
let searchTerm = '';

async function loadAlbums() {
  const response = await fetch('albums.json');
  albums = await response.json();
  buildCategoryButtons();
  buildGenreDropdown();
  renderAlbums();
}

function buildCategoryButtons() {
  const categories = [...new Set(albums.map(a => a.category))];
  const filtersContainer = document.querySelector('.filters');

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = cat;
    btn.dataset.category = cat;
    btn.addEventListener('click', () => {
      selectedCategory = cat;
      selectedGenre = '';
      searchTerm = '';
      document.getElementById('searchBox').value = '';
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      buildGenreDropdown();
      renderAlbums();
    });
    filtersContainer.insertBefore(btn, document.getElementById('genreFilter'));
  });

  // 'All' button handler
  document.querySelector('[data-category=\'all\']').addEventListener('click', () => {
    selectedCategory = 'all';
    selectedGenre = '';
    searchTerm = '';
    document.getElementById('searchBox').value = '';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-category=\'all\']').classList.add('active');
    buildGenreDropdown();
    renderAlbums();
  });
}

function buildGenreDropdown() {
  const genreSelect = document.getElementById('genreFilter');
  genreSelect.innerHTML = '<option value=\'\'>Filter by Genre</option>';

  // Filter genres based on current category
  const filteredAlbums = selectedCategory === 'all'
    ? albums
    : albums.filter(a => a.category === selectedCategory);

  const genres = [...new Set(filteredAlbums.flatMap(a => a.genre.split(',').map(g => g.trim()).filter(Boolean)))].sort();

  genres.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    genreSelect.appendChild(opt);
  });

  genreSelect.addEventListener('change', () => {
    selectedGenre = genreSelect.value;
    renderAlbums();
  });
}

function renderAlbums() {
  const grid = document.getElementById('albumGrid');
  grid.innerHTML = '';

  const filtered = albums.filter(a => {
    const categoryMatch = selectedCategory === 'all' || a.category === selectedCategory;
    const genreMatch = !selectedGenre || a.genre.split(',').map(g => g.trim()).includes(selectedGenre);
    const searchMatch = !searchTerm ||
      a.album.toLowerCase().includes(searchTerm) ||
      a.artist.toLowerCase().includes(searchTerm);
    return categoryMatch && genreMatch && searchMatch;
  });

  grid.classList.toggle('single-result', filtered.length === 1);

  filtered.forEach(a => {
    const div = document.createElement('div');
    div.className = 'album';
    div.innerHTML = `
      <img src='${a.cover}' alt='${a.album}'>
      <div class='album-info'>
        <strong>${a.album}</strong>
        <em>${a.artist}</em><br>
        ${a.year || ''}<br>
        <small>${a.genre}</small>
      </div>
    `;

    // ✅ Click handler: search Deezer for preview and play
    div.addEventListener('click', () => playPreview(a.artist, a.album));

    grid.appendChild(div);
  });
}

// 🔊 Preview logic using JSONP
function playPreview(artist, album, year) {
  // Remove existing preview bar if any
  let existing = document.getElementById('previewBar');
  if (existing) existing.remove();

  const query = encodeURIComponent(`${artist} ${album}`);
  const callbackName = 'deezerPreviewCallback_' + Math.floor(Math.random() * 100000);

  window[callbackName] = function(data) {
    if (data.data && data.data.length > 0) {
      const track = data.data[0];

      // Create preview bar container
      const bar = document.createElement('div');
      bar.id = 'previewBar';
      bar.innerHTML = `
        <img src="${track.album.cover_small}" alt="${track.album.title}">
        <div class="info">
          <strong>${track.title}</strong><br>
          <small>${track.artist.name} • ${year || ''}</small>
          <div class="spectrum">
            <div></div><div></div><div></div><div></div><div></div>
          </div>
        </div>
        <button id="playPauseBtn">⏸</button>
        <audio id="previewAudio" src="${track.preview}" autoplay></audio>
      `;

      document.body.appendChild(bar);

      const audio = bar.querySelector('#previewAudio');
      const playPauseBtn = bar.querySelector('#playPauseBtn');
      const bars = bar.querySelectorAll('.spectrum div');

      // Play/pause toggle
      playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
          audio.play();
          playPauseBtn.textContent = '⏸';
        }
        else {
          audio.pause();
          playPauseBtn.textContent = '▶️';
        }
      });

      // Animate spectrum when audio is playing
      function animateSpectrum() {
        if (!audio.paused) {
          bars.forEach(bar => {
            bar.style.height = `${Math.random() * 100}%`;
          });
        }
        else {
          bars.forEach(bar => {
            bar.style.height = '5%';
          });
        }
        requestAnimationFrame(animateSpectrum);
      }
      animateSpectrum();
    }
    else {
      alert('No preview found for this album.');
    }

    // Cleanup JSONP script
    delete window[callbackName];
    script.remove();
  };

  const script = document.createElement('script');
  script.src = `https://api.deezer.com/search?q=${query}&output=jsonp&callback=${callbackName}`;
  document.body.appendChild(script);
}

// Search box handler
document.getElementById('searchBox').addEventListener('input', (e) => {
  searchTerm = e.target.value.toLowerCase();
  renderAlbums();
});

const urlParams = new URLSearchParams(window.location.search);
const artistParam = urlParams.get('artist');
if (artistParam) {
  document.getElementById('searchBox').value = artistParam;
  setSearch(artistParam);
}

function setSearch(term) {
  searchTerm = term.toLowerCase();
  renderAlbums();
}

loadAlbums();