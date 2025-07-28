// src/components/FilterableAnimeGrid.tsx (VERSÃO FINAL COM TODAS AS CORREÇÕES)
'use client';

import { useState, useEffect, useCallback } from 'react';
// <-- CORREÇÃO: 'FilterOption' removido das importações.
import { getAnimes, getAdPlacements, type Anime } from '@/lib/api';
import AnimeCard from './AnimeCard';
import AdSlot from './AdSlot';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface FilterableAnimeGridProps {
  preselectedFilters?: {
    genres?: string[];
    types?: string[];
    statuses?: string[];
    studios?: string[];
  };
}

export default function FilterableAnimeGrid({ preselectedFilters }: FilterableAnimeGridProps) {
  // <-- CORREÇÃO: 'setActiveFilters' removido pois não é utilizado.
  const [activeFilters] = useState({
    genres: preselectedFilters?.genres || [],
    types: preselectedFilters?.types || [],
    statuses: preselectedFilters?.statuses || [],
    studios: preselectedFilters?.studios || [],
  });
  const [orderBy] = useState<'date' | 'title'>('date');
  
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const [nativeAdScript, setNativeAdScript] = useState<string | null>(null);

  const debouncedFilters = useDebounce(activeFilters, 500);

  const fetchAnimes = useCallback(async (pageNum: number, currentFilters: typeof activeFilters, sortOrder: typeof orderBy) => {
    setIsLoading(true);
    if (pageNum === 1) {
      setAnimes([]);
    }
    const data = await getAnimes(pageNum, 24, { filters: currentFilters, orderBy: sortOrder });
    
    if (data && data.animes) {
      setAnimes((prev) => pageNum === 1 ? data.animes : [...prev, ...data.animes]);
      setHasMore(pageNum < data.totalPages);
    } else {
      setHasMore(false);
    }
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchAnimes(1, debouncedFilters, orderBy);
  }, [debouncedFilters, orderBy, fetchAnimes]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMore && !isLoading) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchAnimes(nextPage, activeFilters, orderBy);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, page, activeFilters, orderBy, fetchAnimes]);
  
  useEffect(() => {
    async function fetchAdScript() {
      const ads = await getAdPlacements();
      if (ads?.script_banner_nativo) {
        setNativeAdScript(ads.script_banner_nativo);
      }
    }
    fetchAdScript();
  }, []);

  const itemsWithAds: (Anime | { isAd: true; id: string })[] = [];
  animes.forEach((anime, index) => {
    itemsWithAds.push(anime);
    if (nativeAdScript && (index + 1) % 12 === 0) {
      itemsWithAds.push({ isAd: true, id: `ad-slot-${index}` });
    }
  });

  return (
    <div>
      <div className="bg-black/20 p-4 rounded-lg mb-8 border border-gray-800">
        <p className="text-center text-gray-400">Filter UI coming soon...</p>
      </div>

      {isLoading && animes.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      ) : itemsWithAds.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4">
          {itemsWithAds.map((item) =>
            'isAd' in item ? (
              <div
                key={item.id}
                className="w-full aspect-[2/3] flex items-center justify-center p-2 bg-gray-900/50 rounded-md"
              >
                <AdSlot script={nativeAdScript} />
              </div>
            ) : (
              <AnimeCard
                key={`${item.id}-${item.slug}`}
                slug={item.slug}
                title={item.title}
                coverImage={item.coverImage}
                type={item.type || null}
              />
            )
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400">No results match your selected filters.</p>
        </div>
      )}

      {isLoading && animes.length > 0 && (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      )}

      {!hasMore && animes.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You&#39;ve reached the end!</p>
        </div>
      )}
    </div>
  );
}
