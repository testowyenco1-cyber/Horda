export type CategoryId = 'pokemon' | 'beyblade' | 'figurki';

export type NavSection =
  | 'home'
  | 'pokemon'
  | 'beyblade'
  | 'figurki'
  | 'nowosci'
  | 'promocje'
  | 'spolecznosc'
  | 'catalog'
  | 'product';

export type AvailabilityStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder';

export type ProductType =
  | 'boostery'
  | 'boxy'
  | 'zestawy'
  | 'akcesoria'
  | 'beye'
  | 'launchery'
  | 'stadiony'
  | 'figurki_scale'
  | 'figurki_nendoroid'
  | 'figurki_prize';

export type ArtworkKind =
  | 'pokemon_box'
  | 'pokemon_etb'
  | 'pokemon_booster'
  | 'pokemon_accessories'
  | 'beyblade_top'
  | 'beyblade_launcher'
  | 'beyblade_stadium'
  | 'beyblade_set'
  | 'figure_scale'
  | 'figure_chibi'
  | 'figure_prize';

export type ProductTag = 'NOWOŚĆ' | 'PROMOCJA' | 'LIMITOWANY' | 'DROP' | 'BESTSELLER';

export interface ProductVariant {
  id: string;
  label: string;
  priceDelta?: number;
  stock: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  productType: ProductType;
  manufacturer: string;
  series: string;
  characterOrLine?: string;
  sizeOrScale?: string;
  price: number;
  previousPrice?: number;
  availability: AvailabilityStatus;
  stockCount: number;
  artworkKind: ArtworkKind;
  accentHex: string;
  images: string[];
  shortSummary: string;
  description: string;
  specs: ProductSpec[];
  variants?: ProductVariant[];
  tags: ProductTag[];
  isNew: boolean;
  isPromo: boolean;
  isBestseller: boolean;
  isWeeklyDrop: boolean;
  popularityScore: number;
  interestCount: number;
  releaseYear: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'popular';

export interface FilterState {
  category: CategoryId | 'all';
  searchQuery: string;
  manufacturers: string[];
  series: string[];
  productTypes: ProductType[];
  characterOrLines: string[];
  sizes: string[];
  priceMin: number | null;
  priceMax: number | null;
  onlyAvailable: boolean;
  onlyNew: boolean;
  onlyPromo: boolean;
  onlyDrop: boolean;
  sortBy: SortOption;
}

export interface CheckoutFormInput {
  fullName: string;
  email: string;
  phone: string;
  deliveryMethod: 'paczkomat' | 'kurier' | 'odbiór';
  addressLine: string;
  postalCode: string;
  city: string;
  notes: string;
}

export interface DemoOrderItem {
  productId: string;
  name: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface DemoOrder {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  deliveryLabel: string;
  items: DemoOrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  statusText: string;
}
