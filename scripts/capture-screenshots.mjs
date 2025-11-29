import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join } from "path";

const BASE_URL = "http://localhost:3000";
const SCREENSHOT_DIR = join(process.cwd(), "public", "screenshots");

async function captureScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport size
  await page.setViewportSize({ width: 1920, height: 1080 });

  try {
    // 1. Main board overview
    console.log("Capturing board overview...");
    await page.goto(`${BASE_URL}/board/demo`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000); // Wait for any animations
    await page.screenshot({
      path: join(SCREENSHOT_DIR, "board-overview.png"),
      fullPage: true,
    });

    // 2. Voting phase - switch to voting phase
    console.log("Capturing voting phase...");
    await page.click('button:has-text("Voting")');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: join(SCREENSHOT_DIR, "voting-phase.png"),
      fullPage: true,
    });

    // 3. Grouping phase - switch to grouping phase
    console.log("Capturing grouping phase...");
    await page.click('button:has-text("Grouping")');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: join(SCREENSHOT_DIR, "grouping-phase.png"),
      fullPage: true,
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
