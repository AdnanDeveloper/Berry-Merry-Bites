
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  cartCount: number;
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onNavigate, currentPage }) => {
  return (
    <header className="sticky top-0 z-50 bg-red-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="cursor-pointer flex items-center gap-2" 
          onClick={() => onNavigate('home')}
        >
          <span className="text-3xl">🎄</span>
          <h1 className="text-3xl font-christmas font-bold tracking-wider">Berry Merry Bites</h1>
        </div>
        
        <nav className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('home')}
            className={`hover:text-yellow-400 transition-colors ${currentPage === 'home' ? 'text-yellow-400 font-bold' : ''}`}
          >
            Home
          </button>
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
