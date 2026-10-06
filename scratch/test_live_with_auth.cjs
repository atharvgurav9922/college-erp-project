const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const LIVE_URL = 'https://college-erp-project-mu.vercel.app';
const SCREENSHOT_DIR = path.resolve(__dirname, 'screenshots');

const ADMIN_USER = {
  id: 'USR-ADMIN-01',
  name: 'Dr. Arthur Vance',
  email: 'admin@campus.edu',
  role: 'admin',
  designation: 'Chief Administrator & Registrar',
  department: 'Administration'
};

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Set localStorage authentication on the live Vercel domain
  await page.goto(`${LIVE_URL}/login`, { waitUntil: 'networkidle' });
  await page.evaluate((user) => {
    localStorage.setItem('erp_auth_user', JSON.stringify(user));
  }, ADMIN_USER);

  console.log('Testing authenticated access to /admin on live Vercel...');
  await page.goto(`${LIVE_URL}/admin`, { waitUntil: 'networkidle' });
  console.log('Current URL:', page.url());
  console.log('Title:', await page.title());
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'live_admin_dashboard.png'), fullPage: true });

  console.log('Testing /admin/students on live Vercel...');
  await page.goto(`${LIVE_URL}/admin/students`, { waitUntil: 'networkidle' });
  console.log('Students Page URL:', page.url());
  const rows = await page.locator('tbody tr').count();
  console.log('Students Table Rows rendered:', rows);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'live_admin_students.png'), fullPage: true });

  console.log('Attempting Add Student on live Vercel...');
  await page.click('button:has-text("Add New Student")');
  await page.waitForTimeout(500);

  const nameInput = page.locator('input[placeholder*="Maya Lin"]');
  const rollInput = page.locator('input[placeholder*="2023-CSE"]');
  const emailInput = page.locator('form input[type="email"]');

  await nameInput.fill('Live Vercel Test');
  await rollInput.fill('2026-LIVE-001');
  await emailInput.fill('livetest@campus.edu');

  let postStatus = null;
  let postUrl = '';
  page.on('response', res => {
    if (res.request().method() === 'POST' && res.url().includes('/students')) {
      postStatus = res.status();
      postUrl = res.url();
      console.log('INTERCEPTED POST RESPONSE:', res.status(), res.url());
    }
  });

  await page.click('button:has-text("Create Student")');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'live_add_student_error.png') });
  const toastText = await page.locator('.fixed').textContent().catch(() => '');
  console.log('Toast on Add Student:', toastText);
  console.log('POST Status Code:', postStatus, 'URL:', postUrl);

  // Responsive mobile test
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'live_mobile_students.png'), fullPage: true });
  console.log('Saved mobile screenshot: live_mobile_students.png');

  await browser.close();
})();
