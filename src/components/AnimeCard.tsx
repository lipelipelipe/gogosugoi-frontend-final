// src/components/AnimeCard.tsx (COMPLETO, CORRIGIDO E FINAL - NÍVEL PHD PRO)
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, BookmarkPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AnimeCardProps {
  slug: string;
  title: string;
  coverImage: string | null;
  type: string | null;
}

const AnimeCard = ({ slug, title, coverImage, type }: AnimeCardProps) => {
  const decodedSlug = decodeURIComponent(slug);
  const router = useRouter();

  /**
   * Lida com cliques nos botões de ação internos, impedindo a navegação do Link pai
   * e executando a ação específica do botão (navegar para assistir ou adicionar à lista).
   * @param e - O evento de clique do mouse.
   * @param action - A ação a ser executada ('watch' ou 'bookmark').
   */
  const handleActionClick = (e: React.MouseEvent<HTMLButtonElement>, action: 'watch' | 'bookmark') => {
    e.stopPropagation(); // Impede que o evento de clique "borbulhe" para o componente Link pai.
    e.preventDefault();  // Impede qualquer comportamento padrão do navegador que possa conflitar.

    if (action === 'watch') {
      // Usa o router do Next.js para navegar programaticamente para a página de assistir.
      // Assumimos que o primeiro episódio sempre terá o slug 'episode-1'.
      router.push(`/watch/${decodedSlug}/episode-1`);
    } else if (action === 'bookmark') {
      // Aqui iria a lógica para adicionar o anime à watchlist do usuário.
      // Por enquanto, apenas registramos a ação no console.
      console.log(`Bookmark action for: ${title}`);
    }
  };

  return (
    // O componente <Link> envolve todo o card, tornando-o uma grande área de clique
    // para a ação principal: navegar para a página de detalhes do anime.
    <Link 
      href={`/anime/${decodedSlug}`} 
      className="group relative block aspect-[2/3] w-full overflow-hidden rounded-md bg-gray-800 shadow-lg transition-transform duration-300 hover:-translate-y-2"
      aria-label={`View details for ${title}`}
    >
      
      {/* 1. Imagem de Fundo do Card */}
      {coverImage ? (
        <Image
          src={coverImage}
          alt={`Cover for ${title}`}
          fill
          sizes="(min-width: 135em) 14vw, (min-width: 107.5em) 16vw, (min-width: 50em) 20vw, (min-width: 35.5em) 25vw, (min-width: 30em) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-sm text-gray-500">No Image</span>
        </div>
      )}
      
      {/* 2. Gradiente e Título Inferior (Sempre Visível) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 pt-8">
        <h3 className="truncate text-sm font-bold text-white transition-colors group-hover:text-orange-400">{title}</h3>
        <p className="text-xs text-gray-300">{type || 'Sub | Dub'}</p>
      </div>

      {/* 3. Overlay com Detalhes Adicionais (Aparece no Hover) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between overflow-hidden rounded-md bg-black/70 p-4 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-3">{title}</h3>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="font-semibold text-orange-400">1 Season</span>
            <span className="h-1 w-1 rounded-full bg-gray-400"></span>
            <span className="font-semibold text-orange-400">12 Episodes</span>
          </div>
          <p className="mt-2 text-xs text-gray-300 line-clamp-4">
            Click to see the full description for this series and start watching now on GogoSugoi.
          </p>
        </div>
        
        {/* 4. Contêiner de Botões de Ação */}
        <div className="flex items-center justify-between">
          <button 
            type="button" // Define explicitamente o tipo para evitar comportamento de 'submit'
            onClick={(e) => handleActionClick(e, 'watch')}
            className="rounded-full bg-orange-500 p-2 text-black transition-transform hover:scale-110 z-20"
            aria-label={`Watch ${title}`}
          >
            <PlayCircle size={24} fill="black" />
          </button>
          
          <button 
            type="button" // Define explicitamente o tipo para segurança e semântica
            onClick={(e) => handleActionClick(e, 'bookmark')}
            className="rounded-full bg-white/20 p-2 text-white transition-transform hover:scale-110 z-20"
            aria-label={`Add ${title} to watchlist`}
          >
            <BookmarkPlus size={24} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;