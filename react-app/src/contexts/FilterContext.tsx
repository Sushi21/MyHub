/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterState, FilterAction } from '@/types/album';

interface FilterContextValue extends FilterState {
  setSelectedCategory: (category: string) => void;
  setSelectedGenre: (genre: string) => void;
  setSearchTerm: (term: string) => void;
  setShouldAutoPlay: (shouldAutoPlay: boolean) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

const initialState: FilterState = {
  selectedCategory: 'all',
  selectedGenre: '',
  searchTerm: '',
  shouldAutoPlay: false,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_CATEGORY':
      // Reset genre when category changes, but preserve other state
      return {
        ...state,
        selectedCategory: action.payload,
        selectedGenre: '',
      };
    case 'SET_GENRE':
      return {
        ...state,
        selectedGenre: action.payload,
      };
    case 'SET_SEARCH':
      return {
        ...state,
        searchTerm: action.payload,
      };
    case 'SET_AUTO_PLAY':
      return {
        ...state,
        shouldAutoPlay: action.payload,
      };
    case 'RESET_FILTERS':
      return initialState;
    default:
      return state;
  }
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, dispatch] = useReducer(filterReducer, initialState);

  // Sync state with URL params on mount
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const genre = searchParams.get('genre') || '';
    const search = searchParams.get('search') || searchParams.get('artist') || '';

    if (category !== 'all') dispatch({ type: 'SET_CATEGORY', payload: category });
    if (genre) dispatch({ type: 'SET_GENRE', payload: genre });
    if (search) dispatch({ type: 'SET_SEARCH', payload: search });
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (state.selectedCategory !== 'all') {
      params.set('category', state.selectedCategory);
    }
    if (state.selectedGenre) {
      params.set('genre', state.selectedGenre);
    }
    if (state.searchTerm) {
      params.set('search', state.searchTerm);
    }

    setSearchParams(params, { replace: true });
  }, [state.selectedCategory, state.selectedGenre, state.searchTerm, setSearchParams]);

  const setSelectedCategory = (category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const setSelectedGenre = (genre: string) => {
    dispatch({ type: 'SET_GENRE', payload: genre });
  };

  const setSearchTerm = (term: string) => {
    dispatch({ type: 'SET_SEARCH', payload: term });
  };

  const setShouldAutoPlay = (shouldAutoPlay: boolean) => {
    dispatch({ type: 'SET_AUTO_PLAY', payload: shouldAutoPlay });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  return (
    <FilterContext.Provider
      value={{
        ...state,
        setSelectedCategory,
        setSelectedGenre,
        setSearchTerm,
        setShouldAutoPlay,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
