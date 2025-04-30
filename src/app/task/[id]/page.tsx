import * as React from 'react';
import { CircularProgress } from '@mui/material';
import { findAllPriorities, findTask } from '@/src/actions';
import { TaskForm } from '@/src/components/TaskForm';

interface EditTaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

function EditTaskPage(props: EditTaskPageProps) {
  const { id } = React.use(props.params);

  const priorities = React.use(findAllPriorities());
  const task = React.use(findTask(Number(id)));

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-heading-1 text-primary-500 mb-6 font-semibold">
        Edit task
      </h2>
      <React.Suspense fallback={<CircularProgress />}>
        <TaskForm task={task} priorities={priorities} />
      </React.Suspense>
    </div>
  );
}

export default EditTaskPage;
