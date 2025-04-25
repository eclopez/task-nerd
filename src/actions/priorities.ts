'use server';

import prisma from '@/lib/prisma';

async function findAllPriorities() {
  return await prisma.priority.findMany();
}

export { findAllPriorities };
