import { findAllPriorities, findAllTasks } from '@/src/actions';
import { ClientTasksTable } from '@/components/ClientTasksTable';

/**
 * A wrapper component to perform server data fetching
 *
 * @returns {Promise<React.JSX.Element>}
 */
async function TasksTable(): Promise<React.JSX.Element> {
  const initialTasks = await findAllTasks();
  const priorities = await findAllPriorities();

  return (
    <ClientTasksTable initialTasks={initialTasks} priorities={priorities} />
  );
}

export { TasksTable };
