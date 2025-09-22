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
    grid.appendChild(div);
  });
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