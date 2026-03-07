const puppeteer = require('puppeteer');
const path = require('path');

const htmlFilePath = `file://${path.join(__dirname, 'banner', 'index.html')}`;
const outputFilePath = path.join(__dirname, 'banner', 'yusuf_bera_hero.png');

async function generateBanner() {
    console.log('🚀 Starting transparent banner generation...');

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport exactly to the banner size
    await page.setViewport({
        width: 1200,
        height: 400,
        deviceScaleFactor: 2
    });

    console.log(`🌐 Loading: ${htmlFilePath}`);
    await page.goto(htmlFilePath, { waitUntil: 'networkidle0' });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Force backgrounds to be transparent for the screenshot
    await page.evaluate(() => {
        document.body.style.background = 'transparent';
        const container = document.querySelector('.hero-container');
        if (container) container.style.background = 'transparent';
    });

    console.log(`📸 Capturing transparent screenshot...`);

    const element = await page.$('.hero-container');
    if (element) {
        await element.screenshot({
            path: outputFilePath,
            type: 'png',
            omitBackground: true // This is the key setting for transparency
        });
        console.log(`✅ Transparent banner successfully saved to: ${outputFilePath}`);
    } else {
        console.error('❌ Could not find .hero-container element!');
    }

    await browser.close();
}

generateBanner().catch(console.error);
