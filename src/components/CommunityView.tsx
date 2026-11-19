import React from 'react';
import { ArrowRight, ChevronRight, Compass, Disc, Sparkles } from 'lucide-react';
import type { NavSection } from '../types/store';
import { SafeImage } from './BrandMark';

interface CommunityViewProps {
  onGoHome: () => void;
  onNavigate: (section: NavSection) => void;
}

export function CommunityView({ onGoHome, onNavigate }: CommunityViewProps) {
  return (
    <div className="max-w-[1380px] mx-auto px-4 py-6 sm:py-8">
      <nav aria-label="Ścieżka" className="flex items-center gap-1.5 text-xs text-[#C5CFD8]/70 mb-4">
        <button type="button" onClick={onGoHome} className="hover:text-[#9CDEF7]">
          Strona główna
        </button>
        <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="text-white font-medium">Społeczność i świat HORDA</span>
      </nav>

      {/* Top Split: Brand Story & Emblem */}
      <div className="rounded-xl bg-[#111925] border border-white/10 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9CDEF7]">
            Społeczność · Zostań jednym z nas
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
            Świat HORDA i nasza przewodniczka Nayra
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#C5CFD8]/85 leading-relaxed">
            HORDA powstała z myślą o pasjonatach otwierania boosterów, testowania kombinacji
            Beyblade X na turniejowych stadionach i budowania półek pełnych wyjątkowych figurek.
            Oprawa fantasy i postać Nayry nadają sklepowi własny charakter, pozostawiając katalog
            i wygodę zakupów na pierwszym miejscu.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#090D14] border border-white/10">
              <div className="flex items-center gap-2 text-[#9CDEF7] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Pasja Pokémon TCG</span>
              </div>
              <p className="mt-1.5 text-xs text-[#C5CFD8]/80 leading-relaxed">
                Odkrywanie różnorodności stworzeń, kolekcjonowanie ulubionych ilustracji i dbanie
                o każdy okaz w klaserze.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#090D14] border border-white/10">
              <div className="flex items-center gap-2 text-[#D8AD6C] text-xs font-bold uppercase tracking-wider">
                <Disc className="w-4 h-4" />
                <span>Pasja Beyblade X</span>
              </div>
              <p className="mt-1.5 text-xs text-[#C5CFD8]/80 leading-relaxed">
                Precyzja, mechanika części, energia Xtreme Dash i czysta satysfakcja z pojedynków
                na arenie.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#9CDEF7] hover:bg-[#BBE8FA] text-[#090D14] text-sm font-bold transition-colors"
            >
              <span>Przejdź do katalogu sklepu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-lg overflow-hidden border border-white/10 bg-[#090D14]">
          <SafeImage
            src="/assets/aistudio/Horda__Skarby_i_kolekcjonerska_przygoda_5043f2e9.png"
            alt="Emblemat skarbu HORDA z kartami i Beyblade"
            fallbackTitle="Emblemat HORDA"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Nayra Character Sheet Showcase */}
      <section aria-label="Karty postaci Nayra" className="mt-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9CDEF7] mb-2">
          <Compass className="w-4 h-4" />
          <span>Miejsce na przyszłe autorskie ilustracje</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white mb-5">
          Karta postaci: Nayra — Wilczyca Księżycowego Światła
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <figure className="rounded-xl overflow-hidden bg-[#111925] border border-white/10">
            <SafeImage
              src="/assets/aistudio/Nayra___Wilczyca_Ksi__ycowego__wiat_a_c4ba482e.png"
              alt="Karta postaci Nayra — grafit, srebro, lodowy błękit i bursztyn"
              fallbackTitle="Karta postaci Nayra"
              className="w-full h-auto object-cover"
            />
            <figcaption className="px-4 py-3 text-xs text-[#C5CFD8]/75 border-t border-white/10">
              Oficjalna paleta i detale stroju podróżniczego Nayry (heterochromia: bursztyn i lodowy błękit).
            </figcaption>
          </figure>

          <figure className="rounded-xl overflow-hidden bg-[#111925] border border-white/10">
            <SafeImage
              src="/assets/aistudio/Karta_postaci_Nayra___Wilczyca_Ksi__ycowego__wiat_a_91aa57bb.png"
              alt="Ekspresje i detale akcesoriów Nayry: Poké Ball oraz BeyLauncher"
              fallbackTitle="Ekspresje Nayry"
              className="w-full h-auto object-cover"
            />
            <figcaption className="px-4 py-3 text-xs text-[#C5CFD8]/75 border-t border-white/10">
              Ekspresje postaci oraz wyposażenie podróżnicze z Poké Ballem i wyrzutnią Beyblade.
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
