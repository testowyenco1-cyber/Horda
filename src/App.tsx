import React, { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PRODUCTS } from './data/products';
import type {
  CartItem,
  CategoryId,
  DemoOrder,
  FilterState,
  NavSection,
  Product,
} from './types/store';
import { DEFAULT_FILTERS } from './utils/catalog';
import { AccountModal } from './components/AccountModal';
import { CartDrawer } from './components/CartDrawer';
import { CatalogView } from './components/CatalogView';
import { CategoryTiles } from './components/CategoryTiles';
import { CommunityView } from './components/CommunityView';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import {
  NayraBrandCorner,
  NewsletterBanner,
  ProductRowSection,
  RecommendedCategories,
} from './components/HomeSections';
import { ProductDetailView } from './components/ProductDetailView';
import { TopBarAndHeader } from './components/TopBarAndHeader';
import { WeeklyDropSection } from './components/WeeklyDropSection';
import { WishlistDrawer } from './components/WishlistDrawer';

type ViewMode = 'home' | 'catalog' | 'product' | 'community';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [activeNav, setActiveNav] = useState<NavSection>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Ephemeral session state (no customer PII stored in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { productId: 'pk-sv85-etb', variantId: 'std-en', variantLabel: 'Edycja Standard (EN)', quantity: 1 },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['fig-gengar-scale']);
  const [interestedIds, setInterestedIds] = useState<string[]>([]);
  const [interestCounts, setInterestCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const p of PRODUCTS) {
      initial[p.id] = p.interestCount;
    }
    return initial;
  });
  const [demoOrders, setDemoOrders] = useState<DemoOrder[]>([]);

  // Overlays
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (section: NavSection) => {
    setActiveNav(section);
    if (section === 'home') {
      setViewMode('home');
      setSelectedProductId(null);
      scrollToTop();
      return;
    }
    if (section === 'spolecznosc') {
      setViewMode('community');
      setSelectedProductId(null);
      scrollToTop();
      return;
    }
    if (section === 'pokemon' || section === 'beyblade' || section === 'figurki') {
      setFilters({ ...DEFAULT_FILTERS, category: section });
      setViewMode('catalog');
      setSelectedProductId(null);
      scrollToTop();
      return;
    }
    if (section === 'nowosci') {
      setFilters({ ...DEFAULT_FILTERS, onlyNew: true, sortBy: 'newest' });
      setViewMode('catalog');
      setSelectedProductId(null);
      scrollToTop();
      return;
    }
    if (section === 'promocje') {
      setFilters({ ...DEFAULT_FILTERS, onlyPromo: true });
      setViewMode('catalog');
      setSelectedProductId(null);
      scrollToTop();
      return;
    }
    setFilters(DEFAULT_FILTERS);
    setViewMode('catalog');
    setSelectedProductId(null);
    scrollToTop();
  };

  const handleViewDrop = () => {
    setActiveNav('catalog');
    setFilters({ ...DEFAULT_FILTERS, onlyDrop: true });
    setViewMode('catalog');
    scrollToTop();
  };

  const handleSelectCategory = (category: CategoryId) => {
    handleNavigate(category);
  };

  const handleSearchSubmit = (q: string) => {
    setActiveNav('catalog');
    setFilters((prev) => ({ ...prev, searchQuery: q }));
    setViewMode('catalog');
    scrollToTop();
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setViewMode('product');
    scrollToTop();
  };

  const handleAddToCart = (
    product: Product,
    quantity = 1,
    variantId?: string,
    variantLabel?: string
  ) => {
    const chosenVariantId = variantId ?? product.variants?.[0]?.id;
    const chosenVariantLabel =
      variantLabel ??
      product.variants?.find((v) => v.id === chosenVariantId)?.label;

    setCartItems((prev) => {
      const idx = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === chosenVariantId
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: chosenVariantId,
          variantLabel: chosenVariantLabel,
          quantity,
        },
      ];
    });
    showToast(`Dodano do koszyka: ${product.name}`);
  };

  const handleUpdateCartQuantity = (
    productId: string,
    variantId: string | undefined,
    delta: number
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string, variantId: string | undefined) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      )
    );
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Usunięto z ulubionych' : 'Dodano do ulubionych');
      return next;
    });
  };

  const handleToggleInterest = (productId: string) => {
    setInterestedIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        setInterestCounts((c) => ({
          ...c,
          [productId]: Math.max(0, (c[productId] ?? 1) - 1),
        }));
        showToast('Anulowano powiadomienie o dostępności');
        return prev.filter((id) => id !== productId);
      }
      setInterestCounts((c) => ({
        ...c,
        [productId]: (c[productId] ?? 0) + 1,
      }));
      showToast('Zapisano zainteresowanie — powiadomimy o dostawie');
      return [...prev, productId];
    });
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const categoryCounts = useMemo(
    () => ({
      pokemon: PRODUCTS.filter((p) => p.category === 'pokemon').length,
      beyblade: PRODUCTS.filter((p) => p.category === 'beyblade').length,
      figurki: PRODUCTS.filter((p) => p.category === 'figurki').length,
      deals: PRODUCTS.filter((p) => p.isPromo || p.isNew).length,
    }),
    []
  );

  const dropProducts = useMemo(
    () => PRODUCTS.filter((p) => p.isWeeklyDrop).slice(0, 3),
    []
  );
  const bestsellerProducts = useMemo(
    () => PRODUCTS.filter((p) => p.isBestseller).slice(0, 4),
    []
  );
  const newProducts = useMemo(
    () => PRODUCTS.filter((p) => p.isNew).slice(0, 4),
    []
  );
  const promoProducts = useMemo(
    () => PRODUCTS.filter((p) => p.isPromo).slice(0, 4),
    []
  );

  const selectedProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === selectedProductId) ?? null,
    [selectedProductId]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#090D14] text-[#C5CFD8]">
      <TopBarAndHeader
        activeNav={activeNav}
        onNavigate={handleNavigate}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        onSearchSubmit={handleSearchSubmit}
        onSelectProduct={handleSelectProduct}
        products={PRODUCTS}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      <main className="flex-1">
        {viewMode === 'home' && (
          <>
            <HeroSection
              onBrowseCatalog={() => handleNavigate('catalog')}
              onViewDrops={handleViewDrop}
            />

            <CategoryTiles
              counts={categoryCounts}
              onSelectSection={handleNavigate}
            />

            <WeeklyDropSection
              dropProducts={dropProducts}
              wishlistIds={wishlistIds}
              interestedIds={interestedIds}
              onSelectProduct={handleSelectProduct}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onToggleWishlist={handleToggleWishlist}
              onToggleInterest={handleToggleInterest}
              onViewAllDrop={handleViewDrop}
            />

            <ProductRowSection
              title="Bestsellery"
              subtitle="Najchętniej wybierane boxy, dyski Beyblade X i figurki w sklepie HORDA."
              products={bestsellerProducts}
              wishlistIds={wishlistIds}
              interestedIds={interestedIds}
              onSelectProduct={handleSelectProduct}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onToggleWishlist={handleToggleWishlist}
              onToggleInterest={handleToggleInterest}
              onViewAll={() => {
                setFilters({ ...DEFAULT_FILTERS, sortBy: 'popular' });
                setActiveNav('catalog');
                setViewMode('catalog');
                scrollToTop();
              }}
              viewAllLabel="Wszystkie bestsellery"
            />

            <ProductRowSection
              title="Nowości"
              subtitle="Świeże dostawy, premiery serii oraz japońskie wydania kolekcjonerskie."
              products={newProducts}
              wishlistIds={wishlistIds}
              interestedIds={interestedIds}
              onSelectProduct={handleSelectProduct}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onToggleWishlist={handleToggleWishlist}
              onToggleInterest={handleToggleInterest}
              onViewAll={() => handleNavigate('nowosci')}
              viewAllLabel="Zobacz wszystkie nowości"
            />

            <ProductRowSection
              title="Promocje"
              subtitle="Wybrane okazje cenowe z wyraźnie oznaczoną ceną poprzednią."
              products={promoProducts}
              wishlistIds={wishlistIds}
              interestedIds={interestedIds}
              onSelectProduct={handleSelectProduct}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onToggleWishlist={handleToggleWishlist}
              onToggleInterest={handleToggleInterest}
              onViewAll={() => handleNavigate('promocje')}
              viewAllLabel="Wszystkie promocje"
            />

            <RecommendedCategories onSelectCategory={handleSelectCategory} />

            <NayraBrandCorner
              onOpenCommunity={() => handleNavigate('spolecznosc')}
              onNavigate={handleNavigate}
            />

            <NewsletterBanner />
          </>
        )}

        {viewMode === 'catalog' && (
          <CatalogView
            allProducts={PRODUCTS}
            filters={filters}
            onUpdateFilters={setFilters}
            onResetFilters={() => {
              setFilters(DEFAULT_FILTERS);
              setActiveNav('catalog');
            }}
            onGoHome={() => handleNavigate('home')}
            wishlistIds={wishlistIds}
            interestedIds={interestedIds}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onToggleWishlist={handleToggleWishlist}
            onToggleInterest={handleToggleInterest}
          />
        )}

        {viewMode === 'product' && selectedProduct && (
          <ProductDetailView
            key={selectedProduct.id}
            product={selectedProduct}
            allProducts={PRODUCTS}
            wishlistIds={wishlistIds}
            interestedIds={interestedIds}
            interestCounts={interestCounts}
            onBackToCatalog={() => {
              setViewMode('catalog');
              scrollToTop();
            }}
            onGoHome={() => handleNavigate('home')}
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onToggleInterest={handleToggleInterest}
          />
        )}

        {viewMode === 'community' && (
          <CommunityView
            onGoHome={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Drawers & Modals */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        products={PRODUCTS}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        onBrowseCatalog={() => handleNavigate('catalog')}
        onRecordDemoOrder={(order) => setDemoOrders((prev) => [order, ...prev])}
      />

      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistIds={wishlistIds}
        interestedIds={interestedIds}
        products={PRODUCTS}
        onSelectProduct={handleSelectProduct}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onToggleWishlist={handleToggleWishlist}
        onToggleInterest={handleToggleInterest}
      />

      <AccountModal
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        orders={demoOrders}
        interestedIds={interestedIds}
        products={PRODUCTS}
        onSelectProduct={handleSelectProduct}
      />

      {/* Crisp Action Toast */}
      {toastMessage && !cartOpen && !wishlistOpen && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#172333] border border-[#9CDEF7]/50 text-sm font-medium text-white shadow-2xl max-w-[90vw]"
        >
          <CheckCircle2 className="w-4 h-4 text-[#9CDEF7] shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
