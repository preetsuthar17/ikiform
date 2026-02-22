import { expect, test, type Locator, type Page } from "@playwright/test";

test.describe.configure({ timeout: 90_000 });

const ROUTES = [
	"/",
	"/login",
	"/reset-password",
	"/changelog",
	"/embed",
	"/embed/test",
	"/demo-form-builder",
	"/form-builder",
	"/ai-builder",
	"/dashboard",
	"/admin",
	"/legal/privacy",
	"/legal/terms",
	"/legal/gdpr",
	"/legal/dpa",
	"/success",
] as const;

const INTERACTION_BUDGET_MS = 20_000;
const MAX_ACTIONS_PER_ROUTE = 100;
const CLICK_TIMEOUT_MS = 350;
const MAX_ROUTE_RECOVERIES = 6;
const VERBOSE_INTERACTIONS = process.env.E2E_VERBOSE === "1";

const IGNORE_CONSOLE_ERROR_PATTERNS = [
	/failed to load resource/i,
	/net::err_/i,
	/content security policy/i,
	/hydration/i,
	/ticketping/i,
	/notification websocket error/i,
	/error loading form:.*pgrst116/i,
];

type CapturedError = {
	type: "console" | "pageerror";
	message: string;
};

type InteractionStats = {
	clicks: number;
	fills: number;
	toggles: number;
	selects: number;
	keys: number;
	navigationsRecovered: number;
	actionsConsumed: number;
	budgetExhausted: boolean;
};

type InteractionContext = {
	expectedRoute: string;
	deadline: number;
	remainingActions: number;
	stats: InteractionStats;
	actionLog: string[];
};

type DeepPassResult = {
	stats: InteractionStats;
	actionLog: string[];
};

function isIgnorableError(text: string): boolean {
	return IGNORE_CONSOLE_ERROR_PATTERNS.some((pattern) => pattern.test(text));
}

function captureBrowserErrors(page: Page) {
	const errors: CapturedError[] = [];

	page.on("console", (message) => {
		if (message.type() !== "error") {
			return;
		}

		const text = message.text().trim();
		if (!text) {
			return;
		}

		if (isIgnorableError(text)) {
			return;
		}

		errors.push({ type: "console", message: text });
	});

	page.on("pageerror", (error) => {
		const text = error.message.trim();
		if (!text || isIgnorableError(text)) {
			return;
		}
		errors.push({ type: "pageerror", message: text });
	});

	return errors;
}

function routePath(url: string): string {
	return new URL(url).pathname;
}

async function recoverNavigation(page: Page, expectedRoute: string, stats: InteractionStats) {
	const current = routePath(page.url());
	if (current === expectedRoute) {
		return;
	}

	if (stats.navigationsRecovered >= MAX_ROUTE_RECOVERIES) {
		return;
	}

	await page.goto(expectedRoute, { waitUntil: "domcontentloaded" }).catch(() => undefined);
	await page.waitForLoadState("networkidle").catch(() => undefined);
	stats.navigationsRecovered += 1;
}

function canContinue(context: InteractionContext): boolean {
	return Date.now() < context.deadline && context.remainingActions > 0;
}

function recordAction(context: InteractionContext, message: string) {
	if (context.actionLog.length >= 300) {
		return;
	}
	const elapsed = INTERACTION_BUDGET_MS - Math.max(0, context.deadline - Date.now());
	const entry = `[+${elapsed}ms] ${message}`;
	context.actionLog.push(entry);
	if (VERBOSE_INTERACTIONS) {
		// Helpful for observing crawler behavior in real-time during headed runs.
		console.log(`[crawl ${context.expectedRoute}] ${entry}`);
	}
}

function consumeAction(context: InteractionContext, label: string): boolean {
	if (!canContinue(context)) {
		context.stats.budgetExhausted = true;
		recordAction(context, `budget exhausted before ${label}`);
		return false;
	}
	context.remainingActions -= 1;
	context.stats.actionsConsumed += 1;
	recordAction(context, `action ${context.stats.actionsConsumed}: ${label}`);
	return true;
}

async function tryClick(locator: Locator): Promise<boolean> {
	if (!(await locator.isVisible().catch(() => false))) {
		return false;
	}
	if (!(await locator.isEnabled().catch(() => false))) {
		return false;
	}

	await locator.scrollIntoViewIfNeeded().catch(() => undefined);
	return locator
		.click({
			timeout: CLICK_TIMEOUT_MS,
			noWaitAfter: true,
		})
		.then(() => true)
		.catch(() => false);
}

async function clickBatch(
	page: Page,
	selector: string,
	maxClicks: number,
	context: InteractionContext,
	afterClick?: () => Promise<void>
) {
	const locator = page.locator(selector);
	const count = Math.min(await locator.count(), maxClicks);

	for (let i = 0; i < count; i += 1) {
		if (!consumeAction(context, `${selector} [${i}]`)) {
			break;
		}

		const target = locator.nth(i);
		const clicked = await tryClick(target);
		if (!clicked) {
			continue;
		}
		context.stats.clicks += 1;
		recordAction(context, "click success");
		await page.waitForTimeout(40);
		if (afterClick) {
			await afterClick();
		}
		await recoverNavigation(page, context.expectedRoute, context.stats);
	}
}

async function fillTextInputs(page: Page, context: InteractionContext) {
	const textInputs = page.locator(
		[
			"input:not([type='hidden']):not([type='checkbox']):not([type='radio']):not([type='file']):not([disabled])",
			"textarea:not([disabled])",
		].join(",")
	);
	const inputCount = Math.min(await textInputs.count(), 10);

	for (let i = 0; i < inputCount; i += 1) {
		if (!consumeAction(context, `fill input [${i}]`)) {
			break;
		}

		const input = textInputs.nth(i);
		if (!(await input.isVisible().catch(() => false))) {
			continue;
		}

		const tagName = await input.evaluate((element) => element.tagName.toLowerCase());
		const type = await input.getAttribute("type");
		const value =
			type === "email"
				? "qa@example.com"
				: type === "number"
					? "42"
					: type === "tel"
						? "9999999999"
						: tagName === "textarea"
							? "Automated deep smoke text"
							: "deep-smoke";

		await input.fill(value, { timeout: CLICK_TIMEOUT_MS }).catch(() => undefined);
		context.stats.fills += 1;
		recordAction(context, `filled ${type ?? tagName} with "${value}"`);
	}
}

async function toggleControls(page: Page, context: InteractionContext) {
	const toggles = page.locator(
		[
			"input[type='checkbox']:not([disabled])",
			"input[type='radio']:not([disabled])",
			"[data-slot='switch']:not([disabled])",
			"[data-slot='checkbox']:not([disabled])",
			"[data-slot='toggle']:not([disabled])",
		].join(",")
	);
	const count = Math.min(await toggles.count(), 14);

	for (let i = 0; i < count; i += 1) {
		if (!consumeAction(context, `toggle [${i}]`)) {
			break;
		}

		const toggle = toggles.nth(i);
		if (!(await toggle.isVisible().catch(() => false))) {
			continue;
		}
		await toggle.click({ timeout: CLICK_TIMEOUT_MS, noWaitAfter: true }).catch(() => undefined);
		context.stats.toggles += 1;
		recordAction(context, "toggle click");
	}
}

async function exerciseSelects(page: Page, context: InteractionContext) {
	const selectTriggers = page.locator("[data-slot='select-trigger']");
	const count = Math.min(await selectTriggers.count(), 8);

	for (let i = 0; i < count; i += 1) {
		if (!consumeAction(context, `select trigger [${i}]`)) {
			break;
		}

		const trigger = selectTriggers.nth(i);
		if (!(await trigger.isVisible().catch(() => false))) {
			continue;
		}
		await trigger.click({ timeout: CLICK_TIMEOUT_MS, noWaitAfter: true }).catch(() => undefined);
		const item = page.locator("[data-slot='select-item']").nth(0);
		if (await item.isVisible().catch(() => false)) {
			await item.click({ timeout: CLICK_TIMEOUT_MS, noWaitAfter: true }).catch(() => undefined);
			context.stats.selects += 1;
			recordAction(context, "select option click");
		}
		await page.keyboard.press("Escape").catch(() => undefined);
	}
}

async function exerciseMenusAndOverlays(
	page: Page,
	context: InteractionContext
) {
	await clickBatch(
		page,
		[
			"[data-slot='dropdown-menu-trigger']",
			"[data-slot='menubar-trigger']",
			"[data-slot='popover-trigger']",
			"[data-slot='dialog-trigger']",
			"[data-slot='sheet-trigger']",
			"[aria-haspopup='menu']",
			"[aria-haspopup='dialog']",
		].join(","),
		16,
		context,
		async () => {
			const menuItems = page.locator(
				[
					"[data-slot='dropdown-menu-item']",
					"[data-slot='menubar-item']",
					"[role='menuitem']",
					"[role='option']",
				].join(",")
			);
			const itemCount = Math.min(await menuItems.count(), 2);
			for (let i = 0; i < itemCount; i += 1) {
				if (!consumeAction(context, `menu item [${i}]`)) {
					break;
				}

				const item = menuItems.nth(i);
				if (!(await item.isVisible().catch(() => false))) {
					continue;
				}
				await item.click({ timeout: CLICK_TIMEOUT_MS, noWaitAfter: true }).catch(() => undefined);
				context.stats.clicks += 1;
				recordAction(context, "menu/option click");
				await page.waitForTimeout(30);
			}

			await page.keyboard.press("Escape").catch(() => undefined);
			await page.keyboard.press("Escape").catch(() => undefined);
		}
	);
}

async function exerciseStructuralControls(
	page: Page,
	context: InteractionContext
) {
	await clickBatch(
		page,
		[
			"[data-slot='accordion-trigger']",
			"[data-slot='collapsible-trigger']",
			"[data-slot='tabs-trigger']",
		].join(","),
		18,
		context
	);
}

async function exerciseButtons(
	page: Page,
	context: InteractionContext
) {
	await clickBatch(
		page,
		[
			"button[data-slot='button']:not([disabled])",
			"button:not([disabled]):not([type='submit']):not([aria-label*='Next.js Dev Tools']):not([aria-label*='issues overlay'])",
			"[role='button']:not([aria-disabled='true'])",
		].join(","),
		26,
		context,
		async () => {
			await page.keyboard.press("Escape").catch(() => undefined);
		}
	);
}

async function keyboardAndScrollPass(page: Page, context: InteractionContext) {
	for (let i = 0; i < 12; i += 1) {
		if (!consumeAction(context, `keyboard tab [${i}]`)) {
			break;
		}

		await page.keyboard.press("Tab").catch(() => undefined);
		context.stats.keys += 1;
	}
	await page.keyboard.press("Enter").catch(() => undefined);
	context.stats.keys += 1;
	recordAction(context, "keyboard Enter");
	await page.keyboard.press("Escape").catch(() => undefined);
	context.stats.keys += 1;
	recordAction(context, "keyboard Escape");

	await page.mouse.wheel(0, 1400).catch(() => undefined);
	await page.mouse.wheel(0, -1400).catch(() => undefined);
	recordAction(context, "scroll down+up");
}

async function runDeepInteractionPass(page: Page, expectedRoute: string): Promise<DeepPassResult> {
	const context: InteractionContext = {
		expectedRoute,
		deadline: Date.now() + INTERACTION_BUDGET_MS,
		remainingActions: MAX_ACTIONS_PER_ROUTE,
		stats: {
		clicks: 0,
		fills: 0,
		toggles: 0,
		selects: 0,
		keys: 0,
		navigationsRecovered: 0,
			actionsConsumed: 0,
			budgetExhausted: false,
		},
		actionLog: [],
	};
	recordAction(context, `start route ${expectedRoute}`);

	await fillTextInputs(page, context);
	await toggleControls(page, context);
	await exerciseSelects(page, context);
	await exerciseStructuralControls(page, context);
	await exerciseMenusAndOverlays(page, context);
	await exerciseButtons(page, context);
	await keyboardAndScrollPass(page, context);

	recordAction(context, "deep interaction pass complete");
	return {
		stats: context.stats,
		actionLog: context.actionLog,
	};
}

for (const route of ROUTES) {
	test(`route ${route} deep interaction crawl`, async ({ page }, testInfo) => {
		const errors = captureBrowserErrors(page);

		const response = await page.goto(route, {
			waitUntil: "domcontentloaded",
		});

		expect(response?.status(), `Unexpected status for ${route}`).toBeLessThan(500);
		await page.waitForLoadState("networkidle").catch(() => undefined);
		const landedRoute = routePath(page.url());

		await expect(page.locator("body")).toBeVisible();
		await expect(page.locator("body")).not.toContainText(/Application error/i);
		await expect(page.locator("body")).not.toContainText(/Internal Server Error/i);

		const { stats, actionLog } = await runDeepInteractionPass(page, landedRoute);
		await page.waitForTimeout(200);

		await testInfo.attach("interaction-stats", {
			contentType: "application/json",
			body: Buffer.from(
				JSON.stringify({ route, landedRoute, stats, finalUrl: page.url() }, null, 2)
			),
		});
		await testInfo.attach("interaction-log", {
			contentType: "text/plain",
			body: Buffer.from(actionLog.join("\n")),
		});

		expect(
			errors,
			`${route} emitted browser errors:\n${errors
				.map((error) => `- [${error.type}] ${error.message}`)
				.join("\n")}`
		).toEqual([]);
	});
}
