
import React from 'react';
import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onMovieClick }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4 px-4">{title}</h2>
      <div className="px-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-48">
              <MovieCard movie={movie} onClick={onMovieClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
