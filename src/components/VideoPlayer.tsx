// src/components/VideoPlayer.tsx
'use client';

import { useState } from 'react';
import type { Episode } from '@/lib/api';

interface VideoPlayerProps {
  episode: Episode;
  initialServerUrl: string | null;
}

export default function VideoPlayer({ episode, initialServerUrl }: VideoPlayerProps) {
  const [currentEmbedCode, setCurrentEmbedCode] = useState(initialServerUrl);

  if (!episode || episode.servers.length === 0) {
    return (
      <div className="aspect-video w-full bg-black flex items-center justify-center rounded-md">
        <p className="text-red-500">Video source not found for this episode.</p>
      </div>
    );
  }

  return (
    <div>
      {/* O Player de Vídeo HTML5 agora renderiza o código do iframe */}
      <div 
        className="aspect-video w-full bg-black rounded-md overflow-hidden"
        // Esta é a mágica! Ele pega a string do iframe e a transforma em HTML real.
        dangerouslySetInnerHTML={{ __html: currentEmbedCode || '' }}
      />

      {/* Seleção de Servidores - Estilo Crunchyroll */}
      {episode.servers.length > 1 && (
        <div className="mt-4 rounded-md bg-gray-800 p-4">
          <h3 className="text-sm font-bold mb-3 text-gray-300 uppercase tracking-wider">Servers</h3>
          <div className="flex flex-wrap gap-2">
            {episode.servers.map((server) => (
              <button
                key={server.name}
                onClick={() => setCurrentEmbedCode(server.url)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                  currentEmbedCode === server.url
                    ? 'bg-orange-500 text-black'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                {server.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}