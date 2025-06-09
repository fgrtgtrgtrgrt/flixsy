import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LiveTVChannel } from '@/types/liveTV';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LiveTVPlayerProps {
  channel: LiveTVChannel | null;
  isOpen: boolean;
  onClose: () => void;
}

const LiveTVPlayer: React.FC<LiveTVPlayerProps> = ({ channel, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (channel && videoRef.current && isOpen) {
      const video = videoRef.current;
      video.src = channel.url;
      video.load();
      video.play().catch(error => {
        console.error('Error playing live stream:', error);
      });
    }
  }, [channel, isOpen]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!channel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'max-w-full m-2' : 'max-w-6xl'} bg-black border-none p-0 max-h-[90vh]`}>
        <div className={`relative w-full ${isMobile ? 'h-[50vh]' : 'h-[70vh]'}`}>
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            autoPlay
            muted={isMuted}
            playsInline
          />
          
          {/* Channel info overlay */}
          <div className={`absolute ${isMobile ? 'top-2 left-2' : 'top-4 left-4'} bg-black/70 rounded px-2 md:px-3 py-1 md:py-2`}>
            <h3 className={`text-white font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>{channel.name}</h3>
            <p className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>{channel.category} • {channel.country}</p>
            {channel.currentProgram && (
              <p className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>Now: {channel.currentProgram}</p>
            )}
          </div>

          {/* Control buttons */}
          <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} flex space-x-1 md:space-x-2`}>
            <button
              onClick={toggleMute}
              className={`${isMobile ? 'p-1.5' : 'p-2'} bg-black/70 rounded hover:bg-black/90 transition-colors`}
            >
              {isMuted ? (
                <VolumeX className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'} text-white`} />
              ) : (
                <Volume2 className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'} text-white`} />
              )}
            </button>
            <button
              onClick={onClose}
              className={`${isMobile ? 'p-1.5' : 'p-2'} bg-black/70 rounded hover:bg-black/90 transition-colors`}
            >
              <X className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'} text-white`} />
            </button>
          </div>

          {/* Live indicator */}
          <div className={`absolute ${isMobile ? 'bottom-2 left-2' : 'bottom-4 left-4'}`}>
            <span className={`bg-red-600 text-white ${isMobile ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'} rounded flex items-center`}>
              ● LIVE
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiveTVPlayer;
