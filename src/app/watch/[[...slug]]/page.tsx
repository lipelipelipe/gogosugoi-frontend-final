// src/app/watch/[[...slug]]/page.tsx (VERSÃO FINAL COM SEO DINÂMICO DE EPISÓDIO)

import { getAnimeDetails, getAdPlacements } from '@/lib/api';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import WatchPageClient from '@/components/WatchPageClient';

interface PageProps {
  params: {
    slug?: string[];
  };
}

// =============================================================================
// GERAÇÃO DE METADADOS (ESTRATÉGIA FINAL)
// =============================================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [animeSlug, episodeSlug] = params.slug ?? [];

  if (!animeSlug) {
    return { title: 'Watch Episode - GogoSugoi' };
  }

  // 1. Buscamos os dados do anime, que incluem os metadados do Yoast para a SÉRIE.
  const anime = await getAnimeDetails(decodeURIComponent(animeSlug));
  
  if (!anime) {
    return { title: 'Anime Not Found - GogoSugoi' };
  }

  // 2. Se for uma página de episódio, entramos na lógica de construção dinâmica.
  if (episodeSlug) {
    const episodeIndex = anime.episodes?.findIndex(ep => ep.slug === episodeSlug);

    if (episodeIndex !== -1 && episodeIndex !== undefined) {
      const episodeNumber = episodeIndex + 1;
      
      // Construímos o título e a descrição seguindo o template que você definiu.
      const title = `${anime.title} Episode ${episodeNumber} English Subbed - GogoSugoi`;
      const description = `Dear Anime Users, Watch ${anime.title} Episode ${episodeNumber} English Subbed Free Online Video by GogoSugoi, you are watching ${anime.title}.`;
      
      // Usamos a imagem do anime como a imagem principal para o episódio.
      const imageUrl = anime.coverImage || '/placeholder.png';

      return {
        title,
        description,
        openGraph: {
          title: title,
          description: description,
          images: [{ url: imageUrl }],
          type: 'video.episode', // Tipo de OG mais específico para episódios.
        },
        twitter: {
          card: 'summary_large_image',
          title: title,
          description: description,
          images: [imageUrl],
        },
      };
    }
  }

  // 3. FALLBACK: Se não for uma página de episódio ou o episódio não for encontrado,
  // usamos os metadados do Yoast do ANIME principal (se existirem).
  if (anime.yoastSeo?.meta) {
    const yoastMeta = anime.yoastSeo.meta;
    const getMetaString = (value: unknown, fallback: string = ''): string => typeof value === 'string' ? value : fallback;
    return {
      title: getMetaString(yoastMeta.title, anime.title),
      description: getMetaString(yoastMeta.description, ''),
    };
  }

  // 4. FALLBACK FINAL: Se não houver dados do Yoast, criamos metadados genéricos para o anime.
  return {
    title: `Watch ${anime.title} - GogoSugoi`,
    description: `Watch all episodes of ${anime.title} online in high quality.`,
  };
}


// =============================================================================
// O COMPONENTE DA PÁGINA (sem alterações na sua lógica)
// =============================================================================
export default async function WatchPage({ params }: PageProps) {
  const [animeSlug, episodeSlug] = params.slug ?? [];

  if (!animeSlug || !episodeSlug) {
    notFound();
  }

  const [anime, ads] = await Promise.all([
    getAnimeDetails(decodeURIComponent(animeSlug)),
    getAdPlacements()
  ]);

  if (!anime || !anime.episodes) {
    notFound();
  }

  const allEpisodes = anime.episodes;
  const currentEpisodeIndex = allEpisodes.findIndex(
    (ep) => ep.slug === episodeSlug
  );

  if (currentEpisodeIndex === -1) {
    notFound();
  }

  const currentEpisode = allEpisodes[currentEpisodeIndex];
  const prevEpisode = allEpisodes[currentEpisodeIndex - 1] ?? null;
  const nextEpisode = allEpisodes[currentEpisodeIndex + 1] ?? null;

  return (
    <main className="min-h-screen bg-[#000000] text-white p-4 md:p-6 lg:p-8">
      <WatchPageClient
        anime={anime}
        ads={ads}
        currentEpisode={currentEpisode}
        prevEpisode={prevEpisode}
        nextEpisode={nextEpisode}
        currentEpisodeIndex={currentEpisodeIndex}
      />
    </main>
  );
}