// src/app/series/page.tsx (VERSÃO FINAL E CORRIGIDA)

import { getPostTypeArchiveSeoData } from '@/lib/api';
import FilterableAnimeGrid from '@/components/FilterableAnimeGrid';
import type { Metadata } from 'next';

// =============================================================================
// GERAÇÃO DE METADADOS (COM PROTOCOLO DE SEGURANÇA DE TIPO)
// =============================================================================
export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getPostTypeArchiveSeoData('anime');

  if (seoData?.meta) {
    const yoastMeta = seoData.meta;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gogosugoi.vercel.app';
    const canonicalUrl = `${siteUrl}/series`;

    const getMetaString = (value: unknown, fallback: string = ''): string => {
      return typeof value === 'string' ? value : fallback;
    };
    
    const getOgImage = (value: unknown): { url: string }[] => {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null && 'url' in value[0] && typeof value[0].url === 'string') {
        return [{ url: value[0].url }];
      }
      return [];
    };

    return {
      title: getMetaString(yoastMeta.title, 'All Anime Series - GogoSugoi'),
      description: getMetaString(yoastMeta.description),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: getMetaString(yoastMeta.og_title, getMetaString(yoastMeta.title)),
        description: getMetaString(yoastMeta.og_description, getMetaString(yoastMeta.description)),
        url: canonicalUrl,
        images: getOgImage(yoastMeta.og_image),
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: getMetaString(yoastMeta.twitter_title, getMetaString(yoastMeta.og_title)),
        description: getMetaString(yoastMeta.twitter_description, getMetaString(yoastMeta.og_description)),
      },
    };
  }

  return {
    title: 'All Anime Series - GogoSugoi',
    description: 'Browse, filter, and sort all anime series available on GogoSugoi.',
  };
}


// =============================================================================
// O COMPONENTE DA PÁGINA
// =============================================================================
export default async function AllSeriesPage() {
  // A busca de dados de filtro foi removida do corpo do componente.
  return (
    <div className="container mx-auto px-4 md:px-8 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8 border-l-4 border-orange-500 pl-4">
        All Series
      </h1>

      {/* 
        A chamada ao FilterableAnimeGrid foi corrigida.
        As props desnecessárias foram removidas.
        A pré-seleção está vazia para mostrar todos os tipos, exceto filmes (lógica interna da grade).
      */}
      <FilterableAnimeGrid 
        preselectedFilters={{
            types: []
        }}
      />
    </div>
  );
}