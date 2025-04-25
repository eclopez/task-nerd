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
          title: 'Test task 1',
          description: 'Test task 1 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 2',
          description: 'Test task 2 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 3',
          description: 'Test task 3 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 4',
          description: 'Test task 4 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 5',
          description: 'Test task 5 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 6',
          description: 'Test task 6 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 7',
          description: 'Test task 7 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 8',
          description: 'Test task 8 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 9',
          description: 'Test task 9 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 10',
          description: 'Test task 10 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 11',
          description: 'Test task 11 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 12',
          description: 'Test task 12 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 13',
          description: 'Test task 13 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 14',
          description: 'Test task 14 description',
          updatedAt: null,
          completedAt: null,
        },
        {
          title: 'Test task 15',
          description: 'Test task 15 description',
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
