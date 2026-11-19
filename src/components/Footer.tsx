import React from 'react';
import type { NavSection } from '../types/store';
import { HordaLogo } from './BrandMark';

interface FooterProps {
  onNavigate: (section: NavSection) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-14 border-t border-white/10 bg-[#070A10]">
      <div className="max-w-[1380px] mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <HordaLogo />
          <p className="mt-3 text-xs text-[#C5CFD8]/75 leading-relaxed max-w-xs">
            Sklep kolekcjonerski HORDA — karty Pokémon TCG, system Beyblade X, figurki oraz
            cotygodniowe dropy w mrocznej, przejrzystej oprawie.
          </p>
          <p className="mt-3 text-xs font-semibold text-[#9CDEF7]">Zostań jednym z nas.</p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Kategorie sklepu
          </h3>
          <ul className="space-y-2 text-sm text-[#C5CFD8]/80">
            <li>
              <button type="button" onClick={() => onNavigate('pokemon')} className="hover:text-[#9CDEF7]">
                Pokémon / TCG
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('beyblade')} className="hover:text-[#9CDEF7]">
                Beyblade X
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('figurki')} className="hover:text-[#9CDEF7]">
                Figurki kolekcjonerskie
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('nowosci')} className="hover:text-[#9CDEF7]">
                Nowości
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('promocje')} className="hover:text-[#9CDEF7]">
                Promocje
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Informacje (Demo)
          </h3>
          <ul className="space-y-2 text-sm text-[#C5CFD8]/80">
            <li>Darmowa dostawa od 299 zł</li>
            <li>Zabezpieczone pakowanie kolekcjonerskie</li>
            <li>Zgłaszanie zainteresowania niedostępnymi produktami</li>
            <li>
              <button type="button" onClick={() => onNavigate('spolecznosc')} className="hover:text-[#9CDEF7]">
                Świat HORDA i Nayra
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Architektura i płatności
          </h3>
          <p className="text-xs text-[#C5CFD8]/70 leading-relaxed">
            Obecna wersja to interaktywna wizualizacja sklepu z demonstracyjnym koszykiem i
            checkoutem. Docelowa wersja produkcyjna zostanie połączona z bezpiecznym backendem
            oraz certyfikowanym operatorem płatności.
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 py-4 px-4">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#C5CFD8]/55">
          <span>© {new Date().getFullYear()} HORDA · Zostań jednym z nas.</span>
          <span>Przykładowy katalog kolekcjonerski</span>
        </div>
      </div>
    </footer>
  );
}
