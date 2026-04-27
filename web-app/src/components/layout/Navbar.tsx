'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUp, MessageCircle, ChevronDown } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';
import { mainNav, socialLinks, contactInfo } from '@/data/navigationData';
import { getWhatsAppUrl } from '@/data/rentalData';

// Shared contact message
const CONTACT_MSG = (name: string) =>
  `Olá ${name}! Gostaria de saber mais sobre os vossos serviços.`;

// ─── Desktop Contact Button ─────────────────────────────────────────────────
function ContactButton({
  showOptions,
  onToggle,
  onClose,
}: {
  showOptions: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showOptions) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showOptions, onClose]);

  return (
    <div ref={ref} className="relative">
      {/* Main Button */}
      <motion.button
        onClick={onToggle}
        className="relative flex items-center gap-2 h-10 px-5 rounded-full bg-[var(--color-accent)] text-black text-sm font-bold cursor-pointer overflow-hidden"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <span>Contactar</span>
        <motion.span
          animate={{ rotate: showOptions ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown size={15} strokeWidth={2.5} />
        </motion.span>

        {/* Hover shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
          initial={{ x: '-150%' }}
          whileHover={{ x: '150%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-full mt-3 w-60 bg-black/95 border border-white/10 rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(255,16,240,0.08)]"
          >
            <div className="p-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 px-3 pt-2.5 pb-2 font-medium">
                Falar via WhatsApp
              </p>
              {contactInfo.whatsapp.map((contact, i) => (
                <motion.a
                  key={contact.name}
                  href={getWhatsAppUrl(contact.number, CONTACT_MSG(contact.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.2 }}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
                    <MessageCircle size={15} className="text-[var(--color-accent)]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold block leading-tight">
                      {contact.name}
                    </span>
                    <span className="text-[11px] text-white/35 leading-tight">
                      {contact.display}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Navbar ────────────────────────────────────────────────────────────
export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const lenis = useLenis();

  // Scroll detection — throttled with RAF
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 100);
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowContactOptions(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setShowContactOptions(false);
  }, []);

  const scrollToTop = useCallback(() => {
    closeMobileMenu();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [closeMobileMenu, lenis]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled
            ? 'bg-transparent md:bg-black/90 md:backdrop-blur-sm md:border-b md:border-white/5'
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
              {mainNav.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive(item.href)
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

            {/* Desktop: Back to Top + Contact */}
            <div className="hidden md:flex items-center gap-3">
              <AnimatePresence>
                {isScrolled && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    onClick={scrollToTop}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors duration-300 text-xs font-medium"
                    aria-label="Voltar ao topo"
                  >
                    <ArrowUp size={14} />
                    Topo
                  </motion.button>
                )}
              </AnimatePresence>

              <ContactButton
                showOptions={showContactOptions}
                onToggle={() => setShowContactOptions(prev => !prev)}
                onClose={() => setShowContactOptions(false)}
              />
            </div>

            {/* Mobile: Back to Top + Hamburger */}
            <div className="md:hidden flex items-center gap-2 relative z-[70]">
              <AnimatePresence>
                {isScrolled && !isMobileMenuOpen && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={scrollToTop}
                    className="p-2 rounded-full border border-white/15 text-white/60 active:text-white active:border-white/40 transition-colors"
                    aria-label="Voltar ao topo"
                  >
                    <ArrowUp size={18} />
                  </motion.button>
                )}
              </AnimatePresence>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white"
                aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black flex flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button inside overlay (Enhanced visibility) */}
            <button
              onClick={closeMobileMenu}
              className="absolute top-6 right-4 p-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 hover:scale-105 transition-all z-50 shadow-lg"
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>

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
                    className={`text-3xl font-bold transition-colors duration-300 ${
                      isActive(item.href)
                        ? 'text-[var(--color-accent)]'
                        : 'text-white hover:text-[var(--color-accent)]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Contact */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: mainNav.length * 0.06, duration: 0.4 }}
                className="mt-4 flex flex-col items-center gap-3"
              >
                <AnimatePresence mode="wait">
                  {!showContactOptions ? (
                    <motion.button
                      key="cta"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => setShowContactOptions(true)}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--color-accent)] text-black font-bold text-base"
                    >
                      Contactar
                      <ChevronDown size={16} strokeWidth={2.5} />
                    </motion.button>
                  ) : (
                    <motion.div
                      key="options"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="flex flex-col items-center gap-3"
                    >
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-medium mb-1">
                        Falar via WhatsApp
                      </p>
                      {contactInfo.whatsapp.map((contact, i) => (
                        <motion.a
                          key={contact.name}
                          href={getWhatsAppUrl(contact.number, CONTACT_MSG(contact.name))}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={closeMobileMenu}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08, duration: 0.3 }}
                          className="flex items-center gap-3 w-64 px-5 py-3.5 bg-white/[0.04] border border-white/10 rounded-2xl text-white hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/5 transition-all"
                        >
                          <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
                            <MessageCircle size={17} className="text-[var(--color-accent)]" />
                          </div>
                          <div>
                            <span className="font-semibold block leading-tight">
                              {contact.name}
                            </span>
                            <span className="text-xs text-white/35">
                              {contact.display}
                            </span>
                          </div>
                        </motion.a>
                      ))}
                      <button
                        onClick={() => setShowContactOptions(false)}
                        className="text-sm text-white/25 hover:text-white/50 transition-colors mt-2"
                      >
                        Cancelar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </nav>

            {/* Explicit Close Menu Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: (mainNav.length + 1) * 0.06, duration: 0.4 }}
              className="mt-6 mb-2"
            >
              <button
                onClick={closeMobileMenu}
                className="px-8 py-3 rounded-full border border-white/20 text-white/70 text-sm font-medium hover:text-white hover:bg-white/10 transition-colors"
              >
                Sair do Menu
              </button>
            </motion.div>

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
