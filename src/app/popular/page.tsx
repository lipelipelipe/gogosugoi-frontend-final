// src/app/popular/page.tsx
import { getAnimes } from '@/lib/api';
import InteractiveCarousel from '@/components/InteractiveCarousel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Popular Anime - GogoSugoi',
  description: 'Watch the most popular and trending anime series on GogoSugoi.',
};

export default async function PopularAnimesPage() {
  // Exemplo: buscando dados e embaralhando para simular "popular"
  // O ideal seria ter um endpoint na API: /popular-animes
  const animeData = await getAnimes(1, 20);
  const popularAnimes = animeData ? [...animeData.animes].sort(() => 0.5 - Math.random()) : [];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6 border-l-4 border-orange-500 pl-4">
        Popular Anime
      </h1>
      
      {popularAnimes.length > 0 ? (
        <InteractiveCarousel title="" animes={popularAnimes} />
      ) : (
        <p className="text-gray-400">
          Could not load popular animes at this time. Please try again later.
        </p>
      )}

      <div className="mt-8">
        {/* Espaço para mais conteúdo popular ou listas */}
      </div>
    </div>
  );
}