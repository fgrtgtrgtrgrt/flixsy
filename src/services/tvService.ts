
import { TVShow, TVShowDetails, ApiResponse } from '@/types/tv';

const API_KEY = '8265bd1679663a7ea12ac168da84d2e8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

export const tvService = {
  async getTrending(): Promise<TVShow[]> {
    try {
      const response = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
      const data: ApiResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
      return [];
    }
  },

  async getPopular(): Promise<TVShow[]> {
    try {
      const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
      const data: ApiResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      return [];
    }
  },

  async getTopRated(): Promise<TVShow[]> {
    try {
      const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
      const data: ApiResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching top rated TV shows:', error);
      return [];
    }
  },

  async getAiringToday(): Promise<TVShow[]> {
    try {
      const response = await fetch(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}`);
      const data: ApiResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching airing today TV shows:', error);
      return [];
    }
  },

  async getTVShowDetails(id: number): Promise<TVShowDetails | null> {
    try {
      const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
      const data: TVShowDetails = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      return null;
    }
  },

  async searchTVShows(query: string): Promise<TVShow[]> {
    try {
      const response = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
      const data: ApiResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error searching TV shows:', error);
      return [];
    }
  },

  getImageUrl(path: string): string {
    return path ? `${IMAGE_BASE_URL}${path}` : '/placeholder.svg';
  },

  getBackdropUrl(path: string): string {
    return path ? `${BACKDROP_BASE_URL}${path}` : '/placeholder.svg';
  },

  getVidsrcUrl(tvShowId: number): string {
    return `https://vidsrc.to/embed/tv/${tvShowId}`;
  }
};
