
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { movieService } from '@/services/movieService';

interface VideoPlayerProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movieId, isOpen, onClose }) => {
  if (!movieId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-black border-none p-0 max-h-[90vh]">
        <div className="relative w-full h-[70vh]">
          <iframe
            src={movieService.getVidsrcUrl(movieId)}
            className="w-full h-full rounded-lg"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            title="Movie Player"
            sandbox="allow-same-origin allow-scripts allow-presentation allow-forms"
            referrerPolicy="no-referrer"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
