// src/app/layout.tsx (VERSÃO FINAL COM VERIFICAÇÃO DO GOOGLE)

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
// METADADOS PADRÃO DO SITE (COM VERIFICAÇÃO DO GOOGLE)
// =============================================================================
export const metadata = {
  title: 'GogoSugoi - Watch Anime Online',
  description: 'Your number one source for watching anime online, free and in high quality.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // <<< SUA VERIFICAÇÃO FOI ADICIONADA AQUI >>>
  verification: {
    google: 'rsyZyeUXnI9FwV4mMCULSq5UWqT0aaIzdGvyYF8q1Dk',
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

        {/* Componente de Analytics da Vercel */}
        <Analytics />
        
      </body>
    </html>
  )
}
