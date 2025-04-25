'use server';

import prisma from '@/lib/prisma';

async function deleteTask(id: number) {
  await prisma.task.delete({
    where: { id },
  });
}

async function getAllTasks(
  sortField: string = 'id',
  sortOrder: 'asc' | 'desc' = 'asc',
) {
  return await prisma.task.findMany({
    include: {
      priority: true,
    },
    orderBy: {
      [sortField]: sortOrder,
    },
  });
}

async function updateTaskPriority(id: number, priorityId: number) {
  await prisma.task.update({
    where: { id },
    data: { priorityId, updatedAt: new Date() },
  });
}

async function updateTaskCompletion(id: number, completed: boolean) {
  await prisma.task.update({
    where: { id },
    data: { completedAt: completed ? new Date() : null },
  });
}

export { deleteTask, getAllTasks, updateTaskPriority, updateTaskCompletion };
