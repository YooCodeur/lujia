# LUJIA - Site E-commerce de Lunettes

Un site e-commerce moderne pour la marque de lunettes LUJIA, développé avec la stack MERN (MongoDB, Express.js, React, Node.js) et Next.js.

## 🚀 Fonctionnalités

- **Design moderne** inspiré de GIGI Studios
- **Catalogue de produits** avec filtres avancés
- **Authentification** (connexion/inscription)
- **Panier d'achat** avec gestion des quantités
- **Pages produits** pour solaire et optique
- **Design responsive** optimisé mobile/desktop
- **Interface multilingue** (Français)

## 🛠 Technologies utilisées

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentification**: NextAuth.js
- **Styling**: Tailwind CSS, Lucide React Icons
- **Database**: MongoDB avec Mongoose ODM

## 📦 Installation

1. Cloner le repository :
```bash
git clone <your-repo-url>
cd lujia
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env.local
```
Puis modifier `.env.local` avec vos propres valeurs :
```
MONGODB_URI=mongodb://localhost:27017/lujia
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
```

4. Démarrer MongoDB (si local) :
```bash
mongod
```

5. Lancer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse : `http://localhost:3000`

## 🏗 Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── account/           # Authentification
│   ├── solaire/           # Lunettes de soleil
│   ├── optique/           # Lunettes de vue
│   ├── panier/            # Panier d'achat
│   └── layout.tsx         # Layout principal
├── components/            # Composants réutilisables
│   ├── Header.tsx         # En-tête avec navigation
│   ├── Footer.tsx         # Pied de page
│   └── ProductCard.tsx    # Carte produit
├── lib/                   # Utilitaires et configuration
│   └── mongodb.ts         # Configuration MongoDB
├── models/                # Modèles de données Mongoose
│   ├── Product.ts         # Modèle produit
│   ├── User.ts           # Modèle utilisateur
│   └── Cart.ts           # Modèle panier
└── types/                # Types TypeScript
    └── global.d.ts       # Types globaux
```

## 🎨 Design et UI

Le design s'inspire de [GIGI Studios](https://gigistudios.com/fr-fr) avec :

- **Header** avec méga-menu et recherche
- **Hero carousel** pour les promotions
- **Grille de produits** avec filtres
- **Cartes produits** interactives
- **Footer** complet avec newsletter
- **Pages d'authentification** élégantes
- **Panier d'achat** fonctionnel

## 🔧 Fonctionnalités à développer

- [ ] Intégration API MongoDB complète
- [ ] Système de paiement (Stripe/PayPal)
- [ ] Gestion des commandes
- [ ] Panel d'administration
- [ ] Optimisation SEO
- [ ] Tests automatisés
- [ ] Déploiement production

## 📱 Pages disponibles

- `/` - Page d'accueil avec carousel et produits recommandés
- `/solaire` - Collection lunettes de soleil avec filtres
- `/optique` - Collection lunettes de vue
- `/account` - Connexion et inscription
- `/panier` - Panier d'achat et checkout

## 🎯 Points clés du design

1. **Navigation intuitive** avec méga-menus
2. **Filtres avancés** par genre, forme, couleur, collection
3. **Responsive design** mobile-first
4. **Images haute qualité** pour les produits
5. **UX optimisée** pour la conversion

## 🚀 Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Type checking
npm run type-check
```

## 📞 Support

Pour toute question ou support, contactez l'équipe de développement.

---

**LUJIA** - L'excellence française en matière de lunettes 🇫🇷