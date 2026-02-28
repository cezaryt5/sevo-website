const { chromium } = require('playwright');
const path = require('path');

async function testTransparencyPage() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Collect console errors
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    // Collect page errors
    const pageErrors = [];
    page.on('pageerror', err => {
        pageErrors.push(err.message);
    });

    try {
        // Get the file path for transparency.html
        const filePath = path.resolve(__dirname, 'transparency.html');
        console.log('Testing transparency.html at:', filePath);

        // Navigate to the page
        await page.goto(`file://${filePath}`);
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Check page title
        const title = await page.title();
        console.log('Page title:', title);

        // Verify key elements exist
        const checks = [
            { selector: 'h1', name: 'Main heading' },
            { selector: '.hero h1', name: 'Hero section heading' },
            { selector: '.stats-section', name: 'Stats section' },
            { selector: '.financial-section', name: 'Financial section' },
            { selector: '.impact-section', name: 'Impact section' },
            { selector: '.footer', name: 'Footer' },
            { selector: '.navbar', name: 'Navigation bar' },
            { selector: '.donut-chart', name: 'Donut chart' },
            { selector: '.chart-legend', name: 'Chart legend' },
            { selector: '.reports-list', name: 'Reports list' }
        ];

        console.log('\nElement verification:');
        for (const check of checks) {
            const element = await page.$(check.selector);
            const status = element ? '✓' : '✗';
            console.log(`  ${status} ${check.name} (${check.selector})`);
        }

        // Check for broken links in navigation
        const navLinks = await page.$$eval('.nav-links a', links => 
            links.map(link => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href')
            }))
        );
        console.log('\nNavigation links:', navLinks);

        // Report results
        console.log('\n--- Test Results ---');
        
        if (consoleErrors.length > 0) {
            console.log('Console errors found:');
            consoleErrors.forEach(err => console.log(`  ✗ ${err}`));
        } else {
            console.log('✓ No console errors');
        }

        if (pageErrors.length > 0) {
            console.log('Page errors found:');
            pageErrors.forEach(err => console.log(`  ✗ ${err}`));
        } else {
            console.log('✓ No page errors');
        }

        // Final status
        const hasErrors = consoleErrors.length > 0 || pageErrors.length > 0;
        console.log(hasErrors ? '\n✗ Test FAILED' : '\n✓ Test PASSED');

        await browser.close();
        return !hasErrors;

    } catch (error) {
        console.error('Test failed with error:', error.message);
        await browser.close();
        throw error;
    }
}

// Run the test
testTransparencyPage()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(err => {
        console.error('Test execution failed:', err);
        process.exit(1);
    });
