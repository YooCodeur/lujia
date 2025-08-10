'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between py-6">
          {/* Mobile menu button */}
          <button 
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl md:text-3xl font-thin tracking-[0.2em] text-gray-900">
            LUJIA
          </Link>

          {/* Desktop Navigation - très minimaliste */}
          <nav className="hidden lg:flex space-x-12">
            <Link 
              href="/solaire" 
              className="text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wider text-sm"
            >
              SOLAIRE
            </Link>
            <Link 
              href="/optique" 
              className="text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wider text-sm"
            >
              OPTIQUE
            </Link>
            <Link 
              href="/collections" 
              className="text-gray-700 hover:text-gray-900 transition-colors font-light tracking-wider text-sm"
            >
              COLLECTIONS
            </Link>
          </nav>

          {/* Right side icons - très épurés */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-700 hover:text-gray-900 transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            <Link href="/account" className="text-gray-700 hover:text-gray-900 transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>
            
            <Link href="/panier" className="relative text-gray-700 hover:text-gray-900 transition-colors">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu - épuré */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="container mx-auto px-6 py-8">
            <nav className="space-y-6">
              <Link 
                href="/solaire" 
                className="block text-xl font-light tracking-wider text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                SOLAIRE
              </Link>
              <Link 
                href="/optique" 
                className="block text-xl font-light tracking-wider text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                OPTIQUE
              </Link>
              <Link 
                href="/collections" 
                className="block text-xl font-light tracking-wider text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                COLLECTIONS
              </Link>
              <Link 
                href="/account" 
                className="block text-xl font-light tracking-wider text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                COMPTE
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
