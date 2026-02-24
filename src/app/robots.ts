import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{ userAgent: "*", allow: "/" },
			{ userAgent: "*", disallow: "/admin" },
			{ userAgent: "*", disallow: "/dashboard" },
			{ userAgent: "*", disallow: "/form-builder" },
			{ userAgent: "*", disallow: "/auth" },
			{ userAgent: "*", disallow: "/e2e-ui" },
			{ userAgent: "*", disallow: "/api" },
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
