
import React from 'react';
import { MovieDetails } from '@/types/movie';
import { movieService } from '@/services/movieService';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MovieModalProps {
  movie: MovieDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (movieId: number) => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, isOpen, onClose, onPlay }) => {
  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-netflix-gray border-gray-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="relative">
            <img
              src={movieService.getBackdropUrl(movie.backdrop_path)}
              alt={movie.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-gray to-transparent rounded-lg" />
            <div className="absolute bottom-4 left-4">
              <h2 className="text-2xl font-bold">{movie.title}</h2>
              {movie.tagline && (
                <p className="text-gray-400 italic">{movie.tagline}</p>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              onClick={() => onPlay(movie.id)}
              className="bg-netflix-red hover:bg-red-700 px-8 py-3 text-lg font-semibold"
            >
              ▶ Play Now
            </Button>
            <div className="text-sm text-gray-400">
              {new Date(movie.release_date).getFullYear()} • {movie.runtime} min • ⭐ {movie.vote_average.toFixed(1)}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-1">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span 
                      key={genre.id}
                      className="px-2 py-1 bg-gray-700 rounded text-xs"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-1">Release Date</h4>
                <p className="text-sm">{new Date(movie.release_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieModal;
