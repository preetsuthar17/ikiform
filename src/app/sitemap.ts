import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { withLocalePath } from "@/lib/i18n/pathname";
import { SITE_URL } from "@/lib/seo/constants";
import { INDEXABLE_SEO_ROUTES, SEO_ROUTE_PATHS } from "@/lib/seo/routes";

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();
	return INDEXABLE_SEO_ROUTES.flatMap((routeKey) => {
		const routePath = SEO_ROUTE_PATHS[routeKey];

		return routing.locales.map((locale) => {
			const localizedPath = withLocalePath(routePath, locale);
			const url = `${SITE_URL}${localizedPath}`;

			return {
				url,
				lastModified,
				changeFrequency: "daily",
				priority: routePath === "/" ? 1 : 0.7,
				alternates: {
					languages: {
						en: `${SITE_URL}${withLocalePath(routePath, "en")}`,
						es: `${SITE_URL}${withLocalePath(routePath, "es")}`,
					},
				},
			};
		});
	});
}
