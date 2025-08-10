import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
  userId: string;
  email: string;
  isOptician: boolean;
}

// Vérifier et décoder le token JWT
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Obtenir l'utilisateur depuis la requête
export function getUserFromRequest(request: NextRequest): AuthUser | null {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) return null;
  
  return verifyToken(token);
}

// Middleware pour les routes protégées
export function requireAuth(request: NextRequest): AuthUser | Response {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return Response.json(
      { success: false, error: 'Authentification requise' },
      { status: 401 }
    );
  }
  
  return user;
}

// Middleware pour les routes admin
export function requireAdmin(request: NextRequest): AuthUser | Response {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return Response.json(
      { success: false, error: 'Authentification requise' },
      { status: 401 }
    );
  }
  
  if (!user.isOptician) {
    return Response.json(
      { success: false, error: 'Accès administrateur requis' },
      { status: 403 }
    );
  }
  
  return user;
}
