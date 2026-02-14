'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { mainNav, socialLinks } from '@/data/navigationData';

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled
            ? 'bg-black/80 backdrop-blur-lg border-b border-white/5'
            : 'bg-transparent'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="relative z-10 text-xl font-bold tracking-tight text-white hover:text-[var(--color-accent)] transition-colors duration-300"
            >
              Str8Global
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {mainNav.filter(item => item.id !== 'home').map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors duration-300 ${isActive(item.href)
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                    }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--color-accent)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <Link
              href="/#contacto"
              className="hidden md:inline-flex items-center px-6 py-2.5 bg-[var(--color-accent)] text-black text-sm font-bold rounded-full hover:bg-[var(--color-accent-hover)] transition-colors duration-300"
            >
              Contactar
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative z-[70] p-2 text-white"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Nav Links */}
            <nav className="flex flex-col items-center gap-6">
              {mainNav.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`text-3xl font-bold transition-colors duration-300 ${isActive(item.href)
                        ? 'text-[var(--color-accent)]'
                        : 'text-white hover:text-[var(--color-accent)]'
                      }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: mainNav.length * 0.06, duration: 0.4 }}
                className="mt-4"
              >
                <Link
                  href="/#contacto"
                  onClick={closeMobileMenu}
                  className="inline-flex items-center px-8 py-3 bg-[var(--color-accent)] text-black font-bold rounded-full hover:bg-[var(--color-accent-hover)] transition-colors"
                >
                  Contactar
                </Link>
              </motion.div>
            </nav>

            {/* Social Links */}
            <motion.div
              className="absolute bottom-12 flex gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {socialLinks
                .filter(s => ['instagram', 'linkedin', 'behance', 'vimeo'].includes(s.id))
                .map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/40 hover:text-[var(--color-accent)] transition-colors"
                  >
                    {social.label}
                  </a>
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
