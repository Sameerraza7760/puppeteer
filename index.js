const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // set to true for headless mode
  const page = await browser.newPage();

  // Go to your target page (replace with actual URL)
  await page.goto('https://www.amazon.com/s?k=laptop');

  // Wait for main product blocks to load
  await page.waitForSelector('.sg-col-inner');

  // Get all product blocks
  const productHandles = await page.$$('.sg-col-inner');

  for (const product of productHandles) {
    const data = await page.evaluate(el => {
      // Title
      const titleEl = el.querySelector('h2 a');
      const title = titleEl?.innerText?.trim() || null;

      // Image
      const imgEl = el.querySelector('img.s-image');
      const image = imgEl?.src || null;

      // Link
      const link = titleEl ? 'https://www.amazon.com' + titleEl.getAttribute('href') : null;

      // Release Date / Additional info (optional)
      const releaseEl = el.querySelector('span.a-size-base.a-color-secondary.a-text-normal');
      const releaseDate = releaseEl?.innerText?.trim() || null;

      return { title, image, link, releaseDate };
    }, product);

    // Only show valid entries
    if (data.title && data.image) {
      console.log(data);
    }
  }

  await browser.close();
})();
