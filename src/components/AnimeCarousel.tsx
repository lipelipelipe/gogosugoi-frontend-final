import AnimeCard from './AnimeCard';
import type { Anime } from '@/lib/api';

interface AnimeCarouselProps {
  title: string;
  animes: Anime[];
}

export default function AnimeCarousel({ title, animes }: AnimeCarouselProps) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-white">
        {title}
      </h2>
      <div className="scrollbar-hide -mx-4 flex scroll-p-4 gap-4 overflow-x-auto px-4 pb-4 pt-4">
        {animes.map((anime) => (
          <div key={anime.id} className="w-[45vw] flex-shrink-0 sm:w-[30vw] md:w-[22vw] lg:w-[18vw] xl:w-[15vw]">
            <AnimeCard
              slug={anime.slug}
              title={anime.title}
              coverImage={anime.coverImage}
              // --- A CORREÇÃO ESTÁ AQUI ---
              // Convertemos um possível 'undefined' para 'null' para satisfazer as props do AnimeCard
              type={anime.type || null}
            />
          </div>
        ))}
      </div>
    </section>
  );
}