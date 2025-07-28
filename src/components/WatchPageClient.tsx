// src/components/WatchPageClient.tsx

'use client';

import AdLoadingOverlay from '@/components/AdLoadingOverlay'; // <-- Esta importação agora aponta para um componente reforçado.
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeListModal from '@/components/EpisodeListModal';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Anime, Episode, AdPlacementSettings } from '@/lib/api';

interface WatchPageClientProps {
  anime: Anime & { episodes: Episode[] };
  ads: AdPlacementSettings | null;
  currentEpisode: Episode;
  prevEpisode: Episode | null;
  nextEpisode: Episode | null;
  currentEpisodeIndex: number;
}

export default function WatchPageClient({
  anime,
  ads,
  currentEpisode,
  prevEpisode,
  nextEpisode,
  currentEpisodeIndex,
}: WatchPageClientProps) {
  return (
    <div className="mx-auto max-w-7xl">
      {/* O alerta vermelho aqui deve desaparecer após corrigir AdLoadingOverlay.tsx */}
      <AdLoadingOverlay
        adScript={ads?.script_banner_player_loading ?? null}
        duration={ads?.player_loading_time ? parseInt(ads.player_loading_time, 10) : 5}
      >
        <VideoPlayer
          episode={currentEpisode}
          initialServerUrl={currentEpisode.servers?.[0]?.url ?? null}
        />
      </AdLoadingOverlay>

      <div className="mt-4 md:mt-6">
        <Link
          href={`/anime/${anime.slug}`}
          className="text-sm font-semibold text-orange-400 hover:text-orange-300"
        >
          {anime.title}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mt-1 truncate">
          E{currentEpisodeIndex + 1} -{' '}
          {currentEpisode.nameExtend || currentEpisode.name}
        </h1>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 rounded-md bg-[#141519] p-3">
        <div className="flex items-center gap-2">
          {prevEpisode ? (
            <Link
              href={`/watch/${anime.slug}/${prevEpisode.slug}`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm font-semibold"
            >
              <ArrowLeft size={16} />
              <span>PREV EP</span>
            </Link>
          ) : (
            <span className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-md text-sm font-semibold text-gray-500 cursor-not-allowed">
              <ArrowLeft size={16} />
              <span>PREV EP</span>
            </span>
          )}
          {nextEpisode ? (
            <Link
              href={`/watch/${anime.slug}/${nextEpisode.slug}`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm font-semibold"
            >
              <span>NEXT EP</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <span className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-md text-sm font-semibold text-gray-500 cursor-not-allowed">
              <span>NEXT EP</span>
              <ArrowRight size={16} />
            </span>
          )}
        </div>

        <EpisodeListModal
          allEpisodes={anime.episodes}
          animeSlug={anime.slug}
          currentEpisodeSlug={currentEpisode.slug}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Recommended For You</h2>
        <div className="mt-4 h-48 rounded-md bg-gray-800 flex items-center justify-center">
          <p className="text-gray-500">Recommendations coming soon...</p>
        </div>
      </div>
    </div>
  );
}