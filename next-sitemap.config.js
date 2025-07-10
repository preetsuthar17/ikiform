module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.ikiform.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};
