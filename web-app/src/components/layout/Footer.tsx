'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { mainNav, socialLinks, contactInfo } from '@/data/navigationData';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black pt-20 pb-8 px-6 md:px-8 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-40" />

      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16"
        >
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold text-white hover:text-[var(--color-accent)] transition-colors">
              Str8Global
            </Link>
            <p className="mt-3 text-sm text-white/50 leading-relaxed">
              Agência de Marketing & Fotografia Premium. Criamos conteúdo que converte — de estratégia a execução.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-4">
              Navegação
            </h4>
            <nav className="flex flex-col gap-2.5">
              {mainNav.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-4">
              Social
            </h4>
            <div className="flex flex-col gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-[var(--color-accent)] transition-colors duration-300"
                >
                  {social.label}
                  {social.handle && (
                    <span className="ml-2 text-white/30">{social.handle}</span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-4">
              Contacto
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Mail size={14} className="text-[var(--color-accent)]" />
                {contactInfo.email}
              </a>

              {contactInfo.whatsapp.map((wa) => (
                <a
                  key={wa.name}
                  href={`https://wa.me/${wa.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <MessageCircle size={14} className="text-[var(--color-accent)]" />
                  {wa.name} — {wa.display}
                </a>
              ))}

              <div className="flex items-center gap-2.5 text-sm text-white/60">
                <MapPin size={14} className="text-[var(--color-accent)]" />
                {contactInfo.location}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {currentYear} Str8Global. Todos os direitos reservados.
          </p>
          <p className="text-xs text-white/20">
            Lisboa, Portugal
          </p>
        </div>
      </div>
    </footer>
  );
}
