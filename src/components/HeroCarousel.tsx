'use client';

import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus } from 'lucide-react';
import type { HeroAnime } from '@/lib/api';

interface HeroCarouselProps {
  heroAnimes: HeroAnime[];
}


// =============================================================================
// COMPONENTE INTERNO: HeroSlide (COM OTIMIZAÇÕES DE PERFORMANCE)
// =============================================================================
function HeroSlide({ anime, isPriority }: { anime: HeroAnime, isPriority: boolean }) {
  const bannerSrc = anime.bannerImage || '/placeholder.png';
  const posterSrc = anime.posterImage || bannerSrc;

  return (
    <div className="relative flex-grow-0 flex-shrink-0 w-full h-full">
      
      {/* Imagem de Fundo para Mobile (Otimizada) */}
      <Image
        src={posterSrc}
        alt={`Background for ${anime.title}`}
        fill
        className="object-cover md:hidden"
        priority={isPriority} // Prop do Next.js para pré-carregar a imagem do primeiro slide.
        sizes="100vw"
        quality={75} // Controla a compressão da imagem para reduzir o tamanho do arquivo.
        fetchPriority={isPriority ? 'high' : 'auto'} // Prop nativa do HTML para dar uma dica forte ao navegador sobre a prioridade do download.
      />
      
      {/* Imagem de Fundo para Desktop (Otimizada) */}
      <Image
        src={bannerSrc}
        alt={`Background for ${anime.title}`}
        fill
        className="object-cover hidden md:block"
        priority={isPriority}
        sizes="100vw"
        quality={75}
        fetchPriority={isPriority ? 'high' : 'auto'}
      />

      {/* Gradientes para legibilidade do texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141519] via-transparent to-transparent" />
      
      {/* Conteúdo do Slide */}
      <div className="relative z-10 flex h-full flex-col justify-end p-4 pb-16 md:p-12 md:pb-24 lg:w-3/5 xl:w-1/2">
        {anime.logoImage ? (
          <div className="w-2/3 md:w-3/4">
            <Image
              src={anime.logoImage}
              alt={`Logo for ${anime.title}`}
              width={600}
              height={200}
              className="h-auto w-full object-contain"
              quality={80} // Otimiza a imagem do logo também.
            />
          </div>
        ) : (
          <h1 className="font-heading text-5xl tracking-wide text-white drop-shadow-lg md:text-7xl">
            {anime.title}
          </h1>
        )}
        <p className="mt-4 text-sm text-gray-200 line-clamp-2 md:line-clamp-3 md:text-base">
          {anime.description}
        </p>
        <div className="mt-6 flex items-center gap-4">
          <Link 
            href={`/anime/${anime.slug}`}
            className="flex items-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-black transition-transform hover:scale-105"
          >
            <Play fill="black" />
            <span>MORE INFO</span>
          </Link>
          <button className="flex items-center gap-2 rounded-md border border-white/50 bg-white/20 px-6 py-3 font-bold text-white backdrop-blur-sm transition-transform hover:scale-105">
            <Plus />
            <span>ADD TO LIST</span>
          </button>
        </div>
      </div>
    </div>
  );
}


// =============================================================================
// COMPONENTE PRINCIPAL (LÓGICA DO CARROSSEL)
// =============================================================================
export default function HeroCarousel({ heroAnimes }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((emblaApi: UseEmblaCarouselType[1]) => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSelect);
      return () => { emblaApi.off('select', onSelect) };
    }
  }, [emblaApi, onSelect]);
  
  // Condição de guarda caso não haja animes para o herói.
  if (!heroAnimes || heroAnimes.length === 0) {
    return <div className="h-[70vh] bg-gray-800 flex items-center justify-center text-gray-500">No hero items configured.</div>;
  }

  return (
    <div className="relative mb-8 h-[70vh] min-h-[500px] w-full md:h-[80vh] overflow-hidden">
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {heroAnimes.map((anime, index) => (
            // Passa a prop `isPriority` para o primeiro slide (index === 0).
            <HeroSlide key={anime.id} anime={anime} isPriority={index === 0} />
          ))}
        </div>
      </div>
      
      {/* Indicadores de navegação do carrossel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-2">
          {heroAnimes.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 w-8 rounded-full transition-colors ${selectedIndex === index ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}