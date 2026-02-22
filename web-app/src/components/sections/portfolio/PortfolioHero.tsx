'use client';

export function PortfolioHero() {
  return (
    <section className="relative bg-black pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Static gradient background — no Globe, no WebGL, no scroll listeners */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-[rgba(255,16,240,0.06)] via-transparent to-transparent" />
        {/* Subtle dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <span className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block animate-fade-in">
          Os Nossos Fotógrafos
        </span>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
          Portfólio
          <span className="text-[var(--color-accent)]"> Str8</span>
          Global
        </h1>

        <p className="text-white/80 text-lg md:text-xl max-w-2xl font-medium">
          Dois olhares, uma visão. Conheça o trabalho dos nossos fotógrafos e descubra
          o estilo que melhor se adapta ao seu projeto.
        </p>
      </div>
    </section>
  );
}

export default PortfolioHero;
