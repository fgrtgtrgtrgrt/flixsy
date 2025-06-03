
import React, { useState, useEffect } from 'react';
import { movieService } from '@/services/movieService';
import { Genre, Movie } from '@/types/movie';
import MovieCard from './MovieCard';

interface GenreRowProps {
  onMovieClick: (movie: Movie) => void;
}

const GenreRow: React.FC<GenreRowProps> = ({ onMovieClick }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGenres = async () => {
      const genreList = await movieService.getGenres();
      setGenres(genreList.slice(0, 8)); // Show first 8 genres
      if (genreList.length > 0) {
        setSelectedGenre(genreList[0]);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      const loadGenreMovies = async () => {
        setLoading(true);
        const movies = await movieService.getMoviesByGenre(selectedGenre.id);
        setGenreMovies(movies);
        setLoading(false);
      };
      loadGenreMovies();
    }
  }, [selectedGenre]);

  if (!genres.length) return null;

  return (
    <div className="mb-8">
      <div className="px-4 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Browse by Genre</h2>
        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre)}
              className={`genre-button ${
                selectedGenre?.id === genre.id 
                  ? 'bg-flixsy-primary border-flixsy-primary' 
                  : ''
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
      
      {selectedGenre && (
        <div className="px-4">
          <h3 className="text-lg font-medium text-white mb-4">
            {selectedGenre.name} Movies
          </h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-flixsy-primary"></div>
            </div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
              {genreMovies.map((movie) => (
                <div key={movie.id} className="flex-none w-48">
                  <MovieCard movie={movie} onClick={onMovieClick} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenreRow;
