module.exports = {
	siteUrl: process.env.SITE_URL || "https://www.ikiform.com",
	generateRobotsTxt: true,
	exclude: ["/e2e-ui"],
	robotsTxtOptions: {
		policies: [
			{ userAgent: "*", allow: "/" },
			{ userAgent: "*", disallow: "/admin" },
			{ userAgent: "*", disallow: "/e2e-ui" },
		],
	},
};
