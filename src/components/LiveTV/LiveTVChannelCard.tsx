import React from 'react';
import { LiveTVChannel } from '@/types/liveTV';

interface LiveTVChannelCardProps {
  channel: LiveTVChannel;
  onClick: (channel: LiveTVChannel) => void;
}

const LiveTVChannelCard: React.FC<LiveTVChannelCardProps> = ({ channel, onClick }) => {
  return (
    <div 
      className="live-tv-card group cursor-pointer"
      onClick={() => onClick(channel)}
    >
      <div className="relative aspect-video bg-flixsy-gray rounded-lg overflow-hidden">
        <img
          src={channel.logo}
          alt={channel.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4">
            <h3 className="text-white font-semibold text-xs md:text-sm mb-1 line-clamp-2">{channel.name}</h3>
            {channel.currentProgram && (
              <p className="text-gray-300 text-xs mb-1 truncate">Now: {channel.currentProgram}</p>
            )}
            <div className="flex items-center space-x-1 md:space-x-2 text-xs text-gray-300">
              <span className="truncate">{channel.category}</span>
              <span>•</span>
              <span className="truncate">{channel.country}</span>
              {channel.isWorking && (
                <>
                  <span>•</span>
                  <span className="flex items-center text-green-400">
                    ● Live
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Live indicator */}
        {channel.isWorking && (
          <div className="absolute top-1 md:top-2 right-1 md:right-2">
            <span className="bg-red-600 text-white text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded">LIVE</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTVChannelCard;
