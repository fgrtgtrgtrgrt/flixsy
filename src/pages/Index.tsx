
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Movie, MovieDetails } from '@/types/movie';
import { TVShow, TVShowDetails } from '@/types/tv';
import { LiveTVChannel, LiveTVCategory } from '@/types/liveTV';
import { movieService } from '@/services/movieService';
import { tvService } from '@/services/tvService';
import { liveTVService } from '@/services/liveTVService';
import Header from '@/components/Layout/Header';
import HeroSection from '@/components/Movie/HeroSection';
import MovieRow from '@/components/Movie/MovieRow';
import TVShowRow from '@/components/TV/TVShowRow';
import GenreRow from '@/components/Movie/GenreRow';
import MovieModal from '@/components/Movie/MovieModal';
import TVShowModal from '@/components/TV/TVShowModal';
import VideoPlayer from '@/components/Video/VideoPlayer';
import LiveTVCategoryRow from '@/components/LiveTV/LiveTVCategoryRow';
import LiveTVPlayer from '@/components/LiveTV/LiveTVPlayer';
import CreditGuard from '@/components/Credits/CreditGuard';

const Index = () => {
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [selectedTVShow, setSelectedTVShow] = useState<TVShowDetails | null>(null);
  const [selectedLiveTVChannel, setSelectedLiveTVChannel] = useState<LiveTVChannel | null>(null);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [isTVShowModalOpen, setIsTVShowModalOpen] = useState(false);
  const [isLiveTVPlayerOpen, setIsLiveTVPlayerOpen] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [playingType, setPlayingType] = useState<'movie' | 'tv' | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [isCreditGuardOpen, setIsCreditGuardOpen] = useState(false);
  const [pendingPlayContent, setPendingPlayContent] = useState<{id: number, type: 'movie' | 'tv', title: string} | null>(null);

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

  // Live TV query
  const { data: liveTVCategories = [] } = useQuery({
    queryKey: ['live-tv-categories'],
    queryFn: liveTVService.getChannelsByCategory,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
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

  const handleLiveTVChannelClick = (channel: LiveTVChannel) => {
    console.log('Live TV channel clicked:', channel.name);
    setSelectedLiveTVChannel(channel);
    setIsLiveTVPlayerOpen(true);
  };

  const handlePlayMovie = (movieId: number) => {
    console.log('Playing movie ID:', movieId);
    const movieTitle = selectedMovie?.title || 'Movie';
    setPendingPlayContent({ id: movieId, type: 'movie', title: movieTitle });
    setIsCreditGuardOpen(true);
    setIsMovieModalOpen(false);
  };

  const handlePlayTVShow = (tvShowId: number) => {
    console.log('Playing TV show ID:', tvShowId);
    const tvShowTitle = selectedTVShow?.name || 'TV Show';
    setPendingPlayContent({ id: tvShowId, type: 'tv', title: tvShowTitle });
    setIsCreditGuardOpen(true);
    setIsTVShowModalOpen(false);
  };

  const proceedToPlay = () => {
    if (pendingPlayContent) {
      setPlayingId(pendingPlayContent.id);
      setPlayingType(pendingPlayContent.type);
      setIsPlayerOpen(true);
      setIsCreditGuardOpen(false);
      setPendingPlayContent(null);
    }
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
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Search Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
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
                  <h3 className="text-white text-xs md:text-sm mt-2 line-clamp-2">
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
            <div className="space-y-6 md:space-y-8 pb-16">
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
            <div className="space-y-6 md:space-y-8 pb-16">
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

      case 'livetv':
        return (
          <div className="pt-24">
            <div className="space-y-6 md:space-y-8 pb-16">
              <div className="px-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Live TV</h1>
                <p className="text-sm md:text-base text-gray-400">Watch live channels from around the world</p>
              </div>
              {liveTVCategories.map((category) => (
                <LiveTVCategoryRow
                  key={category.name}
                  category={category}
                  onChannelClick={handleLiveTVChannelClick}
                />
              ))}
            </div>
          </div>
        );
      
      case 'mylist':
        return (
          <div className="pt-24 px-4">
            <div className="container mx-auto">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">My List</h2>
              <p className="text-sm md:text-base text-gray-400">Your saved movies and shows will appear here!</p>
            </div>
          </div>
        );
      
      default: // 'home'
        return (
          <>
            <HeroSection onMovieClick={handleMovieClick} />
            <div className="space-y-6 md:space-y-8 pb-16">
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
        tvShow={selectedTVShow}
        isOpen={isTVShowModalOpen}
        onClose={() => setIsTVShowModalOpen(false)}
        onPlay={handlePlayTVShow}
      />

      <LiveTVPlayer
        channel={selectedLiveTVChannel}
        isOpen={isLiveTVPlayerOpen}
        onClose={() => {
          setIsLiveTVPlayerOpen(false);
          setSelectedLiveTVChannel(null);
        }}
      />

      <CreditGuard
        isOpen={isCreditGuardOpen}
        onClose={() => {
          setIsCreditGuardOpen(false);
          setPendingPlayContent(null);
        }}
        onProceed={proceedToPlay}
        contentTitle={pendingPlayContent?.title || ''}
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
