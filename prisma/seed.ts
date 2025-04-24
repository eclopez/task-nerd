import { PrismaClient, Prisma } from './generated/prisma';

const prisma = new PrismaClient();

const priorities: Prisma.PriorityCreateInput[] = [
  { name: 'High', value: 10000 },
  {
    name: 'Medium',
    value: 5000,
    tasks: {
      create: [
        {
          title: 'Test task',
          description: 'Test task description',
          updatedAt: null,
          completedAt: null,
        },
      ],
    },
  },
  { name: 'Low', value: 1000 },
];

async function main() {
  for (const p of priorities) {
    await prisma.priority.create({
      data: p,
    });
  }
}

main();
