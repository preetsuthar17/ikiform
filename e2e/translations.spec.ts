import { expect, test } from "@playwright/test";

const EN_PRIVACY_TITLE = "Privacy Policy";
const ES_PRIVACY_TITLE = "Política de privacidad";
const EN_CHANGELOG_LABEL = "CHANGELOG";
const ES_CHANGELOG_LABEL = "NOVEDADES";
const EN_CHANGELOG_ENTRY_SNIPPET = "Base UI Hardening";
const ES_CHANGELOG_ENTRY_SNIPPET = "Endurecimiento de la interfaz";
const ES_CHANGELOG_DATE_REGEX = /\d{1,2} de [a-záéíóúñ]+ de \d{4}/i;
const ES_HOME_TITLE_SNIPPET =
	"Crea formularios, recopila respuestas y analiza datos sin esfuerzo.";
const EN_FOOTER_NAV = "Navigation";
const ES_FOOTER_NAV = "Navegación";
const ES_FOOTER_RESOURCES = "Recursos";
const EN_HEADER_HOME = "Home";
const ES_HEADER_HOME = "Inicio";
const ES_PATH_REGEX = /\/es$/;
const ES_LOGIN_PATH_REGEX = /\/es\/login(?:\?.*)?$/;
const ES_PREMIUM_REQUIRED = "Requiere Premium";
const ES_VIEW_PRICING = "Ver precios";

test("privacy page content is localized for en and es", async ({ page }) => {
	await page.goto("/en/legal/privacy", { waitUntil: "domcontentloaded" });
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		EN_PRIVACY_TITLE
	);
	await expect(page.locator("article")).toContainText("Introduction");
	expect(await page.title()).toContain(EN_PRIVACY_TITLE);

	await page.goto("/es/legal/privacy", { waitUntil: "domcontentloaded" });
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		ES_PRIVACY_TITLE
	);
	await expect(page.locator("article")).toContainText("Introducción");
	expect(await page.title()).toContain(ES_PRIVACY_TITLE);
});

test("changelog and home metadata are localized for es", async ({ page }) => {
	await page.goto("/en/changelog", { waitUntil: "domcontentloaded" });
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		EN_CHANGELOG_LABEL
	);
	await expect(page.locator("article").first()).toContainText(
		EN_CHANGELOG_ENTRY_SNIPPET
	);

	await page.goto("/es/changelog", { waitUntil: "domcontentloaded" });
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		ES_CHANGELOG_LABEL
	);
	await expect(page.locator("article").first()).toContainText(
		ES_CHANGELOG_ENTRY_SNIPPET
	);
	await expect(page.locator("article").first().locator("time").first()).toHaveText(
		ES_CHANGELOG_DATE_REGEX
	);

	await page.goto("/es", { waitUntil: "domcontentloaded" });
	expect(await page.title()).toContain(ES_HOME_TITLE_SNIPPET);
});

test("footer language switcher changes locale and translated labels", async ({
	page,
}) => {
	await page.goto("/en", { waitUntil: "domcontentloaded" });
	await expect(
		page.getByRole("navigation", { name: "Primary navigation" }).getByRole(
			"link",
			{ name: EN_HEADER_HOME, exact: true }
		)
	).toBeVisible();
	await expect(page.getByRole("heading", { name: EN_FOOTER_NAV })).toBeVisible();

	await page.getByLabel("Language").click();
	await page.getByRole("option", { name: "Spanish" }).click();

	await expect(page).toHaveURL(ES_PATH_REGEX);
	await expect(
		page.getByRole("navigation", { name: "Primary navigation" }).getByRole(
			"link",
			{ name: ES_HEADER_HOME, exact: true }
		)
	).toBeVisible();
	await expect(page.getByRole("heading", { name: ES_FOOTER_NAV })).toBeVisible();
	await expect(
		page.getByRole("heading", { name: ES_FOOTER_RESOURCES })
	).toBeVisible();
	await expect(
		page.getByRole("contentinfo").getByRole("link", { name: "Inicio" })
	).toBeVisible();
});

test("dashboard auth redirect respects spanish locale preference", async ({
	page,
}) => {
	await page.goto("/es", { waitUntil: "domcontentloaded" });
	await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
	await expect(page).toHaveURL(ES_LOGIN_PATH_REGEX);
});

test("ai builder premium gate is localized in spanish", async ({ page }) => {
	await page.goto("/es/ai-builder", { waitUntil: "domcontentloaded" });
	await expect(page.getByText(ES_PREMIUM_REQUIRED)).toBeVisible();
	await expect(
		page.getByRole("button", { name: ES_VIEW_PRICING })
	).toBeVisible();
});
