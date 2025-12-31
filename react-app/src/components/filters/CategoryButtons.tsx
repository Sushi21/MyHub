import { useAlbums } from '@/contexts/AlbumsContext';
import { useFilters } from '@/contexts/FilterContext';

export function CategoryButtons() {
  const { albums } = useAlbums();
  const { selectedCategory, setSelectedCategory, setSearchTerm } = useFilters();

  // Extract unique categories from albums
  const categories = [...new Set(albums.map(a => a.category))];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // Clear search when changing category
    setSearchTerm('');
  };

  return (
    <>
      <button
        className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
        onClick={() => handleCategoryClick('all')}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category}
          className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </button>
      ))}
    </>
  );
}
