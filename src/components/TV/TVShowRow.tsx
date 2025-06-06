
import React from 'react';
import { TVShow } from '@/types/tv';
import TVShowCard from './TVShowCard';

interface TVShowRowProps {
  title: string;
  tvShows: TVShow[];
  onTVShowClick: (tvShow: TVShow) => void;
}

const TVShowRow: React.FC<TVShowRowProps> = ({ title, tvShows, onTVShowClick }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4 px-4">{title}</h2>
      <div className="px-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
          {tvShows.map((tvShow) => (
            <div key={tvShow.id} className="flex-none w-48">
              <TVShowCard tvShow={tvShow} onClick={onTVShowClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TVShowRow;
