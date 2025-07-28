'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { searchAnimes, type Anime } from '@/lib/api';
import AnimeCard from './AnimeCard';
import Link from 'next/link';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const searchResults = await searchAnimes(searchQuery);
    setResults(searchResults || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  useEffect(() => {
    if (isOpen) {
      document.getElementById('search-input')?.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex-shrink-0 w-full max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Search</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={28} />
              </button>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for an anime..."
                className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-md pl-12 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div className="flex-grow w-full max-w-3xl mx-auto mt-6 overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-orange-500" size={40} />
              </div>
            )}
            {!isLoading && debouncedQuery.length >= 3 && results.length === 0 && (
              <p className="text-center text-gray-400 mt-8">
                No results found for &quot;{debouncedQuery}&quot;.
              </p>
            )}
            {!isLoading && results.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {results.map((anime) => (
                  <Link key={anime.id} href={`/anime/${anime.slug}`} onClick={onClose}>
                    <AnimeCard {...anime} type={anime.type ?? null} />
                  </Link>
                ))}
              </div>
            )}
            {!isLoading && query.length === 0 && (
              <p className="text-center text-gray-500 mt-8">
                Start typing to see results.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
