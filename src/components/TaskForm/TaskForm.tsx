'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
} from '@mui/material';
import { Priority, Task } from '@/prisma/generated/prisma';
import { createTask, updateTask } from '@/src/actions';
import { ErrorSnack } from '@/components/ErrorSnack';

interface TaskFormProps {
  /**
   * Whether the form is loading or not
   *
   * @type {boolean}
   * @optional
   */
  isLoading?: boolean;
  /**
   * The priorities to be displayed in the form
   *
   * @type {Priority[]}
   * @required
   */
  priorities: Priority[];
  /**
   * The task to be edited
   *
   * @type {Task}
   * @optional
   */
  task?: Task;
}

/**
 *
 * @param {TaskFormProps} props The props for the TaskForm component.
 *
 * @returns {React.JSX.Element}
 */
function TaskForm(props: TaskFormProps): React.JSX.Element {
  const router = useRouter();
  const { isLoading, priorities, task } = props;

  const [formData, setFormData] = React.useState<Partial<Task> | null>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    priorityId: Number(task?.priorityId) ?? 0,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    // If a task is provided, set the form data to the task's data
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priorityId: Number(task.priorityId),
      });
    }
  }, [task]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (task?.id) {
        await updateTask(task.id, {
          title: formData?.title,
          description: formData?.description,
          priorityId: formData?.priorityId,
        });
      } else {
        await createTask(
          formData.title,
          formData.description,
          formData.priorityId,
        );
      }
      router.push('/');
    } catch {
      setErrorOpen(true);
      setIsSubmitting(false);
    }
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  return (
    <Box
      sx={{ maxWidth: '480px' }}
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      {isSubmitting ? (
        <CircularProgress />
      ) : (
        <>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.title}
            required
            onChange={handleChange('title')}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.description}
            onChange={handleChange('description')}
          />
          <TextField
            label="Priority"
            variant="outlined"
            select
            fullWidth
            margin="normal"
            value={!formData.priorityId ? '' : formData.priorityId} // Treat a falsy value (in this case 0) as empty
            required
            onChange={handleChange('priorityId')}
            disabled={isLoading}
          >
            {priorities?.map((priority) => (
              <MenuItem key={priority.id} value={priority.id}>
                {priority.name}
              </MenuItem>
            ))}
          </TextField>
          <div className="mt-6 flex flex-row justify-end gap-8">
            <Button
              variant="text"
              color="secondary"
              onClick={() => router.push('/')}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              loading={isLoading}
              loadingIndicator="Loading..."
            >
              {task?.id ? 'Edit' : 'Add'} Task
            </Button>
          </div>
        </>
      )}
      <ErrorSnack open={errorOpen} onClose={() => setErrorOpen(false)} />
    </Box>
  );
}

export { TaskForm };
