'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAnimes, type Anime } from '@/lib/api';
import AnimeCard from './AnimeCard';
import { Loader2 } from 'lucide-react';

interface InfiniteAnimeGridProps {
  initialAnimes: Anime[];
  initialTotalPages: number;
  filterOptions?: {
    filters?: {
        types?: string[];
    }
  }
}

export default function InfiniteAnimeGrid({ initialAnimes, initialTotalPages, filterOptions }: InfiniteAnimeGridProps) {
  const [animes, setAnimes] = useState<Anime[]>(initialAnimes);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(page < initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreAnimes = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = page + 1;
    
    const animeData = await getAnimes(nextPage, 24, filterOptions); 

    if (animeData && animeData.animes.length > 0) {
      setAnimes(prevAnimes => [...prevAnimes, ...animeData.animes]);
      setPage(nextPage);
      setHasMore(nextPage < animeData.totalPages);
    } else {
      setHasMore(false);
    }
    setIsLoading(false);
  }, [isLoading, hasMore, page, filterOptions]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) {
        loadMoreAnimes();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreAnimes]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4">
        {animes.map((anime) => (
          <AnimeCard
            key={`${anime.id}-${anime.slug}`}
            slug={anime.slug}
            title={anime.title}
            coverImage={anime.coverImage}
            type={anime.type || null}
          />
        ))}
      </div>

      <div className="flex justify-center items-center h-24">
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="animate-spin" size={20} />
            <span>Loading more...</span>
          </div>
        )}
        {!isLoading && !hasMore && animes.length > 0 && (
          <p className="text-gray-500">You&apos;ve reached the end!</p>
        )}
      </div>
    </div>
  );
}