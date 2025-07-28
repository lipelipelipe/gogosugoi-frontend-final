// src/components/AdLoadingOverlay.tsx

'use client';

import { useState, useEffect } from 'react';
import AdSlot from './AdSlot';
import React from 'react'; // Importamos 'React' para usar React.ReactNode

interface AdLoadingOverlayProps {
  adScript: string | null;
  duration: number;
  children: React.ReactNode; // React.ReactNode é o tipo correto para a prop 'children'
}

/**
 * AdLoadingOverlay: A "Sala de Espera Monetizada".
 *
 * Este componente de cliente intercepta a renderização de seu 'children' (neste caso, o VideoPlayer)
 * para exibir um anúncio por uma duração controlada.
 *
 * @param {AdLoadingOverlayProps} props As propriedades do componente.
 * @param {string | null} props.adScript O código do script do anúncio a ser exibido.
 * @param {number} props.duration O tempo em segundos para exibir o anúncio.
 * @param {React.ReactNode} props.children O componente filho a ser renderizado após a contagem regressiva.
 * @returns {JSX.Element | React.ReactNode} O overlay do anúncio ou o componente filho.
 */
export default function AdLoadingOverlay({ adScript, duration, children }: AdLoadingOverlayProps) {
  const [showAd, setShowAd] = useState(true);
  const [countdown, setCountdown] = useState(duration);

  useEffect(() => {
    if (!adScript) {
      setShowAd(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          setShowAd(false);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [adScript, duration]);

  if (showAd && adScript) {
    return (
      <div className="relative aspect-video w-full bg-black flex flex-col items-center justify-center rounded-md p-4">
        <div className="w-[300px] h-[250px] bg-gray-900/50 flex items-center justify-center mb-4">
          <AdSlot script={adScript} />
        </div>
        <div className="text-center text-gray-300">
          <p className="font-semibold">Seu episódio começará em...</p>
          <p className="text-4xl font-bold text-orange-500 mt-2">{countdown}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// <-- REFORÇO ADICIONAL: Definimos um nome de exibição para o componente.
// Isso ajuda nas ferramentas de depuração do React e pode satisfazer algumas regras do linter.
AdLoadingOverlay.displayName = 'AdLoadingOverlay';