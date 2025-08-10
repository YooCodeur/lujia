'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

// Exemple d'articles dans le panier
const sampleCartItems = [
  {
    id: '1',
    name: 'ABYSS',
    model: 'GS3001_30_2',
    price: 229,
    image: '/placeholder-glasses.jpg',
    quantity: 1,
    size: '53',
    fit: 'Regular Fit',
    color: 'Noir',
    category: 'solaire'
  },
  {
    id: '2',
    name: 'ETHEREA',
    model: 'GS3002_23_2',
    price: 229,
    image: '/placeholder-glasses.jpg',
    quantity: 2,
    size: '55',
    fit: 'Regular Fit',
    color: 'Havana',
    category: 'solaire'
  }
];

interface CartItem {
  id: string;
  name: string;
  model: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  fit: string;
  color: string;
  category: string;
}

const PanierPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems);
  const [isLoading, setIsLoading] = useState(false);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.90; // Livraison gratuite au-dessus de 100€
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsLoading(true);
    // Ici vous ajouteriez la logique de commande
    setTimeout(() => {
      setIsLoading(false);
      alert('Redirection vers le paiement...');
    }, 1000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header du panier */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ShoppingBag size={24} />
                <h1 className="text-2xl font-bold">PANIER</h1>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Panier vide */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-8 flex items-center justify-center">
              <ShoppingBag size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-8">
              Découvrez nos collections et ajoutez vos lunettes préférées
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/solaire"
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Lunettes de Soleil
              </Link>
              <Link
                href="/optique"
                className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Lunettes de Vue
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header du panier */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ShoppingBag size={24} />
              <h1 className="text-2xl font-bold">PANIER</h1>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Continuer les achats
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles du panier */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Vos articles</h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Vider le panier
                </button>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                    {/* Image du produit */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Détails du produit */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.model}</p>
                      <div className="text-sm text-gray-500 mt-1">
                        <p>{item.size} / {item.fit}</p>
                        <p>Couleur: {item.color}</p>
                      </div>
                      <p className="font-semibold text-lg mt-2">{item.price},00€</p>
                    </div>

                    {/* Contrôles de quantité */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Prix total pour cet article */}
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {(item.price * item.quantity).toFixed(2)}€
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Résumé de la commande</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Frais d'expédition</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Gratuit</span>
                    ) : (
                      `${shipping.toFixed(2)}€`
                    )}
                  </span>
                </div>

                {subtotal < 100 && subtotal > 0 && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    Ajoutez {(100 - subtotal).toFixed(2)}€ pour bénéficier de la livraison gratuite
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Chargement...' : 'Procéder au paiement'}
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-3">Avantages LUJIA</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Livraison gratuite dès 100€
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Retours gratuits sous 30 jours
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    3 ans de garantie
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Paiement sécurisé
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-center space-x-4">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">Visa</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">Mastercard</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">PayPal</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">Apple Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommandations */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Vous pourriez également aimer</h2>
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-4">
              Découvrez d'autres modèles de notre collection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/solaire"
                className="bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg transition-colors"
              >
                Voir plus de lunettes de soleil
              </Link>
              <Link
                href="/optique"
                className="bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg transition-colors"
              >
                Voir les lunettes de vue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanierPage;
