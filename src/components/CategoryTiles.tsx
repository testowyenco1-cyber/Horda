import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { NavSection } from '../types/store';
import { ProductArtwork } from './ProductArtwork';

interface CategoryTilesProps {
  counts: {
    pokemon: number;
    beyblade: number;
    figurki: number;
    deals: number;
  };
  onSelectSection: (section: NavSection) => void;
}

export function CategoryTiles({ counts, onSelectSection }: CategoryTilesProps) {
  const tiles = [
    {
      id: 'pokemon' as NavSection,
      title: 'Pokémon / TCG',
      subtitle: 'Boostery, Boxy, ETB i akcesoria',
      countLabel: `${counts.pokemon} produktów`,
      cta: 'Przeglądaj karty',
      accent: '#9CDEF7',
      artworkKind: 'pokemon_box' as const,
    },
    {
      id: 'beyblade' as NavSection,
      title: 'Beyblade',
      subtitle: 'Beye X, launchery i areny',
      countLabel: `${counts.beyblade} produktów`,
      cta: 'Wejdź na arenę',
      accent: '#D8AD6C',
      artworkKind: 'beyblade_top' as const,
    },
    {
      id: 'figurki' as NavSection,
      title: 'Figurki',
      subtitle: 'Skale 1/8, Nendoroidy, edycje kolekcjonerskie',
      countLabel: `${counts.figurki} produktów`,
      cta: 'Odkryj figurki',
      accent: '#A6CDA9',
      artworkKind: 'figure_scale' as const,
    },
    {
      id: 'promocje' as NavSection,
      title: 'Nowości i okazje',
      subtitle: 'Aktualne rabaty i cotygodniowe dropy',
      countLabel: `${counts.deals} ofert`,
      cta: 'Sprawdź okazje',
      accent: '#9CDEF7',
      artworkKind: 'pokemon_etb' as const,
    },
  ];

  return (
    <section aria-label="Szybki wybór kategorii" className="max-w-[1380px] mx-auto px-4 pt-8 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            onClick={() => onSelectSection(tile.id)}
            className="group relative flex items-center justify-between gap-3 p-4 rounded-lg bg-[#111925] hover:bg-[#172333] border border-white/10 hover:border-[#9CDEF7]/45 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#9CDEF7]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C5CFD8]/65 tabular-nums">
                {tile.countLabel}
              </p>
              <h2 className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-white group-hover:text-[#9CDEF7] transition-colors">
                {tile.title}
              </h2>
              <p className="mt-1 text-xs text-[#C5CFD8]/80 line-clamp-2 leading-snug">
                {tile.subtitle}
              </p>
              <span
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold transition-colors"
                style={{ color: tile.accent }}
              >
                <span>{tile.cta}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>

            <div className="w-24 h-20 rounded-md overflow-hidden border border-white/10 shrink-0 bg-[#0B111A]">
              <ProductArtwork
                kind={tile.artworkKind}
                accentHex={tile.accent}
                title={tile.title}
                showPlaceholderCaption={false}
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
