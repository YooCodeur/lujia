'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  AlertCircle,
  Package,
  ChevronDown
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
  stock: number;
  images: string[];
  isNew: boolean;
  createdAt: string;
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [searchTerm, selectedCategory, selectedGender, sortBy, sortOrder, currentPage]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedGender !== 'all') params.append('gender', selectedGender);

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

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setProducts(products.filter(p => p._id !== productId));
      } else {
        alert('Erreur lors de la suppression: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Rupture</span>;
    } else if (stock <= 5) {
      return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">Stock faible</span>;
    } else {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">En stock</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600 mt-2">Gérez votre catalogue de lunettes LUJIA</p>
        </div>
        <Link
          href="/admin/products/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Ajouter un produit
        </Link>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          {/* Catégorie */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black appearance-none"
            >
              <option value="all">Toutes catégories</option>
              <option value="solaire">Lunettes de soleil</option>
              <option value="optique">Lunettes de vue</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
          </div>

          {/* Genre */}
          <div className="relative">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black appearance-none"
            >
              <option value="all">Tous genres</option>
              <option value="femme">Femme</option>
              <option value="homme">Homme</option>
              <option value="mixte">Mixte</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
          </div>

          {/* Tri */}
          <div className="relative">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black appearance-none"
            >
              <option value="createdAt-desc">Plus récents</option>
              <option value="createdAt-asc">Plus anciens</option>
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="price-asc">Prix croissant</option>
              <option value="stock-asc">Stock croissant</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
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
            {searchTerm || selectedCategory !== 'all' || selectedGender !== 'all'
              ? 'Aucun produit ne correspond à vos critères de recherche.'
              : 'Commencez par ajouter votre premier produit.'}
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Ajouter un produit
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={product.images[0] || '/placeholder-glasses.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                    NOUVEAU
                  </span>
                )}
                {product.stock <= 5 && (
                  <div className="absolute top-2 right-2">
                    <AlertCircle className="text-orange-500" size={20} />
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  {getStockBadge(product.stock)}
                </div>
                
                <p className="text-sm text-gray-500 mb-2">{product.model}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg">
                    {product.category === 'optique' ? 'Sur mesure' : `${product.price}€`}
                  </span>
                  <span className="text-sm text-gray-500">{product.stock} en stock</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{product.category}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{product.gender}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{product.color}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    href={`/products/${product._id}`}
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye size={16} className="mr-1" />
                    Voir
                  </Link>
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit size={16} className="mr-1" />
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
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
    </div>
  );
}
