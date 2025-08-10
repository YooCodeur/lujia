'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingBag, 
  Star, 
  Shield, 
  Truck, 
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus
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
  availableInOptical: boolean;
  images: string[];
  description: string;
  stock: number;
  collection: string;
  isNew: boolean;
  createdAt: string;
}

interface SimilarProduct {
  _id: string;
  name: string;
  model: string;
  price: number;
  images: string[];
  isNew: boolean;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.data);
        setSimilarProducts(data.similarProducts || []);
      } else {
        console.error('Produit non trouvé');
        router.push('/404');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      router.push('/404');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
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
          productId: product?._id,
          quantity
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`${product?.name} ajouté au panier !`);
      } else {
        alert('Erreur lors de l\'ajout au panier: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implémenter la logique des favoris avec l'API
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Accueil</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/${product.category}`} className="text-gray-500 hover:text-gray-700 capitalize">
              {product.category === 'solaire' ? 'Lunettes de soleil' : 'Lunettes de vue'}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Galerie d'images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[currentImageIndex] || '/placeholder-glasses.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {product.isNew && (
                  <span className="bg-black text-white text-sm px-3 py-1 rounded-full">
                    NOUVEAU
                  </span>
                )}
                {product.polarized && (
                  <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                    POLARISÉ
                  </span>
                )}
              </div>

              {/* Navigation images */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Bouton favoris */}
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 bg-white/80 p-3 rounded-full hover:bg-white transition-colors"
              >
                <Heart 
                  size={20} 
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                />
              </button>
            </div>

            {/* Miniatures */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            {/* Titre et prix */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.model}</p>
              
              {product.category === 'optique' ? (
                <div className="text-2xl font-bold text-gray-900">
                  Disponible chez nos opticiens partenaires
                </div>
              ) : (
                <div className="text-3xl font-bold text-gray-900">
                  {product.price},00€
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Caractéristiques */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Genre</span>
                  <p className="text-gray-900 capitalize">{product.gender}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Forme</span>
                  <p className="text-gray-900 capitalize">{product.shape}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Couleur</span>
                  <p className="text-gray-900 capitalize">{product.color}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Taille</span>
                  <p className="text-gray-900">{product.size}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Ajustement</span>
                  <p className="text-gray-900">{product.fit}</p>
                </div>
                {product.collection && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Collection</span>
                    <p className="text-gray-900">{product.collection}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stock et quantité */}
            {product.category === 'solaire' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">Stock disponible</span>
                  <span className={`text-sm font-medium ${
                    product.stock > 5 ? 'text-green-600' : 
                    product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                  </span>
                </div>

                {product.stock > 0 && (
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-sm font-medium text-gray-700">Quantité</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              {product.category === 'solaire' ? (
                product.stock > 0 ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full flex items-center justify-center space-x-2 bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag size={20} />
                    <span>{isAddingToCart ? 'Ajout en cours...' : 'Ajouter au panier'}</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center space-x-2 bg-gray-300 text-gray-500 py-4 rounded-lg cursor-not-allowed"
                  >
                    <span>Produit non disponible</span>
                  </button>
                )
              ) : (
                <Link
                  href="/opticians"
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye size={20} />
                  <span>Trouver un opticien</span>
                </Link>
              )}

              <button
                onClick={toggleFavorite}
                className={`w-full flex items-center justify-center space-x-2 py-4 rounded-lg border-2 transition-colors ${
                  isFavorite 
                    ? 'border-red-500 text-red-500 bg-red-50' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Heart size={20} />
                <span>{isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
              </button>
            </div>

            {/* Avantages */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Avantages LUJIA</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="text-green-600" size={20} />
                  <span className="text-gray-700">3 ans de garantie</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="text-green-600" size={20} />
                  <span className="text-gray-700">Livraison gratuite dès 100€</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="text-green-600" size={20} />
                  <span className="text-gray-700">Retours gratuits sous 30 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Vous pourriez également aimer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <Link
                  key={similarProduct._id}
                  href={`/products/${similarProduct._id}`}
                  className="group"
                >
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={similarProduct.images[0] || '/placeholder-glasses.jpg'}
                      alt={similarProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {similarProduct.isNew && (
                      <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                        NOUVEAU
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                    {similarProduct.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{similarProduct.model}</p>
                  <p className="font-bold text-lg mt-1">{similarProduct.price},00€</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
