
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TVShowDetails } from '@/types/tv';
import { tvService } from '@/services/tvService';
import { Play, X } from 'lucide-react';

interface TVShowModalProps {
  tvShow: TVShowDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (tvShowId: number) => void;
}

const TVShowModal: React.FC<TVShowModalProps> = ({ tvShow, isOpen, onClose, onPlay }) => {
  if (!tvShow) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-flixsy-darker border border-flixsy-primary/20 p-0 overflow-hidden">
        <div className="relative">
          <div className="relative h-[400px]">
            <img
              src={tvService.getBackdropUrl(tvShow.backdrop_path)}
              alt={tvShow.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-flixsy-darker via-transparent to-transparent" />
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          
          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-4xl font-bold text-white mb-4">{tvShow.name}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-green-400 font-semibold">
                ⭐ {tvShow.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-300">{new Date(tvShow.first_air_date).getFullYear()}</span>
              <span className="text-gray-300">{tvShow.number_of_seasons} Seasons</span>
              <span className="text-gray-300">{tvShow.number_of_episodes} Episodes</span>
            </div>
            <Button
              onClick={() => onPlay(tvShow.id)}
              className="bg-flixsy-primary hover:bg-flixsy-primary/80 text-white font-semibold px-8 py-3"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Now
            </Button>
          </div>
        </div>
        
        <div className="p-8">
          {tvShow.tagline && (
            <p className="text-flixsy-accent italic mb-4">{tvShow.tagline}</p>
          )}
          <p className="text-gray-300 mb-6 leading-relaxed">{tvShow.overview}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {tvShow.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-flixsy-gray rounded-full text-sm text-gray-300"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TVShowModal;
