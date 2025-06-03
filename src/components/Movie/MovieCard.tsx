
import React from 'react';
import { Movie } from '@/types/movie';
import { movieService } from '@/services/movieService';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div 
      className="movie-card group"
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-[2/3] bg-netflix-gray rounded-lg overflow-hidden">
        <img
          src={movieService.getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span>•</span>
              <span className="flex items-center">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
