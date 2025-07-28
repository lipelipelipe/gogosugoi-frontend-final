// src/app/page.tsx

import { getAnimes, getHeroAnimes, getAdPlacements } from '@/lib/api';
import HeroCarousel from '@/components/HeroCarousel';
import AdSlot from '@/components/AdSlot';
import type { Metadata } from 'next';
import ClientCarouselWrapper from '@/components/ClientCarouselWrapper';

// =============================================================================
// SEO: METADADOS PARA A HOME
// =============================================================================
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'GogoSugoi | Watch Anime with English Sub and Dub Online Free',
    description:
      'Watch anime online in English subbed and dubbed for free. Stream the latest anime episodes in HD on GogoSugoi – your ultimate destination to watch anime anytime, anywhere.',
    keywords: [
      'watch anime online',
      'anime subbed',
      'anime dubbed',
      'free anime streaming',
      'HD anime',
      'anime site',
      'GogoSugoi'
    ],
    openGraph: {
      title: 'GogoSugoi | Watch Anime Online Free',
      description:
        'Stream the best English subbed and dubbed anime episodes for free in HD. Watch latest anime releases on GogoSugoi.',
      url: 'https://gogosugoi.com',
      siteName: 'GogoSugoi',
      type: 'website'
    }
  };
}

// =============================================================================
// COMPONENTE PRINCIPAL DA HOME
// =============================================================================
export default async function HomePage() {
  const [heroData, animeData, ads] = await Promise.all([
    getHeroAnimes(),
    getAnimes(1, 20),
    getAdPlacements()
  ]);

  if (!animeData || !animeData.animes || animeData.animes.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#141519] p-8 text-white">
        <h1 className="text-3xl font-bold text-red-500">Error</h1>
        <p className="mt-2 text-gray-400">Failed to load main anime list.</p>
      </main>
    );
  }

  const allAnimes = animeData.animes;
  const popularAnimes = [...allAnimes].sort(() => 0.5 - Math.random());
  const newAnimes = [...allAnimes].sort(() => Math.random() - 0.5);

  return (
    <main className="min-h-screen bg-[#141519]">
      <HeroCarousel heroAnimes={heroData || []} />

      <div className="relative w-full grid grid-cols-12 gap-x-6 px-4 md:px-8">
        
        {/* === SIDEBAR ESQUERDA (ADS) === */}
        <aside className="hidden lg:block lg:col-span-2">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 text-center uppercase tracking-wider">
              Advertisement
            </h3>
            <div className="mx-auto flex justify-center w-[160px] h-[600px] bg-gray-900/50 rounded-md">
              <AdSlot script={ads?.script_banner_sidebar ?? null} />
            </div>
          </div>
        </aside>

        {/* === CONTEÚDO CENTRAL === */}
        <div className="col-span-12 lg:col-span-8">
          <ClientCarouselWrapper
            latestAnimes={allAnimes}
            popularAnimes={popularAnimes}
            newAnimes={newAnimes}
          />
        </div>

        {/* === SIDEBAR DIREITA (ADS) === */}
        <aside className="hidden lg:block lg:col-span-2">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 text-center uppercase tracking-wider">
              Advertisement
            </h3>
            <div className="mx-auto flex justify-center w-[160px] h-[600px] bg-gray-900/50 rounded-md">
              <AdSlot script={ads?.script_banner_sidebar ?? null} />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
