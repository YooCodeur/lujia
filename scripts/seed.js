const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Schémas (version JavaScript pour le script)
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['solaire', 'optique'] 
  },
  gender: { 
    type: String, 
    required: true, 
    enum: ['femme', 'homme', 'mixte'] 
  },
  shape: { 
    type: String, 
    required: true, 
    enum: ['ronde', 'carrée', 'pilote', 'géométrique', 'cat-eye'] 
  },
  color: { type: String, required: true },
  size: { type: String, required: true },
  fit: { type: String, required: true },
  polarized: { type: Boolean, default: false },
  availableInOptical: { type: Boolean, default: false },
  images: [{ type: String, required: true }],
  description: { type: String },
  stock: { type: Number, required: true, default: 0 },
  collection: { type: String },
  isNew: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Données de test
const sampleProducts = [
  // Lunettes de solaire
  {
    name: 'ABYSS',
    model: 'GS3001_30_2',
    price: 229,
    category: 'solaire',
    gender: 'mixte',
    shape: 'ronde',
    color: 'noir',
    size: '53',
    fit: 'Regular Fit',
    polarized: false,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    description: 'Lunettes de soleil au design intemporel avec monture ronde élégante.',
    stock: 25,
    collection: 'Classic',
    isNew: true
  },
  {
    name: 'ETHEREA',
    model: 'GS3002_23_2',
    price: 229,
    category: 'solaire',
    gender: 'femme',
    shape: 'carrée',
    color: 'havana',
    size: '55',
    fit: 'Regular Fit',
    polarized: true,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Lunettes de soleil polarisées pour femme avec finition havana sophistiquée.',
    stock: 18,
    collection: 'Women'
  },
  {
    name: 'SHIMMER',
    model: 'GS3003_50_2',
    price: 229,
    category: 'solaire',
    gender: 'femme',
    shape: 'cat-eye',
    color: 'rose',
    size: '51',
    fit: 'Regular Fit',
    polarized: false,
    images: ['https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Lunettes cat-eye avec nuances rosées pour un look vintage moderne.',
    stock: 20,
    collection: 'Vintage'
  },
  {
    name: 'VANGUARD CLASSIC',
    model: 'VG001_BK',
    price: 245,
    category: 'solaire',
    gender: 'homme',
    shape: 'pilote',
    color: 'noir',
    size: '54',
    fit: 'Regular Fit',
    polarized: true,
    images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    description: 'Lunettes pilote classiques avec verres polarisés pour homme.',
    stock: 30,
    collection: 'Vanguard'
  },
  {
    name: 'ICONS RETRO',
    model: 'IC002_HV',
    price: 215,
    category: 'solaire',
    gender: 'mixte',
    shape: 'géométrique',
    color: 'havana',
    size: '52',
    fit: 'Regular Fit',
    polarized: false,
    images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    description: 'Design géométrique rétro pour un style unique et audacieux.',
    stock: 15,
    collection: 'Icons'
  },

  // Lunettes optiques
  {
    name: 'NOLAN',
    model: 'GS7002_23_NOLAN_2',
    price: 0,
    category: 'optique',
    gender: 'homme',
    shape: 'carrée',
    color: 'noir',
    size: '55',
    fit: 'Regular Fit',
    polarized: false,
    availableInOptical: true,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    description: 'Monture optique carrée pour homme, disponible chez nos opticiens partenaires.',
    stock: 50,
    collection: 'Professional'
  },
  {
    name: 'ZAC',
    model: 'GS7006_30_ZAC_2',
    price: 0,
    category: 'optique',
    gender: 'mixte',
    shape: 'ronde',
    color: 'havana',
    size: '52',
    fit: 'Regular Fit',
    polarized: false,
    availableInOptical: true,
    images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Monture ronde mixte avec finition havana élégante.',
    stock: 40,
    collection: 'Classic'
  },
  {
    name: 'BREN',
    model: 'GS7008_40_BREN_2',
    price: 0,
    category: 'optique',
    gender: 'femme',
    shape: 'géométrique',
    color: 'marron',
    size: '54',
    fit: 'Regular Fit',
    polarized: false,
    availableInOptical: true,
    images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Design géométrique moderne pour femme en teinte marron.',
    stock: 35,
    collection: 'Modern'
  },
  {
    name: 'LAB VISION',
    model: 'LB001_BK',
    price: 0,
    category: 'optique',
    gender: 'femme',
    shape: 'cat-eye',
    color: 'noir',
    size: '53',
    fit: 'Regular Fit',
    polarized: false,
    availableInOptical: true,
    images: ['https://images.unsplash.com/photo-1622445275576-721325763afe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    description: 'Monture cat-eye expérimentale de la collection LAB.',
    stock: 25,
    collection: 'Lab',
    isNew: true
  }
];

async function seedDatabase() {
  try {
    // Connexion à la base de données
    console.log('Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lujia');
    console.log('✅ Connecté à MongoDB');

    // Supprimer les données existantes
    console.log('Suppression des produits existants...');
    await Product.deleteMany({});
    console.log('✅ Produits supprimés');

    // Insérer les nouveaux produits
    console.log('Insertion des nouveaux produits...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ ${insertedProducts.length} produits insérés`);

    // Afficher un résumé
    const solaireCount = await Product.countDocuments({ category: 'solaire' });
    const optiqueCount = await Product.countDocuments({ category: 'optique' });
    
    console.log('\n📊 Résumé:');
    console.log(`- Lunettes de solaire: ${solaireCount}`);
    console.log(`- Lunettes optiques: ${optiqueCount}`);
    console.log(`- Total: ${solaireCount + optiqueCount}`);

    console.log('\n✨ Seed terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion fermée');
  }
}

// Exécuter le seed
seedDatabase();
