import { PrismaClient } from '@/prisma/generated/prisma';

const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
};

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
