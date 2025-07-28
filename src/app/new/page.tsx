// src/app/new/page.tsx (VERSÃO FINAL E CORRIGIDA)

import FilterableAnimeGrid from '@/components/FilterableAnimeGrid';
import type { Metadata } from 'next';

/**
 * Metadados estáticos para a página de Novos Lançamentos.
 */
export const metadata: Metadata = {
  title: 'New Releases - GogoSugoi',
  description: 'Browse, filter, and sort all the latest anime releases on GogoSugoi.',
};

/**
 * NewReleasesPage: Um Componente de Servidor que exibe uma grade filtrável
 * de todos os animes, com foco em novos lançamentos.
 * 
 * Nota: A busca de dados de filtro foi removida do corpo do componente
 * pois a UI de filtros foi movida para dentro de FilterableAnimeGrid.
 * A página agora simplesmente renderiza a grade.
 */
export default async function NewReleasesPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8 border-l-4 border-orange-500 pl-4">
        New Releases
      </h1>
      
      {/* 
        A chamada ao componente FilterableAnimeGrid foi corrigida.
        Removemos as props 'genres', 'types', etc., que não são mais aceitas,
        eliminando o erro de compilação do TypeScript.
        Nenhum filtro é pré-selecionado, permitindo ao usuário total controle.
      */}
      <FilterableAnimeGrid />
    </div>
  );
}