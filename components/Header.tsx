
import React, { useState } from 'react';
import { Page } from '../types';

interface HeaderProps {
  cartCount: number;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  isAdminUnlocked: boolean;
  onSecretUnlock: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  onNavigate, 
  currentPage, 
  isAdminUnlocked,
  onSecretUnlock 
}) => {
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      onSecretUnlock();
      setClickCount(0);
    }
    // Reset click count if not completed within 2 seconds
    setTimeout(() => setClickCount(0), 2000);
  };

  return (
    <header className="sticky top-0 z-50 bg-red-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="cursor-pointer flex items-center gap-2 select-none active:scale-95 transition-transform" 
          onClick={handleLogoClick}
          title="Berry Merry Bites"
        >
          <span className="text-3xl">🎄</span>
          <h1 className="text-3xl font-christmas font-bold tracking-wider hidden sm:block">Berry Merry Bites</h1>
        </div>
        
        <nav className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => onNavigate('home')}
            className={`text-sm md:text-base hover:text-yellow-400 transition-colors ${currentPage === 'home' ? 'text-yellow-400 font-bold' : ''}`}
          >
            Home
          </button>
          
          {isAdminUnlocked && (
            <button 
              onClick={() => onNavigate('admin')}
              className={`text-sm md:text-base px-3 py-1 bg-yellow-500/20 rounded-lg hover:text-yellow-400 transition-colors ${currentPage === 'admin' ? 'text-yellow-400 font-bold' : ''}`}
            >
              Admin 🛠️
            </button>
          )}

          <button 
            onClick={() => onNavigate('cart')}
            className="relative p-2 hover:bg-red-800 rounded-full transition-all"
          >
            <span className="text-2xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-red-900 text-xs font-bold px-2 py-0.5 rounded-full border-2 border-red-700">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
      <div className="h-1 bg-gradient-to-r from-green-600 via-yellow-400 to-green-600"></div>
    </header>
  );
};

export default Header;
