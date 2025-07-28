// src/components/GlobalAdScripts.tsx (COMPLETO E FINAL)
'use client'; // Este componente precisa ser um Client Component para interagir com o DOM.

import { useEffect } from 'react';
import type { AdPlacementSettings } from '@/lib/api'; // Importa a nossa interface do Arsenal

// A interface define as "munições" que o componente recebe.
interface GlobalAdScriptsProps {
  // Recebe todas as configurações de anúncios do nosso layout principal.
  adSettings: AdPlacementSettings | null;
}

/**
 * GlobalAdScripts: O Injetor de Scripts Globais Inteligente.
 * 
 * Este componente não renderiza nada visível na tela. Sua única missão é
 * injetar scripts que precisam rodar em todo o site, como Popunders ou
 * Social Bars, diretamente no <body> da página.
 * 
 * Ele contém a lógica de comando e controle para obedecer às suas ordens
 * do dashboard do WordPress.
 */
export default function GlobalAdScripts({ adSettings }: GlobalAdScriptsProps) {

  // useEffect garante que o código só rode no navegador do usuário.
  useEffect(() => {
    // =========================================================================
    // >> LÓGICA DO INTERRUPTOR MESTRE (POPUNDER) <<
    // =========================================================================

    // 1. VERIFICAR A ORDEM: O comandante ativou o Popunder?
    const isPopunderEnabled = adSettings?.ativar_popunder === 'on';
    // 2. VERIFICAR A MUNIÇÃO: O script do Popunder existe?
    const popunderScript = adSettings?.script_popunder;

    // 3. CONDIÇÃO DE EXECUÇÃO: Prosseguir somente se a ordem for "ATIVADO" e a "munição" existir.
    if (isPopunderEnabled && popunderScript) {
      // Para evitar injetar o mesmo script múltiplas vezes em uma sessão,
      // nós damos um ID único a ele e verificamos se ele já existe na página.
      const popunderId = 'gogo-arsenal-popunder-script';
      if (!document.getElementById(popunderId)) {
        
        // Usa a mesma técnica segura do AdSlot para criar o script.
        const scriptFragment = document.createRange().createContextualFragment(popunderScript);
        
        // Precisamos encontrar a tag <script> dentro do fragmento para adicionar o ID.
        const scriptElement = scriptFragment.querySelector('script');
        if (scriptElement) {
          scriptElement.id = popunderId; // Atribui o ID para a verificação futura.
          document.body.appendChild(scriptElement); // Anexa ao final do <body>.
        }
      }
    }

    // Você pode adicionar lógicas para outros scripts globais aqui (ex: Social Bar)
    // seguindo o mesmo padrão de verificação.

  }, [adSettings]); // Este efeito re-executa se as configurações de anúncios mudarem.

  // Este componente é um "agente secreto", ele não renderiza nenhum HTML.
  return null;
}