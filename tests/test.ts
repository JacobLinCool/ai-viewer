import { expect, test } from "@playwright/test";

test("can view .pdf", async ({ page }) => {
	await page.goto("/");
	const button = await page.$("#select");
	expect(button).toBeTruthy();

	const file = await page.$("#file");
	expect(file).toBeTruthy();

	await file?.setInputFiles("test.pdf");

	const screenshot = await page.screenshot();
	expect(screenshot).toMatchSnapshot("pdf.png", { threshold: 0.2, maxDiffPixelRatio: 0.1 });
});
