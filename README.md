# TableCRM Mobile Order Form

A mobile webapp for creating orders in TableCRM using Next.js, shadcn/ui, and the TableCRM API.

## Features

- Token-based authentication
- Client search by phone
- Selection of organizations, warehouses, payboxes, price types
- Product selection
- Create sale or create and conduct

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form with Zod validation

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The app integrates with TableCRM API endpoints:
- /meta/contragents/ - Clients
- /warehouses/ - Warehouses
- /meta/payboxes/ - Payboxes
- /organizations/ - Organizations
- /price_types/ - Price Types
- /nomenclature/ - Products
- /docs_sales/ - Create sales

## Deployment

Deploy to Vercel or any platform supporting Next.js.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
