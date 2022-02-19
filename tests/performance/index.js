const puppeteer = require('puppeteer');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function runInstance() {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto('http://localhost:3000/presentation');

  setInterval(async () => {
    const itemToClick = getRandomInt(1, 3);

    try {
      await page.click(`label:nth-child(${itemToClick})`, { clickCount: 1 });
    } catch (e) {}
  }, 2000);
}

(async () => {
  for (let i = 0; i < 15; i++) {
    runInstance();
  }
})();
