import sharp from "sharp";
import { readdirSync, statSync, renameSync } from "fs";
import { join } from "path";

const SCREENSHOT_DIR = join(process.cwd(), "public", "screenshots");
const TARGET_WIDTH = 1920;
const TARGET_HEIGHT = 1200;

async function cropScreenshots() {
  try {
    const files = readdirSync(SCREENSHOT_DIR).filter(
      (file) => file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg")
    );

    console.log(`Found ${files.length} screenshot(s) to process...`);

    for (const file of files) {
      const filePath = join(SCREENSHOT_DIR, file);
      console.log(`Processing ${file}...`);

      const metadata = await sharp(filePath).metadata();
      console.log(`  Original size: ${metadata.width}x${metadata.height}`);

      // Resize and crop to target dimensions
      // Using 'cover' strategy: resize to cover the target dimensions, then crop
      const tempPath = filePath + ".tmp";
      await sharp(filePath)
        .resize(TARGET_WIDTH, TARGET_HEIGHT, {
          fit: "cover",
          position: "center",
        })
        .toFile(tempPath);

      // Replace original with cropped version
      renameSync(tempPath, filePath);

      console.log(`  Cropped to: ${TARGET_WIDTH}x${TARGET_HEIGHT}`);
    }

    console.log("All screenshots cropped successfully!");
  } catch (error) {
    console.error("Error cropping screenshots:", error);
    process.exit(1);
  }
}

cropScreenshots();

