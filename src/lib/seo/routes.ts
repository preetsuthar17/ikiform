export type SeoRouteKey =
	| "home"
	| "changelog"
	| "legalPrivacy"
	| "legalTerms"
	| "legalGdpr"
	| "legalDpa"
	| "aiBuilder"
	| "demoFormBuilder"
	| "login"
	| "resetPassword"
	| "success"
	| "embed"
	| "embedTest";

export const SEO_ROUTE_PATHS: Record<SeoRouteKey, string> = {
	home: "/",
	changelog: "/changelog",
	legalPrivacy: "/legal/privacy",
	legalTerms: "/legal/terms",
	legalGdpr: "/legal/gdpr",
	legalDpa: "/legal/dpa",
	aiBuilder: "/ai-builder",
	demoFormBuilder: "/demo-form-builder",
	login: "/login",
	resetPassword: "/reset-password",
	success: "/success",
	embed: "/embed",
	embedTest: "/embed/test",
};

export const INDEXABLE_SEO_ROUTES: SeoRouteKey[] = [
	"home",
	"changelog",
	"legalPrivacy",
	"legalTerms",
	"legalGdpr",
	"legalDpa",
	"aiBuilder",
	"demoFormBuilder",
];
