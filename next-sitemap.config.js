/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://gogosugoi.vercel.app',
  generateRobotsTxt: true,
  
  transform: async (config, path) => {
    const priorityMap = {
      '/': 1.0,
      '/series': 0.9,
      '/new': 0.9,
      '/movies': 0.7,
      '/popular': 0.7,
      '/categories': 0.5,
    };
    
    return {
      loc: path,
      changefreq: priorityMap[path] ? 'daily' : 'weekly',
      priority: priorityMap[path] || 0.7,
      lastmod: new Date().toISOString(),
    };
  },

  additionalPaths: async (config) => {
    console.log('[next-sitemap] Buscando dados de ANIME da API do WordPress...');
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    // <-- VOLTAMOS A USAR O ENDPOINT ORIGINAL E FUNCIONAL
    const SITEMAP_ENDPOINT = `${API_URL}/wp-json/gogo/v1/sitemap-data`;

    if (!API_URL) {
      console.error('[next-sitemap] ERRO: NEXT_PUBLIC_API_URL não está definida.');
      return [];
    }
    
    try {
      const response = await fetch(SITEMAP_ENDPOINT, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error(`API respondeu com status: ${response.status}`);
      
      const animeSitemapData = await response.json();
      if (!Array.isArray(animeSitemapData)) throw new Error('A resposta da API não é um array.');

      const animePaths = animeSitemapData.map(item => ({
        loc: `/anime/${item.slug}`,
        lastmod: item.lastModified,
        priority: 0.8,
        changefreq: 'weekly',
      }));

      console.log(`[next-sitemap] Sucesso! ${animePaths.length} URLs de animes encontradas.`);
      return animePaths;

    } catch (error) {
      console.error('[next-sitemap] ERRO CRÍTICO ao buscar dados de animes:', error.message);
      return []; 
    }
  },

  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
};