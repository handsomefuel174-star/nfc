export const BASE_PRICE = 150000;
export const MIN_QTY = 1;
export const MAX_QTY = 50;
export const tiers = [
  { from: 1, to: 2, price: 150000 },
  { from: 3, to: 6, price: 125000 },
  { from: 7, to: 14, price: 100000 },
  { from: 15, to: null, price: 75000 },
] as const;

export function tierIndex(qty: number) {
  for (let i = tiers.length - 1; i >= 0; i--) if (qty >= tiers[i]!.from) return i;
  return 0;
}
export function unitPrice(qty: number) { return tiers[tierIndex(qty)]!.price; }
export function total(qty: number) { return qty <= 0 ? 0 : unitPrice(qty) * qty; }
export function savings(qty: number) { return qty <= 0 ? 0 : BASE_PRICE * qty - total(qty); }
export function nextTier(qty: number) {
  const next = tiers[tierIndex(qty) + 1];
  return next ? { missing: next.from - qty, price: next.price } : null;
}
export function formatGs(value: number) { return `${new Intl.NumberFormat("es-PY").format(value).replace(/,/g, ".")} Gs`; }
