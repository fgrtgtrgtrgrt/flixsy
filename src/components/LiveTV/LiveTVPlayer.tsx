
import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LiveTVChannel } from '@/types/liveTV';
import { X, Volume2, VolumeX } from 'lucide-react';

interface LiveTVPlayerProps {
  channel: LiveTVChannel | null;
  isOpen: boolean;
  onClose: () => void;
}

const LiveTVPlayer: React.FC<LiveTVPlayerProps> = ({ channel, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(false);

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
      <DialogContent className="max-w-6xl bg-black border-none p-0 max-h-[90vh]">
        <div className="relative w-full h-[70vh]">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            autoPlay
            muted={isMuted}
            playsInline
          />
          
          {/* Channel info overlay */}
          <div className="absolute top-4 left-4 bg-black/70 rounded px-3 py-2">
            <h3 className="text-white font-semibold">{channel.name}</h3>
            <p className="text-gray-300 text-sm">{channel.category} • {channel.country}</p>
          </div>

          {/* Control buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={toggleMute}
              className="p-2 bg-black/70 rounded hover:bg-black/90 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6 text-white" />
              ) : (
                <Volume2 className="h-6 w-6 text-white" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-black/70 rounded hover:bg-black/90 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Live indicator */}
          <div className="absolute bottom-4 left-4">
            <span className="bg-red-600 text-white text-sm px-3 py-1 rounded flex items-center">
              ● LIVE
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiveTVPlayer;
