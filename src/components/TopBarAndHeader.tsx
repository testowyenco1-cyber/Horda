import React, { useMemo, useRef, useState } from 'react';
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import type { NavSection, Product } from '../types/store';
import { formatPLN } from '../utils/catalog';
import { HordaLogo } from './BrandMark';
import { ProductArtwork } from './ProductArtwork';

interface TopBarAndHeaderProps {
  activeNav: NavSection;
  onNavigate: (section: NavSection) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  onSelectProduct: (product: Product) => void;
  products: Product[];
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
}

const NAV_ITEMS: { id: NavSection; label: string }[] = [
  { id: 'home', label: 'Strona główna' },
  { id: 'pokemon', label: 'Pokémon / TCG' },
  { id: 'beyblade', label: 'Beyblade' },
  { id: 'figurki', label: 'Figurki' },
  { id: 'nowosci', label: 'Nowości' },
  { id: 'promocje', label: 'Promocje' },
  { id: 'spolecznosc', label: 'Społeczność' },
];

export function TopBarAndHeader({
  activeNav,
  onNavigate,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectProduct,
  products,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
}: TopBarAndHeaderProps) {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const blurTimerRef = useRef<number | null>(null);

  const quickMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) =>
        `${p.name} ${p.manufacturer} ${p.series} ${p.characterOrLine ?? ''}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 5);
  }, [products, searchQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFocused(false);
    onSearchSubmit(searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090D14]/95 backdrop-blur-md border-b border-white/10">
      {/* Slim top info bar */}
      {!bannerDismissed && (
        <div className="bg-[#111925] border-b border-white/5 text-[10px] sm:text-xs text-[#C5CFD8]">
          <div className="max-w-[1380px] mx-auto px-3 sm:px-4 h-7 sm:h-8 flex items-center justify-between gap-2 sm:gap-4">
            <p className="truncate font-medium tracking-wide">
              <span className="text-[#9CDEF7] font-semibold">DARMOWA DOSTAWA OD 299 ZŁ</span>
              <span className="mx-1.5 sm:mx-2 text-white/30" aria-hidden="true">|</span>
              <span>NOWE ZNALEZISKA CO TYDZIEŃ</span>
              <span className="hidden md:inline text-white/30 mx-2" aria-hidden="true">|</span>
              <span className="hidden md:inline text-[#D8AD6C]">DROP TYGODNIA AKTYWNY</span>
            </p>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              aria-label="Zamknij pasek informacyjny"
              className="p-1 text-[#C5CFD8]/70 hover:text-white transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main header row */}
      <div className="max-w-[1380px] mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 lg:gap-8">
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Zamknij menu nawigacji' : 'Otwórz menu nawigacji'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-2 -ml-1.5 text-[#C5CFD8] hover:text-[#9CDEF7] transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('home');
            }}
            aria-label="HORDA — Strona główna"
            className="focus-visible:outline-2 focus-visible:outline-[#9CDEF7] rounded"
          >
            <HordaLogo compact />
          </button>
        </div>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleFormSubmit}
          className="hidden md:flex flex-1 max-w-xl relative"
          role="search"
        >
          <label htmlFor="horda-desktop-search" className="sr-only">
            Wyszukaj produkty w sklepie HORDA
          </label>
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#C5CFD8]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="horda-desktop-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => {
                if (blurTimerRef.current) window.clearTimeout(blurTimerRef.current);
                setSearchFocused(true);
              }}
              onBlur={() => {
                blurTimerRef.current = window.setTimeout(() => setSearchFocused(false), 180);
              }}
              placeholder="Szukaj kart Pokémon, beyów X, figurek, serii..."
              className="w-full h-10 pl-10 pr-24 rounded-md bg-[#111925] border border-white/10 text-sm text-white placeholder:text-[#C5CFD8]/45 focus:outline-none focus:border-[#9CDEF7] transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 rounded bg-[#172333] hover:bg-[#9CDEF7] text-xs font-semibold text-[#9CDEF7] hover:text-[#090D14] transition-colors whitespace-nowrap"
            >
              Szukaj
            </button>
          </div>

          {/* Live instant search dropdown */}
          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#111925] border border-white/15 rounded-md shadow-2xl overflow-hidden z-50">
              {quickMatches.length === 0 ? (
                <div className="p-4 text-sm text-[#C5CFD8]/70">
                  Brak wyników dla „{searchQuery}”. Naciśnij Enter, aby przeszukać katalog.
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {quickMatches.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSearchFocused(false);
                          onSelectProduct(item);
                        }}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-[#172333] transition-colors text-left"
                      >
                        <div className="w-12 h-9 rounded overflow-hidden shrink-0">
                          <ProductArtwork
                            kind={item.artworkKind}
                            accentHex={item.accentHex}
                            title={item.name}
                            showPlaceholderCaption={false}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{item.name}</p>
                          <p className="text-xs text-[#C5CFD8]/65 truncate">
                            {item.manufacturer} · {item.series}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[#9CDEF7] tabular-nums shrink-0">
                          {formatPLN(item.price)}
                        </span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="submit"
                      className="w-full py-2.5 px-3 text-xs font-semibold text-[#9CDEF7] hover:bg-[#172333] text-center transition-colors"
                    >
                      Pokaż wszystkie wyniki w katalogu →
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </form>

        {/* Action buttons: Account, Wishlist, Cart */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenAccount}
            aria-label="Moje konto"
            className="inline-flex items-center gap-2 px-2 sm:px-3 h-9 sm:h-10 rounded-md text-sm font-medium text-[#C5CFD8] hover:text-white hover:bg-[#111925] transition-colors whitespace-nowrap"
          >
            <User className="w-4 h-4 text-[#9CDEF7]" />
            <span className="hidden xl:inline">Moje konto</span>
          </button>

          <button
            type="button"
            onClick={onOpenWishlist}
            aria-label={`Ulubione (${wishlistCount})`}
            className="relative inline-flex items-center gap-1.5 px-2 sm:px-3 h-9 sm:h-10 rounded-md text-sm font-medium text-[#C5CFD8] hover:text-white hover:bg-[#111925] transition-colors whitespace-nowrap"
          >
            <Heart className="w-4 h-4 text-[#9CDEF7]" />
            <span className="hidden xl:inline">Ulubione</span>
            {wishlistCount > 0 && (
              <span className="text-xs font-semibold text-[#9CDEF7] tabular-nums">
                ({wishlistCount})
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Koszyk (${cartCount})`}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 h-9 sm:h-10 rounded-md bg-[#9CDEF7] hover:bg-[#BBE8FA] text-[#090D14] text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Koszyk</span>
            <span className="tabular-nums font-extrabold">({cartCount})</span>
          </button>
        </div>
      </div>

      {/* Mobile inline visible search */}
      <div className="md:hidden px-3 pb-2">
        <form onSubmit={handleFormSubmit} role="search" className="relative">
          <label htmlFor="horda-mobile-search" className="sr-only">
            Szukaj produktów
          </label>
          <Search className="w-4 h-4 text-[#C5CFD8]/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="horda-mobile-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Szukaj Pokémon, Beyblade, figurek..."
            className="w-full h-9 pl-9 pr-16 rounded-md bg-[#111925] border border-white/10 text-sm text-white placeholder:text-[#C5CFD8]/45 focus:outline-none focus:border-[#9CDEF7]"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2.5 rounded bg-[#172333] text-xs font-semibold text-[#9CDEF7]"
          >
            Szukaj
          </button>
        </form>
      </div>

      {/* Desktop Category Navigation Bar */}
      <nav
        aria-label="Główna nawigacja sklepu"
        className="hidden lg:block border-t border-white/5 bg-[#0C121B]"
      >
        <div className="max-w-[1380px] mx-auto px-4 flex items-center justify-between h-11">
          <ul className="flex items-center gap-7">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`relative py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'text-[#9CDEF7]'
                        : 'text-[#C5CFD8] hover:text-white'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#9CDEF7]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <span className="text-xs text-[#C5CFD8]/60 whitespace-nowrap">
            Zostań jednym z nas · Sklep kolekcjonerski
          </span>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Menu mobilne"
          className="lg:hidden border-t border-white/10 bg-[#111925] px-4 py-3 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors min-h-[44px] flex items-center justify-between ${
                  isActive
                    ? 'bg-[#172333] text-[#9CDEF7]'
                    : 'text-[#C5CFD8] hover:bg-[#172333]/60 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
