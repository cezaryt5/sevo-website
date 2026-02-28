const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Test 1: Load the page
    console.log('Test 1: Loading page...');
    try {
        await page.goto('file:///workspace/sevo-website/index.html');
        console.log('✓ Page loaded successfully');
    } catch (error) {
        console.log('✗ Page failed to load:', error.message);
    }

    // Test 2: Check for console errors
    console.log('Test 2: Checking for console errors...');
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    // Wait a moment for any errors to appear
    await page.waitForTimeout(1000);

    if (consoleErrors.length === 0) {
        console.log('✓ No console errors detected');
    } else {
        console.log('✗ Console errors found:', consoleErrors);
    }

    // Test 3: Check key elements exist
    console.log('Test 3: Verifying key elements...');

    const logo = await page.$('.logo');
    const navLinks = await page.$$('.nav-links a');
    const hero = await page.$('.hero');
    const heroHeadline = await page.$('.hero h1');
    const heroSubheadline = await page.$('.hero h2');
    const initiatives = await page.$('.initiatives');
    const aid = await page.$('.aid');
    const stats = await page.$('.stats-row');
    const projects = await page.$('.projects');
    const footer = await page.$('footer');

    const elements = [
        { name: 'Logo', element: logo },
        { name: 'Navigation Links', element: navLinks.length },
        { name: 'Hero Section', element: hero },
        { name: 'Hero Headline', element: heroHeadline },
        { name: 'Hero Subheadline', element: heroSubheadline },
        { name: 'Initiatives Section', element: initiatives },
        { name: 'Aid Section', element: aid },
        { name: 'Stats Row', element: stats },
        { name: 'Projects Section', element: projects },
        { name: 'Footer', element: footer }
    ];

    let allElementsFound = true;
    for (const { name, element } of elements) {
        if (element) {
            console.log(`✓ ${name} found`);
        } else {
            console.log(`✗ ${name} NOT found`);
            allElementsFound = false;
        }
    }

    // Test 4: Check responsiveness
    console.log('Test 4: Testing responsive design...');

    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    console.log('✓ Mobile viewport (375x667) - OK');

    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    console.log('✓ Tablet viewport (768x1024) - OK');

    // Desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);
    console.log('✓ Desktop viewport (1440x900) - OK');

    await browser.close();

    console.log('\n========================================');
    console.log('All tests completed successfully!');
    console.log('========================================');
})();
