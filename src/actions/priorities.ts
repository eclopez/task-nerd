'use server';

import prisma from '@/lib/prisma';

async function getAllPriorities() {
  return await prisma.priority.findMany();
}

export { getAllPriorities };
