'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';

interface ProductForm {
  name: string;
  model: string;
  price: number;
  category: 'solaire' | 'optique';
  gender: 'femme' | 'homme' | 'mixte';
  shape: 'ronde' | 'carrée' | 'pilote' | 'géométrique' | 'cat-eye';
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
}

export default function NewProduct() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    model: '',
    price: 0,
    category: 'solaire',
    gender: 'mixte',
    shape: 'ronde',
    color: '',
    size: '',
    fit: 'Regular Fit',
    polarized: false,
    availableInOptical: false,
    images: [],
    description: '',
    stock: 0,
    collection: '',
    isNew: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.name || !formData.model || !formData.color || !formData.size) {
        alert('Veuillez remplir tous les champs obligatoires');
        setIsLoading(false);
        return;
      }

      if (formData.images.length === 0) {
        alert('Veuillez ajouter au moins une image');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/products');
      } else {
        alert('Erreur lors de la création: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      alert('Erreur lors de la création du produit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const fitOptions = ['Regular Fit', 'Compact Fit', 'Large Fit'];
  const shapeOptions = ['ronde', 'carrée', 'pilote', 'géométrique', 'cat-eye'];
  const collectionOptions = ['Classic', 'Vanguard', 'Icons', 'Lab', 'Women', 'Men', 'Vintage', 'Modern'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouveau Produit</h1>
          <p className="text-gray-600">Ajoutez une nouvelle paire de lunettes à votre catalogue</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Informations générales */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="ex: ABYSS"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modèle *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="ex: GS3001_30_2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  >
                    <option value="solaire">Lunettes de soleil</option>
                    <option value="optique">Lunettes de vue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="229"
                    min="0"
                    step="0.01"
                    disabled={formData.category === 'optique'}
                  />
                  {formData.category === 'optique' && (
                    <p className="text-xs text-gray-500 mt-1">Prix sur mesure pour les lunettes optiques</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Description du produit..."
                />
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  >
                    <option value="femme">Femme</option>
                    <option value="homme">Homme</option>
                    <option value="mixte">Mixte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forme *
                  </label>
                  <select
                    name="shape"
                    value={formData.shape}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  >
                    {shapeOptions.map(shape => (
                      <option key={shape} value={shape}>
                        {shape.charAt(0).toUpperCase() + shape.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur *
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="ex: noir, havana, rose..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille *
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="ex: 53, 55..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajustement
                  </label>
                  <select
                    name="fit"
                    value={formData.fit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  >
                    {fitOptions.map(fit => (
                      <option key={fit} value={fit}>{fit}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection
                  </label>
                  <select
                    name="collection"
                    value={formData.collection}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  >
                    <option value="">Aucune collection</option>
                    {collectionOptions.map(collection => (
                      <option key={collection} value={collection}>{collection}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Options */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="polarized"
                    checked={formData.polarized}
                    onChange={handleInputChange}
                    className="mr-3"
                    disabled={formData.category === 'optique'}
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Verres polarisés (lunettes de soleil uniquement)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="availableInOptical"
                    checked={formData.availableInOptical}
                    onChange={handleInputChange}
                    className="mr-3"
                    disabled={formData.category === 'solaire'}
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Disponible chez les opticiens partenaires
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Nouveau produit
                  </label>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Images du produit</h2>
              
              {/* Ajouter une image */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="URL de l'image..."
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Liste des images */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Produit ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {formData.images.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Upload size={48} className="mx-auto mb-2 text-gray-400" />
                  <p>Aucune image ajoutée</p>
                </div>
              )}
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            
            {/* Stock */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité en stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Création...' : 'Créer le produit'}
                </button>
                
                <Link
                  href="/admin/products"
                  className="block w-full px-4 py-2 border border-gray-300 text-center rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </Link>
              </div>
            </div>

            {/* Aperçu */}
            {formData.name && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h2>
                
                <div className="space-y-2 text-sm">
                  <p><strong>Nom:</strong> {formData.name}</p>
                  <p><strong>Modèle:</strong> {formData.model}</p>
                  <p><strong>Catégorie:</strong> {formData.category}</p>
                  <p><strong>Prix:</strong> {formData.category === 'optique' ? 'Sur mesure' : `${formData.price}€`}</p>
                  <p><strong>Stock:</strong> {formData.stock}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
