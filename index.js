










const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://ebay.com/');
  await page.waitForSelector('#gh-ac');
  await page.type('#gh-ac', 'macbook pro m1');
  await page.click('input[value="Search"]');
  await page.waitForTimeout(5000); 

  await page.waitForSelector('span.s-item__price');
  const prices = await page.$$eval('span.s-item__price', (spans) => {
    return [...spans].slice(1).map((span) => {
      return span.innerText;
    });
  });

  await page.waitForSelector('div.s-item__title');
  const titles = await page.$$eval('div.s-item__title', (divs) => {
    return [...divs].slice(1).map((div) => {
      return div.innerText;
    });
  });

  
  const imageElement = await page.$('div.s-item__image img');
  const imageUrl = await imageElement.evaluate((img) => img.getAttribute('src'));

  const products = [];

  for (let i = 0; i < Math.min(prices.length, titles.length); i++) {
    products.push({
      title: titles[i],
      price: prices[i],
      imageUrl: imageUrl, 
    });
  }

  
  const productsJSON = JSON.stringify(products, null, 2);
  fs.writeFileSync('products.json', productsJSON, 'utf-8');

  await browser.close();
})();











