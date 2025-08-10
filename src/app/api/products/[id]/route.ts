import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { Types } from 'mongoose';

// GET /api/products/[id] - Récupérer un produit par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    // Vérifier si l'ID est valide
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de produit invalide' },
        { status: 400 }
      );
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer des produits similaires (même catégorie et gender)
    const similarProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      gender: { $in: [product.gender, 'mixte'] },
      stock: { $gt: 0 }
    })
    .limit(4)
    .select('name model price images isNew')
    .lean();

    return NextResponse.json({
      success: true,
      data: product,
      similarProducts
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la récupération du produit' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Mettre à jour un produit (Admin uniquement)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();

    // Vérifier si l'ID est valide
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de produit invalide' },
        { status: 400 }
      );
    }

    // Vérifier si le produit existe
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Si le modèle est modifié, vérifier l'unicité
    if (body.model && body.model !== existingProduct.model) {
      const modelExists = await Product.findOne({ 
        model: body.model, 
        _id: { $ne: id } 
      });
      
      if (modelExists) {
        return NextResponse.json(
          { success: false, error: 'Ce modèle existe déjà' },
          { status: 409 }
        );
      }
    }

    // Mettre à jour le produit
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { 
        ...body,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Produit mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la mise à jour du produit' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Supprimer un produit (Admin uniquement)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    // Vérifier si l'ID est valide
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de produit invalide' },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la suppression du produit' },
      { status: 500 }
    );
  }
}
