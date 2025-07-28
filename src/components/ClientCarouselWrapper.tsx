// src/components/ClientCarouselWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import type { Anime } from '@/lib/api';

const InteractiveCarousel = dynamic(() => import('@/components/InteractiveCarousel'), {
  loading: () => <div className="w-full h-80 bg-gray-800/50 rounded-lg animate-pulse mb-12" />,
  ssr: false, 
});

interface ClientCarouselWrapperProps {
  latestAnimes: Anime[];
  popularAnimes: Anime[];
  newAnimes: Anime[];
}

export default function ClientCarouselWrapper({ latestAnimes, popularAnimes, newAnimes }: ClientCarouselWrapperProps) {
  return (
    <div className="w-full">
      <InteractiveCarousel title="Latest Releases" animes={latestAnimes} />
      <InteractiveCarousel title="Popular Anime" animes={popularAnimes} />
      <InteractiveCarousel title="New on GogoSugoi" animes={newAnimes} />
    </div>
  );
}