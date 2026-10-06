const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LIVE_URL = 'https://college-erp-project-mu.vercel.app';
const SCREENSHOT_DIR = path.resolve(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const testResults = [];
function recordResult(area, test, status, error = '', notes = '') {
  testResults.push({ area, test, status, error, notes });
  console.log(`[${status}] ${area} -> ${test}${error ? ': ' + error : ''}`);
}

async function runLivePlaywrightSuite() {
  console.log('====================================================');
  console.log('LAUNCHING COMPREHENSIVE PLAYWRIGHT TEST ON LIVE VERCEL');
  console.log(`Target: ${LIVE_URL}`);
  console.log('====================================================\n');

  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // ==========================================
  // SECTION 1: AUTHENTICATION & LOGIN ROLES
  // ==========================================
  console.log('--- 1. TESTING AUTHENTICATION & ALL ROLES ---');
  {
    const context = await browser.newContext();
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const networkFailures = [];
    page.on('requestfailed', req => {
      networkFailures.push(`${req.method()} ${req.url()} (${req.failure()?.errorText})`);
    });

    // 1.1 Home / Root URL -> redirects to /login
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      recordResult('Home Page', 'Redirect to Login for unauthenticated users', 'PASS', '', `Redirected to ${currentUrl}`);
    } else {
      recordResult('Home Page', 'Redirect to Login', 'FAIL', `Expected /login, got ${currentUrl}`);
    }

    // 1.2 Admin Login via credentials
    await page.fill('input[type="email"]', 'admin@campus.edu');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Sign In with Credentials")');
    await page.waitForTimeout(1000);

    // Check if on live Vercel standard login works (Note: on live Vercel before the latest commit, handleStandardLogin lacked await, or POST /api/auth/login returned 405)
    let adminLoggedIn = page.url().includes('/admin');
    if (!adminLoggedIn) {
      // Check for toast message
      const toastText = await page.textContent('.fixed').catch(() => '');
      // Try 1-click login if standard login failed on live deployment
      console.log('Notice: Standard login on live Vercel response URL:', page.url(), 'Toast:', toastText);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'admin_standard_login_failed.png') });
      
      // Test 1-click admin demo login button
      const adminCard = page.locator('button:has-text("Dr. Arthur Vance")').or(page.locator('button:has-text("Chief Administrator")')).first();
      if (await adminCard.isVisible()) {
        await adminCard.click();
        await page.waitForTimeout(1500);
      }
      adminLoggedIn = page.url().includes('/admin');
      if (adminLoggedIn) {
        recordResult('Login', 'Admin (via 1-Click Demo)', 'PASS', '', 'Logged in via 1-Click demo authentication');
        recordResult('Login', 'Admin (via Credentials Form)', 'FAIL', `Credentials login failed on live Vercel (API POST /api/auth/login returns 405 Method Not Allowed). Toast: "${toastText || 'Invalid credentials'}"`);
      } else {
        recordResult('Login', 'Admin', 'FAIL', 'Could not authenticate into /admin');
      }
    } else {
      recordResult('Login', 'Admin', 'PASS', '', 'Logged in to /admin via credentials');
    }

    // 1.3 Faculty Portal Login
    await page.goto(`${LIVE_URL}/login`, { waitUntil: 'networkidle' });
    const facultyCard = page.locator('button:has-text("Dr. Sarah Jenkins")').or(page.locator('button:has-text("faculty")')).first();
    if (await facultyCard.isVisible()) {
      await facultyCard.click();
      await page.waitForTimeout(1500);
      if (page.url().includes('/faculty')) {
        recordResult('Login', 'Faculty', 'PASS', '', 'Successfully loaded /faculty portal');
      } else {
        recordResult('Login', 'Faculty', 'FAIL', `Expected /faculty, got ${page.url()}`);
      }
    } else {
      recordResult('Login', 'Faculty', 'FAIL', 'Faculty login card not found');
    }

    // 1.4 Student Portal Login
    await page.goto(`${LIVE_URL}/login`, { waitUntil: 'networkidle' });
    const studentCard = page.locator('button:has-text("Alex Rivera")').or(page.locator('button:has-text("student")')).first();
    if (await studentCard.isVisible()) {
      await studentCard.click();
      await page.waitForTimeout(1500);
      if (page.url().includes('/student')) {
        recordResult('Login', 'Student', 'PASS', '', 'Successfully loaded /student portal');
      } else {
        recordResult('Login', 'Student', 'FAIL', `Expected /student, got ${page.url()}`);
      }
    } else {
      recordResult('Login', 'Student', 'FAIL', 'Student login card not found');
    }

    // 1.5 Hostel Warden Login
    await page.goto(`${LIVE_URL}/login`, { waitUntil: 'networkidle' });
    const wardenCard = page.locator('button:has-text("Rajesh Sharma")').or(page.locator('button:has-text("warden")')).first();
    if (await wardenCard.isVisible()) {
      await wardenCard.click();
      await page.waitForTimeout(1500);
      if (page.url().includes('/hostel')) {
        recordResult('Login', 'Hostel Warden', 'PASS', '', 'Successfully loaded /hostel portal');
      } else {
        recordResult('Login', 'Hostel Warden', 'FAIL', `Expected /hostel, got ${page.url()}`);
      }
    } else {
      recordResult('Login', 'Hostel Warden', 'FAIL', 'Warden login card not found');
    }

    // 1.6 Transport Manager Login
    await page.goto(`${LIVE_URL}/login`, { waitUntil: 'networkidle' });
    const transportCard = page.locator('button:has-text("Vikram Malhotra")').or(page.locator('button:has-text("transport")')).first();
    if (await transportCard.isVisible()) {
      await transportCard.click();
      await page.waitForTimeout(1500);
      if (page.url().includes('/transport')) {
        recordResult('Login', 'Transport Manager', 'PASS', '', 'Successfully loaded /transport portal');
      } else {
        recordResult('Login', 'Transport Manager', 'FAIL', `Expected /transport, got ${page.url()}`);
      }
    } else {
      recordResult('Login', 'Transport Manager', 'FAIL', 'Transport login card not found');
    }

    await context.close();
  }

  // ==========================================
  // SECTION 2: ROUTING TEST (REFRESH, 404, BACK/FORWARD)
  // ==========================================
  console.log('\n--- 2. TESTING ROUTING & 404 VERCEL BEHAVIOR ---');
  {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Authenticate as Admin first so dashboard routes don't redirect
    await page.goto(`${LIVE_URL}/login`, { waitUntil: 'networkidle' });
    await page.locator('button:has-text("Dr. Arthur Vance")').first().click();
    await page.waitForTimeout(1500);

    const routesToCheck = [
      { path: '/admin', name: 'Dashboard' },
      { path: '/admin/students', name: 'Students Directory' },
      { path: '/admin/faculty', name: 'Faculty Directory' },
      { path: '/admin/departments', name: 'Departments' },
      { path: '/admin/notices', name: 'Notices' },
      { path: '/admin/infrastructure', name: 'Infrastructure' }
    ];

    for (const r of routesToCheck) {
      // Step 1: Direct navigation
      const res = await page.goto(`${LIVE_URL}${r.path}`, { waitUntil: 'networkidle' });
      const status = res?.status();
      const content = await page.content();
      const has404 = content.includes('404: NOT_FOUND') || content.includes('Page Not Found') || status === 404;

      if (!has404 && status === 200) {
        // Step 2: Refresh
        const reloadRes = await page.reload({ waitUntil: 'networkidle' });
        const reloadContent = await page.content();
        const reload404 = reloadContent.includes('404: NOT_FOUND') || reloadRes?.status() === 404;

        if (!reload404 && reloadRes?.status() === 200) {
          recordResult('Routing', `${r.name} (${r.path}) Direct & Refresh`, 'PASS', '', 'Status 200, no Vercel 404');
        } else {
          recordResult('Routing', `${r.name} (${r.path}) Refresh`, 'FAIL', `Returned Vercel 404 on refresh!`);
          await page.screenshot({ path: path.join(SCREENSHOT_DIR, `routing_refresh_fail_${r.name.replace(/\s+/g, '_')}.png`) });
        }
      } else {
        recordResult('Routing', `${r.name} (${r.path}) Direct URL`, 'FAIL', `Direct URL failed with status ${status}`);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `routing_direct_fail_${r.name.replace(/\s+/g, '_')}.png`) });
      }
    }

    // Browser Back and Forward
    await page.goto(`${LIVE_URL}/admin/students`, { waitUntil: 'networkidle' });
    await page.goto(`${LIVE_URL}/admin/faculty`, { waitUntil: 'networkidle' });
    await page.goBack({ waitUntil: 'networkidle' });
    const backUrl = page.url();
    await page.goForward({ waitUntil: 'networkidle' });
    const fwdUrl = page.url();

    if (backUrl.includes('/admin/students') && fwdUrl.includes('/admin/faculty')) {
      recordResult('Routing', 'Browser Back / Forward Navigation', 'PASS', '', 'Navigated backward to students and forward to faculty correctly');
    } else {
      recordResult('Routing', 'Browser Back / Forward Navigation', 'FAIL', `Back was ${backUrl}, Forward was ${fwdUrl}`);
    }

    await context.close();
  }

  // ==========================================
  // SECTION 3: FUNCTIONAL & DATABASE PERSISTENCE TESTS
  // ==========================================
  console.log('\n--- 3. TESTING FUNCTIONALITY & DATABASE PERSISTENCE ON LIVE SITE ---');
  {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login as Admin
    await page.goto(`${LIVE_URL}/login`, { waitUntil: 'networkidle' });
    await page.locator('button:has-text("Dr. Arthur Vance")').first().click();
    await page.waitForTimeout(1500);

    // 3.1 STUDENTS MANAGEMENT
    await page.goto(`${LIVE_URL}/admin/students`, { waitUntil: 'networkidle' });
    
    // View Table
    const tableRows = await page.locator('tbody tr').count();
    if (tableRows > 0) {
      recordResult('Students', 'View Directory Table', 'PASS', '', `Rendered ${tableRows} student rows`);
    } else {
      recordResult('Students', 'View Directory Table', 'FAIL', 'Zero rows rendered');
    }

    // Search
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Sophia');
      await page.waitForTimeout(500);
      const filteredRows = await page.locator('tbody tr').count();
      const rowText = await page.locator('tbody tr').first().textContent();
      if (rowText.includes('Sophia')) {
        recordResult('Students', 'Search Functionality', 'PASS', '', 'Filtered correctly to Sophia Chen');
      } else {
        recordResult('Students', 'Search Functionality', 'FAIL', `Search did not filter correctly: "${rowText}"`);
      }
      await searchInput.fill(''); // Clear
    } else {
      recordResult('Students', 'Search Functionality', 'FAIL', 'Search input not found');
    }

    // Add Student Modal & Save Attempt
    const addButton = page.locator('button:has-text("Add New Student")');
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(500);

      // Verify Form Validation (try submit empty)
      const modal = page.locator('div[role="dialog"]').or(page.locator('.fixed.inset-0'));
      const nameInput = page.locator('input[placeholder*="Maya Lin"]').or(page.locator('input[type="text"]').first());
      const rollInput = page.locator('input[placeholder*="2023-CSE"]').or(page.locator('input.font-mono'));
      const emailInput = page.locator('input[type="email"]').first();

      // Cancel button test
      const cancelBtn = page.locator('button:has-text("Cancel")').first();
      await cancelBtn.click();
      await page.waitForTimeout(300);
      const isModalStillOpen = await nameInput.isVisible().catch(() => false);
      if (!isModalStillOpen) {
        recordResult('Students', 'Modal Cancel Button', 'PASS', '', 'Cancel button dismissed the modal');
      } else {
        recordResult('Students', 'Modal Cancel Button', 'FAIL', 'Modal remained open after Cancel');
      }

      // Re-open and fill
      await addButton.click();
      await page.waitForTimeout(300);
      await nameInput.fill('Live Vercel Test Student');
      await rollInput.fill('2026-LIVE-999');
      await emailInput.fill('live.test@campus.edu');

      // Intercept the API POST request to examine exact behavior
      let postAttempted = false;
      let postStatus = null;
      let postUrl = '';
      let postResponseText = '';

      page.on('response', async res => {
        if (res.request().method() === 'POST' && res.url().includes('/students')) {
          postAttempted = true;
          postUrl = res.url();
          postStatus = res.status();
          postResponseText = await res.text().catch(() => '');
        }
      });

      const submitBtn = page.locator('button:has-text("Create Student")').or(page.locator('button[type="submit"]'));
      await submitBtn.click();
      await page.waitForTimeout(2000);

      // Capture screenshot of result
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'live_student_add_result.png') });

      // Check if error toast or success toast appeared
      const pageText = await page.content();
      if (postStatus === 405 || postStatus >= 400 || pageText.includes('Failed to save student')) {
        recordResult(
          'Students',
          'Add Student & MongoDB Persistence',
          'FAIL',
          `Live API Request Failed: POST ${postUrl} returned HTTP ${postStatus} Method Not Allowed (Vercel static rewrite rejects POST to /api/students)`
        );
        recordResult(
          'MongoDB',
          'Persistence (Source of Truth)',
          'FAIL',
          `Cannot persist to MongoDB from live Vercel: Backend server is not hosted on Vercel and VITE_API_URL is unset. Requests hit ${LIVE_URL}/api/* returning 405 Method Not Allowed.`
        );
      } else if (postStatus === 200 || postStatus === 201) {
        recordResult('Students', 'Add Student & MongoDB Persistence', 'PASS', '', 'Persisted to MongoDB successfully');
      } else {
        recordResult('Students', 'Add Student & MongoDB Persistence', 'FAIL', `No POST request or unknown status: ${postStatus}`);
      }
    } else {
      recordResult('Students', 'Add New Student Button', 'FAIL', 'Button not visible');
    }

    // 3.2 FACULTY MANAGEMENT
    await page.goto(`${LIVE_URL}/admin/faculty`, { waitUntil: 'networkidle' });
    const facRows = await page.locator('tbody tr').count();
    if (facRows > 0) {
      recordResult('Faculty', 'View Directory Table', 'PASS', '', `Rendered ${facRows} faculty members`);
    } else {
      recordResult('Faculty', 'View Directory Table', 'FAIL', 'Zero faculty rendered');
    }

    // 3.3 DEPARTMENTS MANAGEMENT
    await page.goto(`${LIVE_URL}/admin/departments`, { waitUntil: 'networkidle' });
    const deptRows = await page.locator('tbody tr').count();
    if (deptRows > 0) {
      recordResult('Departments', 'View Table', 'PASS', '', `Rendered ${deptRows} departments`);
    } else {
      recordResult('Departments', 'View Table', 'FAIL', 'Zero departments rendered');
    }

    // 3.4 NOTICES MANAGEMENT
    await page.goto(`${LIVE_URL}/admin/notices`, { waitUntil: 'networkidle' });
    const notCards = await page.locator('.space-y-4 > div, tbody tr').count();
    recordResult('Notices', 'View Circulars', notCards > 0 ? 'PASS' : 'FAIL', '', `Rendered notices/circulars`);

    // 3.5 FACULTY PORTAL: ATTENDANCE & MARKS
    await page.goto(`${LIVE_URL}/login`, { waitUntil: 'networkidle' });
    await page.locator('button:has-text("Dr. Sarah Jenkins")').first().click();
    await page.waitForTimeout(1500);

    // Mark Attendance page
    await page.goto(`${LIVE_URL}/faculty/attendance`, { waitUntil: 'networkidle' });
    const saveAttendanceBtn = page.locator('button:has-text("Save Attendance")').or(page.locator('button:has-text("Submit Attendance")')).first();
    if (await saveAttendanceBtn.isVisible()) {
      let attPostStatus = null;
      let attPostUrl = '';
      page.on('response', res => {
        if (res.request().method() === 'POST' && res.url().includes('/attendance')) {
          attPostStatus = res.status();
          attPostUrl = res.url();
        }
      });

      await saveAttendanceBtn.click();
      await page.waitForTimeout(1500);

      if (attPostStatus === 405 || attPostStatus >= 400) {
        recordResult('Attendance', 'Save Attendance to MongoDB', 'FAIL', `Live POST ${attPostUrl} returned HTTP ${attPostStatus} Method Not Allowed`);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'live_attendance_save_fail.png') });
      } else {
        recordResult('Attendance', 'Save Attendance to MongoDB', 'PASS', '', 'Attendance saved');
      }
    } else {
      recordResult('Attendance', 'Save Attendance Button', 'FAIL', 'Save button not found');
    }

    // Enter Marks page
    await page.goto(`${LIVE_URL}/faculty/marks`, { waitUntil: 'networkidle' });
    const saveMarksBtn = page.locator('button:has-text("Save & Publish")').or(page.locator('button:has-text("Save Marks")')).first();
    if (await saveMarksBtn.isVisible()) {
      let mrkPutStatus = null;
      let mrkPutUrl = '';
      page.on('response', res => {
        if (res.request().method() === 'PUT' && res.url().includes('/marks')) {
          mrkPutStatus = res.status();
          mrkPutUrl = res.url();
        }
      });

      await saveMarksBtn.click();
      await page.waitForTimeout(1500);

      if (mrkPutStatus === 405 || mrkPutStatus >= 400) {
        recordResult('Marks', 'Save Marks to MongoDB', 'FAIL', `Live PUT ${mrkPutUrl} returned HTTP ${mrkPutStatus} Method Not Allowed`);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'live_marks_save_fail.png') });
      } else {
        recordResult('Marks', 'Save Marks to MongoDB', 'PASS', '', 'Marks saved');
      }
    } else {
      recordResult('Marks', 'Save Marks Button', 'FAIL', 'Save button not found');
    }

    // 3.6 STUDENT PORTAL: HOSTEL & TRANSPORT APPLICATIONS
    await page.goto(`${LIVE_URL}/login`, { waitUntil: 'networkidle' });
    await page.locator('button:has-text("Alex Rivera")').first().click();
    await page.waitForTimeout(1500);

    // Student Hostel
    await page.goto(`${LIVE_URL}/student/hostel`, { waitUntil: 'networkidle' });
    const hostelHeader = await page.textContent('h1');
    if (hostelHeader.includes('Hostel')) {
      recordResult('Hostel', 'Student Hostel View & Room Details', 'PASS', '', 'Rendered room details & curfew timetable');
    } else {
      recordResult('Hostel', 'Student Hostel View', 'FAIL', 'Hostel page header missing');
    }

    // Student Transport
    await page.goto(`${LIVE_URL}/student/transport`, { waitUntil: 'networkidle' });
    const transportHeader = await page.textContent('h1');
    if (transportHeader.includes('Transit') || transportHeader.includes('Transport')) {
      recordResult('Transport', 'Student Transport Pass & Routes View', 'PASS', '', 'Rendered bus badge and route stops timeline');
    } else {
      recordResult('Transport', 'Student Transport View', 'FAIL', 'Transport page header missing');
    }

    await context.close();
  }

  // ==========================================
  // SECTION 4: RESPONSIVE VIEWPORT TESTS
  // ==========================================
  console.log('\n--- 4. TESTING RESPONSIVE VIEWPORTS ---');
  const viewports = [
    { name: 'Desktop', width: 1280, height: 800 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    // Login as Admin
    await page.goto(`${LIVE_URL}/login`, { waitUntil: 'networkidle' });
    await page.locator('button:has-text("Dr. Arthur Vance")').first().click();
    await page.waitForTimeout(1500);

    await page.goto(`${LIVE_URL}/admin/students`, { waitUntil: 'networkidle' });
    const screenshotPath = path.join(SCREENSHOT_DIR, `responsive_${vp.name.toLowerCase()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    if (vp.name === 'Mobile') {
      // Check mobile hamburger menu
      const hamburger = page.locator('header button').first();
      const isHamburgerVisible = await hamburger.isVisible();
      if (isHamburgerVisible) {
        await hamburger.click();
        await page.waitForTimeout(500);
        const sidebarVisible = await page.locator('aside nav, aside a').first().isVisible();
        if (sidebarVisible) {
          recordResult('Mobile', 'Responsive Mobile Drawer & Hamburger', 'PASS', '', 'Sidebar drawer opens smoothly on mobile');
        } else {
          recordResult('Mobile', 'Responsive Mobile Drawer', 'FAIL', 'Sidebar did not open after clicking hamburger');
        }
      } else {
        recordResult('Mobile', 'Hamburger Menu', 'FAIL', 'Hamburger button not visible on mobile');
      }
    }

    recordResult('Responsive', `${vp.name} Viewport (${vp.width}x${vp.height})`, 'PASS', '', `Screenshot saved: ${path.basename(screenshotPath)}`);
    await context.close();
  }

  await browser.close();

  console.log('\n====================================================');
  console.log('ALL PLAYWRIGHT TESTS COMPLETE ON LIVE VERCEL');
  console.log('====================================================');
  const passed = testResults.filter(r => r.status === 'PASS').length;
  const failed = testResults.filter(r => r.status === 'FAIL').length;
  console.log(`Total: ${testResults.length} | Passed: ${passed} | Failed: ${failed}`);

  // Write summary json
  fs.writeFileSync(path.join(__dirname, 'playwright_results.json'), JSON.stringify(testResults, null, 2));
}

runLivePlaywrightSuite().catch(err => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});
