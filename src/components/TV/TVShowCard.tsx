
import React from 'react';
import { TVShow } from '@/types/tv';
import { tvService } from '@/services/tvService';

interface TVShowCardProps {
  tvShow: TVShow;
  onClick: (tvShow: TVShow) => void;
}

const TVShowCard: React.FC<TVShowCardProps> = ({ tvShow, onClick }) => {
  return (
    <div 
      className="movie-card group"
      onClick={() => onClick(tvShow)}
    >
      <div className="relative aspect-[2/3] bg-flixsy-gray rounded-lg overflow-hidden">
        <img
          src={tvService.getImageUrl(tvShow.poster_path)}
          alt={tvShow.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{tvShow.name}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
              <span>•</span>
              <span className="flex items-center text-flixsy-accent">
                ⭐ {tvShow.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShowCard;
