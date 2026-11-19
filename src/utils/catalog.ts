import type {
  CartItem,
  CheckoutFormInput,
  FilterState,
  Product,
} from '../types/store';

export const FREE_SHIPPING_THRESHOLD = 299;
export const STANDARD_SHIPPING_COST = 16;

export const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  searchQuery: '',
  manufacturers: [],
  series: [],
  productTypes: [],
  characterOrLines: [],
  sizes: [],
  priceMin: null,
  priceMax: null,
  onlyAvailable: false,
  onlyNew: false,
  onlyPromo: false,
  onlyDrop: false,
  sortBy: 'featured',
};

export function formatPLN(amount: number): string {
  return `${Math.round(amount).toLocaleString('pl-PL')} zł`;
}

export function getDiscountPercent(price: number, previousPrice?: number): number | null {
  if (!previousPrice || previousPrice <= price) return null;
  return Math.round(((previousPrice - price) / previousPrice) * 100);
}

export function getProductEffectivePrice(product: Product, variantId?: string): number {
  if (!variantId || !product.variants) return product.price;
  const variant = product.variants.find((v) => v.id === variantId);
  return product.price + (variant?.priceDelta ?? 0);
}

export function filterAndSortProducts(products: Product[], filters: FilterState): Product[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = products.filter((p) => {
    if (filters.category !== 'all' && p.category !== filters.category) return false;

    if (query) {
      const haystack = [
        p.name,
        p.manufacturer,
        p.series,
        p.characterOrLine ?? '',
        p.shortSummary,
        p.category,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (filters.manufacturers.length > 0 && !filters.manufacturers.includes(p.manufacturer)) {
      return false;
    }

    if (filters.series.length > 0 && !filters.series.includes(p.series)) {
      return false;
    }

    if (filters.productTypes.length > 0 && !filters.productTypes.includes(p.productType)) {
      return false;
    }

    if (
      filters.characterOrLines.length > 0 &&
      (!p.characterOrLine || !filters.characterOrLines.includes(p.characterOrLine))
    ) {
      return false;
    }

    if (
      filters.sizes.length > 0 &&
      (!p.sizeOrScale || !filters.sizes.includes(p.sizeOrScale))
    ) {
      return false;
    }

    if (filters.priceMin !== null && p.price < filters.priceMin) return false;
    if (filters.priceMax !== null && p.price > filters.priceMax) return false;

    if (filters.onlyAvailable && p.availability === 'out_of_stock') return false;
    if (filters.onlyNew && !p.isNew) return false;
    if (filters.onlyPromo && !p.isPromo) return false;
    if (filters.onlyDrop && !p.isWeeklyDrop) return false;

    return true;
  });

  const sorted = [...filtered];
  sorted.sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'newest':
        if (b.releaseYear !== a.releaseYear) return b.releaseYear - a.releaseYear;
        if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
        return b.popularityScore - a.popularityScore;
      case 'popular':
        return b.popularityScore - a.popularityScore;
      case 'featured':
      default: {
        const aScore =
          (a.isWeeklyDrop ? 20 : 0) +
          (a.isBestseller ? 10 : 0) +
          (a.availability === 'out_of_stock' ? -15 : 0) +
          a.popularityScore * 0.1;
        const bScore =
          (b.isWeeklyDrop ? 20 : 0) +
          (b.isBestseller ? 10 : 0) +
          (b.availability === 'out_of_stock' ? -15 : 0) +
          b.popularityScore * 0.1;
        return bScore - aScore;
      }
    }
  });

  return sorted;
}

export interface CartTotals {
  subtotal: number;
  shippingCost: number;
  total: number;
  freeShippingRemaining: number;
  freeShippingProgressPct: number;
  itemCount: number;
}

export function calculateCartTotals(
  cartItems: CartItem[],
  products: Product[],
  deliveryMethod: CheckoutFormInput['deliveryMethod'] = 'paczkomat'
): CartTotals {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;
    const unitPrice = getProductEffectivePrice(product, item.variantId);
    subtotal += unitPrice * item.quantity;
    itemCount += item.quantity;
  }

  const qualifiesForFreeShipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || deliveryMethod === 'odbiór' || subtotal === 0;
  const shippingCost = qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_COST;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgressPct = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return {
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
    freeShippingRemaining,
    freeShippingProgressPct,
    itemCount,
  };
}

export function validateCheckoutForm(
  input: CheckoutFormInput
): Partial<Record<keyof CheckoutFormInput, string>> {
  const errors: Partial<Record<keyof CheckoutFormInput, string>> = {};

  if (input.fullName.trim().length < 3) {
    errors.fullName = 'Podaj imię i nazwisko (min. 3 znaki).';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = 'Podaj poprawny adres e-mail.';
  }
  if (!/^[+\d\s-]{7,18}$/.test(input.phone.trim())) {
    errors.phone = 'Podaj poprawny numer telefonu.';
  }
  if (input.deliveryMethod !== 'odbiór') {
    if (input.addressLine.trim().length < 4) {
      errors.addressLine =
        input.deliveryMethod === 'paczkomat'
          ? 'Podaj kod paczkomatu lub ulicę.'
          : 'Podaj ulicę i numer domu/mieszkania.';
    }
    if (!/^\d{2}-\d{3}$/.test(input.postalCode.trim())) {
      errors.postalCode = 'Użyj formatu XX-XXX (np. 00-001).';
    }
    if (input.city.trim().length < 2) {
      errors.city = 'Podaj nazwę miejscowości.';
    }
  }

  return errors;
}

export function getActiveFilterCount(filters: FilterState): number {
  let count = 0;
  if (filters.category !== 'all') count += 1;
  if (filters.searchQuery.trim()) count += 1;
  count += filters.manufacturers.length;
  count += filters.series.length;
  count += filters.productTypes.length;
  count += filters.characterOrLines.length;
  count += filters.sizes.length;
  if (filters.priceMin !== null) count += 1;
  if (filters.priceMax !== null) count += 1;
  if (filters.onlyAvailable) count += 1;
  if (filters.onlyNew) count += 1;
  if (filters.onlyPromo) count += 1;
  if (filters.onlyDrop) count += 1;
  return count;
}
