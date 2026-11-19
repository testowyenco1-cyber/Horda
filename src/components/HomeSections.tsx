import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import type { CategoryId, NavSection, Product } from '../types/store';
import { SafeImage } from './BrandMark';
import { ProductCard } from './ProductCard';

interface ProductRowSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  wishlistIds: string[];
  interestedIds: string[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleInterest: (productId: string) => void;
  onViewAll: () => void;
  viewAllLabel: string;
}

export function ProductRowSection({
  title,
  subtitle,
  products,
  wishlistIds,
  interestedIds,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  onToggleInterest,
  onViewAll,
  viewAllLabel,
}: ProductRowSectionProps) {
  return (
    <section className="max-w-[1380px] mx-auto px-4 py-7">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[#C5CFD8]/75">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9CDEF7] hover:text-white transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {products.map((product) => (
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
    </section>
  );
}

interface RecommendedCategoriesProps {
  onSelectCategory: (category: CategoryId) => void;
}

export function RecommendedCategories({ onSelectCategory }: RecommendedCategoriesProps) {
  const cards: { id: CategoryId; name: string; caption: string; accent: string }[] = [
    {
      id: 'pokemon',
      name: 'Pokémon / TCG',
      caption: 'Display Boxy, Elite Trainer Boxy, japońskie High Class Packi i koszulki ochronne.',
      accent: '#9CDEF7',
    },
    {
      id: 'beyblade',
      name: 'Beyblade',
      caption: 'System Beyblade X — metalowe topy Attack/Stamina, wyrzutnie sznurkowe i areny.',
      accent: '#D8AD6C',
    },
    {
      id: 'figurki',
      name: 'Figurki',
      caption: 'Oryginalne wydania Kotobukiya, Good Smile Company, MegaHouse i Bandai Spirits.',
      accent: '#A6CDA9',
    },
  ];

  return (
    <section aria-label="Polecane kategorie" className="max-w-[1380px] mx-auto px-4 py-7">
      <div className="mb-5">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
          Polecane kategorie
        </h2>
        <p className="mt-1 text-sm text-[#C5CFD8]/75">
          Przejdź bezpośrednio do wybranego działu z dedykowanymi filtrami kolekcjonerskimi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectCategory(card.id)}
            className="group p-5 rounded-lg bg-[#111925] hover:bg-[#172333] border border-white/10 hover:border-[#9CDEF7]/45 text-left transition-colors flex flex-col justify-between min-h-[148px]"
          >
            <div>
              <h3 className="font-display text-2xl font-bold uppercase text-white group-hover:text-[#9CDEF7] transition-colors">
                {card.name}
              </h3>
              <p className="mt-2 text-sm text-[#C5CFD8]/80 leading-relaxed">
                {card.caption}
              </p>
            </div>
            <span
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
              style={{ color: card.accent }}
            >
              <span>Otwórz dział</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

interface NayraBrandCornerProps {
  onOpenCommunity: () => void;
  onNavigate: (section: NavSection) => void;
}

export function NayraBrandCorner({ onOpenCommunity, onNavigate }: NayraBrandCornerProps) {
  return (
    <section aria-label="Nayra i świat HORDA" className="max-w-[1380px] mx-auto px-4 py-8">
      <div className="rounded-xl bg-[#111925] border border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-5 relative min-h-[260px] bg-[#0B111A]">
          <SafeImage
            src="/assets/aistudio/Nayra___Wilczyca_Ksi__ycowego__wiat_a_c4ba482e.png"
            alt="Karta postaci Nayra — Wilczyca Księżycowego Światła z logo HORDA"
            fallbackTitle="Nayra — Karta postaci HORDA"
            className="w-full h-full object-cover object-top"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(17,25,37,0) 65%, rgba(17,25,37,0.95) 100%)',
            }}
          />
        </div>

        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9CDEF7]">
            Przewodniczka marki HORDA
          </p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
            Poznaj Nayrę — między kartami a areną
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#C5CFD8]/85 leading-relaxed max-w-2xl">
            Nayra to wilczyca księżycowego światła i opiekunka zbiorów HORDY. Z jednakową pasją
            odkrywa rzadkie karty Pokémon oraz testuje wyważenie metalowych ostrzy na arenie
            Beyblade X. To właśnie tutaj w przyszłości pojawią się kolejne autorskie ilustracje
            i kolekcjonerskie edycje specjalne.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenCommunity}
              className="px-5 py-2.5 rounded-md bg-[#172333] hover:bg-[#9CDEF7] text-[#9CDEF7] hover:text-[#090D14] border border-[#9CDEF7]/35 text-sm font-bold transition-colors"
            >
              Świat HORDA i karta Nayry
            </button>
            <button
              type="button"
              onClick={() => onNavigate('pokemon')}
              className="px-4 py-2.5 rounded-md text-sm font-medium text-[#C5CFD8] hover:text-white border border-white/10 hover:border-white/25 transition-colors"
            >
              Polecane przez Nayrę: Pokémon
            </button>
            <button
              type="button"
              onClick={() => onNavigate('beyblade')}
              className="px-4 py-2.5 rounded-md text-sm font-medium text-[#C5CFD8] hover:text-white border border-white/10 hover:border-white/25 transition-colors"
            >
              Polecane: Beyblade X
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Podaj poprawny adres e-mail.');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <section aria-label="Newsletter dropów" className="max-w-[1380px] mx-auto px-4 py-6">
      <div className="rounded-xl bg-[#111925] border border-white/10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9CDEF7]">
            <Mail className="w-4 h-4" />
            <span>Powiadomienia o dropach (Demo)</span>
          </div>
          <h2 className="mt-1.5 font-display text-2xl font-extrabold uppercase text-white">
            Nie przegap kolejnych dostaw i restocków
          </h2>
          <p className="mt-1 text-sm text-[#C5CFD8]/75">
            Otrzymuj informację o nowych dropach Pokémon TCG, Beyblade X i limitowanych figurkach.
          </p>
        </div>

        {subscribed ? (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-md bg-[#172333] border border-[#A6CDA9]/40 text-sm text-[#A6CDA9] font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Zapisano w trybie demonstracyjnym — dane nie są wysyłane na serwer.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full lg:w-auto lg:min-w-[420px]">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <label htmlFor="newsletter-email" className="sr-only">
                Adres e-mail do newslettera
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Twój adres e-mail..."
                className="flex-1 h-11 px-3.5 rounded-md bg-[#090D14] border border-white/15 text-sm text-white placeholder:text-[#C5CFD8]/45 focus:outline-none focus:border-[#9CDEF7]"
              />
              <button
                type="submit"
                className="h-11 px-5 rounded-md bg-[#9CDEF7] hover:bg-[#BBE8FA] text-[#090D14] text-sm font-bold transition-colors whitespace-nowrap"
              >
                Zapisz się
              </button>
            </div>
            {error && <p className="mt-1.5 text-xs text-[#D8AD6C]">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
