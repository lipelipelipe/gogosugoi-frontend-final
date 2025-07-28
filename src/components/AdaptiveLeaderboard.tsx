// src/components/AdaptiveLeaderboard.tsx (COMPLETO E FINAL)
'use client'; // Este componente precisa ser um Client Component para detectar o tamanho da tela.

import { useState, useEffect } from 'react';
import AdSlot from './AdSlot'; // Usa nosso renderizador de anúncios seguro

// A interface define as "munições" que este componente recebe.
interface AdaptiveLeaderboardProps {
  // O script do banner maior, para desktop (728x90).
  desktopScript: string | null | undefined;
  // O script do banner menor, para mobile (320x50).
  mobileScript: string | null | undefined;
}

/**
 * Hook customizado para detectar a largura da janela do navegador.
 * Isso nos permite reagir a mudanças de tamanho da tela, como virar um tablet.
 */
const useWindowWidth = () => {
  // State para armazenar a largura da janela. Começa como 0 no servidor.
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Esta função atualiza o state com a largura atual da janela.
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Apenas execute este código no lado do cliente.
    if (typeof window !== 'undefined') {
      // Define a largura inicial assim que o componente é montado no navegador.
      handleResize();
      // Adiciona um "ouvinte" que chama `handleResize` sempre que a janela muda de tamanho.
      window.addEventListener('resize', handleResize);
    }

    // Função de limpeza: remove o "ouvinte" quando o componente é desmontado
    // para evitar vazamentos de memória.
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []); // O array vazio [] garante que isso só rode uma vez na montagem.

  return windowWidth;
};


/**
 * AdaptiveLeaderboard: O Banner Adaptativo Inteligente.
 * 
 * Este componente executa a estratégia da "Vitrine Adaptativa". Sua missão é
 * analisar o ambiente (o tamanho da tela do usuário) e decidir qual "arma"
 * (banner) é a mais apropriada para a situação: o leaderboard de desktop ou
 * o leaderboard de mobile.
 */
export default function AdaptiveLeaderboard({ desktopScript, mobileScript }: AdaptiveLeaderboardProps) {
  // Usa nosso hook customizado para obter a largura da tela em tempo real.
  const width = useWindowWidth();

  // Define o ponto de quebra. Telas maiores que 768px são consideradas "desktop".
  const isDesktop = width >= 768;

  // Se o componente ainda está renderizando no servidor, a largura será 0.
  // Neste caso, não renderizamos nada para evitar um "flash" de conteúdo incorreto.
  // O anúncio só aparecerá quando o componente for montado no cliente.
  if (width === 0) {
    return null;
  }
  
  // =========================================================================
  // >> LÓGICA DE DECISÃO ESTRATÉGICA <<
  // =========================================================================

  // 1. Cenário Desktop: Se a tela for larga E o script de desktop existir...
  if (isDesktop && desktopScript) {
    return (
      <div className="flex justify-center items-center w-full h-[90px] bg-gray-900/50">
        <AdSlot script={desktopScript} />
      </div>
    );
  }

  // 2. Cenário Mobile: Se a tela for estreita E o script de mobile existir...
  if (!isDesktop && mobileScript) {
    return (
      <div className="flex justify-center items-center w-full h-[50px] bg-gray-900/50">
        <AdSlot script={mobileScript} />
      </div>
    );
  }

  // 3. Cenário de Fallback (Segurança): Se a tela for larga, mas só tivermos o script de mobile...
  if (isDesktop && mobileScript) {
    // É melhor mostrar o anúncio de mobile do que não mostrar nada.
    return (
      <div className="flex justify-center items-center w-full h-[50px] bg-gray-900/50">
        <AdSlot script={mobileScript} />
      </div>
    );
  }

  // 4. Se nenhuma das condições acima for atendida (nenhum script válido para a situação),
  // não renderize nada.
  return null;
}