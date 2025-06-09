
import React from 'react';
import { LiveTVCategory } from '@/types/liveTV';
import LiveTVChannelCard from './LiveTVChannelCard';

interface LiveTVCategoryRowProps {
  category: LiveTVCategory;
  onChannelClick: (channel: any) => void;
}

const LiveTVCategoryRow: React.FC<LiveTVCategoryRowProps> = ({ category, onChannelClick }) => {
  if (category.channels.length === 0) return null;

  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 px-4">{category.name}</h2>
      <div className="px-4">
        <div className="flex space-x-3 md:space-x-4 overflow-x-auto scrollbar-hide pb-4">
          {category.channels.map((channel) => (
            <div key={channel.id} className="flex-none w-48 md:w-64">
              <LiveTVChannelCard channel={channel} onClick={onChannelClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTVCategoryRow;
