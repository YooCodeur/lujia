import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

// GET /api/products - Récupérer tous les produits avec filtres
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Paramètres de filtrage
    const category = searchParams.get('category'); // 'solaire' | 'optique'
    const gender = searchParams.get('gender'); // 'femme' | 'homme' | 'mixte'
    const shape = searchParams.get('shape'); // 'ronde' | 'carrée' | etc.
    const color = searchParams.get('color');
    const polarized = searchParams.get('polarized'); // 'true' | 'false'
    const collection = searchParams.get('collection');
    const isNew = searchParams.get('isNew'); // 'true' | 'false'
    
    // Paramètres de pagination et tri
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'createdAt'; // 'price' | 'name' | 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'; // 'asc' | 'desc'

    // Recherche textuelle
    const search = searchParams.get('search');

    // Construction du filtre MongoDB
    const filter: any = {};

    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (shape) filter.shape = shape;
    if (color) filter.color = { $regex: color, $options: 'i' };
    if (polarized !== null) filter.polarized = polarized === 'true';
    if (collection) filter.collection = { $regex: collection, $options: 'i' };
    if (isNew !== null) filter.isNew = isNew === 'true';

    // Filtrer les produits en stock
    filter.stock = { $gt: 0 };

    // Recherche textuelle sur nom et modèle
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Configuration du tri
    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (page - 1) * limit;

    // Exécution de la requête
    const products = await Product.find(filter)
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .lean();

    // Comptage total pour pagination
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        category,
        gender,
        shape,
        color,
        polarized,
        collection,
        isNew,
        search
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

// POST /api/products - Créer un nouveau produit (Admin uniquement)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    
    // Validation des champs requis
    const requiredFields = ['name', 'model', 'price', 'category', 'gender', 'shape', 'color', 'size', 'fit', 'images'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Vérifier l'unicité du modèle
    const existingProduct = await Product.findOne({ model: body.model });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Ce modèle existe déjà' },
        { status: 409 }
      );
    }

    // Création du produit
    const product = new Product({
      name: body.name,
      model: body.model,
      price: body.price,
      category: body.category,
      gender: body.gender,
      shape: body.shape,
      color: body.color,
      size: body.size,
      fit: body.fit,
      polarized: body.polarized || false,
      availableInOptical: body.availableInOptical || false,
      images: body.images,
      description: body.description || '',
      stock: body.stock || 0,
      collection: body.collection || '',
      isNew: body.isNew || false
    });

    const savedProduct = await product.save();

    return NextResponse.json({
      success: true,
      data: savedProduct,
      message: 'Produit créé avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la création du produit' },
      { status: 500 }
    );
  }
}
