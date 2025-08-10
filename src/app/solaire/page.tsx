'use client';

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { ChevronDown, Filter, X } from 'lucide-react';

// Données d'exemple pour les produits solaires
const sampleProducts = [
  {
    id: '1',
    name: 'ABYSS',
    model: 'GS3001_30_2',
    price: 229,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
    size: '53',
    fit: 'Regular Fit',
    polarized: false,
    category: 'solaire' as const,
    isNew: true,
    shape: 'ronde' as const,
    color: 'noir',
    gender: 'mixte' as const
  },
  {
    id: '2',
    name: 'ETHEREA',
    model: 'GS3002_23_2',
    price: 229,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'],
    size: '55',
    fit: 'Regular Fit',
    polarized: true,
    category: 'solaire' as const,
    shape: 'carrée' as const,
    color: 'havana',
    gender: 'femme' as const
  },
  {
    id: '3',
    name: 'SHIMMER',
    model: 'GS3003_50_2',
    price: 229,
    images: ['https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'],
    size: '51',
    fit: 'Regular Fit',
    polarized: false,
    category: 'solaire' as const,
    shape: 'cat-eye' as const,
    color: 'rose',
    gender: 'femme' as const
  },
  {
    id: '4',
    name: 'VANGUARD CLASSIC',
    model: 'VG001_BK',
    price: 245,
    images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
    size: '54',
    fit: 'Regular Fit',
    polarized: true,
    category: 'solaire' as const,
    shape: 'pilote' as const,
    color: 'noir',
    gender: 'homme' as const
  },
  {
    id: '5',
    name: 'ICONS RETRO',
    model: 'IC002_HV',
    price: 215,
    images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
    size: '52',
    fit: 'Regular Fit',
    polarized: false,
    category: 'solaire' as const,
    shape: 'géométrique' as const,
    color: 'havana',
    gender: 'mixte' as const
  },
  {
    id: '6',
    name: 'XS COMPACT',
    model: 'XS003_GR',
    price: 199,
    images: ['https://images.unsplash.com/photo-1556306535-0f09a537f0a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
    size: '48',
    fit: 'Compact Fit',
    polarized: true,
    category: 'solaire' as const,
    shape: 'ronde' as const,
    color: 'vert',
    gender: 'mixte' as const
  },
  {
    id: '7',
    name: 'AURORA',
    model: 'AR004_RG',
    price: 259,
    images: ['https://images.unsplash.com/photo-1544966503-7cc61b6e2099?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
    size: '56',
    fit: 'Large Fit',
    polarized: true,
    category: 'solaire' as const,
    shape: 'carrée' as const,
    color: 'rose',
    gender: 'femme' as const,
    isNew: true
  },
  {
    id: '8',
    name: 'TITANIUM',
    model: 'TI005_MT',
    price: 289,
    images: ['https://images.unsplash.com/photo-1517091043640-2e14e4175134?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
    size: '52',
    fit: 'Regular Fit',
    polarized: true,
    category: 'solaire' as const,
    shape: 'ronde' as const,
    color: 'métal',
    gender: 'homme' as const
  },
  {
    id: '9',
    name: 'CRYSTAL',
    model: 'CR006_CL',
    price: 199,
    images: ['https://images.unsplash.com/photo-1585034946026-8715895c7d73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
    size: '50',
    fit: 'Regular Fit',
    polarized: false,
    category: 'solaire' as const,
    shape: 'cat-eye' as const,
    color: 'transparent',
    gender: 'femme' as const
  }
];

const filters = {
  gender: ['Femme', 'Homme', 'Mixte'],
  shape: ['Ronde', 'Carrée', 'Pilote', 'Géométrique', 'Cat Eye'],
  color: ['Noir', 'Havana', 'Vert', 'Marron', 'Rose'],
  collection: ['VANGUARD Collection', 'ICONS Collection', 'MEN Collection', 'XS Collection'],
  polarized: ['Polarisants', 'Non Polarisants']
};

const SolairePage = () => {
  const [activeFilters, setActiveFilters] = useState<{[key: string]: string[]}>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('nouveautés');
  const [cart, setCart] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleFilterChange = (category: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      
      return updated.length > 0 
        ? { ...prev, [category]: updated }
        : { ...prev, [category]: [] };
    });
  };

  const removeFilter = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category]?.filter(item => item !== value) || []
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).flat().length;
  };

  const handleAddToCart = (productId: string) => {
    setCart(prev => [...prev, productId]);
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Filtrer les produits selon les filtres actifs
  const filteredProducts = sampleProducts.filter(product => {
    const genderFilter = activeFilters.gender || [];
    const shapeFilter = activeFilters.shape || [];
    const colorFilter = activeFilters.color || [];
    const polarizedFilter = activeFilters.polarized || [];

    return (
      (genderFilter.length === 0 || genderFilter.some(f => f.toLowerCase() === product.gender)) &&
      (shapeFilter.length === 0 || shapeFilter.some(f => f.toLowerCase().replace(' ', '-') === product.shape)) &&
      (colorFilter.length === 0 || colorFilter.some(f => f.toLowerCase() === product.color)) &&
      (polarizedFilter.length === 0 || 
        (polarizedFilter.includes('Polarisants') && product.polarized) ||
        (polarizedFilter.includes('Non Polarisants') && !product.polarized))
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Lunettes de Soleil</h1>
        <p className="text-gray-600">
          Découvrez notre collection complète de lunettes de soleil alliant style et protection.
        </p>
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded"
        >
          <Filter size={20} />
          <span>Filtres</span>
          {getActiveFilterCount() > 0 && (
            <span className="bg-white text-black px-2 py-1 rounded-full text-sm">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4">
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filtres</h2>
                {getActiveFilterCount() > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-black"
                  >
                    Effacer tout
                  </button>
                )}
              </div>

              {/* Active filters */}
              {getActiveFilterCount() > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Filtres actifs:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([category, values]) =>
                      values.map(value => (
                        <span
                          key={`${category}-${value}`}
                          className="inline-flex items-center bg-gray-100 text-sm px-2 py-1 rounded"
                        >
                          {value}
                          <button
                            onClick={() => removeFilter(category, value)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Filter categories */}
              {Object.entries(filters).map(([category, options]) => (
                <div key={category} className="mb-6">
                  <h3 className="font-medium mb-3 capitalize">{category}</h3>
                  <div className="space-y-2">
                    {options.map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeFilters[category]?.includes(option) || false}
                          onChange={() => handleFilterChange(category, option)}
                          className="mr-2"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile filter modal */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="fixed right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filtres</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mêmes filtres que desktop */}
              {Object.entries(filters).map(([category, options]) => (
                <div key={category} className="mb-6">
                  <h3 className="font-medium mb-3 capitalize">{category}</h3>
                  <div className="space-y-2">
                    {options.map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeFilters[category]?.includes(option) || false}
                          onChange={() => handleFilterChange(category, option)}
                          className="mr-2"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-black text-white py-3 rounded mt-6"
              >
                Appliquer les filtres
              </button>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1">
          {/* Sort and results header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </p>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="nouveautés">Nouveautés</option>
                <option value="prix-croissant">Prix croissant</option>
                <option value="prix-décroissant">Prix décroissant</option>
                <option value="nom">Nom A-Z</option>
              </select>
            </div>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(product.id)}
              />
            ))}
          </div>

          {/* No results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600 mb-4">
                Essayez de modifier vos filtres pour voir plus de produits.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                Effacer tous les filtres
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SolairePage;
