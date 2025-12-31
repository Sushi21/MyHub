export interface Track {
  title: string;
  track: number;
  length: string; // Format: "MM:SS"
}

export interface Album {
  album: string;
  artist: string;
  year: number;
  category: string;
  genre: string; // Comma-separated genres
  cover: string; // Relative path: images/[category]/[artist]/...
  tracks: Track[];
}

export interface DeezerTrack {
  id: number;
  title: string;
  preview: string; // MP3 URL
  artist: {
    name: string;
  };
  album: {
    title: string;
    cover_small: string;
    cover_medium: string;
  };
}

export interface DeezerResponse {
  data: DeezerTrack[];
  total: number;
}

export type CategoryType = 'all' | string;

export interface FilterState {
  selectedCategory: CategoryType;
  selectedGenre: string;
  searchTerm: string;
  shouldAutoPlay: boolean;
}

export type FilterAction =
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_GENRE'; payload: string }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_AUTO_PLAY'; payload: boolean }
  | { type: 'RESET_FILTERS' };
