import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';
import { CATEGORY_META } from '../data/products';
import { PRODUCT_MEDIA } from '../data/product-media';
import type { ArtworkKind, Product } from '../types/store';
import {
  formatPLN,
  getDiscountPercent,
  getProductEffectivePrice,
} from '../utils/catalog';
import { ProductArtwork } from './ProductArtwork';
import { ProductCard } from './ProductCard';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  wishlistIds: string[];
  interestedIds: string[];
  interestCounts: Record<string, number>;
  onBackToCatalog: () => void;
  onGoHome: () => void;
  onSelectCategory: (category: Product['category']) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, variantId?: string, variantLabel?: string) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleInterest: (productId: string) => void;
}

export function ProductDetailView({
  product,
  allProducts,
  wishlistIds,
  interestedIds,
  interestCounts,
  onBackToCatalog,
  onGoHome,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  onToggleInterest,
}: ProductDetailViewProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants?.[0]?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const effectivePrice = getProductEffectivePrice(product, selectedVariantId);
  const discountPct = getDiscountPercent(product.price, product.previousPrice);
  const isOut = product.availability === 'out_of_stock' || (selectedVariant && selectedVariant.stock === 0);
  const isWishlisted = wishlistIds.includes(product.id);
  const isInterested = interestedIds.includes(product.id);
  const totalInterest = interestCounts[product.id] ?? product.interestCount;

  const productMedia = PRODUCT_MEDIA[product.id];
  const galleryItems: ArtworkKind[] = productMedia?.imageUrl
    ? [product.artworkKind]
    : product.images.length > 0
      ? (product.images as ArtworkKind[])
      : [product.artworkKind];

  const similarProducts = useMemo(
    () =>
      allProducts
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, 4),
    [allProducts, product]
  );

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedVariant?.id, selectedVariant?.label);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1800);
  };

  const categoryMeta = CATEGORY_META[product.category];

  return (
    <div className="max-w-[1380px] mx-auto px-4 py-6 sm:py-8">
      {/* Breadcrumbs + Back */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <nav aria-label="Ścieżka produktu" className="flex flex-wrap items-center gap-1.5 text-xs text-[#C5CFD8]/70">
          <button type="button" onClick={onGoHome} className="hover:text-[#9CDEF7]">
            Strona główna
          </button>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <button
            type="button"
            onClick={() => onSelectCategory(product.category)}
            className="hover:text-[#9CDEF7]"
          >
            {categoryMeta.name}
          </button>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="text-white font-medium truncate max-w-[260px] sm:max-w-md">
            {product.name}
          </span>
        </nav>

        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9CDEF7] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Wróć do katalogu</span>
        </button>
      </div>

      {/* Main 2-Column PDP Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Large Gallery */}
        <div className="lg:col-span-7 space-y-3">
          <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#111925] border border-white/10">
            <ProductArtwork
              kind={galleryItems[activeImageIdx] ?? product.artworkKind}
              accentHex={product.accentHex}
              title={product.name}
              subtitle={`${product.series} · Poglądowa wizualizacja`}
              imageUrl={productMedia?.imageUrl}
              angleIndex={activeImageIdx}
            />
          </div>

          {!productMedia?.imageUrl && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {galleryItems.map((kind, idx) => (
                <button
                  key={`${kind}-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`Widok ${idx + 1} produktu`}
                  className={`w-24 h-18 rounded-md overflow-hidden border transition-colors shrink-0 ${
                    activeImageIdx === idx
                      ? 'border-[#9CDEF7] ring-1 ring-[#9CDEF7]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <ProductArtwork
                    kind={kind}
                    accentHex={product.accentHex}
                    title={product.name}
                    angleIndex={idx}
                    showPlaceholderCaption={false}
                  />
                </button>
              ))}
            </div>
          )}
          {productMedia?.imageUrl ? (
            <p className="text-[11px] text-[#C5CFD8]/55 leading-relaxed">
              Zdjęcie referencyjne:{" "}
              <a href={productMedia.imageSourceUrl} target="_blank" rel="noreferrer" className="text-[#9CDEF7] hover:underline">
                {productMedia.imageSourceLabel}
              </a>
              {" · "}Dane produktu:{" "}
              <a href={productMedia.productSourceUrl} target="_blank" rel="noreferrer" className="text-[#9CDEF7] hover:underline">
                {productMedia.productSourceLabel}
              </a>
              {" · "}Przed publikacją komercyjną potwierdź licencję zdjęcia.
            </p>
          ) : (
            <p className="text-[11px] text-[#C5CFD8]/55">
              * Grafika poglądowa — zdjęcie produktu nie zostało jeszcze zweryfikowane.
            </p>
          )}
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 rounded-xl bg-[#111925] border border-white/10 p-6 sm:p-7 lg:sticky lg:top-32">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#9CDEF7] font-semibold">
            <span>{categoryMeta.name}</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span className="text-[#C5CFD8]">{product.manufacturer}</span>
          </div>

          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white leading-tight">
            {product.name}
          </h1>

          <p className="mt-2.5 text-sm text-[#C5CFD8]/85 leading-relaxed">
            {product.shortSummary}
          </p>

          {/* Price Block */}
          <div className="mt-5 pt-5 border-t border-white/10 flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-extrabold text-white tabular-nums">
              {formatPLN(effectivePrice)}
            </span>
            {product.previousPrice && product.previousPrice > product.price && (
              <>
                <span className="text-base text-[#C5CFD8]/50 line-through tabular-nums">
                  {formatPLN(product.previousPrice)}
                </span>
                {discountPct && (
                  <span className="px-2 py-0.5 rounded-sm bg-[#D8AD6C] text-[#090D14] text-xs font-extrabold tabular-nums">
                    -{discountPct}%
                  </span>
                )}
              </>
            )}
          </div>

          {/* Availability */}
          <div className="mt-3 flex items-center gap-2 text-sm">
            {isOut ? (
              <>
                <XCircle className="w-4 h-4 text-[#C5CFD8]/60" />
                <span className="text-[#C5CFD8] font-medium">
                  Chwilowo niedostępny — produkt pozostaje w katalogu
                </span>
              </>
            ) : product.availability === 'low_stock' ? (
              <>
                <Clock className="w-4 h-4 text-[#D8AD6C]" />
                <span className="text-[#D8AD6C] font-semibold tabular-nums">
                  Ostatnie {selectedVariant?.stock ?? product.stockCount} sztuki w magazynie
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#A6CDA9]" />
                <span className="text-[#A6CDA9] font-semibold tabular-nums">
                  Dostępny ({selectedVariant?.stock ?? product.stockCount} szt. na stanie)
                </span>
              </>
            )}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-5">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#C5CFD8]/80 mb-2">
                Wariant wydania
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => {
                  const active = variant.id === selectedVariantId;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`px-3.5 py-2 rounded-md text-xs font-semibold border transition-colors ${
                        active
                          ? 'bg-[#172333] border-[#9CDEF7] text-[#9CDEF7]'
                          : 'bg-[#090D14] border-white/15 text-[#C5CFD8] hover:border-white/35'
                      }`}
                    >
                      {variant.label}
                      {variant.priceDelta ? ` (${variant.priceDelta > 0 ? '+' : ''}${variant.priceDelta} zł)` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Purchase or Interest Capture Controls */}
          {isOut ? (
            <div className="mt-6 p-4 rounded-lg bg-[#090D14] border border-white/10 space-y-3">
              <p className="text-xs text-[#C5CFD8]/80 leading-relaxed">
                Zbieramy zgłoszenia zainteresowania tym produktem, aby lepiej planować kolejne dostawy
                do magazynu HORDA.
              </p>
              <button
                type="button"
                onClick={() => onToggleInterest(product.id)}
                className={`w-full h-11 px-5 rounded-md font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors ${
                  isInterested
                    ? 'bg-[#172333] text-[#A6CDA9] border border-[#A6CDA9]/50'
                    : 'bg-[#9CDEF7] hover:bg-[#BBE8FA] text-[#090D14]'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>
                  {isInterested
                    ? 'Zapisano zainteresowanie (Powiadom o dostępności)'
                    : 'Powiadom o dostępności / Zainteresowany produktem'}
                </span>
              </button>
              <p className="text-xs text-[#C5CFD8]/65 tabular-nums text-center">
                Liczba kolekcjonerów czekających na restock: <strong className="text-white">{totalInterest}</strong>
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="inline-flex items-center h-11 rounded-md bg-[#090D14] border border-white/15">
                  <button
                    type="button"
                    aria-label="Zmniejsz ilość"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center text-[#C5CFD8] hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Zwiększ ilość"
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(selectedVariant?.stock ?? product.stockCount, q + 1)
                      )
                    }
                    className="w-10 h-full flex items-center justify-center text-[#C5CFD8] hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 h-11 px-5 rounded-md bg-[#9CDEF7] hover:bg-[#BBE8FA] text-[#090D14] font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedFeedback ? 'Dodano do koszyka' : 'Dodaj do koszyka'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            className={`mt-3 w-full h-10 px-4 rounded-md border text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
              isWishlisted
                ? 'bg-[#172333] border-[#9CDEF7]/50 text-[#9CDEF7]'
                : 'bg-transparent border-white/15 text-[#C5CFD8] hover:text-white hover:border-white/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            <span>{isWishlisted ? 'W ulubionych' : 'Dodaj do ulubionych'}</span>
          </button>

          {/* Delivery & Authenticity Info */}
          <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5 text-xs text-[#C5CFD8]/80">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#9CDEF7] shrink-0" />
              <span>Wysyłka w 24h (Paczkomat / Kurier) · Darmowa dostawa od 299 zł</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#A6CDA9] shrink-0" />
              <span>100% oryginalny produkt z zabezpieczonym pakowaniem kolekcjonerskim</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specification */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-xl bg-[#111925] border border-white/10 p-6">
          <h2 className="font-display text-2xl font-bold uppercase text-white mb-3">
            Opis produktu
          </h2>
          <p className="text-sm sm:text-base text-[#C5CFD8]/85 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="lg:col-span-5 rounded-xl bg-[#111925] border border-white/10 p-6">
          <h2 className="font-display text-2xl font-bold uppercase text-white mb-3">
            Specyfikacja
          </h2>
          <dl className="divide-y divide-white/10 text-sm">
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-[#C5CFD8]/65">Producent</dt>
              <dd className="text-white font-medium text-right">{product.manufacturer}</dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-[#C5CFD8]/65">Seria</dt>
              <dd className="text-white font-medium text-right">{product.series}</dd>
            </div>
            {product.specs.map((spec) => (
              <div key={spec.label} className="py-2.5 flex justify-between gap-4">
                <dt className="text-[#C5CFD8]/65">{spec.label}</dt>
                <dd className="text-white font-medium text-right">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section aria-label="Podobne produkty" className="mt-12">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white mb-5">
            Podobne produkty
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {similarProducts.map((sim) => (
              <ProductCard
                key={sim.id}
                product={sim}
                isWishlisted={wishlistIds.includes(sim.id)}
                isInterested={interestedIds.includes(sim.id)}
                onSelectProduct={onSelectProduct}
                onAddToCart={(p) => onAddToCart(p, 1)}
                onToggleWishlist={onToggleWishlist}
                onToggleInterest={onToggleInterest}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
