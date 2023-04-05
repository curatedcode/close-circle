import { test, expect } from "@playwright/test";

test("should be able to create a post", async ({ page }) => {
  await page.goto("/");

  // input text
  await page.getByLabel(/post body/i).fill("testing post");

  await page.getByLabel(/publish post/i).click();

  // verify post did get uploaded into timeline
  await expect(page.getByText("testing post").first()).toBeVisible();
});

test("should be able to like a post", async ({ page }) => {
  await page.goto("/");

  // like the post
  await page
    .getByLabel(/like post/i)
    .first()
    .click();
});

test("should be able to comment on post", async ({ page }) => {
  await page.goto("/");

  // open comment section
  await page
    .getByRole("button", { name: /comment on post/i })
    .first()
    .click();

  // type and post comment
  await page.getByPlaceholder(/write a comment.../i).fill("an awesome comment");
  await page.getByRole("button", { name: /publish comment/i }).click();

  // comment should now be visible in comment section
  await expect(
    page
      .getByTestId(/comment body/i)
      .filter({ hasText: "an awesome comment" })
      .first()
  ).toBeVisible();
});
