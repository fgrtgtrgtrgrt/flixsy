
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Movie, MovieDetails } from '@/types/movie';
import { TVShow, TVShowDetails } from '@/types/tv';
import { movieService } from '@/services/movieService';
import { tvService } from '@/services/tvService';
import Header from '@/components/Layout/Header';
import HeroSection from '@/components/Movie/HeroSection';
import MovieRow from '@/components/Movie/MovieRow';
import TVShowRow from '@/components/TV/TVShowRow';
import GenreRow from '@/components/Movie/GenreRow';
import MovieModal from '@/components/Movie/MovieModal';
import TVShowModal from '@/components/TV/TVShowModal';
import VideoPlayer from '@/components/Video/VideoPlayer';

const Index = () => {
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [selectedTVShow, setSelectedTVShow] = useState<TVShowDetails | null>(null);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [isTVShowModalOpen, setIsTVShowModalOpen] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [playingType, setPlayingType] = useState<'movie' | 'tv' | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');

  // Movie queries
  const { data: trendingMovies = [] } = useQuery({
    queryKey: ['trending-movies'],
    queryFn: movieService.getTrending,
  });

  const { data: popularMovies = [] } = useQuery({
    queryKey: ['popular-movies'],
    queryFn: movieService.getPopular,
  });

  const { data: topRatedMovies = [] } = useQuery({
    queryKey: ['topRated-movies'],
    queryFn: movieService.getTopRated,
  });

  // TV Show queries
  const { data: trendingTVShows = [] } = useQuery({
    queryKey: ['trending-tv'],
    queryFn: tvService.getTrending,
  });

  const { data: popularTVShows = [] } = useQuery({
    queryKey: ['popular-tv'],
    queryFn: tvService.getPopular,
  });

  const { data: topRatedTVShows = [] } = useQuery({
    queryKey: ['topRated-tv'],
    queryFn: tvService.getTopRated,
  });

  const handleMovieClick = async (movie: Movie) => {
    console.log('Movie clicked:', movie.title);
    const details = await movieService.getMovieDetails(movie.id);
    if (details) {
      setSelectedMovie(details);
      setIsMovieModalOpen(true);
    }
  };

  const handleTVShowClick = async (tvShow: TVShow) => {
    console.log('TV Show clicked:', tvShow.name);
    const details = await tvService.getTVShowDetails(tvShow.id);
    if (details) {
      setSelectedTVShow(details);
      setIsTVShowModalOpen(true);
    }
  };

  const handlePlayMovie = (movieId: number) => {
    console.log('Playing movie ID:', movieId);
    setPlayingId(movieId);
    setPlayingType('movie');
    setIsPlayerOpen(true);
    setIsMovieModalOpen(false);
  };

  const handlePlayTVShow = (tvShowId: number) => {
    console.log('Playing TV show ID:', tvShowId);
    setPlayingId(tvShowId);
    setPlayingType('tv');
    setIsPlayerOpen(true);
    setIsTVShowModalOpen(false);
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      setIsSearching(true);
      setCurrentSection('search');
      const [movieResults, tvResults] = await Promise.all([
        movieService.searchMovies(query),
        tvService.searchTVShows(query)
      ]);
      const combinedResults = [...movieResults, ...tvResults];
      setSearchResults(combinedResults);
      console.log('Search results:', combinedResults.length);
    } else {
      setIsSearching(false);
      setSearchResults([]);
      if (currentSection === 'search') {
        setCurrentSection('home');
      }
    }
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    if (section === 'home') {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const isMovie = (item: Movie | TVShow): item is Movie => {
    return 'title' in item;
  };

  const renderContent = () => {
    if (isSearching || currentSection === 'search') {
      return (
        <div className="pt-24 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">Search Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((item) => (
                <div 
                  key={item.id}
                  className="movie-card cursor-pointer"
                  onClick={() => isMovie(item) ? handleMovieClick(item) : handleTVShowClick(item)}
                >
                  <div className="aspect-[2/3] bg-flixsy-gray rounded-lg overflow-hidden">
                    <img
                      src={isMovie(item) ? movieService.getImageUrl(item.poster_path) : tvService.getImageUrl(item.poster_path)}
                      alt={isMovie(item) ? item.title : item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-white text-sm mt-2 line-clamp-2">
                    {isMovie(item) ? item.title : item.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    switch (currentSection) {
      case 'movies':
        return (
          <div className="pt-24">
            <div className="space-y-8 pb-16">
              <MovieRow 
                title="Popular Movies" 
                movies={popularMovies} 
                onMovieClick={handleMovieClick}
              />
              <MovieRow 
                title="Top Rated Movies" 
                movies={topRatedMovies} 
                onMovieClick={handleMovieClick}
              />
              <GenreRow onMovieClick={handleMovieClick} />
            </div>
          </div>
        );
      
      case 'tvshows':
        return (
          <div className="pt-24">
            <div className="space-y-8 pb-16">
              <TVShowRow 
                title="Popular TV Shows" 
                tvShows={popularTVShows} 
                onTVShowClick={handleTVShowClick}
              />
              <TVShowRow 
                title="Top Rated TV Shows" 
                tvShows={topRatedTVShows} 
                onTVShowClick={handleTVShowClick}
              />
              <TVShowRow 
                title="Trending TV Shows" 
                tvShows={trendingTVShows} 
                onTVShowClick={handleTVShowClick}
              />
            </div>
          </div>
        );
      
      case 'mylist':
        return (
          <div className="pt-24 px-4">
            <div className="container mx-auto">
              <h2 className="text-2xl font-semibold text-white mb-6">My List</h2>
              <p className="text-gray-400">Your saved movies and shows will appear here!</p>
            </div>
          </div>
        );
      
      default: // 'home'
        return (
          <>
            <HeroSection onMovieClick={handleMovieClick} />
            <div className="space-y-8 pb-16">
              <MovieRow 
                title="Trending Movies" 
                movies={trendingMovies} 
                onMovieClick={handleMovieClick}
              />
              <TVShowRow 
                title="Trending TV Shows" 
                tvShows={trendingTVShows} 
                onTVShowClick={handleTVShowClick}
              />
              <MovieRow 
                title="Popular Movies" 
                movies={popularMovies} 
                onMovieClick={handleMovieClick}
              />
              <TVShowRow 
                title="Popular TV Shows" 
                tvShows={popularTVShows} 
                onTVShowClick={handleTVShowClick}
              />
              <GenreRow onMovieClick={handleMovieClick} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-flixsy-darker">
      <Header onSearch={handleSearch} onNavigate={handleNavigate} />
      {renderContent()}

      <MovieModal
        movie={selectedMovie}
        isOpen={isMovieModalOpen}
        onClose={() => setIsMovieModalOpen(false)}
        onPlay={handlePlayMovie}
      />

      <TVShowModal
        movie={selectedTVShow}
        isOpen={isTVShowModalOpen}
        onClose={() => setIsTVShowModalOpen(false)}
        onPlay={handlePlayTVShow}
      />

      <VideoPlayer
        contentId={playingId}
        contentType={playingType}
        isOpen={isPlayerOpen}
        onClose={() => {
          setIsPlayerOpen(false);
          setPlayingId(null);
          setPlayingType(null);
        }}
      />
    </div>
  );
};

export default Index;
