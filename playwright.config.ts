import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";
const hasExternalServer = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
	testDir: "./e2e",
	timeout: 60_000,
	expect: {
		timeout: 10_000,
	},
	fullyParallel: false,
	workers: 1,
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		baseURL,
		headless: true,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
	},
	webServer: hasExternalServer
		? undefined
		: {
				command: "bun run dev -- --hostname 127.0.0.1 --port 3000",
				url: baseURL,
				reuseExistingServer: true,
				timeout: 180_000,
		  },
});
