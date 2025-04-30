'use server';

import prisma from '@/lib/prisma';
import type { Task } from '@/prisma/generated/prisma';

async function deleteTask(id: number) {
  await prisma.task.delete({
    where: { id },
  });
}

async function findAllTasks(
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

async function findTask(id: number) {
  return await prisma.task.findUnique({
    where: { id },
  });
}

async function updateTask(id: number, data: Partial<Task>) {
  await prisma.task.update({
    where: { id },
    data: { ...data, updatedAt: new Date() },
  });
}

async function updateTaskPriority(id: number, priorityId: number) {
  await prisma.task.update({
    where: { id },
    data: { priorityId, updatedAt: new Date() },
  });
}

async function completeTask(id: number, completed: boolean) {
  await prisma.task.update({
    where: { id },
    data: { completedAt: completed ? new Date() : null },
  });
}

async function createTask(
  title: string,
  description: string,
  priorityId: number,
) {
  await prisma.task.create({
    data: {
      title,
      description,
      priorityId,
      createdAt: new Date(),
    },
  });
}

export {
  createTask,
  deleteTask,
  findAllTasks,
  findTask,
  updateTask,
  updateTaskPriority,
  completeTask,
};
