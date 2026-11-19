import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../data/products';
import {
  calculateCartTotals,
  DEFAULT_FILTERS,
  filterAndSortProducts,
  FREE_SHIPPING_THRESHOLD,
  getDiscountPercent,
  STANDARD_SHIPPING_COST,
  validateCheckoutForm,
} from './catalog';

test('filterAndSortProducts filters by category and productType', () => {
  const result = filterAndSortProducts(PRODUCTS, {
    ...DEFAULT_FILTERS,
    category: 'beyblade',
    productTypes: ['stadiony'],
  });
  assert.ok(result.length >= 2);
  assert.ok(result.every((p) => p.category === 'beyblade' && p.productType === 'stadiony'));
});

test('filterAndSortProducts keeps out-of-stock products visible unless onlyAvailable is checked', () => {
  const allPokemon = filterAndSortProducts(PRODUCTS, {
    ...DEFAULT_FILTERS,
    category: 'pokemon',
  });
  const availablePokemon = filterAndSortProducts(PRODUCTS, {
    ...DEFAULT_FILTERS,
    category: 'pokemon',
    onlyAvailable: true,
  });

  assert.ok(allPokemon.some((p) => p.availability === 'out_of_stock'));
  assert.ok(availablePokemon.every((p) => p.availability !== 'out_of_stock'));
  assert.ok(allPokemon.length > availablePokemon.length);
});

test('filterAndSortProducts sorts ascending and descending by price', () => {
  const asc = filterAndSortProducts(PRODUCTS, { ...DEFAULT_FILTERS, sortBy: 'price_asc' });
  const desc = filterAndSortProducts(PRODUCTS, { ...DEFAULT_FILTERS, sortBy: 'price_desc' });

  for (let i = 1; i < asc.length; i++) {
    assert.ok(asc[i].price >= asc[i - 1].price);
    assert.ok(desc[i].price <= desc[i - 1].price);
  }
});

test('calculateCartTotals computes subtotal, variant deltas, and free shipping threshold', () => {
  const totalsBelow = calculateCartTotals(
    [{ productId: 'pk-sv07-booster', variantId: '1pack', quantity: 2 }],
    PRODUCTS,
    'paczkomat'
  );
  assert.equal(totalsBelow.subtotal, 44);
  assert.equal(totalsBelow.shippingCost, STANDARD_SHIPPING_COST);
  assert.equal(totalsBelow.total, 44 + STANDARD_SHIPPING_COST);
  assert.equal(totalsBelow.freeShippingRemaining, FREE_SHIPPING_THRESHOLD - 44);

  const totalsAbove = calculateCartTotals(
    [{ productId: 'pk-sv85-etb', variantId: 'acrylic-case', quantity: 1 }],
    PRODUCTS,
    'paczkomat'
  );
  assert.equal(totalsAbove.subtotal, 279 + 65);
  assert.equal(totalsAbove.shippingCost, 0);
  assert.equal(totalsAbove.freeShippingRemaining, 0);
});

test('getDiscountPercent returns rounded discount or null', () => {
  assert.equal(getDiscountPercent(279, 329), 15);
  assert.equal(getDiscountPercent(100, 100), null);
  assert.equal(getDiscountPercent(100, undefined), null);
});

test('validateCheckoutForm catches invalid inputs and passes valid demo order', () => {
  const invalid = validateCheckoutForm({
    fullName: 'A',
    email: 'bad-email',
    phone: '12',
    deliveryMethod: 'kurier',
    addressLine: 'ul',
    postalCode: '123',
    city: '',
    notes: '',
  });
  assert.ok(invalid.fullName);
  assert.ok(invalid.email);
  assert.ok(invalid.phone);
  assert.ok(invalid.addressLine);
  assert.ok(invalid.postalCode);
  assert.ok(invalid.city);

  const valid = validateCheckoutForm({
    fullName: 'Jan Kowalski',
    email: 'jan@horda.demo',
    phone: '+48 600 100 200',
    deliveryMethod: 'paczkomat',
    addressLine: 'WAW123M',
    postalCode: '00-001',
    city: 'Warszawa',
    notes: '',
  });
  assert.deepEqual(valid, {});
});
