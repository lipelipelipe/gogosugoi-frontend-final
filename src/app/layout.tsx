// src/app/layout.tsx (VERSÃO FINAL COM OTIMIZAÇÕES DE SEO)

import { Inter, Bangers } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAdPlacements } from '@/lib/api';
import GlobalAdScripts from '@/components/GlobalAdScripts';
import { Analytics } from '@vercel/analytics/react';

// A configuração das fontes permanece a mesma.
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', 
});

const bangers = Bangers({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-bangers',
});


// =============================================================================
// METADADOS PADRÃO DO SITE (COM REFORÇO DE SEO)
// =============================================================================
export const metadata = {
  title: 'GogoSugoi - Watch Anime Online',
  description: 'Your number one source for watching anime online, free and in high quality.',
  // <-- REFORÇO DE SEO: Adicionamos o objeto 'robots' para dar instruções explícitas
  // aos crawlers dos mecanismos de busca.
  robots: {
    index: true, // Permite que a página seja indexada.
    follow: true, // Permite que os links na página sejam seguidos.
    googleBot: { // Instruções específicas para o GoogleBot.
      index: true,
      follow: true,
      'max-video-preview': -1, // Permite que o Google mostre prévias de vídeo de qualquer duração.
      'max-image-preview': 'large', // Permite que o Google mostre imagens grandes nas prévias.
      'max-snippet': -1, // Não há limite para o tamanho do snippet de texto que o Google pode mostrar.
    },
  },
}


// =============================================================================
// O COMPONENTE ROOT LAYOUT
// =============================================================================
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // A busca de dados centralizada permanece, pois é a abordagem mais eficiente.
  const ads = await getAdPlacements();

  return (
    // A injeção das variáveis de fonte no HTML permanece.
    <html lang="en" className={`${inter.variable} ${bangers.variable}`}>
      <body className="bg-[#141519]">
        
        {/* Injeção de scripts globais (Popunder, etc.) */}
        <GlobalAdScripts adSettings={ads} />
        
        {/* Componentes de layout globais */}
        <Header />
        
        <main className="pt-16">
          {children}
        </main>
        
        <Footer />

        {/* Componente de Analytics da Vercel para o nosso Intel Dashboard */}
        <Analytics />
        
      </body>
    </html>
  )
}