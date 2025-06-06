
export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  tagline?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TVShowDetails extends TVShow {
  genres: Genre[];
  number_of_seasons: number;
  number_of_episodes: number;
  tagline: string;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string;
  }>;
  seasons: Array<{
    id: number;
    season_number: number;
    episode_count: number;
    name: string;
    poster_path: string;
  }>;
}

export interface ApiResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}
