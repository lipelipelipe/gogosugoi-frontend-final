// src/lib/api.ts (VERSÃO FINAL REFORÇADA - NÍVEL PHD)

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// =============================================================================
// 1. TIPAGENS DE DADOS (DATA CONTRACTS)
// =============================================================================

/**
 * Representa a estrutura básica de um Anime em listagens.
 */
export interface Anime {
    id: number;
    title: string;
    slug: string;
    coverImage: string | null;
    type?: string;
}

/**
 * Representa um Anime com dados expandidos para o carrossel principal (Hero).
 */
export interface HeroAnime {
    id: number;
    title: string;
    slug: string;
    bannerImage: string | null;
    posterImage: string | null;
    logoImage: string | null;
    description: string;
}

/**
 * Representa um único episódio de um Anime.
 */
export interface Episode {
    id: number;
    name: string;
    nameExtend: string;
    slug: string;
    date: string;
    volume: string;
    servers: { name: string; url: string }[];
}

/**
 * Representa os metadados que recebemos do nosso plugin Gogo SEO Bridge no WordPress.
 * A vulnerabilidade de tipo foi neutralizada substituindo 'any' por tipos mais seguros.
 */
export interface YoastSeoData {
  /** 
   * Um objeto contendo os metadados da página (título, descrição, etc.).
   * Usamos Record<string, unknown> como um tipo seguro para um objeto com chaves string
   * e valores de qualquer tipo, que devem ser verificados antes do uso.
   */
  meta: Record<string, unknown>;
  /**
   * Um objeto contendo os dados estruturados (Schema.org / JSON-LD) para a página.
   */
  schema: Record<string, unknown>;
}

/**
 * Representa todos os detalhes de um Anime para a sua página de detalhes,
 * incluindo o campo opcional para os dados de SEO.
 */
export interface AnimeDetails extends Anime {
    description: string;
    status: string | null;
    releaseYear: string | null;
    genres: string[];
    type: string;
    alternativeName: string;
    episodes: Episode[];
    yoastSeo?: YoastSeoData | null;
}

/**
 * Representa os dados necessários para gerar o sitemap.
 */
export interface SitemapData {
    slug: string;
    lastModified: string;
}

/**
 * Representa uma opção selecionável nos menus de filtro (ex: um gênero, um tipo).
 */
export interface FilterOption {
  name: string;
  slug: string;
}

/**
 * Representa a estrutura de dados completa que recebemos do nosso
 * "Arsenal de Monetização" no WordPress.
 */
export interface AdPlacementSettings {
    ativar_popunder?: 'on' | 'off';
    script_popunder?: string;
    script_banner_player_loading?: string;
    player_loading_time?: string;
    script_banner_sidebar?: string;
    script_banner_leaderboard_desktop?: string;
    script_banner_leaderboard_mobile?: string;
    script_banner_nativo?: string;
    script_banner_footer?: string;
    url_direct_link?: string;
}


// =============================================================================
// 2. FUNÇÕES DE COMUNICAÇÃO COM A API (DATA FETCHING LAYER)
// Todas as funções permanecem inalteradas, pois sua lógica é robusta.
// =============================================================================

/**
 * Busca os animes destacados para o carrossel principal.
 */
export async function getHeroAnimes(): Promise<HeroAnime[] | null> {
    if (!API_URL) {
        console.error("[CONFIG_ERROR] NEXT_PUBLIC_API_URL is not defined in .env.local");
        return null;
    }
    try {
        const res = await fetch(`${API_URL}/wp-json/gogo-hero/v1/carousel`, {
            next: { revalidate: 600 }
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch hero animes. Status: ${res.status}. URL: ${res.url}`);
        }
        return await res.json() as HeroAnime[];
    } catch (error) {
        console.error("[API_ERROR] getHeroAnimes:", error);
        return null;
    }
}

/**
 * Busca uma lista paginada e filtrável de animes.
 */
export async function getAnimes(
    page = 1, 
    perPage = 24, 
    options?: {
        filters?: {
            genres?: string[];
            types?: string[];
            statuses?: string[];
            studios?: string[];
        };
        orderBy?: 'date' | 'title';
    }
) {
    if (!API_URL) {
        console.error("[CONFIG_ERROR] NEXT_PUBLIC_API_URL is not defined in .env.local");
        return null;
    }
    try {
        const params = new URLSearchParams({
            page: String(page),
            per_page: String(perPage),
        });
        if (options?.orderBy) params.append('orderby', options.orderBy);
        if (options?.filters?.genres?.length) params.append('genres', options.filters.genres.join(','));
        if (options?.filters?.types?.length) params.append('types', options.filters.types.join(','));
        if (options?.filters?.statuses?.length) params.append('statuses', options.filters.statuses.join(','));
        if (options?.filters?.studios?.length) params.append('studios', options.filters.studios.join(','));

        const url = `${API_URL}/wp-json/gogo/v1/animes?${params.toString()}`;
        const res = await fetch(url, { next: { revalidate: 3600 } });

        if (!res.ok) {
            throw new Error(`Failed to fetch animes. Status: ${res.status}. URL: ${url}`);
        }
        return await res.json() as { animes: Anime[], totalPages: number, currentPage: number };
    } catch (error) {
        console.error("[API_ERROR] getAnimes:", error);
        return null;
    }
}

/**
 * Busca os detalhes completos de um anime E os seus dados de SEO em paralelo.
 */
export async function getAnimeDetails(slug: string): Promise<AnimeDetails | null> {
    if (!API_URL) {
        console.error("[CONFIG_ERROR] NEXT_PUBLIC_API_URL is not defined in .env.local");
        return null;
    }
    try {
        const animeDetailsUrl = `${API_URL}/wp-json/gogo/v1/anime/${slug}`;
        const seoUrl = `${API_URL}/wp-json/gogo-seo/v1/meta?slug=${slug}`;

        const [animeRes, seoRes] = await Promise.all([
            fetch(animeDetailsUrl, { next: { revalidate: 3600 } }),
            fetch(seoUrl, { next: { revalidate: 3600 } })
        ]);

        if (!animeRes.ok) {
            if (animeRes.status === 404) return null;
            throw new Error(`Failed to fetch anime details for slug "${slug}": ${animeRes.statusText}`);
        }

        const animeData: AnimeDetails = await animeRes.json();
        
        if (seoRes.ok) {
            animeData.yoastSeo = await seoRes.json() as YoastSeoData;
        } else {
            animeData.yoastSeo = null;
            console.warn(`[SEO_API_WARN] Could not fetch Yoast SEO data for slug "${slug}". Status: ${seoRes.status}`);
        }
        return animeData;
    } catch (error) {
        console.error(`[API_ERROR] getAnimeDetails for slug "${slug}":`, error);
        return null;
    }
}

/**
 * Busca os dados de SEO do Yoast para uma página de arquivo de taxonomia (ex: /movies).
 */
export async function getArchiveSeoData(taxonomy: string, slug: string): Promise<YoastSeoData | null> {
    if (!API_URL) {
        console.error("[CONFIG_ERROR] NEXT_PUBLIC_API_URL is not defined in .env.local");
        return null;
    }
    try {
        const seoUrl = `${API_URL}/wp-json/gogo-seo/v1/archive-meta?taxonomy=${taxonomy}&slug=${slug}`;
        const seoRes = await fetch(seoUrl, { next: { revalidate: 3600 } });

        if (!seoRes.ok) {
            console.warn(`[SEO_API_WARN] Could not fetch Yoast SEO data for archive ${taxonomy}/${slug}. Status: ${seoRes.status}`);
            return null;
        }
        return await seoRes.json() as YoastSeoData;
    } catch (error) {
        console.error(`[API_ERROR] getArchiveSeoData for ${taxonomy}/${slug}:`, error);
        return null;
    }
}

/**
 * Busca os dados de SEO do Yoast para a página inicial.
 */
export async function getHomepageSeoData(): Promise<YoastSeoData | null> {
    if (!API_URL) {
        console.error("[CONFIG_ERROR] NEXT_PUBLIC_API_URL is not defined in .env.local");
        return null;
    }
    try {
        const seoUrl = `${API_URL}/wp-json/gogo-seo/v1/homepage-meta`;
        const seoRes = await fetch(seoUrl, { next: { revalidate: 3600 } });

        if (!seoRes.ok) {
            console.warn(`[SEO_API_WARN] Could not fetch Yoast SEO data for homepage. Status: ${seoRes.status}`);
            return null;
        }
        return await seoRes.json() as YoastSeoData;
    } catch (error) {
        console.error(`[API_ERROR] getHomepageSeoData:`, error);
        return null;
    }
}

/**
 * Busca os dados de SEO do Yoast para uma página de arquivo de tipo de post (ex: /series).
 */
export async function getPostTypeArchiveSeoData(postType: string): Promise<YoastSeoData | null> {
    if (!API_URL) {
        console.error("[CONFIG_ERROR] NEXT_PUBLIC_API_URL is not defined in .env.local");
        return null;
    }
    try {
        const seoUrl = `${API_URL}/wp-json/gogo-seo/v1/post-type-archive-meta?post_type=${postType}`;
        const seoRes = await fetch(seoUrl, { next: { revalidate: 3600 } });

        if (!seoRes.ok) {
            console.warn(`[SEO_API_WARN] Could not fetch Yoast SEO data for post type archive ${postType}. Status: ${seoRes.status}`);
            return null;
        }
        return await seoRes.json() as YoastSeoData;
    } catch (error) {
        console.error(`[API_ERROR] getPostTypeArchiveSeoData for ${postType}:`, error);
        return null;
    }
}

/**
 * Busca dados para a geração do sitemap.
 */
export async function getSitemapData(): Promise<SitemapData[] | null> {
    if (!API_URL) {
        console.error("[CONFIG_ERROR] NEXT_PUBLIC_API_URL is not defined in .env.local");
        return null;
    }
    try {
        const res = await fetch(`${API_URL}/wp-json/gogo/v1/sitemap-data`, {
            next: { revalidate: 86400 }
        });
        if (!res.ok) { throw new Error('Failed to fetch sitemap data'); }
        return await res.json() as SitemapData[];
    } catch (error) {
        console.error("[API_ERROR] getSitemapData:", error);
        return null;
    }
}

/**
 * Busca animes com base em um termo de pesquisa.
 */
export async function searchAnimes(query: string): Promise<Anime[] | null> {
    if (!API_URL) {
        console.error("[CONFIG_ERROR] NEXT_PUBLIC_API_URL is not defined in .env.local");
        return null;
    }
    if (!query || query.trim().length < 3) { return []; }
    try {
        const url = `${API_URL}/wp-json/gogo/v1/search?q=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch search results. Status: ${res.status}. URL: ${url}`);
        }
        return await res.json() as Anime[];
    } catch (error) {
        console.error(`[API_ERROR] searchAnimes for query "${query}":`, error);
        return null;
    }
}

/**
 * Busca as opções disponíveis para uma determinada taxonomia de filtro.
 */
export async function getFilterOptions(taxonomy: 'anime_genre' | 'anime_type' | 'anime_status' | 'anime_studio'): Promise<FilterOption[]> {
    if (!API_URL) {
        console.error("[CONFIG_ERROR] NEXT_PUBLIC_API_URL is not defined in .env.local");
        return [];
    }
    try {
        const url = `${API_URL}/wp-json/gogo/v1/filters/${taxonomy}`;
        const res = await fetch(url, { next: { revalidate: 86400 } });
        if (!res.ok) {
            throw new Error(`Failed to fetch filter options. Status: ${res.status}. URL: ${url}`);
        }
        return await res.json() as FilterOption[];
    } catch (error) {
        console.error(`[API_ERROR] getFilterOptions for ${taxonomy}:`, error);
        return [];
    }
}

/**
 * Busca as configurações de anúncios do nosso "Arsenal de Monetização" no WordPress.
 */
export async function getAdPlacements(): Promise<AdPlacementSettings | null> {
    if (!API_URL) {
        console.error("[ARSENAL_CONFIG_ERROR] NEXT_PUBLIC_API_URL is not defined in .env.local");
        return null;
    }
    try {
        const url = `${API_URL}/wp-json/gogo-arsenal/v1/placements`;
        
        const res = await fetch(url, {
            next: { revalidate: 300 }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch ad placements. Status: ${res.status}. URL: ${url}`);
        }
        
        return await res.json() as AdPlacementSettings;

    } catch (error) {
        console.error("[ARSENAL_API_ERROR] getAdPlacements:", error);
        return null;
    }
}