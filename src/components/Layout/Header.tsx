
import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import UserMenu from './UserMenu';
import CreditDisplay from '@/components/Credits/CreditDisplay';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onSearch: (query: string) => void;
  onNavigate?: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'movies', label: 'Movies' },
    { id: 'tvshows', label: 'TV Shows' },
    { id: 'livetv', label: 'Live TV' },
    { id: 'mylist', label: 'My List' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
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
          <div className="flex items-center space-x-4 md:space-x-8">
            <h1 
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-flixsy-primary to-flixsy-secondary bg-clip-text text-transparent cursor-pointer"
              onClick={() => handleNavClick('home')}
            >
              Flixsy
            </h1>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`transition-colors ${activeSection === item.id ? 'text-flixsy-primary' : 'text-white hover:text-flixsy-primary'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 text-white hover:text-flixsy-primary transition-colors">
                    <Menu size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-flixsy-darker border-flixsy-primary/20">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`text-left p-3 rounded-lg transition-colors ${
                          activeSection === item.id 
                            ? 'bg-flixsy-primary text-white' 
                            : 'text-white hover:bg-flixsy-primary/20'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={isMobile ? "Search..." : "Search movies & TV shows..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 md:w-64 bg-flixsy-gray border-flixsy-primary/30 text-white placeholder-gray-400 pr-10 focus:border-flixsy-primary text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-flixsy-primary transition-colors"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>
            
            {user && !isMobile && <CreditDisplay />}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
