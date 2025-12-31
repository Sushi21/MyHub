import { useEffect } from 'react';
import { useFilters } from '@/contexts/FilterContext';

export function useUrlParams() {
  const { setSearchTerm } = useFilters();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const artist = params.get('artist');

    if (artist) {
      setSearchTerm(artist);
    }
    // setSearchTerm is stable and doesn't need to be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
