
// npm install puppeteer-extra puppeteer-extra-plugin-stealth
const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// add the stealth plugin

puppeteer.use(StealthPlugin());

(async () => {
    // set up browser environment
    const browser = await puppeteer.launch({ 
            headless: true,
            args: [
                "--disable-notifications",
                "--disable-blink-features=AutomationControlled",
            ],
        })
    
        page = await browser.newPage()
    
        await page.goto('https://www.funda.nl/en/', { waitUntil: 'networkidle2',
            timeout: 30000,
            }).catch((err) => {
                console.error(`Navigation to ${'https://www.funda.nl/en/'} failed:`, err.message);
                return []
                })
                const disagreeBtn = await page.waitForSelector('button[id="didomi-notice-disagree-button"]', {timeout: 1000})
        if (disagreeBtn) await page.click('button[id="didomi-notice-disagree-button"]')
    // wait for the challenge to resolve
    await new Promise(function (resolve) {
        setTimeout(resolve, 10000);
    });

    // take page screenshot
    await page.screenshot({ path: 'screenshot.png' });

    // close the browser instance
    await browser.close();
})();