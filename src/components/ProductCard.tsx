'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  model: string;
  price: number;
  images: string[];
  availableInOptical?: boolean;
  size: string;
  fit: string;
  polarized?: boolean;
  isNew?: boolean;
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

const ProductCard = ({
  id,
  name,
  model,
  price,
  images,
  availableInOptical = false,
  size,
  fit,
  polarized = false,
  isNew = false,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false
}: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageHover = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart?.(id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFavorite?.(id);
  };

  return (
    <div className="group relative">
      <Link href={`/products/${id}`}>
        <div 
          className="relative aspect-square mb-4 overflow-hidden bg-gray-100 rounded-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main product image */}
          <Image
            src={images[currentImageIndex] || '/placeholder-glasses.jpg'}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {isNew && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded">
                NOUVEAU
              </span>
            )}
            {availableInOptical && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                DISPONIBLE EN OPTIQUE
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Heart 
              size={16} 
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>

          {/* Quick add to cart button */}
          {isHovered && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300 hover:bg-gray-800"
            >
              <ShoppingBag size={16} />
              <span className="text-sm">Ajouter au panier</span>
            </button>
          )}

          {/* Image thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 flex space-x-1">
              {images.slice(0, 4).map((_, index) => (
                <button
                  key={index}
                  onMouseEnter={() => handleImageHover(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg group-hover:text-gray-600 transition-colors">
            {name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              {availableInOptical ? (
                <span className="text-gray-600 text-sm">Disponible en optique</span>
              ) : (
                <span className="font-semibold text-lg">{price},00€</span>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>{model}</p>
            <p>{size} / {fit} / {polarized ? 'POLARISANTS' : 'NON POLARISANTS'}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
