'use client';

import { useRef, useState, useCallback, memo } from 'react';
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from 'framer-motion';
import Image from 'next/image';
import { Heart, X, RotateCcw, Camera, Instagram } from 'lucide-react';

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
    role: 'O Mestre da Execução',
    description:
      'O olhar pragmático por trás das câmaras. Capta momentos, resolve desafios e garante que cada sessão acontece sem stress. Objetivo, focado e sempre pronto para tornar as tuas ideias em fotografias que vais postar em todo o lado. Apaixonado por fotografia desportiva, vídeo e operações aéreas com Drone.',
    specialties: ['Desporto', 'Vídeo', 'Drone', 'Documental'],
    profileImage: '/images/portfolio/igor/Capa.jpg',
    portfolio: [
      '/images/portfolio/igor/1.JPG',
      '/images/portfolio/igor/2.JPG',
      '/images/portfolio/igor/3.JPG',
      '/images/portfolio/igor/4.JPG',
      '/images/portfolio/igor/5.JPG',
      '/images/portfolio/igor/6.JPG',
      '/images/portfolio/igor/7.JPG',
      '/images/portfolio/igor/8.JPG',
      '/images/portfolio/igor/9.JPG',
      '/images/portfolio/igor/10.JPG',
      '/images/portfolio/igor/11.JPG',
      '/images/portfolio/igor/12.JPG',
      '/images/portfolio/igor/13.jpg',
    ],
    accent: '#FF10F0',
    instagram: '#',
  },
  {
    name: 'Marta Oliveira',
    role: 'A Mente Criativa',
    description:
      'A mente criativa por trás de cada sessão. Transforma ideias em conteúdos para marcas com pura estratégia, sempre com boa energia e aquele olhar super atento aos detalhes que faz absolutamente toda a diferença. Se isto não é ser imparável, então não sabemos o que é.',
    specialties: ['Estratégia Visual', 'Conteúdo para Marcas', 'Direção de Arte'],
    profileImage: '/images/portfolio/marta/capa.jpg',
    portfolio: [
      '/images/portfolio/marta/1.mp4',
      '/images/portfolio/marta/2.mp4',
      '/images/portfolio/marta/3.mov',
      '/images/portfolio/marta/4.mov',
      '/images/portfolio/marta/5.mov',
      '/images/portfolio/marta/6.mov',
      '/images/portfolio/marta/7.mov',
      '/images/portfolio/marta/8.mov',
    ],
    accent: '#FF10F0',
    instagram: '#',
  },
];

/* ─── Tinder Card ─── */
// memo prevents re-renders when parent state changes but props are the same
const TinderCard = memo(function TinderCard({
  src,
  onSwipe,
  isTop,
}: {
  src: string;
  onSwipe: (dir: 'left' | 'right') => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  }, [onSwipe]);

  const isVideo = src.endsWith('.mp4') || src.endsWith('.mov');

  // Background card — no drag, no autoplay on videos (perf: don't decode video until it's the top)
  if (!isTop) {
    return (
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{ willChange: 'transform' }}
      >
        {isVideo ? (
          // Static poster placeholder for background card — avoid decoding 2 videos at once
          <div className="w-full h-full bg-black/40 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[16px] border-l-white/60 border-y-[10px] border-y-transparent ml-1" />
            </div>
          </div>
        ) : (
          <Image
            src={src}
            alt="Portfólio"
            fill
            quality={75}
            className="object-cover opacity-70"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing touch-none"
      style={{ x, rotate, zIndex: 10, willChange: 'transform' }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.97, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {isVideo ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full pointer-events-none"
        />
      ) : (
        <Image
          src={src}
          alt="Portfólio"
          fill
          quality={85}
          className="object-cover pointer-events-none"
          sizes="(max-width: 768px) 100vw, 40vw"
          priority
        />
      )}

      {/* Gradient bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* LIKE stamp */}
      <motion.div
        className="absolute top-8 left-6 z-20 border-4 border-green-400 rounded-lg px-4 py-2 rotate-[-15deg] pointer-events-none"
        style={{ opacity: likeOpacity }}
      >
        <span className="text-green-400 font-black text-3xl tracking-wider">LIKE</span>
      </motion.div>

      {/* NOPE stamp */}
      <motion.div
        className="absolute top-8 right-6 z-20 border-4 border-red-500 rounded-lg px-4 py-2 rotate-[15deg] pointer-events-none"
        style={{ opacity: nopeOpacity }}
      >
        <span className="text-red-500 font-black text-3xl tracking-wider">NOPE</span>
      </motion.div>
    </motion.div>
  );
});

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

  const allImages = [data.profileImage, ...data.portfolio];
  const total = allImages.length;
  const isFinished = currentIndex >= total;

  // Fixed: removed currentIndex from deps — functional updater handles it
  const handleSwipe = useCallback(
    (dir: 'left' | 'right') => {
      if (dir === 'right') {
        setLiked((prev) => [...prev, currentIndex]);
      }
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex]
  );

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setLiked([]);
  }, []);

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col"
      initial={{ opacity: 0, x: side === 'left' ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header — name + role */}
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-accent)] flex-shrink-0">
          <Image
            src={data.profileImage}
            alt={data.name}
            width={40}
            height={40}
            quality={80}
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
      </div>

      {/* Progress bar (one bar, no per-dot animations) */}
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
      <div
        className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10"
        style={{ contain: 'layout paint' }}
      >
        {/* Next card rendered behind — static, no AnimatePresence overhead */}
        {!isFinished && currentIndex + 1 < total && (
          <TinderCard
            key={`bg-${currentIndex + 1}`}
            src={allImages[currentIndex + 1]}
            onSwipe={() => { }}
            isTop={false}
          />
        )}

        {/* AnimatePresence tracks only the single top card */}
        <AnimatePresence>
          {!isFinished ? (
            <TinderCard
              key={`card-${currentIndex}`}
              src={allImages[currentIndex]}
              onSwipe={handleSwipe}
              isTop={true}
            />
          ) : (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
            >
              <Camera size={48} className="text-[var(--color-accent)] mb-4" />
              <h4 className="text-white text-xl font-bold mb-2">Viste tudo!</h4>
              <p className="text-white/50 text-sm mb-1">
                Gostaste de{' '}
                <span className="text-[var(--color-accent)] font-bold">{liked.length}</span>{' '}
                de {total} fotos
              </p>
              <p className="text-white/30 text-xs mb-6">do portfólio de {data.name}</p>
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
        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full border-2 border-red-500/40 flex items-center justify-center bg-black hover:border-red-500 hover:scale-105 active:scale-95 transition-all"
          >
            <X size={24} className="text-red-500/70" />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full border-2 border-[var(--color-accent)]/40 flex items-center justify-center bg-black hover:border-[var(--color-accent)] hover:scale-105 active:scale-95 transition-all"
          >
            <Heart size={28} className="text-[var(--color-accent)]/70" />
          </button>
          <button
            onClick={handleReset}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black hover:border-white/30 hover:scale-105 active:scale-95 transition-all"
          >
            <RotateCcw size={14} className="text-white/30" />
          </button>
        </div>
      )}

      {/* Specialties */}
      <div className="flex flex-wrap gap-2 mt-5">
        {data.specialties.map((spec) => (
          <span
            key={spec}
            className="px-3 py-1 text-xs font-medium rounded-full border border-white/10 text-white/50 bg-white/[0.02]"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-white/40 text-sm mt-4 leading-relaxed">{data.description}</p>
    </motion.div>
  );
}

/* ─── Main Section ─── */

export function PortfolioSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

  return (
    <section ref={sectionRef} className="relative bg-black py-20 md:py-32">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] block mb-4">
            Dois Olhares
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            Dois Olhares.{' '}
            <span className="text-[var(--color-accent)]">Zero</span>{' '}Limites.
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-md mx-auto">
            Desliza ou usa os botões para explorar o portfólio de cada fotógrafo. Spoiler: vais querer os dois.
          </p>
        </motion.div>
      </div>

      {/* Split Tinder Decks */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Center divider — CSS only, no motion scroll listener */}
        <div
          className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, var(--color-accent) 20%, var(--color-accent) 80%, transparent 100%)',
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14">
          <PhotographerDeck data={photographers[0]} side="left" index={0} />
          <PhotographerDeck data={photographers[1]} side="right" index={1} />
        </div>
      </div>
    </section>
  );
}

export default PortfolioSplit;
