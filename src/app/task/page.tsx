'use client';

import { TaskForm } from '@/src/components/TaskForm';

function NewTaskPage() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-heading-1 text-primary-500 mb-6 font-semibold">
        Add new task
      </h2>
      <TaskForm mode="add" />
    </div>
  );
}

export default NewTaskPage;
