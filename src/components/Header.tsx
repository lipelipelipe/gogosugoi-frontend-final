'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/new', label: 'New' },
  { href: '/series', label: 'TV Series' },
  { href: '/movies', label: 'Movies' },
];

const Logo = () => (
  <Link href="/" className="flex items-center group">
    <div className="relative mr-2">
      <div className="absolute inset-0 bg-orange-500/30 rounded-md blur-sm group-hover:blur transition-all duration-300"></div>
      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-orange-500 to-yellow-500 border border-orange-500/30 flex items-center justify-center relative shadow-lg shadow-orange-500/20">
        <div className="absolute inset-[3px] bg-[#101010] rounded-[4px] flex items-center justify-center overflow-hidden">
          <div className="font-bold text-lg font-heading bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            GS
          </div>
        </div>
      </div>
    </div>
    <div className="text-xl font-medium font-heading bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
      GogoSugoi
    </div>
  </Link>
);

// --- 1. DEFINIÇÃO DE TIPO PARA O BOTÃO ---
interface MobileMenuButtonProps {
    isOpen: boolean;
    toggle: () => void;
}

// --- 2. APLICANDO O TIPO AO SUB-COMPONENTE ---
const MobileMenuButton = ({ isOpen, toggle }: MobileMenuButtonProps) => (
    <motion.button
        onClick={toggle}
        className="relative w-10 h-10 z-[100] focus:outline-none"
        aria-label="Toggle menu"
        animate={isOpen ? "open" : "closed"}
    >
        <motion.span
            className="absolute h-0.5 w-6 bg-white"
            style={{ left: '50%', top: '35%', x: '-50%', y: '-50%' }}
            variants={{ open: { rotate: 45, y: 5 }, closed: { rotate: 0, y: 0 } }}
        />
        <motion.span
            className="absolute h-0.5 w-6 bg-white"
            style={{ left: '50%', top: '50%', x: '-50%', y: '-50%' }}
            variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
        />
        <motion.span
            className="absolute h-0.5 w-6 bg-white"
            style={{ left: '50%', top: '65%', x: '-50%', y: '-50%' }}
            variants={{ open: { rotate: -45, y: -5 }, closed: { rotate: 0, y: 0 } }}
        />
    </motion.button>
);

// --- 3. FAZENDO O MESMO PARA O OVERLAY PARA SER PROATIVO ---
interface MobileMenuOverlayProps {
    isOpen: boolean;
    toggle: () => void;
}

const MobileMenuOverlay = ({ isOpen, toggle }: MobileMenuOverlayProps) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.ul
                    className="flex flex-col items-center gap-8"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={{
                        open: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                        closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                    }}
                >
                    {navLinks.map((link) => (
                        <motion.li
                            key={link.href}
                            variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                        >
                            <Link 
                              href={link.href} 
                              onClick={toggle}
                              className="text-3xl font-semibold text-gray-200 hover:text-orange-500 transition-colors"
                            >
                                {link.label}
                            </Link>
                        </motion.li>
                    ))}
                     {/* --- BOTÃO DE LOGIN DO MENU MÓVEL OCULTADO --- */}
                     {/*
                     <motion.li
                        variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                        className="pt-8"
                      >
                         <Link href="/login" onClick={toggle} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-black font-bold text-lg relative z-10 hover:scale-105 transition-transform">
                             Login
                         </Link>
                     </motion.li>
                     */}
                </motion.ul>
            </motion.div>
        )}
    </AnimatePresence>
);


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
      const handleResize = () => { if (window.innerWidth >= 768) setIsMobileMenuOpen(false); };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
      document.body.style.overflow = isMobileMenuOpen || isSearchOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen, isSearchOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const activeLink = navLinks.find(link => link.href === pathname)?.href || '';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[99] transition-colors duration-300 ${scrolled ? 'bg-black/50 shadow-lg backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="hidden md:flex items-center justify-center">
                <ul className="flex items-center space-x-2 bg-[#23252b] border border-[#3f4148] rounded-full p-1" onMouseLeave={() => setHoveredLink('')}>
                    {navLinks.map(link => (
                      <li key={link.href} className="relative" onMouseEnter={() => setHoveredLink(link.href)}>
                        <Link href={link.href} className={`px-4 py-2 text-sm rounded-full transition-colors z-10 relative ${(hoveredLink === link.href || (!hoveredLink && activeLink === link.href)) ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
                          {link.label}
                        </Link>
                        {(hoveredLink === link.href || (!hoveredLink && activeLink === link.href)) && (
                            <motion.div className="absolute inset-0 bg-[#3f4148] rounded-full" layoutId="magic-line" transition={{ type: 'spring', stiffness: 300, damping: 30 }}/>
                        )}
                      </li>
                    ))}
                </ul>
            </div>
            <div className="hidden md:flex items-center gap-2">
               <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Open search">
                 <Search size={20}/>
               </button>
               {/* --- BOTÃO DE LOGIN DO DESKTOP OCULTADO --- */}
               {/*
               <Link href="/login" className="relative inline-block group">
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                 <span className="relative px-5 py-2.5 bg-black rounded-lg text-white text-sm font-semibold">
                   Login
                 </span>
               </Link>
               */}
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-300 hover:text-white" aria-label="Open search">
                 <Search size={24}/>
               </button>
              <MobileMenuButton isOpen={isMobileMenuOpen} toggle={toggleMobileMenu} />
            </div>
          </div>
        </div>
      </nav>
      <MobileMenuOverlay isOpen={isMobileMenuOpen} toggle={toggleMobileMenu} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}