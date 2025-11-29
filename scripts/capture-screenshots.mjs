import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join } from "path";

const BASE_URL = "http://localhost:3000";
const SCREENSHOT_DIR = join(process.cwd(), "public", "screenshots");

async function captureScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport size - reasonable height to cap screenshot size
  await page.setViewportSize({ width: 1920, height: 1200 });

  try {
    // 1. Main board overview
    console.log("Capturing board overview...");
    await page.goto(`${BASE_URL}/board/demo`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000); // Wait for any animations
    // Scroll to top to ensure header is visible
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(SCREENSHOT_DIR, "board-overview.png"),
      // Don't use fullPage - just capture viewport to cap height
    });

    // 2. Voting phase - switch to voting phase
    console.log("Capturing voting phase...");
    await page.click('button:has-text("Voting")');
    await page.waitForTimeout(1000);
    // Scroll to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(SCREENSHOT_DIR, "voting-phase.png"),
      // Don't use fullPage - just capture viewport to cap height
    });

    // 3. Grouping phase - switch to grouping phase
    console.log("Capturing grouping phase...");
    await page.click('button:has-text("Grouping")');
    await page.waitForTimeout(1000);
    // Scroll to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(SCREENSHOT_DIR, "grouping-phase.png"),
      // Don't use fullPage - just capture viewport to cap height
    });

    // 4. Phase indicators close-up
    console.log("Capturing phase indicators...");
    await page.click('button:has-text("Gathering")');
    await page.waitForTimeout(500);
    const phaseIndicator = await page
      .locator('div:has(button:has-text("Gathering"))')
      .first();
    await phaseIndicator.screenshot({
      path: join(SCREENSHOT_DIR, "phase-indicators.png"),
    });

    console.log("All screenshots captured successfully!");
  } catch (error) {
    console.error("Error capturing screenshots:", error);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
