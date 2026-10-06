const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('response', async res => {
    if (res.url().includes('/api')) {
      const type = res.headers()['content-type'];
      console.log('API RESPONSE:', res.status(), res.request().method(), res.url(), type);
    }
  });

  await page.goto('https://college-erp-project-mu.vercel.app/login', { waitUntil: 'networkidle' });

  console.log('Testing 1: Standard login credentials on live Vercel...');
  await page.fill('input[type="email"]', 'admin@campus.edu');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button:has-text("Sign In with Credentials")');
  await page.waitForTimeout(1000);
  console.log('URL after standard login:', page.url());

  console.log('\nTesting 2: 1-click admin login card on live Vercel...');
  const adminBtn = page.locator('button:has-text("Dr. Arthur Vance")').first();
  await adminBtn.click();
  await page.waitForTimeout(2000);
  console.log('URL after 1-click login:', page.url());

  const storage = await page.evaluate(() => localStorage.getItem('erp_auth_user'));
  console.log('localStorage erp_auth_user:', storage);

  await browser.close();
})();
