export const SITE_NAME = 'Hotzy Foods';
export const SITE_TAGLINE = 'Bold Flavor. Zero Limits.';
export const CURRENCY = 'Rs.';
export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_COST = 350;

export function formatPrice(price: number) {
  return `${CURRENCY} ${price.toLocaleString('en-LK')}`;
}
