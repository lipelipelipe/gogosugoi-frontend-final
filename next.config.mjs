/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Permissões para Imagens Externas (CORRIGIDO)
  images: {
    remotePatterns: [
      // PERMISSÃO CORRIGIDA PARA SEU WORDPRESS
      // Removemos o 'pathname' para ser mais flexível e correto.
      {
        protocol: 'https',
        hostname: 'wetterjetzt.wuaze.com',
      },
      // Permissão para a Crunchyroll (se precisar)
      {
        protocol: 'https',
        hostname: 'imgsrv.crunchyroll.com',
      },
    ],
  },

  // 2. Correção da Política de Segurança de Conteúdo (CSP) (CORRIGIDO)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // ADICIONAMOS 'https://9animetv.be' ao frame-src para permitir o player
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com; frame-src 'self' blob: data: https://9animetv.be;".replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
