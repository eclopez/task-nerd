import * as React from 'react';
import {
  deleteTask,
  getAllPriorities,
  getAllTasks,
  updateTaskCompletion,
  updateTaskPriority,
} from '@/src/actions';
import type { Task, Priority } from '@/prisma/generated/prisma';

type TaskWithPriority = Task & { priority: Priority };

const useTaskData = () => {
  const [tasks, setTasks] = React.useState<TaskWithPriority[]>([]);
  const [priorities, setPriorities] = React.useState<Priority[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [operationCount, setOperationCount] = React.useState<number>(0);

  async function fetchData() {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await getAllTasks();
      const fetchedPriorities = await getAllPriorities();

      setTasks(fetchedTasks);
      setPriorities(fetchedPriorities);
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error('An unknown error occurred'),
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function setTaskCompleted(id: number, isCompleted: boolean) {
    const updatedTask = tasks.find((task) => task.id === id);
    if (!updatedTask) return;

    try {
      setOperationCount((prev) => prev + 1);
      setIsLoading(true);
      setError(null);
      // Optimistically update the task state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? { ...task, completedAt: isCompleted ? new Date() : null }
            : task,
        ),
      );

      await updateTaskCompletion(id, isCompleted);
      setOperationCount((prev) => Math.min(0, prev - 1));

      // Don't refetch data if there are still pending operations
      // to prevent flickering UI
      if (operationCount === 0) {
        await fetchData();
      }
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error('An unknown error occurred'),
      );
      // Revert the optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? { ...task, completedAt: updatedTask.completedAt }
            : task,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function setTaskPriority(id: number, priorityId: number) {
    const updatedTask = tasks.find((task) => task.id === id);
    const updatedPriority = priorities.find(
      (priority) => priority.id === priorityId,
    );
    if (!updatedTask || !updatedPriority) return;

    try {
      setOperationCount((prev) => prev + 1);
      setIsLoading(true);
      setError(null);
      // Optimistically update the task state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                priorityId: updatedPriority.id,
                priority: updatedPriority,
              }
            : task,
        ),
      );

      await updateTaskPriority(id, updatedPriority.id);
      setOperationCount((prev) => Math.min(0, prev - 1));

      // Don't refetch data if there are still pending operations
      // to prevent flickering UI
      if (operationCount === 0) {
        await fetchData();
      }
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error('An unknown error occurred'),
      );
      // Revert the optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, priority: updatedTask.priority } : task,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function removeTask(id: number) {
    const deletedTask = tasks.find((task) => task.id === id);
    if (!deletedTask) return;

    try {
      setOperationCount((prev) => prev + 1);
      setIsLoading(true);
      setError(null);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

      await deleteTask(id);
      setOperationCount((prev) => Math.min(0, prev - 1));

      // Don't refetch data if there are still pending operations
      // to prevent flickering UI
      if (operationCount === 0) {
        await fetchData();
      }
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error('An unknown error occurred'),
      );
      fetchData();
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  return {
    tasks,
    priorities,
    isLoading,
    error,
    removeTask,
    setTaskCompleted,
    setTaskPriority,
  };
};

export { useTaskData };
