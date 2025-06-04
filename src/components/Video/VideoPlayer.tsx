
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { movieService } from '@/services/movieService';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movieId, isOpen, onClose }) => {
  const [currentSource, setCurrentSource] = useState(0);
  
  if (!movieId) return null;

  const sources = [
    `https://vidsrc.to/embed/movie/${movieId}`,
    `https://www.2embed.cc/embed/${movieId}`,
    `https://multiembed.mov/directstream.php?video_id=${movieId}&tmdb=1`
  ];

  const handleSourceChange = () => {
    setCurrentSource((prev) => (prev + 1) % sources.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-black border-none p-0 max-h-[90vh]">
        <div className="relative w-full h-[70vh]">
          <iframe
            key={currentSource}
            src={sources[currentSource]}
            className="w-full h-full rounded-lg"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            title="Movie Player"
            sandbox="allow-same-origin allow-scripts allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 right-4 z-10">
            <Button
              onClick={handleSourceChange}
              className="bg-flixsy-primary hover:bg-flixsy-secondary text-white text-sm px-3 py-1"
            >
              Try Another Source
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
