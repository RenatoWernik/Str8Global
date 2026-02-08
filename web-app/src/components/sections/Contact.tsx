'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

export function Contact() {
    return (
        <footer className="relative bg-black pt-32 pb-12 px-6 overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--color-accent)] rounded-full blur-[200px] opacity-10" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
                        Let&apos;s Create
                        <br />
                        <span className="text-[var(--color-accent)]">Together</span>
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.05, gap: '1rem' }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--color-accent)] text-black font-bold text-lg rounded-full hover:bg-[var(--color-accent-hover)] transition-colors"
                    >
                        Start a Project
                        <ArrowRight size={20} />
                    </motion.button>
                </motion.div>

                {/* Contact Grid */}
                <div className="grid md:grid-cols-3 gap-12 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                            <Mail size={20} className="text-[var(--color-accent)]" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Email Us</h3>
                            <a href="mailto:hello@str8global.com" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">
                                hello@str8global.com
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                            <Phone size={20} className="text-[var(--color-accent)]" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Call Us</h3>
                            <a href="tel:+351912345678" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">
                                +351 912 345 678
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-start gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                            <MapPin size={20} className="text-[var(--color-accent)]" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Visit Us</h3>
                            <span className="text-white/60">
                                Porto, Portugal
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
                    <div>© 2024 Str8Global. All rights reserved.</div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">Behance</a>
                        <a href="#" className="hover:text-white transition-colors">Vimeo</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Contact;
