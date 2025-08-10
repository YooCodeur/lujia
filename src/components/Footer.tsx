'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Newsletter signup:', { email, birthday, gender });
    setIsNewsletterSubmitted(true);
    setTimeout(() => setIsNewsletterSubmitted(false), 3000);
  };

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Logo et description */}
          <div className="space-y-6">
            <h3 className="text-3xl font-thin tracking-[0.2em]">LUJIA</h3>
            <p className="text-gray-400 font-light leading-relaxed">
              L'art de voir différemment.<br />
              Créateur de lunettes d'exception.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} strokeWidth={1.5} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} strokeWidth={1.5} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="text-lg font-light tracking-wider">NAVIGATION</h4>
            <ul className="space-y-3">
              <li><Link href="/solaire" className="text-gray-400 hover:text-white transition-colors font-light">Lunettes de soleil</Link></li>
              <li><Link href="/optique" className="text-gray-400 hover:text-white transition-colors font-light">Lunettes de vue</Link></li>
              <li><Link href="/collections" className="text-gray-400 hover:text-white transition-colors font-light">Collections</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors font-light">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter minimaliste */}
          <div className="space-y-6">
            <h4 className="text-lg font-light tracking-wider">NEWSLETTER</h4>
            <p className="text-gray-400 font-light text-sm">
              Recevez nos dernières créations et actualités
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-white transition-colors font-light"
                required
              />
              <button
                type="submit"
                className="text-white hover:text-gray-300 transition-colors font-light tracking-wider text-sm"
              >
                S'ABONNER →
              </button>
              {isNewsletterSubmitted && (
                <p className="text-green-400 text-sm">
                  Merci de votre inscription
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar minimaliste */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-light">
              © 2025 LUJIA. Tous droits réservés.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm font-light transition-colors">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm font-light transition-colors">
                Conditions
              </Link>
              <Link href="/legal" className="text-gray-400 hover:text-white text-sm font-light transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
