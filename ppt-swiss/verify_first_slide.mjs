import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/chenruiyan/2026-project/thinking-notes/drafts/version2/social-card-ai-anxiety-cover/node_modules/playwright");

const deckPath = "/Users/chenruiyan/2026-project/thinking-notes/drafts/ai-team-sharing/ppt-swiss/index.html";
const requestedPage = Math.max(1, Number.parseInt(process.argv[2] || "1", 10) || 1);
const screenshotPath = `/Users/chenruiyan/2026-project/thinking-notes/drafts/ai-team-sharing/ppt-swiss/slide-${String(requestedPage).padStart(2, "0")}-preview.png`;

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
});

await page.goto(pathToFileURL(deckPath).href, { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForTimeout(1800);

for (let i = 1; i < requestedPage; i += 1) {
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(2200);
}

const currentSlide = page.locator("section.slide").nth(requestedPage - 1);
const result = {
  slideCount: await page.locator("section.slide").count(),
  requestedPage,
  currentText: (await currentSlide.innerText()).replace(/\s+/g, " ").trim(),
  screenshotPath,
};

await page.screenshot({ path: screenshotPath, fullPage: false });
await browser.close();

console.log(JSON.stringify(result, null, 2));
