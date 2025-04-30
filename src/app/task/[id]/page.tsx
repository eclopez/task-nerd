import * as React from 'react';
import { TaskForm } from '@/src/components/TaskForm';

interface EditTaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

function EditTaskPage(props: EditTaskPageProps) {
  const { id } = React.use(props.params);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-heading-1 text-primary-500 mb-6 font-semibold">
        Edit task
      </h2>
      <TaskForm id={Number(id)}></TaskForm>
    </div>
  );
}

export default EditTaskPage;
