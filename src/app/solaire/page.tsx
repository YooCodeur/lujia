'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  ChevronDown,
  X,
  Package,
  Heart,
  ShoppingBag
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  model: string;
  price: number;
  category: 'solaire' | 'optique';
  gender: 'femme' | 'homme' | 'mixte';
  shape: string;
  color: string;
  size: string;
  fit: string;
  polarized: boolean;
  images: string[];
  stock: number;
  isNew: boolean;
}

const filters = {
  gender: ['Femme', 'Homme', 'Mixte'],
  shape: ['Ronde', 'Carrée', 'Pilote', 'Géométrique', 'Cat Eye'],
  color: ['Noir', 'Havana', 'Vert', 'Marron', 'Rose'],
  collection: ['VANGUARD Collection', 'ICONS Collection', 'MEN Collection', 'XS Collection'],
  polarized: ['Polarisants', 'Non Polarisants']
};

export default function SolairePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<{[key: string]: string[]}>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, [searchTerm, activeFilters, sortBy, sortOrder, currentPage]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder,
        category: 'solaire' // Uniquement les lunettes de soleil
      });

      if (searchTerm) params.append('search', searchTerm);
      
      // Ajouter les filtres actifs
      Object.entries(activeFilters).forEach(([category, values]) => {
        values.forEach(value => {
          if (category === 'gender') {
            params.append('gender', value.toLowerCase());
          } else if (category === 'polarized') {
            params.append('polarized', value === 'Polarisants' ? 'true' : 'false');
          } else if (category === 'color') {
            params.append('color', value.toLowerCase());
          }
        });
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        console.error('Erreur lors du chargement des produits:', data.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    setCurrentPage(1); // Reset to first page when filtering
  };

  const removeFilter = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category]?.filter(item => item !== value) || []
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setCurrentPage(1);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).flat().length;
  };

  const handleAddToCart = async (productId: string) => {
    try {
      // Générer un sessionId pour les utilisateurs non connectés
      const sessionId = localStorage.getItem('sessionId') || generateSessionId();
      localStorage.setItem('sessionId', sessionId);

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      });

      const data = await response.json();

      if (data.success) {
        const product = products.find(p => p._id === productId);
        alert(`${product?.name} ajouté au panier !`);
      } else {
        alert('Erreur lors de l\'ajout au panier: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

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
          {/* Search and sort header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            {/* Results count and sort */}
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">
                {products.length} produit{products.length > 1 ? 's' : ''}
              </p>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">Trier par:</span>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="createdAt-desc">Nouveautés</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="name-asc">Nom A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Package size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600 mb-6">
                Aucun produit ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                Effacer tous les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product._id} className="group relative">
                  <Link href={`/products/${product._id}`}>
                    <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100 rounded-lg">
                      <Image
                        src={product.images[0] || '/placeholder-glasses.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col space-y-2">
                        {product.isNew && (
                          <span className="bg-black text-white text-xs px-2 py-1 rounded">
                            NOUVEAU
                          </span>
                        )}
                        {product.polarized && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            POLARISÉ
                          </span>
                        )}
                      </div>

                      {/* Favorite button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleFavorite(product._id);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <Heart 
                          size={16} 
                          className={favorites.includes(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                        />
                      </button>

                      {/* Quick add to cart button */}
                      {product.stock > 0 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product._id);
                          }}
                          className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-800"
                        >
                          <ShoppingBag size={16} />
                          <span className="text-sm">Ajouter au panier</span>
                        </button>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg group-hover:text-gray-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm">{product.model}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">{product.price}€</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          product.stock > 5 ? 'bg-green-100 text-green-800' :
                          product.stock > 0 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 0 ? 'En stock' : 'Rupture'}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">
                        <p>{product.size} / {product.fit} / {product.polarized ? 'POLARISANTS' : 'NON POLARISANTS'}</p>
                        <p className="capitalize">{product.gender} • {product.color}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-12">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Précédent
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === page
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}