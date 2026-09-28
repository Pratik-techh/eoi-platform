const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

async function generatePdf() {
  console.log('Reading HTML manual from docs/EOI_Platform_User_Manual_and_Guide.html...');
  const htmlPath = path.join(__dirname, '..', 'docs', 'EOI_Platform_User_Manual_and_Guide.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  console.log('Launching browser with Edge channel...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  // Output paths:
  // 1. Root SIH folder for instant user access
  const rootPdfPath = path.resolve(__dirname, '..', '..', 'EOI_Platform_User_Manual_and_Guide.pdf');
  // 2. public folder in eoi-platform for live web hosting
  const publicPdfPath = path.join(__dirname, '..', 'public', 'EOI_Platform_User_Manual_and_Guide.pdf');

  console.log('Generating PDF to root:', rootPdfPath);
  await page.pdf({
    path: rootPdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '14mm',
      left: '12mm',
      right: '12mm'
    }
  });

  console.log('Copying PDF to public folder:', publicPdfPath);
  fs.copyFileSync(rootPdfPath, publicPdfPath);

  await browser.close();
  console.log('✅ PDF generated successfully in both locations!');
}

generatePdf().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
