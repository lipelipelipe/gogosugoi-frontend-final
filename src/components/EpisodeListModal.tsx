// src/components/EpisodeListModal.tsx
'use client'; // Marcando como Client Component para usar interatividade

import { useState } from 'react';
import Link from 'next/link';
import { ListVideo, X } from 'lucide-react';
import type { Episode } from '@/lib/api'; // Reutilizamos nossa tipagem

// Definimos as propriedades que o componente receberá
interface EpisodeListModalProps {
  allEpisodes: Episode[];
  animeSlug: string;
  currentEpisodeSlug: string;
}

export default function EpisodeListModal({ allEpisodes, animeSlug, currentEpisodeSlug }: EpisodeListModalProps) {
  // Estado para controlar se o modal está aberto ou fechado
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* O botão que o usuário vê na página */}
      <button 
        onClick={openModal}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm font-semibold"
      >
        <ListVideo size={16} />
        <span>EPISODES</span>
      </button>

      {/* O Modal - só é renderizado quando isModalOpen for true */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeModal} // Clicar no fundo fecha o modal
        >
          <div 
            className="relative w-full max-w-2xl max-h-[80vh] rounded-lg bg-[#141519] border border-gray-700 flex flex-col"
            onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
          >
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold">Episodes</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Lista de Episódios Rolável */}
            <ul className="overflow-y-auto divide-y divide-gray-800">
              {allEpisodes.map((ep, index) => (
                <li key={ep.id}>
                  <Link 
                    href={`/watch/${animeSlug}/${ep.slug}`}
                    onClick={closeModal} // Fecha o modal ao navegar para um novo episódio
                    className={`block p-4 transition-colors text-sm ${
                      ep.slug === currentEpisodeSlug 
                        ? 'bg-orange-500 text-black font-bold' // Estilo do episódio atual
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    Episode {index + 1}: {ep.nameExtend || ep.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}