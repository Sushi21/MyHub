import { useState, useEffect } from 'react';
import { useFilters } from '@/contexts/FilterContext';

export function SearchBox() {
  const { searchTerm, setSearchTerm } = useFilters();
  const [showClear, setShowClear] = useState(false);

  useEffect(() => {
    setShowClear(searchTerm.length > 0);
  }, [searchTerm]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="search-container">
      <input
        type="text"
        id="searchBox"
        placeholder="Search album or artist..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        id="clearSearch"
        className="clear-btn"
        style={{ display: showClear ? 'block' : 'none' }}
        onClick={handleClear}
      >
        ✕
      </button>
    </div>
  );
}
