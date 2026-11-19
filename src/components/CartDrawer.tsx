import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus,
  ShieldAlert,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import type {
  CartItem,
  CheckoutFormInput,
  DemoOrder,
  Product,
} from '../types/store';
import {
  calculateCartTotals,
  formatPLN,
  FREE_SHIPPING_THRESHOLD,
  getProductEffectivePrice,
  validateCheckoutForm,
} from '../utils/catalog';
import { ProductArtwork } from './ProductArtwork';
import { PRODUCT_MEDIA } from '../data/product-media';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: string, variantId: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string | undefined) => void;
  onClearCart: () => void;
  onBrowseCatalog: () => void;
  onRecordDemoOrder: (order: DemoOrder) => void;
}

const INITIAL_FORM: CheckoutFormInput = {
  fullName: '',
  email: '',
  phone: '',
  deliveryMethod: 'paczkomat',
  addressLine: '',
  postalCode: '',
  city: '',
  notes: '',
};

export function CartDrawer({
  open,
  onClose,
  cartItems,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBrowseCatalog,
  onRecordDemoOrder,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [form, setForm] = useState<CheckoutFormInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormInput, string>>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<DemoOrder | null>(null);

  if (!open) return null;

  const totals = calculateCartTotals(cartItems, products, form.deliveryMethod);

  const handleClose = () => {
    if (step === 'confirmed') {
      setStep('cart');
      setConfirmedOrder(null);
    }
    onClose();
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setErrors({});
    const orderItems = cartItems
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        const unitPrice = getProductEffectivePrice(product, item.variantId);
        return {
          productId: product.id,
          name: product.name,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
          unitPrice,
          lineTotal: unitPrice * item.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const deliveryNames: Record<CheckoutFormInput['deliveryMethod'], string> = {
      paczkomat: `Paczkomat (${form.addressLine}, ${form.city})`,
      kurier: `Kurier (${form.addressLine}, ${form.postalCode} ${form.city})`,
      odbiór: 'Odbiór osobisty w punkcie HORDA',
    };

    const order: DemoOrder = {
      orderNumber: `HRD-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: form.fullName.trim(),
      deliveryLabel: deliveryNames[form.deliveryMethod],
      items: orderItems,
      subtotal: totals.subtotal,
      shippingCost: totals.shippingCost,
      total: totals.total,
      statusText: 'Zamówienie demonstracyjne zarejestrowane (brak płatności)',
    };

    setConfirmedOrder(order);
    onRecordDemoOrder(order);
    onClearCart();
    setForm(INITIAL_FORM);
    setStep('confirmed');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Koszyk HORDA"
    >
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-lg bg-[#111925] h-full border-l border-white/10 flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="Wróć do koszyka"
                className="p-1.5 rounded hover:bg-[#172333] text-[#C5CFD8]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-[#9CDEF7]" />
            <h2 className="font-display text-xl font-extrabold uppercase text-white">
              {step === 'cart'
                ? `Twój koszyk (${totals.itemCount})`
                : step === 'checkout'
                ? 'Demonstracyjny Checkout'
                : 'Potwierdzenie (Demo)'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Zamknij koszyk"
            className="p-2 rounded-md text-[#C5CFD8] hover:text-white hover:bg-[#172333]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Cart Contents */}
        {step === 'cart' && (
          <>
            {/* Free shipping progress */}
            <div className="px-5 py-3 bg-[#0C121B] border-b border-white/5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-[#C5CFD8]">
                  <Truck className="w-3.5 h-3.5 text-[#9CDEF7]" />
                  {totals.freeShippingRemaining === 0 && totals.subtotal > 0 ? (
                    <span className="text-[#A6CDA9] font-semibold">
                      Darmowa dostawa odblokowana
                    </span>
                  ) : (
                    <span>
                      Do darmowej dostawy brakuje:{' '}
                      <strong className="text-white tabular-nums">
                        {formatPLN(totals.freeShippingRemaining)}
                      </strong>
                    </span>
                  )}
                </span>
                <span className="text-[#C5CFD8]/60 tabular-nums">
                  próg {FREE_SHIPPING_THRESHOLD} zł
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#172333] overflow-hidden">
                <div
                  className="h-full bg-[#9CDEF7] transition-all duration-300"
                  style={{ width: `${totals.freeShippingProgressPct}%` }}
                />
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingBag className="w-12 h-12 text-[#9CDEF7]/40 mb-3" />
                <h3 className="font-display text-2xl font-bold uppercase text-white">
                  Koszyk jest pusty
                </h3>
                <p className="mt-1.5 text-sm text-[#C5CFD8]/75 max-w-xs">
                  Dodaj karty Pokémon TCG, beye lub figurki kolekcjonerskie, aby przetestować
                  demonstracyjny koszyk HORDA.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBrowseCatalog();
                  }}
                  className="mt-5 px-5 py-2.5 rounded-md bg-[#9CDEF7] hover:bg-[#BBE8FA] text-[#090D14] text-sm font-bold transition-colors"
                >
                  Przeglądaj katalog
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto divide-y divide-white/10 px-5">
                  {cartItems.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    const unitPrice = getProductEffectivePrice(product, item.variantId);
                    const lineTotal = unitPrice * item.quantity;

                    return (
                      <li
                        key={`${item.productId}-${item.variantId ?? 'default'}`}
                        className="py-4 flex gap-3.5 items-start"
                      >
                        <div className="w-20 h-16 rounded-md overflow-hidden border border-white/10 shrink-0">
                          <ProductArtwork
                            kind={product.artworkKind}
                            accentHex={product.accentHex}
                            title={product.name}
                            imageUrl={PRODUCT_MEDIA[product.id]?.imageUrl}
                            showPlaceholderCaption={false}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
                            {product.name}
                          </p>
                          {item.variantLabel && (
                            <p className="text-xs text-[#9CDEF7] mt-0.5">{item.variantLabel}</p>
                          )}

                          <div className="mt-2.5 flex items-center justify-between gap-2">
                            <div className="inline-flex items-center h-8 rounded bg-[#090D14] border border-white/15">
                              <button
                                type="button"
                                aria-label={`Zmniejsz ilość ${product.name}`}
                                onClick={() =>
                                  onUpdateQuantity(item.productId, item.variantId, -1)
                                }
                                className="w-7 h-full flex items-center justify-center text-[#C5CFD8] hover:text-white"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-white tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label={`Zwiększ ilość ${product.name}`}
                                onClick={() =>
                                  onUpdateQuantity(item.productId, item.variantId, 1)
                                }
                                className="w-7 h-full flex items-center justify-center text-[#C5CFD8] hover:text-white"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-white tabular-nums">
                                {formatPLN(lineTotal)}
                              </span>
                              <button
                                type="button"
                                aria-label={`Usuń ${product.name} z koszyka`}
                                onClick={() => onRemoveItem(item.productId, item.variantId)}
                                className="p-1.5 text-[#C5CFD8]/60 hover:text-[#D8AD6C] transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="p-5 border-t border-white/10 bg-[#0C121B] space-y-3">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-[#C5CFD8]">
                      <span>Wartość produktów</span>
                      <span className="tabular-nums text-white font-semibold">
                        {formatPLN(totals.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#C5CFD8]">
                      <span>Szacowana dostawa</span>
                      <span className="tabular-nums text-white font-semibold">
                        {totals.shippingCost === 0 ? 'Gratis' : formatPLN(totals.shippingCost)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold text-white">
                      <span>Razem</span>
                      <span className="text-[#9CDEF7] tabular-nums">{formatPLN(totals.total)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="w-full h-11 rounded-md bg-[#9CDEF7] hover:bg-[#BBE8FA] text-[#090D14] font-bold text-sm transition-colors"
                  >
                    Przejdź do podsumowania (Demo)
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* Step 2: Demo Checkout Form */}
        {step === 'checkout' && (
          <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="p-3.5 rounded-md bg-[#172333] border border-[#D8AD6C]/40 flex gap-2.5 text-xs text-[#C5CFD8]">
                <ShieldAlert className="w-4 h-4 text-[#D8AD6C] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Tryb demonstracyjny:</strong> Formularz prezentuje
                  przyszły proces zamówienia. Nie są tu realizowane płatności ani trwałe zapisy danych.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C5CFD8] mb-1.5" htmlFor="chk-name">
                  Imię i nazwisko (dane demo)
                </label>
                <input
                  id="chk-name"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="np. Jan Kowalski"
                  className="w-full h-10 px-3 rounded-md bg-[#090D14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#9CDEF7]"
                />
                {errors.fullName && <p className="mt-1 text-xs text-[#D8AD6C]">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#C5CFD8] mb-1.5" htmlFor="chk-email">
                    E-mail
                  </label>
                  <input
                    id="chk-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jan@przyklad.pl"
                    className="w-full h-10 px-3 rounded-md bg-[#090D14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#9CDEF7]"
                  />
                  {errors.email && <p className="mt-1 text-xs text-[#D8AD6C]">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C5CFD8] mb-1.5" htmlFor="chk-phone">
                    Telefon
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+48 600 000 000"
                    className="w-full h-10 px-3 rounded-md bg-[#090D14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#9CDEF7]"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-[#D8AD6C]">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#C5CFD8] mb-1.5">
                  Sposób dostawy
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'paczkomat', label: 'Paczkomat' },
                      { id: 'kurier', label: 'Kurier' },
                      { id: 'odbiór', label: 'Odbiór' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setForm({ ...form, deliveryMethod: opt.id })}
                      className={`py-2 px-2.5 rounded-md border text-xs font-semibold transition-colors ${
                        form.deliveryMethod === opt.id
                          ? 'bg-[#172333] border-[#9CDEF7] text-[#9CDEF7]'
                          : 'bg-[#090D14] border-white/15 text-[#C5CFD8]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.deliveryMethod !== 'odbiór' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#C5CFD8] mb-1.5" htmlFor="chk-addr">
                      {form.deliveryMethod === 'paczkomat'
                        ? 'Kod paczkomatu lub ulica'
                        : 'Ulica i numer'}
                    </label>
                    <input
                      id="chk-addr"
                      type="text"
                      value={form.addressLine}
                      onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                      placeholder={
                        form.deliveryMethod === 'paczkomat' ? 'np. WAW123M' : 'ul. Księżycowa 12/4'
                      }
                      className="w-full h-10 px-3 rounded-md bg-[#090D14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#9CDEF7]"
                    />
                    {errors.addressLine && (
                      <p className="mt-1 text-xs text-[#D8AD6C]">{errors.addressLine}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#C5CFD8] mb-1.5" htmlFor="chk-zip">
                        Kod pocztowy
                      </label>
                      <input
                        id="chk-zip"
                        type="text"
                        value={form.postalCode}
                        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                        placeholder="00-001"
                        className="w-full h-10 px-3 rounded-md bg-[#090D14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#9CDEF7]"
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-xs text-[#D8AD6C]">{errors.postalCode}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#C5CFD8] mb-1.5" htmlFor="chk-city">
                        Miejscowość
                      </label>
                      <input
                        id="chk-city"
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Warszawa"
                        className="w-full h-10 px-3 rounded-md bg-[#090D14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#9CDEF7]"
                      />
                      {errors.city && <p className="mt-1 text-xs text-[#D8AD6C]">{errors.city}</p>}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-5 border-t border-white/10 bg-[#0C121B] space-y-3">
              <div className="flex justify-between text-sm font-bold text-white">
                <span>Do zapłaty (Demo)</span>
                <span className="text-[#9CDEF7] tabular-nums">{formatPLN(totals.total)}</span>
              </div>
              <button
                type="submit"
                className="w-full h-11 rounded-md bg-[#9CDEF7] hover:bg-[#BBE8FA] text-[#090D14] font-bold text-sm transition-colors"
              >
                Złóż zamówienie demonstracyjne
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation Receipt */}
        {step === 'confirmed' && confirmedOrder && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-[#A6CDA9] mb-4">
                <CheckCircle2 className="w-8 h-8 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">
                    Symulacja zakończona pomyślnie
                  </p>
                  <h3 className="font-display text-2xl font-extrabold uppercase text-white">
                    Zamówienie {confirmedOrder.orderNumber}
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#090D14] border border-white/10 space-y-2 text-sm">
                <p className="text-[#C5CFD8]">
                  Odbiorca: <strong className="text-white">{confirmedOrder.customerName}</strong>
                </p>
                <p className="text-[#C5CFD8]">
                  Dostawa: <strong className="text-white">{confirmedOrder.deliveryLabel}</strong>
                </p>
                <p className="text-xs text-[#D8AD6C] pt-1">
                  {confirmedOrder.statusText}
                </p>
              </div>

              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5CFD8]/70 mb-2">
                  Pozycje zamówienia
                </h4>
                <ul className="divide-y divide-white/10 text-sm">
                  {confirmedOrder.items.map((item, idx) => (
                    <li key={idx} className="py-2.5 flex justify-between gap-3">
                      <span className="text-[#C5CFD8]">
                        {item.quantity}× {item.name}
                      </span>
                      <span className="font-semibold text-white tabular-nums shrink-0">
                        {formatPLN(item.lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 mt-2 border-t border-white/15 flex justify-between text-base font-bold text-white">
                  <span>Suma końcowa</span>
                  <span className="text-[#9CDEF7] tabular-nums">
                    {formatPLN(confirmedOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full h-11 rounded-md bg-[#9CDEF7] hover:bg-[#BBE8FA] text-[#090D14] font-bold text-sm transition-colors"
            >
              Wróć do sklepu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
