'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import { Task } from '@/prisma/generated/prisma';
import { useTaskForm } from '@/src/hooks/useTaskForm';
import { ErrorSnack } from '../ErrorSnack';

interface TaskFormProps {
  /**
   * The id of the task.
   *
   * @type {number}
   * @optional
   */
  id?: number;
}

/**
 *
 * @param {TaskFormProps} props The props for the TaskForm component.
 *
 * @returns {React.JSX.Element}
 */
function TaskForm(props: TaskFormProps): React.JSX.Element {
  const router = useRouter();
  const { id } = props;

  const [newTitle, setNewTitle] = React.useState<string>('');
  const [newDescription, setNewDescription] = React.useState<string>('');
  const [newPriorityId, setNewPriorityId] = React.useState<number | ''>('');
  const [errorOpen, setErrorOpen] = React.useState<boolean>(false);

  const { error, isLoading, priorities, addTask, editTask, getTask } =
    useTaskForm();

  React.useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;

      const task: Task = await getTask(id);
      setNewTitle(task.title);
      setNewDescription(task.description);
      setNewPriorityId(task.priorityId);
    };

    fetchTask();
  }, [id, getTask]);

  React.useEffect(() => {
    if (error) {
      setErrorOpen(true);
    }
  }, [error]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (id) {
        await editTask(id, newTitle, newDescription, Number(newPriorityId));
      } else {
        await addTask(newTitle, newDescription, Number(newPriorityId));
      }
      router.push('/');
    } catch {
      setErrorOpen(true);
    }
  };

  return (
    <Box
      sx={{ maxWidth: '480px' }}
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
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
              {id ? 'Edit' : 'Add'} Task
            </Button>
          </div>
        </>
      )}
      <ErrorSnack open={errorOpen} onClose={() => {}} />
    </Box>
  );
}

export { TaskForm };
