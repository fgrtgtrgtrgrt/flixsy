
import { Movie, MovieDetails, ApiResponse, Genre } from '@/types/movie';

const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'; // TMDB public API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

export const movieService = {
  async getTrending(): Promise<Movie[]> {
    try {
      const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
      const data: ApiResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return [];
    }
  },

  async getPopular(): Promise<Movie[]> {
    try {
      const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
      const data: ApiResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  },

  async getTopRated(): Promise<Movie[]> {
    try {
      const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
      const data: ApiResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      return [];
    }
  },

  async getUpcoming(): Promise<Movie[]> {
    try {
      const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
      const data: ApiResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      return [];
    }
  },

  async getMovieDetails(id: number): Promise<MovieDetails | null> {
    try {
      const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
      const data: MovieDetails = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  },

  async searchMovies(query: string): Promise<Movie[]> {
    try {
      const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
      const data: ApiResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  },

  async getGenres(): Promise<Genre[]> {
    try {
      const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      return [];
    }
  },

  async getMoviesByGenre(genreId: number): Promise<Movie[]> {
    try {
      const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
      const data: ApiResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return [];
    }
  },

  getImageUrl(path: string): string {
    return path ? `${IMAGE_BASE_URL}${path}` : '/placeholder.svg';
  },

  getBackdropUrl(path: string): string {
    return path ? `${BACKDROP_BASE_URL}${path}` : '/placeholder.svg';
  },

  getVidsrcUrl(movieId: number): string {
    return `https://vidsrc.to/embed/movie/${movieId}`;
  }
};
