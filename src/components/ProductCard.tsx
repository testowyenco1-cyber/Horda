import React from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Heart,
  ShoppingBag,
  XCircle,
} from 'lucide-react';
import { CATEGORY_META } from '../data/products';
import type { Product } from '../types/store';
import { formatPLN, getDiscountPercent } from '../utils/catalog';
import { ProductArtwork } from './ProductArtwork';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  isInterested: boolean;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleInterest: (productId: string) => void;
}

export function ProductCard({
  product,
  isWishlisted,
  isInterested,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  onToggleInterest,
}: ProductCardProps) {
  const discountPct = getDiscountPercent(product.price, product.previousPrice);
  const categoryName = CATEGORY_META[product.category].shortName;

  // Pick at most 1 clean corner tag (zero badge sandwich)
  let cornerTag: { text: string; tone: 'ice' | 'gold' | 'sage' } | null = null;
  if (discountPct !== null) {
    cornerTag = { text: `-${discountPct}%`, tone: 'gold' };
  } else if (product.isWeeklyDrop || product.tags.includes('LIMITOWANY')) {
    cornerTag = { text: 'LIMITOWANY', tone: 'gold' };
  } else if (product.isNew) {
    cornerTag = { text: 'NOWOŚĆ', tone: 'ice' };
  } else if (product.isBestseller) {
    cornerTag = { text: 'BESTSELLER', tone: 'sage' };
  }

  const isOut = product.availability === 'out_of_stock';
  const isLow = product.availability === 'low_stock';

  return (
    <article className="group flex flex-col rounded-lg bg-[#111925] border border-white/10 hover:border-[#9CDEF7]/40 transition-all duration-200 hover:-translate-y-0.5 overflow-hidden">
      {/* Product image / visual frame leading 65%+ of card */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0D141F]">
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          aria-label={`Zobacz szczegóły produktu ${product.name}`}
          className="block w-full h-full text-left focus-visible:outline-2 focus-visible:outline-[#9CDEF7]"
        >
          <ProductArtwork
            kind={product.artworkKind}
            accentHex={product.accentHex}
            title={product.name}
            subtitle={product.series}
            className="group-hover:scale-[1.03] transition-transform duration-300"
          />
        </button>

        {/* Single clean corner tag */}
        {cornerTag && (
          <span
            className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-sm text-[11px] font-bold tracking-wide uppercase pointer-events-none ${
              cornerTag.tone === 'gold'
                ? 'bg-[#D8AD6C] text-[#090D14]'
                : cornerTag.tone === 'sage'
                ? 'bg-[#A6CDA9] text-[#090D14]'
                : 'bg-[#9CDEF7] text-[#090D14]'
            }`}
          >
            {cornerTag.text}
          </span>
        )}

        {/* Wishlist toggle button */}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={
            isWishlisted
              ? `Usuń ${product.name} z ulubionych`
              : `Dodaj ${product.name} do ulubionych`
          }
          aria-pressed={isWishlisted}
          className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-md flex items-center justify-center border transition-colors ${
            isWishlisted
              ? 'bg-[#9CDEF7] text-[#090D14] border-[#9CDEF7]'
              : 'bg-[#090D14]/80 text-[#C5CFD8] border-white/15 hover:text-white hover:border-[#9CDEF7]/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Clean unboxed metadata */}
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#C5CFD8]/65 truncate">
          <span>{categoryName}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{product.manufacturer}</span>
        </div>

        {/* Product title */}
        <h3 className="mt-1.5 text-[15px] font-semibold text-white leading-snug line-clamp-2 min-h-[2.65rem]">
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="text-left hover:text-[#9CDEF7] transition-colors focus-visible:outline-2 focus-visible:outline-[#9CDEF7] rounded"
          >
            {product.name}
          </button>
        </h3>

        {/* Availability line with explicit icon + text */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {isOut ? (
            <>
              <XCircle className="w-3.5 h-3.5 text-[#C5CFD8]/60 shrink-0" />
              <span className="text-[#C5CFD8]/75">Niedostępny</span>
            </>
          ) : isLow ? (
            <>
              <Clock className="w-3.5 h-3.5 text-[#D8AD6C] shrink-0" />
              <span className="text-[#D8AD6C] font-medium tabular-nums">
                Ostatnie {product.stockCount} szt.
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A6CDA9] shrink-0" />
              <span className="text-[#A6CDA9] font-medium">Dostępny</span>
            </>
          )}
        </div>

        {/* Price & Action Footer */}
        <div className="mt-auto pt-3.5 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {product.previousPrice && product.previousPrice > product.price && (
              <span className="text-xs text-[#C5CFD8]/50 line-through tabular-nums leading-none mb-0.5">
                {formatPLN(product.previousPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-white tabular-nums leading-tight">
              {formatPLN(product.price)}
            </span>
          </div>

          {isOut ? (
            <button
              type="button"
              onClick={() => onToggleInterest(product.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isInterested
                  ? 'bg-[#172333] text-[#A6CDA9] border border-[#A6CDA9]/40'
                  : 'bg-[#172333] hover:bg-[#223247] text-[#C5CFD8] border border-white/15'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isInterested ? 'Zapisano' : 'Powiadom mnie'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#172333] hover:bg-[#9CDEF7] text-[#9CDEF7] hover:text-[#090D14] border border-[#9CDEF7]/30 hover:border-[#9CDEF7] text-xs font-bold transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Do koszyka</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
