import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (err) => console.log('PAGEERROR:', err.message));
await page.goto('http://localhost:3300/', { waitUntil: 'load' });
await page.waitForTimeout(400);
await page.click('button[aria-label="Menü öffnen"]');
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/shots/mobile-menu.png' });
// click a nav link and confirm menu closes + navigates
await page.click('text=Kontakt');
await page.waitForTimeout(500);
console.log('url after nav:', page.url());
const menuStillOpen = await page.locator('nav >> text=Jetzt anmelden').count();
console.log('mobile menu still mounted:', menuStillOpen > 0);
await browser.close();
