import { expect, test } from "@playwright/test";

const EN_PATH_REGEX = /\/en\/?$/;

test("root redirects to /en", async ({ page }) => {
	const response = await page.goto("/", { waitUntil: "domcontentloaded" });
	expect(response?.ok()).toBeTruthy();
	expect(page.url()).toMatch(EN_PATH_REGEX);
});

test("/es sets html lang and hreflang alternates", async ({ page }) => {
	await page.goto("/es", { waitUntil: "domcontentloaded" });
	await page.waitForLoadState("networkidle").catch(() => undefined);

	const lang = await page.getAttribute("html", "lang");
	expect(lang).toBe("es");

	const canonical = await page
		.locator("head link[rel='canonical']")
		.getAttribute("href");
	expect(canonical).toContain("/es");

	const enAlt = await page
		.locator("head link[rel='alternate'][hreflang='en']")
		.getAttribute("href");
	const esAlt = await page
		.locator("head link[rel='alternate'][hreflang='es']")
		.getAttribute("href");
	const xDefaultAlt = await page
		.locator("head link[rel='alternate'][hreflang='x-default']")
		.getAttribute("href");

	expect(enAlt).toContain("/en");
	expect(esAlt).toContain("/es");
	expect(xDefaultAlt).toContain("/en");
});

test("/es/login sends noindex robots policy", async ({ page }) => {
	const response = await page.goto("/es/login", {
		waitUntil: "domcontentloaded",
	});
	expect(response?.headers()["x-robots-tag"]).toBe("noindex, follow");
});

test("sitemap exposes localized public URLs", async ({ request }) => {
	const response = await request.get("/sitemap.xml");
	expect(response.status()).toBe(200);
	const text = await response.text();

	expect(text).toContain("/en/changelog");
	expect(text).toContain("/es/changelog");
	expect(text).not.toContain("/dashboard");
});
