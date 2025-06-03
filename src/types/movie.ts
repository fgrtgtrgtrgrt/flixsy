
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  tagline: string;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string;
  }>;
}

export interface ApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
