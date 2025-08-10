'use client';

import { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const AccountPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    gender: '',
    isOptician: false,
    newsletterSubscribed: false,
    acceptPrivacy: false
  });

  // Reset password state
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        // Connexion réussie
        alert('Connexion réussie !');
        
        // Rediriger vers /admin si c'est un opticien
        if (data.data.isOptician) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } else {
        alert('Erreur de connexion: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      alert('Erreur lors de la connexion');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    if (!registerData.acceptPrivacy) {
      alert('Veuillez accepter la politique de confidentialité');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        // Vider le formulaire d'inscription
        setRegisterData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          birthday: '',
          gender: '',
          isOptician: false,
          newsletterSubscribed: false,
          acceptPrivacy: false
        });
        // Basculer vers le formulaire de connexion
        setShowLogin(true);
      } else {
        alert('Erreur lors de la création du compte: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Erreur lors de la création du compte');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset password for:', resetEmail);
    // Ici vous ajouteriez la logique de réinitialisation
    alert('Un e-mail de réinitialisation a été envoyé');
    setShowResetPassword(false);
  };

  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Réinitialiser son mot de passe</h2>
              <button
                onClick={() => setShowResetPassword(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Nous vous ferons parvenir un e-mail pour réinitialiser votre mot de passe
            </p>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Envoyer
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetPassword(false)}
                  className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Login Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Début de la séance particulière</h2>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Connexion
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Vous n'avez pas de compte ?{' '}
                  <button
                    onClick={() => setShowLogin(false)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Créer un compte
                  </button>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Êtes-vous une optique?</p>
                <p className="text-xs text-gray-500 mb-3">
                  Accede a nuestra zona profesional con condiciones exclusivas para ópticas como la tuya.
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Cliquez ici
                </button>
              </div>
            </div>

            {/* Register Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Créer un compte</h2>
              
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        placeholder="Prénom"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      placeholder="Nom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance (optionnel)
                  </label>
                  <input
                    type="date"
                    value={registerData.birthday}
                    onChange={(e) => setRegisterData({...registerData, birthday: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre (optionnel)
                  </label>
                  <div className="flex space-x-4">
                    {['femme', 'homme', 'unisexe'].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setRegisterData({...registerData, gender})}
                        className={`px-4 py-2 text-sm border rounded-lg capitalize ${
                          registerData.gender === gender
                            ? 'bg-black text-white border-black'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={registerData.newsletterSubscribed}
                      onChange={(e) => setRegisterData({...registerData, newsletterSubscribed: e.target.checked})}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-600">
                      Abonnez-vous à notre newsletter
                    </span>
                  </label>

                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={registerData.isOptician}
                      onChange={(e) => setRegisterData({...registerData, isOptician: e.target.checked})}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-600">
                      Je suis un professionnel de l'optique
                    </span>
                  </label>

                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={registerData.acceptPrivacy}
                      onChange={(e) => setRegisterData({...registerData, acceptPrivacy: e.target.checked})}
                      className="mt-1"
                      required
                    />
                    <span className="text-sm text-gray-600">
                      J'ai lu et j'accepte la{' '}
                      <a href="/privacy" className="text-blue-600 hover:text-blue-800">
                        politique de confidentialité
                      </a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Registre
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Avez-vous déjà un compte ?{' '}
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Se connecter
                  </button>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Êtes-vous une optique?</p>
                <p className="text-xs text-gray-500 mb-3">
                  Accede a nuestra zona profesional con condiciones exclusivas para ópticas como la tuya.
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Cliquez ici
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
