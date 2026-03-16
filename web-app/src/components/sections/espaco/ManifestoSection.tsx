'use client';

import { motion } from 'framer-motion';
import { ShinyText } from '@/components/animations/ShinyText';
import { BalancedHeadline } from '@/components/animations/BalancedHeadline';

export function ManifestoSection() {
  return (
    <section className="relative py-24 px-6 border-b border-white/5 bg-black z-20">
      <div className="max-w-4xl mx-auto text-center">
        <BalancedHeadline as="h2" className="text-3xl md:text-5xl font-light text-white/90 leading-tight">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
          >
            Descubra a infraestrutura que transforma as melhores ideias em{' '}
            <ShinyText 
              text="produções de alto nível." 
              disabled={false} 
              speed={3} 
              className="font-normal"
              color="#d4d4d8"
              shineColor="#22d3ee"
            />
          </motion.span>
        </BalancedHeadline>
      </div>
    </section>
  );
}
