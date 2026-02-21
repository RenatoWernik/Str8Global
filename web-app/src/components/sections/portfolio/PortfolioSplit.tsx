'use client';

import { useRef, useState, useCallback } from 'react';
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from 'framer-motion';
import Image from 'next/image';
import { Heart, X, RotateCcw, Camera, Instagram, ArrowRight } from 'lucide-react';

/* ─── Data ─── */

interface PhotographerData {
  name: string;
  role: string;
  description: string;
  specialties: string[];
  profileImage: string;
  portfolio: string[];
  accent: string;
  instagram?: string;
}

const photographers: [PhotographerData, PhotographerData] = [
  {
    name: 'Igor',
    role: 'Fotógrafo & Diretor Criativo',
    description:
      'Especialista em fotografia documental e retratos autênticos. Capta a essência de cada momento com um olhar cinematográfico.',
    specialties: ['Retratos', 'Documental', 'Lifestyle', 'Eventos'],
    profileImage: '/images/team/igor.png',
    portfolio: Array.from({ length: 10 }, (_, i) =>
      `/images/portfolio/igor/${String(i + 1).padStart(2, '0')}.jpg`
    ),
    accent: '#FF10F0',
    instagram: '#',
  },
  {
    name: 'Marta',
    role: 'Fotógrafa & Diretora de Arte',
    description:
      'Mestre em fotografia de moda e beleza. Cria composições elegantes que elevam cada projeto a um nível único.',
    specialties: ['Moda', 'Beleza', 'Editorial', 'Branding'],
    profileImage: '/images/team/marta.png',
    portfolio: Array.from({ length: 10 }, (_, i) =>
      `/images/portfolio/marta/${String(i + 1).padStart(2, '0')}.jpg`
    ),
    accent: '#FF10F0',
    instagram: '#',
  },
];

/* ─── Tinder Card ─── */

function TinderCard({
  src,
  onSwipe,
  isTop,
}: {
  src: string;
  onSwipe: (dir: 'left' | 'right') => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  if (!isTop) {
    return (
      <motion.div className="absolute inset-0 rounded-2xl overflow-hidden">
        <Image
          src={src}
          alt="Portfólio"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 90vw, 45vw"
        />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing touch-none"
      style={{ x, rotate, zIndex: 10 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Image
        src={src}
        alt="Portfólio"
        fill
        className="object-cover pointer-events-none"
        sizes="(max-width: 768px) 90vw, 45vw"
        priority
      />

      {/* Gradient bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* LIKE stamp */}
      <motion.div
        className="absolute top-8 left-6 z-20 border-4 border-green-400 rounded-lg px-4 py-2 rotate-[-15deg] pointer-events-none"
        style={{ opacity: likeOpacity }}
      >
        <span className="text-green-400 font-black text-3xl tracking-wider">
          LIKE
        </span>
      </motion.div>

      {/* NOPE stamp */}
      <motion.div
        className="absolute top-8 right-6 z-20 border-4 border-red-500 rounded-lg px-4 py-2 rotate-[15deg] pointer-events-none"
        style={{ opacity: nopeOpacity }}
      >
        <span className="text-red-500 font-black text-3xl tracking-wider">
          NOPE
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Photographer Tinder Deck ─── */

function PhotographerDeck({
  data,
  side,
  index,
}: {
  data: PhotographerData;
  side: 'left' | 'right';
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const allImages = [data.profileImage, ...data.portfolio];
  const total = allImages.length;
  const isFinished = currentIndex >= total;

  const handleSwipe = useCallback(
    (dir: 'left' | 'right') => {
      setDirection(dir);
      if (dir === 'right') {
        setLiked((prev) => [...prev, currentIndex]);
      }
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex]
  );

  const handleReset = () => {
    setCurrentIndex(0);
    setLiked([]);
    setDirection(null);
  };

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col"
      initial={{ opacity: 0, x: side === 'left' ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header — name + role */}
      <motion.div
        className="mb-4 flex items-center gap-3"
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 + index * 0.15 }}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-accent)] flex-shrink-0">
          <Image
            src={data.profileImage}
            alt={data.name}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">{data.name}</h3>
          <p className="text-[var(--color-accent)] text-xs uppercase tracking-wider">
            {data.role}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {data.instagram && (
            <a
              href={data.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[var(--color-accent)] transition-colors"
            >
              <Instagram size={16} />
            </a>
          )}
          <div className="text-white/30 text-xs font-mono">
            {Math.min(currentIndex + 1, total)}/{total}
          </div>
        </div>
      </motion.div>

      {/* Progress dots */}
      <div className="flex gap-1 mb-3">
        {allImages.map((_, i) => (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-full transition-colors duration-300"
            style={{
              backgroundColor:
                i < currentIndex
                  ? liked.includes(i)
                    ? '#FF10F0'
                    : 'rgba(255,255,255,0.3)'
                  : i === currentIndex
                    ? 'rgba(255,255,255,0.8)'
                    : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>

      {/* Card Stack */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
        <AnimatePresence mode="popLayout">
          {!isFinished ? (
            <>
              {/* Next card (behind) */}
              {currentIndex + 1 < total && (
                <TinderCard
                  key={`bg-${currentIndex + 1}`}
                  src={allImages[currentIndex + 1]}
                  onSwipe={() => { }}
                  isTop={false}
                />
              )}
              {/* Current card (top, draggable) */}
              <TinderCard
                key={`card-${currentIndex}`}
                src={allImages[currentIndex]}
                onSwipe={handleSwipe}
                isTop={true}
              />
            </>
          ) : (
            /* Finished state */
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <Camera size={48} className="text-[var(--color-accent)] mb-4" />
              </motion.div>
              <h4 className="text-white text-xl font-bold mb-2">
                Viste tudo!
              </h4>
              <p className="text-white/50 text-sm mb-1">
                Gostaste de{' '}
                <span className="text-[var(--color-accent)] font-bold">
                  {liked.length}
                </span>{' '}
                de {total} fotos
              </p>
              <p className="text-white/30 text-xs mb-6">
                do portfólio de {data.name}
              </p>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 transition-colors"
              >
                <RotateCcw size={14} />
                Ver novamente
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      {!isFinished && (
        <motion.div
          className="flex items-center justify-center gap-4 mt-5"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 + index * 0.15 }}
        >
          {/* X button */}
          <motion.button
            onClick={() => handleSwipe('left')}
            className="group relative w-14 h-14 rounded-full border-2 border-red-500/40 flex items-center justify-center bg-black hover:border-red-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X
              size={24}
              className="text-red-500/70 group-hover:text-red-500 transition-colors"
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </motion.button>

          {/* Heart button */}
          <motion.button
            onClick={() => handleSwipe('right')}
            className="group relative w-16 h-16 rounded-full border-2 border-[var(--color-accent)]/40 flex items-center justify-center bg-black hover:border-[var(--color-accent)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              size={28}
              className="text-[var(--color-accent)]/70 group-hover:text-[var(--color-accent)] transition-colors"
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-[var(--color-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </motion.button>

          {/* Reset button (small) */}
          <motion.button
            onClick={handleReset}
            className="group w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black hover:border-white/30 transition-colors"
            whileHover={{ scale: 1.1, rotate: -180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <RotateCcw
              size={14}
              className="text-white/30 group-hover:text-white/60 transition-colors"
            />
          </motion.button>
        </motion.div>
      )}

      {/* Specialties below */}
      <motion.div
        className="flex flex-wrap gap-2 mt-5"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 + index * 0.15 }}
      >
        {data.specialties.map((spec) => (
          <span
            key={spec}
            className="px-3 py-1 text-xs font-medium rounded-full border border-white/10 text-white/50 bg-white/[0.02]"
          >
            {spec}
          </span>
        ))}
      </motion.div>

      {/* Description */}
      <p className="text-white/40 text-sm mt-4 leading-relaxed">
        {data.description}
      </p>
    </motion.div>
  );
}

/* ─── Main Section ─── */

export function PortfolioSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-20 md:py-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Center divider glow — desktop only */}
        <motion.div
          className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={isInView ? { opacity: 1, scaleY: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, var(--color-accent) 20%, var(--color-accent) 80%, transparent 100%)',
            boxShadow:
              '0 0 20px var(--color-accent), 0 0 60px rgba(255,16,240,0.3)',
          }}
        />
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-accent)] rounded-full blur-[300px] opacity-[0.04]" />
      </div>

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] block mb-4">
            Dois Olhares
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            Dois Olhares.{' '}
            <span className="text-[var(--color-accent)]">
              Zero
            </span>{' '}Limites.
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-md mx-auto">
            Desliza ou usa os botões para explorar o portfólio de cada fotógrafo. Spoiler: vais querer os dois.
          </p>
        </motion.div>
      </div>

      {/* Split Tinder Decks */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14">
          <PhotographerDeck data={photographers[0]} side="left" index={0} />
          <PhotographerDeck data={photographers[1]} side="right" index={1} />
        </div>
      </div>

      {/* VS badge — desktop only */}
      <motion.div
        className="hidden md:flex absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-black border-2 border-[var(--color-accent)] flex items-center justify-center shadow-[0_0_30px_rgba(255,16,240,0.4)]">
            <span className="text-[var(--color-accent)] font-bold text-sm tracking-wider">
              VS
            </span>
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border border-[var(--color-accent)]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}

export default PortfolioSplit;
