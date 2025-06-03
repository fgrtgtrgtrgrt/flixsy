
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Movie, MovieDetails } from '@/types/movie';
import { movieService } from '@/services/movieService';
import Header from '@/components/Layout/Header';
import HeroSection from '@/components/Movie/HeroSection';
import MovieRow from '@/components/Movie/MovieRow';
import GenreRow from '@/components/Movie/GenreRow';
import MovieModal from '@/components/Movie/MovieModal';
import VideoPlayer from '@/components/Video/VideoPlayer';

const Index = () => {
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playingMovieId, setPlayingMovieId] = useState<number | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { data: trending = [] } = useQuery({
    queryKey: ['trending'],
    queryFn: movieService.getTrending,
  });

  const { data: popular = [] } = useQuery({
    queryKey: ['popular'],
    queryFn: movieService.getPopular,
  });

  const { data: topRated = [] } = useQuery({
    queryKey: ['topRated'],
    queryFn: movieService.getTopRated,
  });

  const handleMovieClick = async (movie: Movie) => {
    console.log('Movie clicked:', movie.title);
    const details = await movieService.getMovieDetails(movie.id);
    if (details) {
      setSelectedMovie(details);
      setIsModalOpen(true);
    }
  };

  const handlePlay = (movieId: number) => {
    console.log('Playing movie ID:', movieId);
    setPlayingMovieId(movieId);
    setIsPlayerOpen(true);
    setIsModalOpen(false);
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      setIsSearching(true);
      const results = await movieService.searchMovies(query);
      setSearchResults(results);
      console.log('Search results:', results.length);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-flixsy-darker">
      <Header onSearch={handleSearch} />
      
      {!isSearching ? (
        <>
          <HeroSection onMovieClick={handleMovieClick} />
          
          <div className="space-y-8 pb-16">
            <MovieRow 
              title="Trending Now" 
              movies={trending} 
              onMovieClick={handleMovieClick}
            />
            <MovieRow 
              title="Popular Movies" 
              movies={popular} 
              onMovieClick={handleMovieClick}
            />
            <MovieRow 
              title="Top Rated" 
              movies={topRated} 
              onMovieClick={handleMovieClick}
            />
            <GenreRow onMovieClick={handleMovieClick} />
          </div>
        </>
      ) : (
        <div className="pt-24 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">Search Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((movie) => (
                <div 
                  key={movie.id}
                  className="movie-card cursor-pointer"
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="aspect-[2/3] bg-flixsy-gray rounded-lg overflow-hidden">
                    <img
                      src={movieService.getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-white text-sm mt-2 line-clamp-2">{movie.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlay={handlePlay}
      />

      <VideoPlayer
        movieId={playingMovieId}
        isOpen={isPlayerOpen}
        onClose={() => {
          setIsPlayerOpen(false);
          setPlayingMovieId(null);
        }}
      />
    </div>
  );
};

export default Index;
