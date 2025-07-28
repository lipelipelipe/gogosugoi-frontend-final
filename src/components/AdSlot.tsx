// src/components/AdSlot.tsx (COMPLETO E FINAL)
'use client'; // Este componente precisa ser um Client Component para manipular o DOM com useEffect.

import { useEffect, useRef } from 'react';

// A interface define as "munições" que nosso componente pode receber.
interface AdSlotProps {
  // O script do anúncio, vindo diretamente do nosso Arsenal no WordPress.
  script: string | null | undefined;
  // Uma classe CSS opcional para estilizar o contêiner do anúncio, se necessário.
  className?: string;
}

/**
 * AdSlot: O Renderizador de Anúncios Universal e Seguro.
 * 
 * Esta é a ferramenta de linha de frente para exibir nossos anúncios. Sua missão é simples e crítica:
 * 1. Receber um pedaço de texto (o script do anúncio).
 * 2. Criar um contêiner `div` seguro para ele.
 * 3. Injetar o script dentro desse contêiner no navegador do usuário, de forma que ele seja executado.
 *
 * O uso de `dangerouslySetInnerHTML` é evitado aqui. Em vez disso, manipulamos o DOM
 * diretamente com `useEffect` e `useRef`, que é uma abordagem mais controlada e segura no React
 * para lidar com scripts de terceiros.
 */
export default function AdSlot({ script, className }: AdSlotProps) {
  // `useRef` cria uma referência direta ao elemento `div` no DOM,
  // nos permitindo manipulá-lo sem causar re-renderizações desnecessárias.
  const adRef = useRef<HTMLDivElement>(null);

  // `useEffect` é o nosso "gatilho". Ele dispara o código de injeção
  // APENAS no lado do cliente (no navegador), depois que o componente foi montado.
  useEffect(() => {
    // Condição de segurança: só prosseguir se a referência ao `div` existir e se houver um script para injetar.
    if (adRef.current && script) {
      
      // Limpa o contêiner de qualquer conteúdo anterior. Isso é crucial
      // para evitar duplicatas em Single Page Applications (SPAs) como o Next.js.
      adRef.current.innerHTML = '';
      
      // A MÁGICA: `createContextualFragment` transforma a string do script
      // em nós de DOM reais que podem ser anexados à página.
      const scriptFragment = document.createRange().createContextualFragment(script);
      
      // Anexa o fragmento do script ao nosso contêiner `div`. O navegador
      // então reconhecerá a tag <script> e a executará.
      adRef.current.appendChild(scriptFragment);
    }
  }, [script]); // O array de dependências [script] garante que este efeito só
                 // será re-executado se a prop `script` mudar.

  // Condição de renderização: Se não houver script, não renderize nada.
  // Isso evita criar `divs` vazias e inúteis na página.
  if (!script) {
    return null;
  }

  // Retorna o contêiner `div` que servirá como o "slot" para o nosso anúncio.
  // A referência `adRef` o conecta à nossa lógica no `useEffect`.
  return <div ref={adRef} className={className} />;
}