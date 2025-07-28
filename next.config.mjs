/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Permissões para Imagens Externas
  images: {
    remotePatterns: [
      // PERMISSÃO CRÍTICA PARA SEU WORDPRESS NA INFINITYFREE
      {
        protocol: 'https',
        hostname: 'wetterjetzt.wuaze.com',
      },
      // Permissão que você já tinha para a Crunchyroll
      {
        protocol: 'https',
        hostname: 'imgsrv.crunchyroll.com',
      },
    ],
  },

  // 2. Correção da Política de Segurança de Conteúdo (CSP) para Anúncios
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Adiciona 'unsafe-eval' para permitir scripts de anúncios
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com; frame-src 'self' blob: data:;".replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;