# Guide des Images LUJIA

## 📸 Images Actuelles

Le site utilise actuellement des images temporaires d'Unsplash qui correspondent parfaitement au style épuré et classe de LUJIA.

### 🌟 Images utilisées par section

#### Page d'Accueil - Cercles Principaux
- **Section Solaire** :
  - Cercle principal : Lunettes noires classiques élégantes
  - Cercles secondaires : Aviateur doré, Cat-eye vintage

- **Section Optique** :
  - Cercle principal : Lunettes de vue modernes
  - Cercles secondaires : Monture havana, Lunettes géométriques

#### Catalogue Solaire (9 modèles)
1. **ABYSS** - Lunettes noires classiques (style premium)
2. **ETHEREA** - Aviateur doré (style vintage)
3. **SHIMMER** - Cat-eye vintage (style féminin)
4. **VANGUARD CLASSIC** - Pilote modernes (style masculin)
5. **ICONS RETRO** - Géométriques rétro (style mixte)
6. **XS COMPACT** - Rondes vertes (style compact)
7. **AURORA** - Carrées roses (style nouveau)
8. **TITANIUM** - Rondes métal (style premium)
9. **CRYSTAL** - Transparentes (style moderne)

#### Catalogue Optique (8 modèles)
1. **NOLAN** - Carrées noires classiques
2. **ZAC** - Rondes havana
3. **BREN** - Géométriques marron
4. **LAB VISION** - Cat-eye noires (nouveau)
5. **ICONS CLASSIC** - Aviateur optiques
6. **VANGUARD OPTICAL** - Rondes vertes
7. **CLARITY** - Carrées bleues (nouveau)
8. **MINIMAL** - Minimalistes métal

## 🎨 Style des Images

Toutes les images sélectionnées respectent :
- **Esthétique minimaliste** : Fonds neutres, focus sur le produit
- **Qualité premium** : Images haute résolution (1000px+)
- **Cohérence stylistique** : Éclairage professionnel, angles similaires
- **Diversité des styles** : Couvre tous les genres et formes

## 🔄 Remplacement des Images

### Structure des fichiers
```
src/data/images.ts - Configuration centralisée des URLs
public/images/glasses/
├── solaire/     - Pour vos futures images solaires
├── optique/     - Pour vos futures images optiques
├── hero/        - Pour les images principales
└── collections/ - Pour les images de collections
```

### Pour remplacer les images :

1. **Ajoutez vos images** dans `public/images/glasses/`
2. **Modifiez les URLs** dans `src/data/images.ts`
3. **Gardez les mêmes noms** pour éviter de casser les références

### Format recommandé pour vos vraies images :
- **Format** : JPG ou WebP optimisé
- **Taille** : 1000x400px minimum pour les principales
- **Poids** : < 200KB après optimisation
- **Qualité** : 80-90% pour équilibrer qualité/performance

## 🌐 URLs Actuelles

Toutes les images actuelles proviennent d'Unsplash avec des URLs optimisées :
- Paramètre `w=1000` pour la largeur
- Paramètre `q=80` pour la qualité
- Format auto-optimisé selon le navigateur

## 🎯 Conseils pour vos futures images

1. **Photographiez sur fond neutre** (blanc, gris clair)
2. **Éclairage uniforme** pour éviter les ombres dures
3. **Angle légèrement incliné** pour montrer la profondeur
4. **Même distance** pour une cohérence visuelle
5. **Post-traitement minimal** pour garder l'aspect naturel

## 🔧 Maintenance

Le fichier `src/data/images.ts` centralise toute la gestion des images :
- Facile à maintenir
- URLs organisées par catégorie
- Fonctions utilitaires pour les images aléatoires
- Prêt pour l'ajout de nouvelles images

---

**Note** : Ces images temporaires vous donnent un aperçu parfait du rendu final. Quand vous ajouterez vos vraies photos de lunettes LUJIA, le style restera identique ! 🕶️✨
