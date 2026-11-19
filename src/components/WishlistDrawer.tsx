import React from 'react';
import { Bell, Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import type { Product } from '../types/store';
import { formatPLN } from '../utils/catalog';
import { ProductArtwork } from './ProductArtwork';

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
  wishlistIds: string[];
  interestedIds: string[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleInterest: (productId: string) => void;
}

export function WishlistDrawer({
  open,
  onClose,
  wishlistIds,
  interestedIds,
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  onToggleInterest,
}: WishlistDrawerProps) {
  if (!open) return null;

  const items = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Ulubione produkty"
    >
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-[#111925] h-full border-l border-white/10 flex flex-col shadow-2xl">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-[#9CDEF7]" />
            <h2 className="font-display text-xl font-extrabold uppercase text-white">
              Ulubione ({items.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij ulubione"
            className="p-2 rounded-md text-[#C5CFD8] hover:text-white hover:bg-[#172333]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <Heart className="w-12 h-12 text-[#9CDEF7]/35 mb-3" />
            <h3 className="font-display text-2xl font-bold uppercase text-white">
              Lista ulubionych jest pusta
            </h3>
            <p className="mt-1.5 text-sm text-[#C5CFD8]/75 max-w-xs">
              Kliknij serce na dowolnym produkcie, aby zapisać go na liście obserwowanych łupów.
            </p>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y divide-white/10 px-5">
            {items.map((product) => {
              const isOut = product.availability === 'out_of_stock';
              const isInterested = interestedIds.includes(product.id);
              return (
                <li key={product.id} className="py-4 flex gap-3.5 items-start">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                    className="w-20 h-16 rounded-md overflow-hidden border border-white/10 shrink-0"
                  >
                    <ProductArtwork
                      kind={product.artworkKind}
                      accentHex={product.accentHex}
                      title={product.name}
                      showPlaceholderCaption={false}
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                      className="text-left text-sm font-semibold text-white hover:text-[#9CDEF7] line-clamp-2 transition-colors"
                    >
                      {product.name}
                    </button>
                    <p className="mt-1 text-sm font-bold text-[#9CDEF7] tabular-nums">
                      {formatPLN(product.price)}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2">
                      {isOut ? (
                        <button
                          type="button"
                          onClick={() => onToggleInterest(product.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#172333] text-xs font-semibold text-[#C5CFD8] border border-white/15"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>{isInterested ? 'Powiadomienie aktywne' : 'Powiadom mnie'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAddToCart(product)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#9CDEF7] hover:bg-[#BBE8FA] text-[#090D14] text-xs font-bold transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Do koszyka</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onToggleWishlist(product.id)}
                        aria-label={`Usuń ${product.name} z ulubionych`}
                        className="p-1.5 text-[#C5CFD8]/60 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
