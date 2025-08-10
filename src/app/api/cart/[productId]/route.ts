import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper pour obtenir l'utilisateur depuis le token
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

// PUT /api/cart/[productId] - Mettre à jour la quantité d'un produit dans le panier
export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const sessionId = request.headers.get('x-session-id');
    const { productId } = params;
    const body = await request.json();
    const { quantity } = body;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session requise' },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: 'ID de produit invalide' },
        { status: 400 }
      );
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Quantité valide requise (minimum 1)' },
        { status: 400 }
      );
    }

    // Vérifier que le produit existe et est en stock
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: `Stock insuffisant. Stock disponible: ${product.stock}` },
        { status: 400 }
      );
    }

    // Trouver le panier
    const filter = userId ? { user: userId } : { sessionId };
    const cart = await Cart.findOne(filter);

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Panier non trouvé' },
        { status: 404 }
      );
    }

    // Trouver l'item dans le panier
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé dans le panier' },
        { status: 404 }
      );
    }

    // Mettre à jour la quantité
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Récupérer le panier mis à jour avec les détails des produits
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    
    const total = updatedCart!.items.reduce((sum, item) => {
      if (item.product && typeof item.product === 'object') {
        return sum + (item.product.price * item.quantity);
      }
      return sum;
    }, 0);

    return NextResponse.json({
      success: true,
      message: 'Quantité mise à jour',
      data: {
        id: updatedCart!._id,
        items: updatedCart!.items,
        total,
        itemsCount: updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du panier:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la mise à jour du panier' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[productId] - Supprimer un produit du panier
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const sessionId = request.headers.get('x-session-id');
    const { productId } = params;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session requise' },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: 'ID de produit invalide' },
        { status: 400 }
      );
    }

    // Trouver le panier
    const filter = userId ? { user: userId } : { sessionId };
    const cart = await Cart.findOne(filter);

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Panier non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer l'item du panier
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    // Récupérer le panier mis à jour avec les détails des produits
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    
    const total = updatedCart!.items.reduce((sum, item) => {
      if (item.product && typeof item.product === 'object') {
        return sum + (item.product.price * item.quantity);
      }
      return sum;
    }, 0);

    return NextResponse.json({
      success: true,
      message: 'Produit supprimé du panier',
      data: {
        id: updatedCart!._id,
        items: updatedCart!.items,
        total,
        itemsCount: updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la suppression du panier' },
      { status: 500 }
    );
  }
}
