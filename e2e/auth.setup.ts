import { test as setup } from "@playwright/test";
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import dotenv from "dotenv";

dotenv.config();
chromium.use(stealth());

const TESTING_AUTH_EMAIL = process.env.TESTING_AUTH_EMAIL;
const TESTING_AUTH_PASSWORD = process.env.TESTING_AUTH_PASSWORD;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

setup("authentication", async () => {
  if (typeof TESTING_AUTH_EMAIL === "undefined")
    throw new Error("TESTING_AUTH_EMAIL missing from env variables");
  if (typeof TESTING_AUTH_PASSWORD === "undefined")
    throw new Error("TESTING_AUTH_PASSWORD missing from env variables");
  if (typeof BASE_URL === "undefined")
    throw new Error("BASE_URL missing from env variables");

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to sign-in page
  await page.goto(BASE_URL);
  console.log(page.url());
  await page.getByRole("button", { name: /sign up/i }).click();

  // Sign in
  await page.getByLabel(/sign in with google/i).click();

  // Type in email slowly to simulate an actual user
  await page.waitForSelector("input[type='email']");
  await page.locator("input[type='email']").type(TESTING_AUTH_EMAIL);

  await Promise.all([
    page.waitForLoadState(),
    await page.keyboard.press("Enter"),
  ]);

  // Type in password slowly to simulate an actual user
  await page.waitForSelector("input[type='password']");
  await page.locator("input[type='password']").type(TESTING_AUTH_PASSWORD);

  await Promise.all([
    page.waitForLoadState(),
    await page.keyboard.press("Enter"),
  ]);

  // Wait until the page receives the cookies.
  // Wait for the final URL to ensure that the cookies are actually set.
  // This URL is different than testing URL due to how next auth works
  await page.waitForURL(BASE_URL);

  // End of authentication steps.
  const authFile = "./e2e/.auth/user.json";
  await page.context().storageState({ path: authFile });

  await browser.close();
});
