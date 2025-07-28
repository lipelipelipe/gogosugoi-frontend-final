// src/components/Footer.tsx (VERSÃO MODIFICADA E COMPLETA)

import Link from 'next/link';
// IMPORTAÇÕES ESTRATÉGICAS: Adicionamos getAdPlacements e AdSlot
import { getAdPlacements } from '@/lib/api';
import AdSlot from './AdSlot';

// <-- O COMPONENTE AGORA É async PARA PODER BUSCAR DADOS NO SERVIDOR
const Footer = async () => {
  // <-- BUSCA OS DADOS DO ARSENAL
  const ads = await getAdPlacements();

  return (
    <footer className="bg-[#101010] text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-8 py-8">
        
        {/* <-- PONTO DE INSERÇÃO ESTRATÉGICA DO BANNER DE RODAPÉ --> */}
        {ads?.script_banner_footer && (
          <div className="mb-8 flex justify-center">
            <AdSlot script={ads.script_banner_footer} />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-white mb-2">Navigation</h3>
            <ul>
              <li className="mb-1"><Link href="/series" className="hover:text-orange-500 transition-colors">TV Series</Link></li>
              <li className="mb-1"><Link href="/movies" className="hover:text-orange-500 transition-colors">Movies</Link></li>
              <li className="mb-1"><Link href="/new" className="hover:text-orange-500 transition-colors">New</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">Legal</h3>
            <ul>
              <li className="mb-1"><Link href="#" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
              <li className="mb-1"><Link href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">Connect</h3>
            <ul>
              <li className="mb-1"><Link href="#" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
              <li className="mb-1"><Link href="#" className="hover:text-orange-500 transition-colors">Help Center</Link></li>
            </ul>
          </div>
          {/* <-- PONTO DE INSERÇÃO ESTRATÉGICA DO LINK DIRETO --> */}
          {ads?.url_direct_link && (
            <div>
              <h3 className="font-bold text-white mb-2">Support Us</h3>
              <ul>
                <li className="mb-1">
                  <a 
                    href={ads.url_direct_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-bold text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Click Here to Support
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} GogoSugoi. All Rights Reserved.</p>
          <p className="mt-1">This is a fictional website for portfolio purposes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;