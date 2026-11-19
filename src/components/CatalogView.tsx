import React, { useMemo, useState } from 'react';
import {
  ChevronRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { CATEGORY_META, PRODUCT_TYPE_LABELS } from '../data/products';
import type {
  CategoryId,
  FilterState,
  Product,
  ProductType,
  SortOption,
} from '../types/store';
import {
  filterAndSortProducts,
  getActiveFilterCount,
} from '../utils/catalog';
import { ProductCard } from './ProductCard';

interface CatalogViewProps {
  allProducts: Product[];
  filters: FilterState;
  onUpdateFilters: (updater: (prev: FilterState) => FilterState) => void;
  onResetFilters: () => void;
  onGoHome: () => void;
  wishlistIds: string[];
  interestedIds: string[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleInterest: (productId: string) => void;
}

const PAGE_SIZE = 9;

export function CatalogView({
  allProducts,
  filters,
  onUpdateFilters,
  onResetFilters,
  onGoHome,
  wishlistIds,
  interestedIds,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  onToggleInterest,
}: CatalogViewProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(
    () => filterAndSortProducts(allProducts, filters),
    [allProducts, filters]
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const activeFilterCount = getActiveFilterCount(filters);

  // Derive available facet options based on currently selected category (or all)
  const categoryScopedProducts = useMemo(() => {
    if (filters.category === 'all') return allProducts;
    return allProducts.filter((p) => p.category === filters.category);
  }, [allProducts, filters.category]);

  const availableManufacturers = useMemo(
    () => Array.from(new Set(categoryScopedProducts.map((p) => p.manufacturer))).sort(),
    [categoryScopedProducts]
  );

  const availableSeries = useMemo(
    () => Array.from(new Set(categoryScopedProducts.map((p) => p.series))).sort(),
    [categoryScopedProducts]
  );

  const availableProductTypes = useMemo(() => {
    if (filters.category !== 'all') {
      return CATEGORY_META[filters.category].productTypes;
    }
    const present = Array.from(new Set(allProducts.map((p) => p.productType)));
    return present.map((id) => ({ id, label: PRODUCT_TYPE_LABELS[id] }));
  }, [allProducts, filters.category]);

  const availableCharacters = useMemo(
    () =>
      Array.from(
        new Set(
          categoryScopedProducts
            .map((p) => p.characterOrLine)
            .filter((v): v is string => Boolean(v))
        )
      ).sort(),
    [categoryScopedProducts]
  );

  const availableSizes = useMemo(
    () =>
      Array.from(
        new Set(
          categoryScopedProducts
            .map((p) => p.sizeOrScale)
            .filter((v): v is string => Boolean(v))
        )
      ).sort(),
    [categoryScopedProducts]
  );

  const toggleArrayValue = <T extends string>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const categoryTitle =
    filters.category !== 'all'
      ? CATEGORY_META[filters.category].name
      : filters.onlyDrop
      ? 'Drop tygodnia'
      : filters.onlyNew
      ? 'Nowości w katalogu'
      : filters.onlyPromo
      ? 'Promocje i okazje'
      : 'Pełny katalog HORDA';

  const categoryDesc =
    filters.category !== 'all'
      ? CATEGORY_META[filters.category].description
      : 'Przeglądaj pełny asortyment kolekcjonerski: karty Pokémon TCG, system Beyblade X oraz licencjonowane figurki. Produkty chwilowo wyprzedane pozostają widoczne z możliwością zgłoszenia zainteresowania.';

  const renderFiltersBody = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
          Kategoria
        </h3>
        <div className="space-y-1">
          {(
            [
              { id: 'all', label: 'Wszystkie kategorie' },
              { id: 'pokemon', label: 'Pokémon / TCG' },
              { id: 'beyblade', label: 'Beyblade' },
              { id: 'figurki', label: 'Figurki' },
            ] as { id: CategoryId | 'all'; label: string }[]
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setVisibleCount(PAGE_SIZE);
                onUpdateFilters((prev) => ({
                  ...prev,
                  category: cat.id,
                  productTypes: [],
                  series: [],
                  manufacturers: [],
                  characterOrLines: [],
                  sizes: [],
                }));
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                filters.category === cat.id
                  ? 'bg-[#172333] text-[#9CDEF7] font-semibold border border-[#9CDEF7]/30'
                  : 'text-[#C5CFD8] hover:bg-[#172333]/60 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Type (dynamic per category) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
          Rodzaj produktu
        </h3>
        <div className="space-y-2">
          {availableProductTypes.map((pt) => {
            const checked = filters.productTypes.includes(pt.id);
            return (
              <label
                key={pt.id}
                className="flex items-center gap-2.5 text-sm text-[#C5CFD8] hover:text-white cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setVisibleCount(PAGE_SIZE);
                    onUpdateFilters((prev) => ({
                      ...prev,
                      productTypes: toggleArrayValue<ProductType>(prev.productTypes, pt.id),
                    }));
                  }}
                  className="w-4 h-4 rounded border-white/25 bg-[#090D14] accent-[#9CDEF7]"
                />
                <span>{pt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability & Status */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
          Dostępność i oferty
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 text-sm text-[#C5CFD8] hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onlyAvailable}
              onChange={(e) =>
                onUpdateFilters((prev) => ({ ...prev, onlyAvailable: e.target.checked }))
              }
              className="w-4 h-4 rounded border-white/25 bg-[#090D14] accent-[#9CDEF7]"
            />
            <span>Tylko dostępne</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm text-[#C5CFD8] hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onlyNew}
              onChange={(e) =>
                onUpdateFilters((prev) => ({ ...prev, onlyNew: e.target.checked }))
              }
              className="w-4 h-4 rounded border-white/25 bg-[#090D14] accent-[#9CDEF7]"
            />
            <span>Nowości</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm text-[#C5CFD8] hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onlyPromo}
              onChange={(e) =>
                onUpdateFilters((prev) => ({ ...prev, onlyPromo: e.target.checked }))
              }
              className="w-4 h-4 rounded border-white/25 bg-[#090D14] accent-[#9CDEF7]"
            />
            <span>Promocje</span>
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
          Zakres cen (zł)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="filter-price-min" className="sr-only">
              Cena od
            </label>
            <input
              id="filter-price-min"
              type="number"
              min={0}
              placeholder="Od"
              value={filters.priceMin ?? ''}
              onChange={(e) =>
                onUpdateFilters((prev) => ({
                  ...prev,
                  priceMin: e.target.value ? Number(e.target.value) : null,
                }))
              }
              className="w-full h-9 px-2.5 rounded bg-[#090D14] border border-white/15 text-sm text-white placeholder:text-[#C5CFD8]/40 focus:outline-none focus:border-[#9CDEF7] tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="filter-price-max" className="sr-only">
              Cena do
            </label>
            <input
              id="filter-price-max"
              type="number"
              min={0}
              placeholder="Do"
              value={filters.priceMax ?? ''}
              onChange={(e) =>
                onUpdateFilters((prev) => ({
                  ...prev,
                  priceMax: e.target.value ? Number(e.target.value) : null,
                }))
              }
              className="w-full h-9 px-2.5 rounded bg-[#090D14] border border-white/15 text-sm text-white placeholder:text-[#C5CFD8]/40 focus:outline-none focus:border-[#9CDEF7] tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Manufacturer */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
          Producent
        </h3>
        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {availableManufacturers.map((mfr) => (
            <label
              key={mfr}
              className="flex items-center gap-2.5 text-sm text-[#C5CFD8] hover:text-white cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.manufacturers.includes(mfr)}
                onChange={() =>
                  onUpdateFilters((prev) => ({
                    ...prev,
                    manufacturers: toggleArrayValue(prev.manufacturers, mfr),
                  }))
                }
                className="w-4 h-4 rounded border-white/25 bg-[#090D14] accent-[#9CDEF7]"
              />
              <span className="truncate">{mfr}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Series */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
          Seria / Dodatek
        </h3>
        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {availableSeries.map((ser) => (
            <label
              key={ser}
              className="flex items-center gap-2.5 text-sm text-[#C5CFD8] hover:text-white cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.series.includes(ser)}
                onChange={() =>
                  onUpdateFilters((prev) => ({
                    ...prev,
                    series: toggleArrayValue(prev.series, ser),
                  }))
                }
                className="w-4 h-4 rounded border-white/25 bg-[#090D14] accent-[#9CDEF7]"
              />
              <span className="truncate">{ser}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Figurki-specific: Character & Size */}
      {(filters.category === 'figurki' || availableSizes.length > 0) &&
        filters.category === 'figurki' && (
          <>
            {availableCharacters.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
                  Postać
                </h3>
                <div className="space-y-2">
                  {availableCharacters.map((ch) => (
                    <label
                      key={ch}
                      className="flex items-center gap-2.5 text-sm text-[#C5CFD8] hover:text-white cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.characterOrLines.includes(ch)}
                        onChange={() =>
                          onUpdateFilters((prev) => ({
                            ...prev,
                            characterOrLines: toggleArrayValue(prev.characterOrLines, ch),
                          }))
                        }
                        className="w-4 h-4 rounded border-white/25 bg-[#090D14] accent-[#9CDEF7]"
                      />
                      <span>{ch}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
                  Rozmiar / Skala
                </h3>
                <div className="space-y-2">
                  {availableSizes.map((sz) => (
                    <label
                      key={sz}
                      className="flex items-center gap-2.5 text-sm text-[#C5CFD8] hover:text-white cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.sizes.includes(sz)}
                        onChange={() =>
                          onUpdateFilters((prev) => ({
                            ...prev,
                            sizes: toggleArrayValue(prev.sizes, sz),
                          }))
                        }
                        className="w-4 h-4 rounded border-white/25 bg-[#090D14] accent-[#9CDEF7]"
                      />
                      <span>{sz}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
    </div>
  );

  return (
    <div className="max-w-[1380px] mx-auto px-4 py-6 sm:py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Ścieżka nawigacji" className="flex items-center gap-1.5 text-xs text-[#C5CFD8]/70 mb-4">
        <button
          type="button"
          onClick={onGoHome}
          className="hover:text-[#9CDEF7] transition-colors"
        >
          Strona główna
        </button>
        <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="text-white font-medium">{categoryTitle}</span>
      </nav>

      {/* Catalog header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
          {categoryTitle}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#C5CFD8]/80 max-w-3xl">
          {categoryDesc}
        </p>
      </div>

      {/* Main layout: Sidebar + Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Sidebar */}
        <aside
          aria-label="Filtry katalogu"
          className="hidden lg:block lg:col-span-3 rounded-lg bg-[#111925] border border-white/10 p-5 sticky top-32"
        >
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Filtry
            </span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#9CDEF7] hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Wyczyść ({activeFilterCount})</span>
              </button>
            )}
          </div>
          {renderFiltersBody()}
        </aside>

        {/* Catalog Results Column */}
        <div className="lg:col-span-9">
          {/* Toolbar: Search, Sort, Mobile Filter Button, Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#111925] border border-white/10 mb-5">
            <div className="flex items-center gap-2.5 flex-1">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 h-10 rounded-md bg-[#172333] border border-white/15 text-sm font-semibold text-white shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#9CDEF7]" />
                <span>Filtry</span>
                {activeFilterCount > 0 && (
                  <span className="text-[#9CDEF7] tabular-nums">({activeFilterCount})</span>
                )}
              </button>

              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#C5CFD8]/45 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <label htmlFor="catalog-inline-search" className="sr-only">
                  Filtruj po nazwie w katalogu
                </label>
                <input
                  id="catalog-inline-search"
                  type="search"
                  value={filters.searchQuery}
                  onChange={(e) =>
                    onUpdateFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                  }
                  placeholder="Filtruj wyniki po nazwie lub serii..."
                  className="w-full h-10 pl-9 pr-3 rounded-md bg-[#090D14] border border-white/10 text-sm text-white placeholder:text-[#C5CFD8]/45 focus:outline-none focus:border-[#9CDEF7]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs sm:text-sm text-[#C5CFD8]/75 tabular-nums whitespace-nowrap">
                Znaleziono: <strong className="text-white">{filteredProducts.length}</strong>
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="catalog-sort" className="text-xs text-[#C5CFD8]/70 hidden sm:inline">
                  Sortuj:
                </label>
                <select
                  id="catalog-sort"
                  value={filters.sortBy}
                  onChange={(e) =>
                    onUpdateFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as SortOption,
                    }))
                  }
                  className="h-10 px-3 rounded-md bg-[#090D14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#9CDEF7]"
                >
                  <option value="featured">Polecane</option>
                  <option value="newest">Najnowsze</option>
                  <option value="price_asc">Cena rosnąco</option>
                  <option value="price_desc">Cena malejąco</option>
                  <option value="popular">Największa popularność</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid or Empty State */}
          {visibleProducts.length === 0 ? (
            <div className="rounded-lg bg-[#111925] border border-white/10 p-10 text-center">
              <h2 className="font-display text-2xl font-bold uppercase text-white">
                Brak produktów spełniających kryteria
              </h2>
              <p className="mt-2 text-sm text-[#C5CFD8]/75 max-w-md mx-auto">
                Zmień wybrane filtry lub wyczyść wyszukiwanie, aby zobaczyć wszystkie dostępne
                produkty w sklepie HORDA.
              </p>
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#9CDEF7] hover:bg-[#BBE8FA] text-[#090D14] text-sm font-bold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Wyczyść wszystkie filtry</span>
              </button>
            </div>
          ) : (
            <>
              <div
                data-testid="catalog-product-grid"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
              >
                {visibleProducts.map((product) => (
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

              {visibleCount < filteredProducts.length && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="px-6 py-3 rounded-md bg-[#111925] hover:bg-[#172333] border border-white/15 hover:border-[#9CDEF7]/50 text-sm font-semibold text-white transition-colors"
                  >
                    Pokaż więcej ({filteredProducts.length - visibleCount} pozostałych)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Filtry katalogu"
        >
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xs bg-[#111925] h-full overflow-y-auto p-5 border-r border-white/10 flex flex-col">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
              <span className="font-display text-xl font-bold uppercase text-white">
                Filtry katalogu
              </span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Zamknij panel filtrów"
                className="p-2 text-[#C5CFD8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1">{renderFiltersBody()}</div>

            <div className="pt-5 mt-6 border-t border-white/10 flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onResetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="flex-1 py-2.5 rounded-md border border-white/15 text-sm font-medium text-[#C5CFD8]"
              >
                Wyczyść
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-md bg-[#9CDEF7] text-[#090D14] text-sm font-bold"
              >
                Pokaż ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
