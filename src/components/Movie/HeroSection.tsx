
import React, { useEffect, useState } from 'react';
import { Movie } from '@/types/movie';
import { movieService } from '@/services/movieService';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onMovieClick: (movie: Movie) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onMovieClick }) => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const loadFeaturedMovie = async () => {
      const trending = await movieService.getTrending();
      if (trending.length > 0) {
        setFeaturedMovie(trending[0]);
      }
    };
    loadFeaturedMovie();
  }, []);

  if (!featuredMovie) return null;

  return (
    <div className="relative h-screen flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${movieService.getBackdropUrl(featuredMovie.backdrop_path)})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-flixsy-darker/90 via-flixsy-darker/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-flixsy-darker via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
            {featuredMovie.title}
          </h1>
          <p className="text-lg text-gray-300 mb-6 line-clamp-3 animate-fade-in">
            {featuredMovie.overview}
          </p>
          <div className="flex space-x-4 animate-fade-in">
            <Button 
              onClick={() => onMovieClick(featuredMovie)}
              className="bg-flixsy-primary hover:bg-flixsy-primary/80 text-white px-8 py-3 text-lg font-semibold"
            >
              ▶ Play
            </Button>
            <Button 
              variant="outline"
              className="border-flixsy-primary/50 text-white hover:bg-flixsy-primary/20 hover:border-flixsy-primary px-8 py-3 text-lg"
            >
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
