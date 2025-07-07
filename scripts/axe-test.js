const { AxePuppeteer } = require('axe-puppeteer')
const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:3000')
  const results = await new AxePuppeteer(page).analyze()
  console.log(JSON.stringify(results, null, 2))
  await browser.close()
  if (results.violations.length) {
    process.exitCode = 1
  }
})()
