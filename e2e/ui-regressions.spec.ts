import { expect, test, type Page } from "@playwright/test";

const TEST_EMAIL = process.env.E2E_TEST_EMAIL;
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD;

const IGNORE_ERROR_PATTERNS = [
	/ticketping/i,
	/notification websocket error/i,
	/error loading form:.*pgrst116/i,
	/failed to load resource/i,
	/net::err_/i,
] as const;

type CapturedError = {
	type: "console" | "pageerror";
	message: string;
};

function isIgnorableError(message: string): boolean {
	return IGNORE_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

function captureBrowserErrors(page: Page): CapturedError[] {
	const errors: CapturedError[] = [];

	page.on("console", (entry) => {
		if (entry.type() !== "error") {
			return;
		}

		const message = entry.text().trim();
		if (!message || isIgnorableError(message)) {
			return;
		}

		errors.push({ type: "console", message });
	});

	page.on("pageerror", (error) => {
		const message = error.message.trim();
		if (!message || isIgnorableError(message)) {
			return;
		}

		errors.push({ type: "pageerror", message });
	});

	return errors;
}

function assertSvgRendered(locator: ReturnType<Page["locator"]>) {
	return locator.evaluate((element) => {
		const rect = element.getBoundingClientRect();
		const style = window.getComputedStyle(element);
		return (
			rect.width > 0 &&
			rect.height > 0 &&
			style.display !== "none" &&
			style.visibility !== "hidden" &&
			style.opacity !== "0"
		);
	});
}

async function loginToDashboard(page: Page) {
	test.skip(
		!TEST_EMAIL || !TEST_PASSWORD,
		"Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run authenticated dashboard icon checks."
	);

	await page.goto("/login", { waitUntil: "domcontentloaded" });
	await page.waitForLoadState("networkidle").catch(() => undefined);

	await page
		.getByRole("textbox", { name: "Enter your email" })
		.fill(TEST_EMAIL as string);
	await page.getByRole("button", { name: "Continue", exact: true }).click();
	await page
		.getByRole("textbox", { name: "Enter your password" })
		.fill(TEST_PASSWORD as string);
	await page.getByRole("button", { name: "Sign in", exact: true }).click();
	await page.waitForURL("**/dashboard", { timeout: 30_000 });
	await page.waitForLoadState("networkidle").catch(() => undefined);
}

test("provider auth buttons render visible icons", async ({ page }) => {
	const errors = captureBrowserErrors(page);

	await page.goto("/login", { waitUntil: "domcontentloaded" });
	await page.waitForLoadState("networkidle").catch(() => undefined);

	const googleButton = page.getByRole("button", {
		name: /continue with google/i,
	});
	const githubButton = page.getByRole("button", {
		name: /continue with github/i,
	});

	await expect(googleButton).toBeVisible();
	await expect(githubButton).toBeVisible();

	for (const button of [googleButton, githubButton]) {
		const icon = button.locator("svg").first();
		await expect(icon).toBeVisible();
		expect(await assertSvgRendered(icon)).toBeTruthy();
	}

	expect(
		errors,
		`/login emitted browser errors:\n${errors
			.map((error) => `- [${error.type}] ${error.message}`)
			.join("\n")}`
	).toEqual([]);
});

test("dropdown label works without group context and asChild button icons render", async ({
	page,
}) => {
	const errors = captureBrowserErrors(page);

	await page.goto("/e2e-ui", { waitUntil: "domcontentloaded" });
	await page.waitForLoadState("networkidle").catch(() => undefined);

	const iconButton = page.getByTestId("icon-button");
	const asChildIconButton = page.getByTestId("aschild-icon-button");
	await expect(iconButton).toBeVisible();
	await expect(asChildIconButton).toBeVisible();

	const iconButtonSvg = iconButton.locator("svg").first();
	const asChildIconSvg = asChildIconButton.locator("svg").first();
	await expect(iconButtonSvg).toBeVisible();
	await expect(asChildIconSvg).toBeVisible();
	const iconButtonSvgRendered = await assertSvgRendered(iconButtonSvg);
	const asChildIconSvgRendered = await assertSvgRendered(asChildIconSvg);
	expect(iconButtonSvgRendered).toBeTruthy();
	expect(asChildIconSvgRendered).toBeTruthy();

	const menuTrigger = page.getByRole("button", { name: /open test menu/i });
	await menuTrigger.click();

	const label = page.getByTestId("menu-label");
	await expect(label).toBeVisible();
	await expect(label).toContainText("Account details");

	const menuItem = page.getByTestId("menu-item");
	await expect(menuItem).toBeVisible();
	await expect(menuItem.locator("svg").first()).toBeVisible();

	expect(
		errors,
		`/e2e-ui emitted browser errors:\n${errors
			.map((error) => `- [${error.type}] ${error.message}`)
			.join("\n")}`
	).toEqual([]);
});

test("dashboard icon buttons render SVG icons (create/filter/actions)", async ({
	page,
}) => {
	const errors = captureBrowserErrors(page);

	await loginToDashboard(page);

	const createButton = page
		.getByRole("button", { name: /create new form/i })
		.first();
	const filterButton = page.getByRole("button", { name: /open filter menu/i }).first();
	const actionsButton = page.locator("button[aria-label^='Actions for']").first();

	for (const button of [createButton, filterButton, actionsButton]) {
		await expect(button).toBeVisible();
		const icon = button.locator("svg").first();
		await expect(icon).toBeVisible();
		expect(await assertSvgRendered(icon)).toBeTruthy();
	}

	await actionsButton.click();
	const editItem = page.getByRole("menuitem", { name: /edit form/i }).first();
	await expect(editItem).toBeVisible();
	const editIcon = editItem.locator("svg").first();
	await expect(editIcon).toBeVisible();
	expect(await assertSvgRendered(editIcon)).toBeTruthy();

	const userMenuTrigger = page.getByRole("button", { name: /open user menu/i });
	await expect(userMenuTrigger).toBeVisible();
	const avatarFallback = userMenuTrigger.locator("[data-slot='avatar-fallback']");
	await expect(avatarFallback).toBeVisible();
	await expect(avatarFallback).not.toHaveText(/^\s*$/);

	expect(
		errors,
		`/dashboard emitted browser errors:\n${errors
			.map((error) => `- [${error.type}] ${error.message}`)
			.join("\n")}`
	).toEqual([]);
});

test("faq accordion uses a single rotating chevron trigger", async ({ page }) => {
	const errors = captureBrowserErrors(page);

	await page.goto("/", { waitUntil: "domcontentloaded" });
	await page.waitForLoadState("networkidle").catch(() => undefined);

	const firstTrigger = page.locator("[data-slot='accordion-trigger']").first();
	await expect(firstTrigger).toBeVisible();

	const chevrons = firstTrigger.locator("svg");
	await expect(chevrons).toHaveCount(1);

	const chevron = chevrons.first();
	await expect(chevron).toBeVisible();
	await expect(chevron).toHaveClass(/group-data-\[panel-open\]\/accordion-trigger:rotate-180/);

	await firstTrigger.click();
	await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
	await expect(firstTrigger).toHaveAttribute("data-panel-open", "");
	const firstPanel = page.locator("[data-slot='accordion-content']").first();
	await expect(firstPanel).toHaveAttribute("data-open", "");
	await expect(firstPanel).toHaveClass(/h-\(--accordion-panel-height\)/);
	await expect(firstPanel).toHaveClass(/data-starting-style:h-0/);
	await expect(firstPanel).toHaveClass(/data-ending-style:h-0/);

	expect(
		errors,
		`/ FAQ emitted browser errors:\n${errors
			.map((error) => `- [${error.type}] ${error.message}`)
			.join("\n")}`
	).toEqual([]);
});
