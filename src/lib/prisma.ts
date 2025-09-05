// src/lib/prisma.ts

import { PrismaClient } from "@/generated/prisma";

declare global {
  // Allow global `prisma` to exist in Node.js (for hot reloads)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.prisma ?? new PrismaClient();

// Prevent creating multiple instances in development (hot reload)
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
