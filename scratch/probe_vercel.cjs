const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));

  const failedRequests = [];
  page.on('requestfailed', req => failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`));

  const apiResponses = [];
  page.on('response', res => {
    if (res.status() >= 400 || res.url().includes('/api')) {
      apiResponses.push(`${res.status()} ${res.request().method()} ${res.url()}`);
    }
  });

  console.log('Navigating to https://college-erp-project-mu.vercel.app ...');
  await page.goto('https://college-erp-project-mu.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });

  console.log('Final URL:', page.url());
  console.log('Title:', await page.title());
  console.log('Console logs:', consoleLogs);
  console.log('Failed requests:', failedRequests);
  console.log('API / Error responses:', apiResponses);

  await browser.close();
})();
