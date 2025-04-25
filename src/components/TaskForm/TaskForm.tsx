'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import { Task } from '@/prisma/generated/prisma';
import { useTaskForm } from '@/src/hooks/useTaskForm';
import { ErrorSnack } from '../ErrorSnack';

interface TaskFormProps {
  /**
   * The task to edit. If not provided, a new task will be created.
   *
   * @type {Task | undefined}
   * @optional
   */
  task?: Task;
  /**
   * The mode of the form. Can be either 'add' or 'edit'.
   *
   * @type {'add' | 'edit'}
   */
  mode: 'add' | 'edit';
}

/**
 *
 * @param {TaskFormProps} props The props for the TaskForm component.
 *
 * @returns {React.JSX.Element}
 */
function TaskForm(props: TaskFormProps): React.JSX.Element {
  const router = useRouter();

  const { task, mode } = props;

  const { error, isLoading, priorities, addTask, editTask } = useTaskForm();

  const [newTitle, setNewTitle] = React.useState<string>(task?.title ?? '');
  const [newDescription, setNewDescription] = React.useState<string>(
    task?.description ?? '',
  );
  const [newPriorityId, setNewPriorityId] = React.useState<number | ''>(
    task?.priorityId ?? '',
  );
  const [errorOpen, setErrorOpen] = React.useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (mode === 'edit') {
        await editTask(
          task.id,
          newTitle,
          newDescription,
          Number(newPriorityId),
        );
      } else {
        await addTask(newTitle, newDescription, Number(newPriorityId));
      }
      router.push('/');
    } catch (error) {
      setErrorOpen(true);
    }
  };

  React.useEffect(() => {
    if (error) {
      setErrorOpen(true);
    }
  }, [error]);

  return (
    <Box
      sx={{ maxWidth: '480px' }}
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newTitle}
        required
        onChange={(event) => setNewTitle(event.target.value)}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newDescription}
        onChange={(event) => setNewDescription(event.target.value)}
      />
      <TextField
        label="Priority"
        variant="outlined"
        select
        fullWidth
        margin="normal"
        value={newPriorityId}
        required
        onChange={(event) => setNewPriorityId(Number(event.target.value))}
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
          {mode} Task
        </Button>
      </div>
      <ErrorSnack open={errorOpen} onClose={() => {}} />
    </Box>
  );
}

export { TaskForm };
