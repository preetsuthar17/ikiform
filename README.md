# Ikiform

## Project Overview

Ikiform is a modern, AI-powered form builder and analytics platform. It allows users to create, manage, and analyze forms with advanced features such as AI-assisted form creation, analytics, and integrations. Built with Next.js, React, Supabase, and Tailwind CSS, Ikiform is designed for scalability and developer productivity.

### Key Features

- AI-powered form builder
- Real-time analytics and reporting
- User authentication and dashboard
- Customizable appearance and themes

## Project Structure

```plaintext
Ikiform/
├── public/           # Static assets (images, videos, icons, etc.)
├── src/
│   ├── app/          # Next.js app directory (routes, pages, layouts)
│   ├── components/   # Reusable React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Library code (API, database, services, utils)
│   └── utils/        # Utility functions
├── .gitignore        # Git ignore rules
├── next.config.ts    # Next.js configuration
├── package.json      # Project metadata and scripts
├── postcss.config.mjs# PostCSS configuration
├── tsconfig.json     # TypeScript configuration
└── README.md         # Project documentation
```

- Most of the application logic and UI lives in the `src/` directory.
- The `public/` directory contains static files served directly by Next.js.
- Configuration and setup files are in the project root.

## Roadmap

You can view the project roadmap at [https://ikiform.com/roadmap](https://ikiform.com/roadmap)

## Contributing

Thank you for your interest in contributing to Ikiform!

### Getting Started

1. **Clone the repository**
2. **Install dependencies**
   - Using npm: `npm install`
   - Or using pnpm: `pnpm install`
3. **Copy and configure environment variables**
   - Copy `.env.example` to `.env.local` and fill in the required values.
4. **Run the development server**
   - `npm run dev` or `pnpm dev`

The app will be available at `http://localhost:3000` by default.

### Environment Variables

Create a `.env.local` file in the project root. Use `.env.example` as a template. The following variables are required:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
POLAR_ACCESS_TOKEN=your-polar-access-token
POLAR_SUCCESS_URL=http://localhost:3000/success
POLAR_WEBHOOK_SECRET=your-polar-webhook-secret
ANALYTICS_AI_SYSTEM_PROMPT=your-analytics-ai-system-prompt
GROQ_API_KEY=your-groq-api-key
AI_FORM_SYSTEM_PROMPT=your-ai-form-system-prompt
```

### Code Quality

- Run `npm run lint` to check for linting issues.
- Run `npm run format` to auto-format code.
- Run `npm run check` to check types and formatting.

### Building

- Run `npm run build` to build the project for production.

### Notes

- Do not commit files or folders listed in `.gitignore` (e.g., `node_modules`, `.next`, `.env*`, etc.).
- Use clean and clear code for maintainability.
- Follow the existing code style and structure.

Feel free to open issues or pull requests for improvements or bug fixes.
