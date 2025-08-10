import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { firstName, lastName, email, password, phone, address, birthday, gender, isOptician, newsletterSubscribed } = body;

    // Validation des champs requis
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation du mot de passe (min 8 caractères)
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Un compte avec cette adresse email existe déjà' },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    // Créer le nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || undefined,
      address: address || undefined,
      birthday: birthday ? new Date(birthday) : undefined,
      gender: gender || undefined,
      isOptician: isOptician || false,
      newsletterSubscribed: newsletterSubscribed || false
    });

    const savedUser = await newUser.save();

    // Retourner les données utilisateur sans le mot de passe
    const userResponse = {
      id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      phone: savedUser.phone,
      address: savedUser.address,
      birthday: savedUser.birthday,
      gender: savedUser.gender,
      isOptician: savedUser.isOptician,
      newsletterSubscribed: savedUser.newsletterSubscribed,
      createdAt: savedUser.createdAt
    };

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      data: userResponse
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données invalides', 
          details: Object.values(error.errors).map((err: any) => err.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la création du compte' },
      { status: 500 }
    );
  }
}
