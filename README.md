# Preorder Manager

A modern web application for managing product preorders with filtering, sorting, and pagination capabilities.

## Tech Stack

- **Framework:** Next.js 16.2.9 (App Router)
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS 3.4.19
- **Language:** TypeScript 5.9.3
- **Package Manager:** pnpm 9.15.4

## Prerequisites

- Node.js v22 or higher
- pnpm v9 or higher

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

If `.env.example` doesn't exist, create `.env.local` manually:

```bash
touch .env.local
```

Add your environment variables to `.env.local`:

```env
# Database URL (SQLite is the default)
DATABASE_URL="file:./prisma/dev.db"
```

**Note:** Never commit `.env.local` to version control. It's already listed in `.gitignore`.

### 3. Set Up the Database

The project uses Prisma with SQLite. The database will be automatically created at `./prisma/dev.db`.

Initialize the database schema by running migrations:

```bash
pnpm exec prisma migrate dev
```

This will:

- Create the SQLite database
- Apply all migrations
- Generate the Prisma Client

### 4. Seed Sample Data (Optional)

To populate the database with 8 sample preorder records, run:

```bash
pnpm exec node --input-type=module --eval "
import { prisma } from './lib/db.js';

async function main() {
  await prisma.preorder.createMany({
    data: [
      { name: 'Multi variant 3', products: 1, preorderWhen: 'out-of-stock', startsAt: new Date('2025-12-15T08:24:00'), endsAt: null, status: false },
      { name: 'Multi variant 2', products: 1, preorderWhen: 'regardless-of-stock', startsAt: new Date('2025-12-15T08:24:00'), endsAt: new Date('2025-12-15T08:27:00'), status: true },
      { name: 'Multi variants 1', products: 1, preorderWhen: 'regardless-of-stock', startsAt: new Date('2025-12-15T08:24:00'), endsAt: null, status: true },
      { name: 'Partial payment', products: 1, preorderWhen: 'regardless-of-stock', startsAt: new Date('2025-08-17T04:56:00'), endsAt: null, status: true },
      { name: 'Shipping not sure', products: 1, preorderWhen: 'regardless-of-stock', startsAt: new Date('2025-08-17T04:56:00'), endsAt: null, status: true },
      { name: 'Full payment', products: 1, preorderWhen: 'regardless-of-stock', startsAt: new Date('2025-08-17T04:56:00'), endsAt: null, status: true },
      { name: 'Coming soon', products: 1, preorderWhen: 'regardless-of-stock', startsAt: new Date('2025-12-11T04:42:00'), endsAt: null, status: true },
      { name: 'With ends', products: 1, preorderWhen: 'regardless-of-stock', startsAt: new Date('2025-08-14T03:59:00'), endsAt: null, status: true }
    ]
  });
  console.log('Sample data created');
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
"
```

Or create preorders via the API after starting the dev server.

### 5. Start the Development Server

```bash
pnpm dev
```

The application will be available at **http://localhost:3000**

## Project Structure

```
app/
├── page.tsx                    # Preorder list with filtering & sorting
├── preorder/
│   ├── new/page.tsx           # Create preorder form
│   └── [id]/edit/page.tsx      # Edit preorder form
└── api/
    └── preorders/
        ├── route.ts           # List & create preorders
        └── [id]/route.ts      # Get, update & delete single preorder

components/
└── PreorderForm.tsx           # Reusable form component

lib/
└── db.ts                      # Prisma client singleton

prisma/
├── schema.prisma              # Database schema
└── migrations/                # Database migrations
```

## Features

- **Filtering:** Filter preorders by All/Active/Inactive status
- **Sorting:** Sort by Name, Created At, Starts At, or Ends At
- **Pagination:** 8 preorders per page with navigation
- **Selection:** Checkboxes with select-all capability
- **CRUD Operations:**
  - Create new preorders
  - Edit existing preorders with data pre-filling
  - Delete with confirmation dialog
  - Toggle status with immediate database update
- **Responsive Design:** Clean, minimal UI with Tailwind CSS

## Database Schema

The application uses a single `Preorder` model with the following fields:

- `id`: Unique identifier (CUID)
- `name`: Preorder name
- `products`: Number of products
- `preorderWhen`: "out-of-stock" or "regardless-of-stock"
- `startsAt`: Preorder start date/time
- `endsAt`: Preorder end date/time (optional)
- `status`: Active (true) or Inactive (false)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## API Endpoints

### GET `/api/preorders`

Fetch preorders with filtering, sorting, and pagination.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 8)
- `filter`: "all", "active", or "inactive" (default: "all")
- `sortBy`: "name", "createdAt", "startsAt", or "endsAt" (default: "createdAt")
- `order`: "asc" or "desc" (default: "desc")

### POST `/api/preorders`

Create a new preorder.

### GET `/api/preorders/[id]`

Fetch a single preorder by ID.

### PUT `/api/preorders/[id]`

Update a preorder (partial updates supported).

### DELETE `/api/preorders/[id]`

Delete a preorder.

## Troubleshooting

### Database Issues

If you encounter database connection errors, try:

1. Delete `prisma/dev.db` and `prisma/dev.db-journal`
2. Run `pnpm exec prisma migrate dev` again

### Port Already in Use

If port 3000 is busy, you can specify a different port:

```bash
pnpm dev -- -p 3001
```

### TypeScript Errors

Regenerate the Prisma Client:

```bash
pnpm exec prisma generate
```

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm exec prisma studio` - Open Prisma Studio (database GUI)
- `pnpm exec prisma migrate dev` - Create and apply migrations
