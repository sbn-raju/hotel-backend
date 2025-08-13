const puppeteer = require('puppeteer');
const fs = require('fs');

async function htmlToPdf(htmlContent, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'A4', printBackground: true });

  await browser.close();
}

module.exports = htmlToPdf;
