import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { SafeImage } from './BrandMark';

interface HeroSectionProps {
  onBrowseCatalog: () => void;
  onViewDrops: () => void;
}

const PARTICLES = [
  { left: '12%', top: '24%', delay: '0s', size: 3 },
  { left: '28%', top: '72%', delay: '1.2s', size: 2 },
  { left: '44%', top: '18%', delay: '2.4s', size: 3 },
  { left: '61%', top: '66%', delay: '0.8s', size: 2.5 },
  { left: '78%', top: '28%', delay: '1.9s', size: 3 },
  { left: '89%', top: '54%', delay: '3.1s', size: 2 },
];

export function HeroSection({ onBrowseCatalog, onViewDrops }: HeroSectionProps) {
  return (
    <section
      aria-label="Wprowadzenie do sklepu HORDA"
      className="relative overflow-hidden border-b border-white/10 bg-[#090D14]"
    >
      {/* Background moonlit castle atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 75% at 75% 35%, rgba(156, 222, 247, 0.14) 0%, rgba(23, 35, 51, 0.45) 45%, #090D14 100%)',
        }}
      />

      {/* Subtle ice-blue drifting dust */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {PARTICLES.map((p, idx) => (
          <span
            key={idx}
            className="animate-horda-particle absolute rounded-full bg-[#9CDEF7]"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: p.delay,
              opacity: 0.35,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-[1380px] mx-auto px-4 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left copy & primary CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#9CDEF7] mb-3">
              Sklep kolekcjonerski · Zostań jednym z nas
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[58px] font-extrabold uppercase tracking-tight text-white leading-[1.02] max-w-2xl [text-wrap:balance]">
              Twoja kolekcja.{' '}
              <span className="text-[#9CDEF7]">Twoja HORDA.</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#C5CFD8] max-w-xl leading-relaxed">
              Karty, beye, figurki i kolejne zdobycze do kolekcji. Odkrywaj nowości,
              poluj na wyjątkowe okazje i znajdź swoje miejsce w świecie HORDA.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onBrowseCatalog}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#9CDEF7] hover:bg-[#BBE8FA] text-[#090D14] font-bold text-sm transition-colors whitespace-nowrap"
              >
                <span>Przeglądaj produkty</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onViewDrops}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#111925] hover:bg-[#172333] border border-[#D8AD6C]/50 text-[#D8AD6C] font-semibold text-sm transition-colors whitespace-nowrap"
              >
                <Flame className="w-4 h-4" />
                <span>Zobacz aktualne dropy</span>
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#C5CFD8]/75">
              <span>Oryginalne wydania EN / JP / EU</span>
              <span aria-hidden="true" className="text-white/25">·</span>
              <span>Bezpieczne pakowanie kolekcjonerskie</span>
              <span aria-hidden="true" className="text-white/25">·</span>
              <span>Darmowa dostawa od 299 zł</span>
            </div>
          </div>

          {/* Right compact Nayra + Gothic Moonlit Castle showcase */}
          <div className="lg:col-span-5 relative min-h-[240px] sm:min-h-[290px] lg:min-h-[340px] rounded-lg overflow-hidden border border-white/10 bg-[#111925]">
            <SafeImage
              src="/assets/aistudio/Wilcza_wojowniczka_pod_pe_ni__ksi__yca_b01ccdaf.png"
              alt="Nayra na tle gotyckiego zamku pod pełnią księżyca — przewodniczka świata HORDA"
              fallbackTitle="Nayra — Świat HORDA"
              className="w-full h-full object-cover object-[center_6%] lg:absolute lg:inset-0"
            />
            {/* Measured dark scrim so Nayra stays framed without overpowering text */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(9,13,20,0.08) 0%, rgba(9,13,20,0.22) 60%, rgba(9,13,20,0.88) 100%)',
              }}
            />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#9CDEF7] font-semibold">
                  Przewodniczka HORDA
                </p>
                <p className="text-sm font-semibold text-white">
                  Nayra · Wilczyca Księżycowego Światła
                </p>
              </div>
              <span className="text-[11px] text-[#C5CFD8]/75 shrink-0">
                Pokémon · Beyblade
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
