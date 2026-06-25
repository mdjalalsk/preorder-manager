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

## How to Run Locally

### Quick Start Guide

Follow these steps to get the project running on your local machine:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd preorder-manager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   echo 'DATABASE_URL="file:./prisma/dev.db"' > .env.local
   ```

4. **Initialize the database**
   ```bash
   pnpm exec prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Useful Commands

- **Run migrations:** `pnpm exec prisma migrate dev`
- **Open Prisma Studio:** `pnpm exec prisma studio`
- **Build for production:** `pnpm run build`
- **Start production server:** `pnpm start`

### Development Tips

- Hot reload is enabled by default, so changes will be reflected immediately
- The SQLite database file is created at `./prisma/dev.db`
- Use Prisma Studio to view and manage database records: `pnpm exec prisma studio`
- API routes are located in `app/api/` directory

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
