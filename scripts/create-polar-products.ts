#!/usr/bin/env tsx

import { Polar } from "@polar-sh/sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;
const POLAR_ORGANIZATION_ID = process.env.POLAR_ORGANIZATION_ID;

if (!POLAR_ACCESS_TOKEN) {
  console.error("❌ POLAR_ACCESS_TOKEN environment variable is not set");
  console.error("Please add POLAR_ACCESS_TOKEN to your .env.local file");
  process.exit(1);
}

if (!POLAR_ORGANIZATION_ID) {
  console.error("❌ POLAR_ORGANIZATION_ID environment variable is not set");
  console.error("Please add your Polar organization ID to .env.local");
  console.error("You can find this in your Polar dashboard");
  process.exit(1);
}

// Initialize Polar SDK
const polar = new Polar({
  accessToken: POLAR_ACCESS_TOKEN,
  server: "production",
});

// Product configurations with better names
const PRODUCTS = [
  {
    id: "05f52efa-2102-4dd0-9d1d-1538210d6712",
    name: "Ikiform Pro - Monthly",
    description: "Unlock unlimited forms, AI-powered analytics, and advanced features with our monthly Pro plan",
    price: 1900, // $19.00 in cents
    currency: "USD",
    interval: "month",
    interval_count: 1,
  },
  {
    id: "4eff4c1d-56de-4111-96de-b5ec8124dd4b",
    name: "Ikiform Pro - Yearly",
    description: "Get 53% savings with our annual Pro plan. All the features you need for building powerful forms",
    price: 900, // $9.00 per month in cents
    currency: "USD",
    interval: "month",
    interval_count: 12,
  },
  {
    id: "2e9b8531-0d45-40df-be1c-65482eefeb85",
    name: "Ikiform Pro - Lifetime",
    description: "One-time payment for lifetime access to all Ikiform Pro features. Never pay again",
    price: 11900, // $119.00 in cents
    currency: "USD",
  },
];

async function createProducts() {
  console.log("🚀 Starting Polar product creation for Ikiform...\n");

  try {
    console.log("📡 Testing Polar connection...");
    console.log(`✅ Using organization ID: ${POLAR_ORGANIZATION_ID}\n`);

    // Create each product
    for (const productConfig of PRODUCTS) {
      console.log(`🛍️ Creating product: ${productConfig.name}`);
      
      try {
        // For subscription products
        if (productConfig.interval) {
          const product = await polar.products.create({
            name: productConfig.name,
            description: productConfig.description,
            recurringInterval: productConfig.interval as any,
            prices: [{
              amountType: "fixed",
              priceAmount: productConfig.price,
            }],
          });

          console.log(`✅ Created subscription product: ${product.name} (ID: ${product.id})`);
          console.log(`   Price: $${(productConfig.price / 100).toFixed(2)} ${productConfig.currency}`);
          console.log(`   Billing: ${productConfig.interval_count} ${productConfig.interval}(s)`);
        } else {
          // For one-time products
          const product = await polar.products.create({
            name: productConfig.name,
            description: productConfig.description,
            recurringInterval: null,
            prices: [{
              amountType: "fixed",
              priceAmount: productConfig.price,
            }],
          });

          console.log(`✅ Created one-time product: ${product.name} (ID: ${product.id})`);
          console.log(`   Price: $${(productConfig.price / 100).toFixed(2)} ${productConfig.currency}`);
        }
        console.log("");
      } catch (error: any) {
        if (error.message?.includes("already exists")) {
          console.log(`⚠️ Product already exists: ${productConfig.name}`);
        } else {
          console.error(`❌ Error creating product ${productConfig.name}:`, error.message);
          console.error(`   Full error:`, error);
        }
      }
    }

    console.log("🎉 Product creation completed!");
    console.log("\n📋 Summary of products:");
    PRODUCTS.forEach((product) => {
      console.log(`   • ${product.name} (${product.id})`);
    });

    console.log("\n🔗 Next steps:");
    console.log("1. Verify the products in your Polar dashboard");
    console.log("2. Update the product IDs in src/components/home/pricing/client.tsx if needed");
    console.log("3. Test the checkout flow");
    console.log("4. Configure webhooks to point to /api/webhook/polar");

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

// Run the script
createProducts().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
