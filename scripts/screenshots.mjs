import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const STORE = 'http://localhost:3000';
const ADMIN = 'http://localhost:3001';

const adminCreds = { email: 'admin@hotzyfoods.com', password: 'admin123' };
const VIEWPORT = { width: 1440, height: 900 };

mkdirSync('/home/xtx/Desktop/Hotzy/screenshots', { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: VIEWPORT });
const page = await context.newPage();

// ── Store pages ──
const storePages = [
  { name: '01-store-home', url: `${STORE}/` },
  { name: '02-store-products', url: `${STORE}/products` },
  { name: '03-store-product-detail', url: `${STORE}/products/snake-bite-hot-sauce` },
  { name: '04-store-cart', url: `${STORE}/cart` },
  { name: '05-store-about', url: `${STORE}/about` },
];

for (const p of storePages) {
  console.log(`Capturing ${p.name}...`);
  await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: `/home/xtx/Desktop/Hotzy/screenshots/${p.name}.png`,
    fullPage: true,
  });
  console.log(`  ✓ Saved ${p.name}.png`);
}

// ── Admin login ──
console.log('Logging in to admin...');
await page.goto(`${ADMIN}/login`, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1000);
await page.screenshot({
  path: `/home/xtx/Desktop/Hotzy/screenshots/06-admin-login.png`,
  fullPage: true,
});
console.log('  ✓ Saved 06-admin-login.png');

await page.fill('input[type="email"]', adminCreds.email);
await page.fill('input[type="password"]', adminCreds.password);
await page.click('button[type="submit"]');
await page.waitForURL('**/admin', { timeout: 15000 });
await page.waitForTimeout(5000);
console.log('  Logged in on dashboard');

// Dashboard screenshot
await page.screenshot({
  path: `/home/xtx/Desktop/Hotzy/screenshots/07-admin-dashboard.png`,
  fullPage: true,
});
console.log('  ✓ Saved 07-admin-dashboard.png');

// Navigate via sidebar buttons to keep zustand store alive
const navButtons = [
  { name: '08-admin-analytics', label: 'Analytics' },
  { name: '09-admin-products', label: 'Inventory' },
  { name: '10-admin-orders', label: 'Orders' },
  { name: '11-admin-customers', label: 'Customers' },
  { name: '12-admin-promotions', label: 'Promotions' },
  { name: '13-admin-website', label: 'Website' },
];

for (const nav of navButtons) {
  console.log(`Capturing ${nav.name}...`);
  // Click the sidebar button by its text label
  const btn = page.locator('button', { hasText: nav.label });
  await btn.click();
  // Wait for page + data to fully load
  await page.waitForTimeout(5000);
  await page.screenshot({
    path: `/home/xtx/Desktop/Hotzy/screenshots/${nav.name}.png`,
    fullPage: true,
  });
  console.log(`  ✓ Saved ${nav.name}.png`);
}

await browser.close();
console.log('\n✅ All screenshots captured!');
