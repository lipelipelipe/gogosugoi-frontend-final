/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // --- ADICIONE ESTA LINHA ---
    formats: ['image/avif', 'image/webp'], // Permite que o Next sirva formatos modernos

    remotePatterns: [
      // Permissão para o seu servidor local (WordPress)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/GogoSugoi/wp-content/uploads/**',
      },
      // Permissão para o domínio da Crunchyroll
      {
        protocol: 'https',
        hostname: 'imgsrv.crunchyroll.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;