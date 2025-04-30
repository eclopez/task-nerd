import * as React from 'react';
import { findAllPriorities } from '@/src/actions';
import { TaskForm } from '@/src/components/TaskForm';

function NewTaskPage() {
  const priorities = React.use(findAllPriorities());

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-heading-1 text-primary-500 mb-6 font-semibold">
        Add new task
      </h2>
      <TaskForm priorities={priorities} />
    </div>
  );
}

export default NewTaskPage;
