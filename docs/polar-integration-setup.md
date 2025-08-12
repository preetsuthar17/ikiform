# Polar Integration Setup Guide

This guide explains how to set up Polar products programmatically for the Ikiform application, including product creation, webhook configuration, and environment setup.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Polar Access Token Setup](#polar-access-token-setup)
- [Product Configuration](#product-configuration)
- [Running the Setup Script](#running-the-setup-script)
- [Webhook Configuration](#webhook-configuration)
- [Testing the Integration](#testing-the-integration)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)

## Overview

Ikiform uses [Polar](https://polar.sh) for payment processing and subscription management. This guide covers the complete setup process for creating products programmatically and configuring the integration.

### What We're Setting Up

- **3 Product Types**: Monthly, Yearly, and Lifetime subscriptions
- **Automated Product Creation**: Script-based setup using Polar SDK
- **Webhook Integration**: Real-time payment and subscription event handling
- **Customer Portal**: Self-service subscription management

## Prerequisites

Before starting, ensure you have:

- [ ] A Polar account with organization access
- [ ] Node.js 18+ and pnpm installed
- [ ] Access to your project's environment variables
- [ * ] Polar SDK installed (`@polar-sh/sdk`)

## Environment Setup

### 1. Install Dependencies

The Polar SDK should already be installed. If not, install it:

```bash
pnpm add @polar-sh/sdk
```

### 2. Environment Variables

Add these variables to your `.env.local` file:

```env
# Polar Configuration
POLAR_ACCESS_TOKEN=your_polar_access_token_here
POLAR_ORGANIZATION_ID=your_organization_id_here

# Optional: For development
POLAR_SERVER=production  # or "development" for testing
```

## Polar Access Token Setup

### 1. Generate Access Token

1. Go to [Polar Dashboard](https://polar.sh/dashboard)
2. Navigate to **Settings** → **API Keys**
3. Click **"Create API Key"**
4. Give it a name (e.g., "Ikiform Integration")
5. Select the required scopes (see [Required Scopes](#required-scopes) below)
6. Copy the generated token

### 2. Required Scopes

Your Polar access token needs these scopes:

#### Core Scopes

- `products:write` - Create and manage products
- `products:read` - Read product information
- `customers:read` - Read customer information
- `customers:write` - Create and update customers
- `subscriptions:read` - Read subscription information
- `subscriptions:write` - Manage subscriptions
- `orders:read` - Read order information
- `webhooks:write` - Create and manage webhooks

#### Additional Scopes

- `organizations:read` - Read organization information
- `invoices:read` - Read invoice information
- `invoices:write` - Create and manage invoices

### 3. Get Organization ID

1. In your Polar dashboard, go to **Settings** → **General**
2. Copy your **Organization ID** (it's a UUID)
3. Add it to your `.env.local` file

## Product Configuration

The application uses three product tiers:

### Product Structure

```typescript
const PRODUCTS = [
  {
    id: "f4c70364-2a3e-4397-ac2e-9d7884d645c9",
    name: "Ikiform Pro - Monthly",
    description:
      "Unlock unlimited forms, AI-powered analytics, and advanced features with our monthly Pro plan",
    price: 1900, // $19.00 in cents
    currency: "USD",
    interval: "month",
    interval_count: 1,
  },
  {
    id: "ea14c1ae-f1af-4173-8e37-a713345f8840",
    name: "Ikiform Pro - Yearly",
    description:
      "Get 53% savings with our annual Pro plan. All the features you need for building powerful forms",
    price: 900, // $9.00 per month in cents
    currency: "USD",
    interval: "year",
    interval_count: 1,
  },
  {
    id: "9d111ea1-3a74-4789-9f10-2d858b0ff476",
    name: "Ikiform Pro - Lifetime",
    description:
      "One-time payment for lifetime access to all Ikiform Pro features",
    price: 11900, // $119.00 in cents
    currency: "USD",
    // No interval for one-time products
  },
];
```

### Pricing Strategy

- **Monthly**: $19/month - Standard monthly billing
- **Yearly**: $9/month (billed yearly) - 53% savings
- **Lifetime**: $119 one-time - Best value for long-term users

## Running the Setup Script

### 1. Script Location

The setup script is located at `scripts/create-polar-products.ts`

### 2. Run the Script

```bash
# Using the npm script
pnpm run polar:setup

# Or directly with tsx
npx tsx scripts/create-polar-products.ts
```

### 3. Expected Output

```
🚀 Starting Polar Product Setup...

✅ Environment variables loaded
✅ Polar SDK initialized

🛍️ Creating product: Ikiform Pro - Monthly
✅ Created subscription product: Ikiform Pro - Monthly (ID: f4c70364-2a3e-4397-ac2e-9d7884d645c9)
   Price: $19.00 USD
   Billing: 1 month(s)

🛍️ Creating product: Ikiform Pro - Yearly
✅ Created subscription product: Ikiform Pro - Yearly (ID: ea14c1ae-f1af-4173-8e37-a713345f8840)
   Price: $9.00 USD
   Billing: 1 year(s)

🛍️ Creating product: Ikiform Pro - Lifetime
✅ Created one-time product: Ikiform Pro - Lifetime (ID: 9d111ea1-3a74-4789-9f10-2d858b0ff476)
   Price: $119.00 USD
   Type: One-time payment

🎉 All products created successfully!
```

### 4. Update Product IDs

After running the script, **update the product IDs** in your code:

```typescript
// src/components/home/pricing/client.tsx
const MONTHLY_PRODUCT_ID = "f4c70364-2a3e-4397-ac2e-9d7884d645c9";
const YEARLY_PRODUCT_ID = "ea14c1ae-f1af-4173-8e37-a713345f8840";
const ONETIME_PRODUCT_ID = "9d111ea1-3a74-4789-9f10-2d858b0ff476";
```

## Webhook Configuration

### 1. Webhook Events

Configure these webhook events in your Polar dashboard:

#### Order Events

- `order.paid` - When payment is completed
- `order.canceled` - When order is canceled

#### Subscription Events

- `subscription.created` - New subscription created
- `subscription.active` - Subscription becomes active
- `subscription.updated` - Subscription details updated
- `subscription.revoked` - Subscription revoked
- `subscription.canceled` - Subscription canceled

### 2. Webhook URL

Set your webhook URL to:

```
https://yourdomain.com/api/webhook/polar
```

### 3. Webhook Handler

The webhook handler is located at `src/app/api/webhook/polar/route.ts` and handles:

- Payment confirmation
- Subscription status updates
- User premium status management
- Email notifications

## Testing the Integration

### 1. Test Checkout Flow

1. Navigate to your pricing page
2. Click on any plan
3. Complete the checkout process
4. Verify webhook events are received

### 2. Test Webhook Events

Use Polar's webhook testing tools:

1. Go to **Settings** → **Webhooks**
2. Click **"Test Webhook"** for each event type
3. Verify events are processed correctly

### 3. Test Customer Portal

1. After successful payment, users get access to customer portal
2. Test subscription management features
3. Verify billing information display

## Troubleshooting

### Common Issues

#### 1. "Setting organization_id is disallowed"

**Problem**: Using organization token but still specifying organization ID

**Solution**: Remove `organizationId` from the API call when using organization tokens

```typescript
// ❌ Wrong - with organization token
const product = await polar.products.create({
  organizationId: POLAR_ORGANIZATION_ID, // Remove this
  name: "Product Name",
  // ...
});

// ✅ Correct - with organization token
const product = await polar.products.create({
  name: "Product Name",
  // ...
});
```

#### 2. "Invalid price structure"

**Problem**: Incorrect price object structure

**Solution**: Use the correct price structure:

```typescript
// ✅ Correct price structure
prices: [
  {
    amountType: "fixed",
    priceAmount: 1900, // Amount in cents
  },
];
```

#### 3. "Missing required fields"

**Problem**: Missing required fields in product creation

**Solution**: Ensure all required fields are provided:

```typescript
const product = await polar.products.create({
  name: "Product Name", // Required
  description: "Description", // Required
  recurringInterval: "month", // Required for subscriptions
  prices: [
    {
      // Required
      amountType: "fixed",
      priceAmount: 1900,
    },
  ],
});
```

#### 4. Webhook Not Receiving Events

**Problem**: Webhook events not being received

**Solutions**:

- Verify webhook URL is accessible
- Check webhook secret configuration
- Ensure correct event types are selected
- Test with Polar's webhook testing tool

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=polar:*
```

### Error Logs

Check your application logs for detailed error information:

```bash
# Development
pnpm dev

# Production
pnpm start
```

## API Reference

### Polar SDK Methods Used

#### Product Creation

```typescript
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
  accessToken: POLAR_ACCESS_TOKEN,
  server: "production", // or "development"
});

// Create subscription product
const product = await polar.products.create({
  name: "Product Name",
  description: "Product Description",
  recurringInterval: "month", // or "year"
  prices: [
    {
      amountType: "fixed",
      priceAmount: 1900, // Amount in cents
    },
  ],
});

// Create one-time product
const product = await polar.products.create({
  name: "Product Name",
  description: "Product Description",
  recurringInterval: null,
  prices: [
    {
      amountType: "fixed",
      priceAmount: 11900,
    },
  ],
});
```

#### Webhook Handling

```typescript
// src/app/api/webhook/polar/route.ts
import { WebhookHandler } from "@polar-sh/sdk";

const handler = new WebhookHandler({
  secret: process.env.POLAR_WEBHOOK_SECRET!,
});

// Handle order events
handler.onOrderPaid(async (event) => {
  // Update user premium status
  // Send confirmation email
  // Store customer information
});

// Handle subscription events
handler.onSubscriptionCreated(async (event) => {
  // Activate user subscription
  // Update billing information
});
```

### Environment Variables Reference

| Variable                | Description              | Required | Example      |
| ----------------------- | ------------------------ | -------- | ------------ |
| `POLAR_ACCESS_TOKEN`    | Polar API access token   | Yes      | `pol_...`    |
| `POLAR_ORGANIZATION_ID` | Polar organization ID    | Yes      | `uuid`       |
| `POLAR_SERVER`          | Polar server environment | No       | `production` |
| `POLAR_WEBHOOK_SECRET`  | Webhook signature secret | Yes      | `whsec_...`  |

## Security Considerations

### 1. Access Token Security

- Store access tokens securely in environment variables
- Use organization tokens when possible
- Rotate tokens regularly
- Never commit tokens to version control

### 2. Webhook Security

- Always verify webhook signatures
- Use HTTPS for webhook endpoints
- Implement idempotency for webhook handlers
- Log all webhook events for debugging

### 3. Data Protection

- Encrypt sensitive customer data
- Follow GDPR compliance requirements
- Implement proper data retention policies
- Use secure database connections

## Best Practices

### 1. Product Management

- Use descriptive product names
- Provide clear pricing information
- Test all product configurations
- Monitor product performance

### 2. Error Handling

- Implement comprehensive error handling
- Log all API interactions
- Provide user-friendly error messages
- Set up monitoring and alerting

### 3. Testing

- Test with Polar's test mode first
- Use webhook testing tools
- Verify all payment flows
- Test subscription lifecycle events

## Support Resources

- [Polar Documentation](https://docs.polar.sh)
- [Polar API Reference](https://docs.polar.sh/api)
- [Polar SDK GitHub](https://github.com/polarsource/polar)
- [Polar Community](https://discord.gg/polar)

## Contributing

When contributing to this integration:

1. Test all changes thoroughly
2. Update documentation
3. Follow the existing code style
4. Add appropriate error handling
5. Include tests for new features

---

**Note**: This documentation assumes you're using the latest version of the Polar SDK. Check the [Polar documentation](https://docs.polar.sh) for the most up-to-date API reference.
