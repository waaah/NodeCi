const puppeteer = require('puppeteer');

let scrape =  async () => {
    browser = await puppeteer.launch({
        headless : true
    });
    page = await browser.newPage();
    await page.goto('https://nflpickwatch.com/')

    let text = await page.$$eval('div.game-header-cell__team' , el => el.map(e => e.textContent.trim()));
    console.log(text);
};

scrape();