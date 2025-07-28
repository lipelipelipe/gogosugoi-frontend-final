// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

// Hook customizado que atrasa a atualização de um valor.
// Ele só retorna o valor mais recente depois que um certo tempo se passa sem novas mudanças.
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura um timer para atualizar o valor "atrasado"
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor ou o atraso mudarem (ou se o componente for desmontado)
    // Isso é o que impede a atualização a cada tecla pressionada.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}