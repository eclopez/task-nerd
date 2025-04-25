'use client';

import * as React from 'react';
import { Task } from '@/prisma/generated/prisma';
import { TaskForm } from '@/src/components/TaskForm';
import { useTaskForm } from '@/src/hooks/useTaskForm';

interface EditTaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

function EditTaskPage(props: EditTaskPageProps) {
  const { id } = React.use(props.params);
  const { getTask } = useTaskForm();

  const [task, setTask] = React.useState<Task | null>(null);

  React.useEffect(() => {
    const fetchTask = async () => {
      const task: Task = await getTask(Number(id));
      setTask(task);
    };

    fetchTask();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-heading-1 text-primary-500 mb-6 font-semibold">
        Edit task
      </h2>
      {task ? (
        <TaskForm task={task} mode="edit"></TaskForm>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default EditTaskPage;
