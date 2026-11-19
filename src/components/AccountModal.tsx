import React from 'react';
import { Bell, PackageCheck, User, X } from 'lucide-react';
import type { DemoOrder, Product } from '../types/store';
import { formatPLN } from '../utils/catalog';

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  orders: DemoOrder[];
  interestedIds: string[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export function AccountModal({
  open,
  onClose,
  orders,
  interestedIds,
  products,
  onSelectProduct,
}: AccountModalProps) {
  if (!open) return null;

  const interestedProducts = products.filter((p) => interestedIds.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Moje konto HORDA"
    >
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl rounded-xl bg-[#111925] border border-white/15 shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#9CDEF7]" />
            <h2 className="font-display text-2xl font-extrabold uppercase text-white">
              Moje konto (Podgląd Demo)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij okno konta"
            className="p-2 rounded-md text-[#C5CFD8] hover:text-white hover:bg-[#172333]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-4 rounded-lg bg-[#090D14] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#9CDEF7] font-semibold">
                Sesja demonstracyjna kolekcjonera
              </p>
              <p className="mt-1 text-base font-bold text-white">Gość HORDY</p>
              <p className="text-xs text-[#C5CFD8]/70 mt-0.5">
                Dane zamówień i powiadomień działają wyłącznie w pamięci bieżącej sesji (brak zapisu w localStorage).
              </p>
            </div>
          </div>

          {/* Demo Orders */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white mb-3">
              <PackageCheck className="w-4 h-4 text-[#A6CDA9]" />
              <span>Zamówienia demonstracyjne ({orders.length})</span>
            </h3>
            {orders.length === 0 ? (
              <p className="text-sm text-[#C5CFD8]/70 p-4 rounded-lg bg-[#090D14] border border-white/5">
                Brak złożonych zamówień demonstracyjnych w tej sesji. Dodaj produkty do koszyka i
                przejdź przez podsumowanie, aby zobaczyć tutaj historię.
              </p>
            ) : (
              <div className="space-y-2.5">
                {orders.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="p-4 rounded-lg bg-[#090D14] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">
                        {order.orderNumber} · {order.customerName}
                      </p>
                      <p className="text-xs text-[#C5CFD8]/70">
                        {order.createdAt} · {order.deliveryLabel}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#9CDEF7] tabular-nums">
                      {formatPLN(order.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interest / Restock alerts */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white mb-3">
              <Bell className="w-4 h-4 text-[#D8AD6C]" />
              <span>Obserwowane produkty niedostępne ({interestedProducts.length})</span>
            </h3>
            {interestedProducts.length === 0 ? (
              <p className="text-sm text-[#C5CFD8]/70 p-4 rounded-lg bg-[#090D14] border border-white/5">
                Nie zgłoszono jeszcze zainteresowania produktami chwilowo niedostępnymi.
              </p>
            ) : (
              <ul className="space-y-2">
                {interestedProducts.map((p) => (
                  <li
                    key={p.id}
                    className="p-3 rounded-lg bg-[#090D14] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-white truncate">{p.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectProduct(p);
                      }}
                      className="text-xs font-semibold text-[#9CDEF7] hover:underline shrink-0"
                    >
                      Zobacz kartę
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
