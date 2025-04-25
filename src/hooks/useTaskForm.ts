import * as React from 'react';
import {
  createTask,
  findAllPriorities,
  findTask,
  updateTask,
} from '@/src/actions';
import type { Task, Priority } from '@/prisma/generated/prisma';

const useTaskForm = () => {
  const [priorities, setPriorities] = React.useState<Priority[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  async function fetchData() {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedPriorities = await findAllPriorities();

      setPriorities(fetchedPriorities);
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error('An unknown error occurred'),
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function addTask(
    title: string,
    description: string,
    priorityId: number,
  ) {
    try {
      setIsLoading(true);
      setError(null);

      await createTask(title, description, priorityId);
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error('An unknown error occurred'),
      );
      fetchData();
    } finally {
      setIsLoading(false);
    }
  }

  async function getTask(id: number): Promise<Task> {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTask = await findTask(id);

      return fetchedTask;
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error('An unknown error occurred'),
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function editTask(
    id: number,
    title: string,
    description: string,
    priorityId: number,
  ) {
    try {
      setIsLoading(true);
      setError(null);

      await updateTask(id, { title, description, priorityId });
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
    priorities,
    isLoading,
    error,
    addTask,
    getTask,
    editTask,
  };
};

export { useTaskForm };
