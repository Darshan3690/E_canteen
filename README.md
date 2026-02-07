## Environment Variables Setup (Clerk + Supabase)

This project uses Clerk for authentication and Supabase as the database.

---

## 1. Create `.env`

Create a `.env` file in the root of your project:

```env
# ================================
# Clerk Authentication
# ================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxx

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ================================
# Supabase Database
# ================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

⚠️ Never commit `.env.local` to GitHub.

---

## 2. Install Required Packages

```bash
npm install @clerk/nextjs @supabase/supabase-js
```

---

## 3. Wrap App with Clerk Provider

Edit `app/layout.tsx`:

```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

## 4. Create Supabase Client

Create `lib/supabase.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## 5. Example: Fetch Data from Supabase

```ts
import { supabase } from "@/lib/supabase";

export async function getUsers() {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
```

---

## 6. Database Migration & Setup (Prisma + Supabase)

This project uses **Prisma ORM** with **Supabase (PostgreSQL)** for schema management and migrations.

---

## Install Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
```

---

## Initialize Prisma

```bash
npx prisma init
```

This creates:

```text
prisma/
 └─ schema.prisma
.env
```

---

## Configure Database URL

Get your **Supabase database connection string** from:

Supabase Dashboard → Project Settings → Database → Connection string

Update `.env.local`:

```env
DATABASE_URL="postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres"
```

⚠️ Use **Transaction Pooler URL** for serverless (Vercel).

---

## Example Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(uuid())
  clerkUserId   String   @unique
  email         String   @unique
  createdAt     DateTime @default(now())
}
```

---

## Run Prisma Migration

Create and apply migration:

```bash
npx prisma migrate dev --name init
```

This will:

* Create tables in Supabase
* Track schema history
* Generate Prisma Client

---

## Generate Prisma Client (Manual)

```bash
npx prisma generate
```

---

## Use Prisma Client

Create `lib/prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## Example Query (Prisma)

```ts
import { prisma } from "@/lib/prisma";

export async function getUsers() {
  return prisma.user.findMany();
}
```

---

## 7. Restart Development Server

```bash
npm run dev
```

---

## Security Notes

* Do NOT expose `CLERK_SECRET_KEY`
* Enable Row Level Security (RLS) in Supabase
* Use Supabase Service Role key only on the server
