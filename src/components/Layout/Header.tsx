
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import UserMenu from './UserMenu';

interface HeaderProps {
  onSearch: (query: string) => void;
  onNavigate?: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    if (onNavigate) {
      onNavigate(section);
    }
    // Clear search when navigating
    if (section === 'home') {
      setSearchQuery('');
      onSearch('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-flixsy-darker to-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-flixsy-primary to-flixsy-secondary bg-clip-text text-transparent cursor-pointer"
              onClick={() => handleNavClick('home')}
            >
              Flixsy
            </h1>
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => handleNavClick('home')}
                className={`transition-colors ${activeSection === 'home' ? 'text-flixsy-primary' : 'text-white hover:text-flixsy-primary'}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('movies')}
                className={`transition-colors ${activeSection === 'movies' ? 'text-flixsy-primary' : 'text-white hover:text-flixsy-primary'}`}
              >
                Movies
              </button>
              <button 
                onClick={() => handleNavClick('tvshows')}
                className={`transition-colors ${activeSection === 'tvshows' ? 'text-flixsy-primary' : 'text-white hover:text-flixsy-primary'}`}
              >
                TV Shows
              </button>
              <button 
                onClick={() => handleNavClick('mylist')}
                className={`transition-colors ${activeSection === 'mylist' ? 'text-flixsy-primary' : 'text-white hover:text-flixsy-primary'}`}
              >
                My List
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search movies & TV shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-flixsy-gray border-flixsy-primary/30 text-white placeholder-gray-400 pr-10 focus:border-flixsy-primary"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-flixsy-primary transition-colors"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
            
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
