// scripts/generate-icons.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SOURCE_SVG = path.join(process.cwd(), 'public', 'icon-template.svg');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'icons');

async function generateIcons() {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Read the SVG template
    const svgBuffer = await fs.readFile(SOURCE_SVG);

    // Generate icons for each size
    for (const size of ICON_SIZES) {
      console.log(`Generating ${size}x${size} icon...`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(OUTPUT_DIR, `icon-${size}x${size}.png`));
    }

    // Generate apple-touch-icon (180x180)
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'));

    console.log('Icon generation complete!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();