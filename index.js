let allChannels = [];
let currentCategory = 'All';

function renderGrid(category) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  let filtered;

  if (category === 'All') {
    filtered = allChannels;
  }
  else if (category === 'French 🇫🇷') {
    filtered = allChannels.filter(ch => ch.french);
  }
  else {
    filtered = allChannels.filter(ch => ch.category === category);
  }

  filtered.forEach(channel => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <a href="${channel.link}" target="_blank">
        <img src="${channel.img}" alt="${channel.title}">
        <p>${channel.title}</p>
      </a>
      ${channel.french ? '<div class="flag">🇫🇷</div>' : ''}
    `;

    grid.appendChild(card);
  });
}

function renderFilters(categories) {
  const filters = document.getElementById('filters');
  filters.innerHTML = '';
  const allCats = ['All', 'French 🇫🇷', ...categories];
  allCats.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = cat === currentCategory ? 'active' : '';
    btn.onclick = () => {
      currentCategory = cat;
      document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid(cat);
    };
    filters.appendChild(btn);
  });
}

// Load JSON file
fetch('youtube_subscriptions.json')
  .then(response => response.json())
  .then(data => {
    allChannels = data;
    const categories = [...new Set(data.map(ch => ch.category).filter(Boolean))];
    renderFilters(categories);
    renderGrid('All');
  })
  .catch(err => {
    console.error('Error loading JSON:', err);
    document.getElementById('grid').innerText = 'Could not load subscriptions.';
  });