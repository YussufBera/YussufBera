const puppeteer = require('puppeteer');
const path = require('path');

const htmlFilePath = `file://${path.join(__dirname, 'banner', 'cards.html')}`;

async function generateCards() {
    console.log('🚀 Starting card generation...');

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // High res viewport
    await page.setViewport({ width: 1000, height: 2000, deviceScaleFactor: 2 });

    await page.goto(htmlFilePath, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 500));

    // Cards to capture
    const cards = [
        { id: '#card-about', name: 'card_about.png' },
        { id: '#card-nelio', name: 'card_nelio.png' },
        { id: '#card-kelime', name: 'card_kelime.png' },
        { id: '#card-get4trip', name: 'card_get4trip.png' }
    ];

    for (const card of cards) {
        const element = await page.$(card.id);
        if (element) {
            const outputPath = path.join(__dirname, 'banner', card.name);
            await element.screenshot({
                path: outputPath,
                type: 'png',
                omitBackground: true // Transparent background
            });
            console.log(`✅ Saved: ${card.name}`);
        } else {
            console.error(`❌ Could not find element ${card.id}`);
        }
    }

    await browser.close();
}

generateCards().catch(console.error);
