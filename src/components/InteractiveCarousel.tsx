// src/components/InteractiveCarousel.tsx
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnimeCard from './AnimeCard';
import type { Anime } from '@/lib/api';

interface CarouselProps {
  title: string;
  animes: Anime[];
}

const PrevButton = (props: { onClick: () => void; disabled: boolean }) => {
  const { onClick, disabled } = props;
  return (
    <button
      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100 disabled:opacity-0 md:flex hover:bg-black/80"
      onClick={onClick}
      disabled={disabled}
      aria-label="Previous slide"
    >
      <ChevronLeft size={32} />
    </button>
  );
};

const NextButton = (props: { onClick: () => void; disabled: boolean }) => {
  const { onClick, disabled } = props;
  return (
    <button
      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100 disabled:opacity-0 md:flex hover:bg-black/80"
      onClick={onClick}
      disabled={disabled}
      aria-label="Next slide"
    >
      <ChevronRight size={32} />
    </button>
  );
};

export default function InteractiveCarousel({ title, animes }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', skipSnaps: true, containScroll: 'trimSnaps' });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi: UseEmblaCarouselType[1]) => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect).on('select', onSelect);
    return () => {
      emblaApi.off('reInit', onSelect).off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-white">{title}</h2>
      {/* 
        A MUDANÇA ESTÁ AQUI:
        - O `group/carousel` e `relative` estão no contêiner externo.
        - O `overflow-hidden` está em um contêiner interno (`viewport`).
        Isso permite que os cards "cresçam" para fora do viewport sem serem cortados.
      */}
      <div className="group/carousel relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex py-4 -ml-4">
            {animes.map((anime) => (
              <div key={anime.id} className="basis-1/2 flex-shrink-0 px-2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[14.28%] 2xl:basis-[12.5%]">
                <AnimeCard
                  slug={anime.slug}
                  title={anime.title}
                  coverImage={anime.coverImage}
                  type={anime.type ?? null}
                />
              </div>
            ))}
          </div>
        </div>
        
        <PrevButton onClick={scrollPrev} disabled={!canScrollPrev} />
        <NextButton onClick={scrollNext} disabled={!canScrollNext} />
      </div>
    </section>
  );
}