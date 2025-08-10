import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';

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

// Helper pour obtenir ou créer un panier
async function getOrCreateCart(userId: string | null, sessionId: string | null) {
  if (userId) {
    // Utilisateur connecté : chercher par userId
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }
    return cart;
  } else if (sessionId) {
    // Utilisateur non connecté : chercher par sessionId
    let cart = await Cart.findOne({ sessionId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
      await cart.save();
    }
    return cart;
  }
  
  return null;
}

// GET /api/cart - Récupérer le panier
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const sessionId = request.headers.get('x-session-id');

    if (!userId && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session requise' },
        { status: 400 }
      );
    }

    const cart = await getOrCreateCart(userId, sessionId);

    if (!cart) {
      return NextResponse.json({
        success: true,
        data: { items: [], total: 0 }
      });
    }

    // Calculer le total du panier
    const total = cart.items.reduce((sum, item) => {
      if (item.product && typeof item.product === 'object') {
        return sum + (item.product.price * item.quantity);
      }
      return sum;
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        id: cart._id,
        items: cart.items,
        total,
        itemsCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la récupération du panier' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Ajouter un produit au panier
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const sessionId = request.headers.get('x-session-id');
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session requise' },
        { status: 400 }
      );
    }

    if (!productId || quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'ID produit et quantité valides requis' },
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
        { success: false, error: 'Stock insuffisant' },
        { status: 400 }
      );
    }

    // Obtenir ou créer le panier
    const cart = await getOrCreateCart(userId, sessionId);
    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Impossible de créer le panier' },
        { status: 500 }
      );
    }

    // Vérifier si le produit est déjà dans le panier
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Produit déjà dans le panier : augmenter la quantité
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return NextResponse.json(
          { success: false, error: 'Stock insuffisant pour cette quantité' },
          { status: 400 }
        );
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Nouveau produit : ajouter au panier
      cart.items.push({
        product: productId,
        quantity
      });
    }

    await cart.save();

    // Récupérer le panier avec les détails des produits
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    
    const total = updatedCart!.items.reduce((sum, item) => {
      if (item.product && typeof item.product === 'object') {
        return sum + (item.product.price * item.quantity);
      }
      return sum;
    }, 0);

    return NextResponse.json({
      success: true,
      message: 'Produit ajouté au panier',
      data: {
        id: updatedCart!._id,
        items: updatedCart!.items,
        total,
        itemsCount: updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de l\'ajout au panier' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Vider le panier
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const sessionId = request.headers.get('x-session-id');

    if (!userId && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session requise' },
        { status: 400 }
      );
    }

    const filter = userId ? { user: userId } : { sessionId };
    await Cart.findOneAndUpdate(filter, { items: [] });

    return NextResponse.json({
      success: true,
      message: 'Panier vidé avec succès',
      data: { items: [], total: 0, itemsCount: 0 }
    });

  } catch (error) {
    console.error('Erreur lors du vidage du panier:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors du vidage du panier' },
      { status: 500 }
    );
  }
}
