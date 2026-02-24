'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { siteCopy } from '@/data/mockData';
import { ctaCopy } from '@/data/ctaData';
import { CTASection } from '@/components/sections/CTASection';

export function Contact() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <>
            {/* White CTA Section */}
            <CTASection
                badge={ctaCopy.home.badge}
                headline={ctaCopy.home.headline}
                subtitle={ctaCopy.home.subtitle}
                buttonText={ctaCopy.home.buttonText}
                buttonHref={ctaCopy.home.buttonHref}
            />

            {/* Contact cards + footer — dark background */}
            <footer ref={sectionRef} className="relative bg-black pt-16 md:pt-24 pb-12 px-6 overflow-hidden">

                <div className="max-w-7xl mx-auto relative z-10">

                    {/* Contact cards — glassmorphism */}
                    <div className="grid md:grid-cols-3 gap-6 mb-20">
                        {/* Email */}
                        <motion.a
                            href="mailto:str8global.co@gmail.com"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            whileHover={{ y: -6, borderColor: 'rgba(255,16,240,0.3)' }}
                            className="group relative p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10  overflow-hidden transition-colors duration-500 block"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--color-accent)]/20 transition-colors duration-300">
                                    <Mail size={20} className="text-[var(--color-accent)]" />
                                </div>
                                <h3 className="font-bold text-white/90 mb-1 text-lg">Email</h3>
                                <span className="text-white/50 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                                    str8global.co@gmail.com
                                </span>
                            </div>
                        </motion.a>

                        {/* Telefones */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="group relative p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10  overflow-hidden hover:border-[var(--color-accent)]/30 transition-all duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--color-accent)]/20 transition-colors duration-300">
                                    <Phone size={20} className="text-[var(--color-accent)]" />
                                </div>
                                <h3 className="font-bold text-white/90 mb-3 text-lg">Telefone</h3>
                                <div className="space-y-2">
                                    <a href="tel:+351966128922" className="flex items-center gap-2 text-white/50 hover:text-[var(--color-accent)] transition-colors duration-300">
                                        <span className="text-white/30 text-xs font-medium uppercase tracking-wider w-12">Igor</span>
                                        <span>+351 966 128 922</span>
                                    </a>
                                    <a href="tel:+351933029438" className="flex items-center gap-2 text-white/50 hover:text-[var(--color-accent)] transition-colors duration-300">
                                        <span className="text-white/30 text-xs font-medium uppercase tracking-wider w-12">Marta</span>
                                        <span>+351 933 029 438</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Localização */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="group relative p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10  overflow-hidden hover:border-[var(--color-accent)]/30 transition-all duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--color-accent)]/20 transition-colors duration-300">
                                    <MapPin size={20} className="text-[var(--color-accent)]" />
                                </div>
                                <h3 className="font-bold text-white/90 mb-1 text-lg">Localização</h3>
                                <span className="text-white/60">Estrada das Ligeiras, Lote 2</span>
                                <p className="text-white/50 text-sm mt-1">
                                    2735-337 Agualva-Cacém
                                </p>
                                <p className="text-white/40 text-xs mt-2">
                                    A servir Lisboa, Cascais e Grande Lisboa
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
                        <div>&copy; {new Date().getFullYear()} Str8Global. Todos os direitos reservados.</div>
                        <div className="flex gap-8">
                            {siteCopy.social.map((platform) => (
                                <a key={platform} href="#" className="hover:text-[var(--color-accent)] transition-colors duration-300">
                                    {platform}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Contact;
