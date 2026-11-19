import React, { useEffect, useState } from 'react';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import type { Product } from '../types/store';
import { ProductCard } from './ProductCard';

interface WeeklyDropSectionProps {
  dropProducts: Product[];
  wishlistIds: string[];
  interestedIds: string[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleInterest: (productId: string) => void;
  onViewAllDrop: () => void;
}

export function WeeklyDropSection({
  dropProducts,
  wishlistIds,
  interestedIds,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  onToggleInterest,
  onViewAllDrop,
}: WeeklyDropSectionProps) {
  // Demo countdown timer (explicitly labeled as demo)
  const [secondsLeft, setSecondsLeft] = useState(3 * 86400 + 14 * 3600 + 27 * 60 + 42);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      aria-label="Drop tygodnia"
      className="max-w-[1380px] mx-auto px-4 py-8"
    >
      <div className="rounded-xl bg-[#111925] border border-[#D8AD6C]/35 overflow-hidden">
        {/* Drop Banner Header */}
        <div
          className="p-5 sm:p-7 border-b border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
          style={{
            background:
              'linear-gradient(105deg, rgba(216,173,108,0.14) 0%, rgba(17,25,37,0.95) 55%, rgba(156,222,247,0.09) 100%)',
          }}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#D8AD6C]">
              <Sparkles className="w-4 h-4" />
              <span>Drop tygodnia · Limitowana pula (Demo)</span>
            </div>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              Wybrane perełki z najnowszej dostawy
            </h2>
            <p className="mt-1.5 text-sm text-[#C5CFD8]/85">
              Ograniczone partie kolekcjonerskich zestawów Pokémon TCG, aren Beyblade X UX
              oraz ręcznie malowanych figurek. Licznik prezentuje demonstrację funkcji dropu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#090D14]/90 border border-[#D8AD6C]/30"
              aria-label="Demonstracyjny licznik do końca dropu"
            >
              <Clock className="w-4 h-4 text-[#D8AD6C] shrink-0" />
              <div className="flex items-center gap-2 text-center tabular-nums">
                <div>
                  <span className="block text-base font-bold text-white leading-none">{days}d</span>
                </div>
                <span className="text-white/30">:</span>
                <div>
                  <span className="block text-base font-bold text-white leading-none">{pad(hours)}h</span>
                </div>
                <span className="text-white/30">:</span>
                <div>
                  <span className="block text-base font-bold text-white leading-none">{pad(mins)}m</span>
                </div>
                <span className="text-white/30">:</span>
                <div>
                  <span className="block text-base font-bold text-[#D8AD6C] leading-none">{pad(secs)}s</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onViewAllDrop}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#D8AD6C] hover:bg-[#E4BE82] text-[#090D14] text-sm font-bold transition-colors whitespace-nowrap"
            >
              <span>Zobacz cały drop</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drop Products Grid */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-5">
          {dropProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              isInterested={interestedIds.includes(product.id)}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onToggleInterest={onToggleInterest}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
