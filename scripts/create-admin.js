const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Schéma User (version JavaScript pour le script)
const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  birthday: { type: Date },
  gender: { 
    type: String, 
    enum: ['femme', 'homme', 'unisexe'] 
  },
  isOptician: { type: Boolean, default: false },
  newsletterSubscribed: { type: Boolean, default: false }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    // Connexion à la base de données
    console.log('Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lujia');
    console.log('✅ Connecté à MongoDB');

    // Données de l'admin
    const adminData = {
      email: 'admin@lujia.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'LUJIA',
      isOptician: true,
      newsletterSubscribed: false
    };

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❗ Un admin avec cet email existe déjà');
      console.log('Email:', adminData.email);
      console.log('Mot de passe:', adminData.password);
      return;
    }

    // Hasher le mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcryptjs.hash(adminData.password, saltRounds);

    // Créer l'admin
    const admin = new User({
      ...adminData,
      password: hashedPassword
    });

    await admin.save();

    console.log('✅ Compte administrateur créé avec succès !');
    console.log('');
    console.log('🔐 INFORMATIONS DE CONNEXION :');
    console.log('Email:', adminData.email);
    console.log('Mot de passe:', adminData.password);
    console.log('');
    console.log('🚀 Accès back-office : http://localhost:3000/admin');
    console.log('');
    console.log('⚠️  Changez le mot de passe après la première connexion !');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion fermée');
  }
}

// Exécuter la création
createAdmin();
