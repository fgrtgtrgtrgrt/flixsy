
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface VideoPlayerProps {
  contentId: number | null;
  contentType: 'movie' | 'tv' | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ contentId, contentType, isOpen, onClose }) => {
  if (!contentId || !contentType) return null;

  const vidsrcUrl = `https://vidsrc.cc/v2/embed/${contentType}/${contentId}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-black border-none p-0 max-h-[90vh]">
        <div className="relative w-full h-[70vh]">
          <iframe
            src={vidsrcUrl}
            className="w-full h-full rounded-lg"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            title={`${contentType === 'movie' ? 'Movie' : 'TV Show'} Player`}
            sandbox="allow-same-origin allow-scripts allow-presentation"
            referrerPolicy="no-referrer"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
