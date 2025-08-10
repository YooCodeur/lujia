'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Données d'exemple pour les produits
const featuredProducts = [
  {
    id: '1',
    name: 'ABYSS',
    price: 229,
    image: '/placeholder-glasses.jpg',
  },
  {
    id: '2',
    name: 'ETHEREA', 
    price: 229,
    image: '/placeholder-glasses.jpg',
  },
  {
    id: '3',
    name: 'SHIMMER',
    price: 229,
    image: '/placeholder-glasses.jpg',
  }
];

export default function Home() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <div className="w-full">
      {/* Hero Section - 100vh avec vidéo de fond */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1509695507497-903c140c43b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          >
            <source
              src="https://videos.pexels.com/video-files/6069112/6069112-uhd_2560_1440_25fps.mp4"
              type="video/mp4"
            />
            <source
              src="https://videos.pexels.com/video-files/8369770/8369770-uhd_2560_1440_25fps.mp4"
              type="video/mp4"
            />
            {/* Fallback pour les navigateurs qui ne supportent pas la vidéo */}
            <Image
              src="https://images.unsplash.com/photo-1509695507497-903c140c43b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Collection de lunettes LUJIA"
              fill
              className="object-cover"
            />
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white animate-fade-in">
            <h1 className="text-6xl md:text-9xl font-thin tracking-[0.3em] mb-8 drop-shadow-lg">
              LUJIA
            </h1>
            <p className="text-xl md:text-3xl font-light tracking-widest opacity-90 mb-12 drop-shadow-md">
              L'ART DE VOIR DIFFÉREMMENT
            </p>
            <div className="w-24 h-0.5 bg-white mx-auto opacity-80 shadow-lg"></div>
          </div>
        </div>

        {/* Indicateur de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>

        {/* Contrôles vidéo discrets */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={() => {
              const video = document.querySelector('video');
              if (video) {
                if (video.paused) {
                  video.play();
                } else {
                  video.pause();
                }
              }
            }}
            className="bg-black/20 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/40 transition-colors"
          >
            ⏸️
          </button>
        </div>
      </section>

      {/* Section Lunettes de Soleil - 100vh */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Lunettes de soleil élégantes"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex items-center px-8 md:px-16">
          <div className="max-w-2xl text-white">
            <h2 className="text-6xl md:text-8xl font-thin tracking-[0.2em] mb-8">
              SOLAIRE
            </h2>
            <p className="text-2xl md:text-3xl font-light leading-relaxed mb-12 opacity-90">
              Protection et élégance<br />
              sous le soleil
            </p>
            <Link 
              href="/solaire"
              className="inline-flex items-center space-x-4 border-2 border-white px-12 py-4 text-white font-light tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 group"
            >
              <span>DÉCOUVRIR</span>
              <div className="w-8 h-0.5 bg-white group-hover:w-12 transition-all duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Optique - 100vh */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Lunettes de vue modernes LUJIA"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-end px-8 md:px-16">
          <div className="max-w-2xl text-white text-right">
            <h2 className="text-6xl md:text-8xl font-thin tracking-[0.2em] mb-8">
              OPTIQUE
            </h2>
            <p className="text-2xl md:text-3xl font-light leading-relaxed mb-12 opacity-90">
              Vision claire,<br />
              style affirmé
            </p>
            <Link 
              href="/optique"
              className="inline-flex items-center space-x-4 border-2 border-white px-12 py-4 text-white font-light tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 group"
            >
              <span>EXPLORER</span>
              <div className="w-8 h-0.5 bg-white group-hover:w-12 transition-all duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Collections - 100vh */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1622445275576-721325763afe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Collections LUJIA"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center px-8">
          <div className="text-center mb-16 text-white">
            <h2 className="text-6xl md:text-8xl font-thin tracking-[0.3em] mb-8">
              COLLECTIONS
            </h2>
            <p className="text-xl md:text-2xl font-light opacity-90 tracking-wider">
              Chaque modèle raconte une histoire
            </p>
            <div className="w-32 h-0.5 bg-white mx-auto mt-8 opacity-60"></div>
          </div>

          {/* Grille de collections */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { name: 'VANGUARD', desc: 'Avant-garde' },
              { name: 'ICONS', desc: 'Iconiques' },
              { name: 'LAB', desc: 'Expérimental' },
              { name: 'XS', desc: 'Compact' }
            ].map((collection, index) => (
              <Link
                key={collection.name}
                href={`/collections/${collection.name.toLowerCase()}`}
                className="group relative text-center"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white/30 flex items-center justify-center relative overflow-hidden group-hover:border-white group-hover:scale-110 transition-all duration-500 mx-auto mb-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                    <span className="text-white text-sm md:text-base font-light tracking-wider">
                      {collection.name}
                    </span>
                  </div>
                </div>
                <p className="text-white/80 text-sm font-light tracking-wider group-hover:text-white transition-colors">
                  {collection.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
