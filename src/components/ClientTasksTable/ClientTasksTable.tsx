'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  DeleteForever,
  Edit,
  SignalCellularAlt,
  SignalCellularAlt1Bar,
  SignalCellularAlt2Bar,
} from '@mui/icons-material';
import {
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableProps,
  TableRow,
} from '@mui/material';
import type { Priority, Task } from '@/prisma/generated/prisma';
import { completeTask, deleteTask, updateTaskPriority } from '@/src/actions';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { ErrorSnack } from '@/components/ErrorSnack';

type TaskWithPriority = Task & { priority: Priority };

interface ClientTasksTableProps extends TableProps {
  /**
   * The list of tasks to be displayed
   *
   * @type {Task[]}
   * @required
   */
  initialTasks: TaskWithPriority[];
  /**
   * The list of all priorities
   *
   * @type {Priority[]}
   * @required
   */
  priorities: Priority[];
}

function StrikethroughText({
  text,
  isComplete,
}: {
  text: string;
  isComplete: boolean;
}) {
  return <span className={`${isComplete && 'line-through'}`}>{text}</span>;
}

/**
 * A table component that displays a list of tasks.
 *
 * @returns {React.JSX.Element}
 */
function ClientTasksTable(props: ClientTasksTableProps): React.JSX.Element {
  const router = useRouter();

  const { initialTasks, priorities, ...others } = props;

  const [tasks, setTasks] = React.useState<TaskWithPriority[]>(initialTasks);

  const [pendingDelete, setPendingDelete] = React.useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [errorOpen, setErrorOpen] = React.useState<boolean>(false);

  const [optimisticTasks, addOptimisticTask] = React.useOptimistic(
    tasks,
    (
      currentTasks: TaskWithPriority[],
      optimisticTask: Partial<TaskWithPriority> & { shouldDelete?: boolean },
    ) => {
      if (optimisticTask.shouldDelete) {
        return currentTasks.filter((task) => task.id !== optimisticTask.id);
      }
      return currentTasks.map((task) =>
        task.id === optimisticTask.id
          ? {
              ...task,
              completedAt: optimisticTask.completedAt,
              priorityId: optimisticTask.priorityId,
              priority:
                priorities.find(
                  (priority) => priority.id === optimisticTask.priorityId,
                ) ?? task.priority,
            }
          : task,
      );
    },
  );

  const handleCheckTask = async (taskId: number, checked: boolean) => {
    React.startTransition(() => {
      addOptimisticTask({
        id: taskId,
        completedAt: checked ? new Date() : null,
      });
    });

    try {
      await completeTask(taskId, checked);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? { ...task, completedAt: checked ? new Date() : null }
            : task,
        ),
      );

      router.refresh();
    } catch (error) {
      setErrorOpen(true);
      console.error('Failed to update task completion status:', error);
    }
  };

  const handleUpdatePriority = async (taskId: number, priorityId: number) => {
    const task = tasks.find((task) => task.id === taskId);
    const newPriority = priorities.find(
      (priority) => priority.id === priorityId,
    );

    React.startTransition(() => {
      addOptimisticTask({
        id: task.id,
        completedAt: task.completedAt,
        priorityId,
        priority: newPriority,
      });
    });

    try {
      await updateTaskPriority(taskId, priorityId);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? { ...task, priorityId, priority: newPriority }
            : task,
        ),
      );

      router.refresh();
    } catch (error) {
      setErrorOpen(true);
      console.error('Failed to update task priority:', error);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    setPendingDelete(task);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    React.startTransition(() => {
      addOptimisticTask({
        id: pendingDelete.id,
        shouldDelete: true,
      });
    });

    try {
      await deleteTask(pendingDelete.id);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== pendingDelete.id),
      );

      router.refresh();
    } catch (error) {
      setErrorOpen(true);
      console.error('Failed to update task completion status:', error);
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <div className="sm:px-12">
      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ minWidth: 320, maxHeight: 640 }}>
          <Table stickyHeader size="small" aria-label="Tasks table" {...others}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: 0, width: '40px' }} />
                <TableCell
                  sx={{
                    paddingY: '10px',
                    paddingLeft: 0,
                    paddingRight: '24px',
                    minWidth: '131px',
                  }}
                  align="left"
                >
                  Title
                </TableCell>
                <TableCell
                  sx={{
                    paddingX: 0,
                    paddingY: '10px',
                    paddingRight: '24px',
                    display: { xs: 'none', sm: 'table-cell' },
                  }}
                  align="left"
                >
                  Description
                </TableCell>
                <TableCell
                  sx={{
                    paddingX: 0,
                    paddingY: '10px',
                    paddingRight: '24px',
                    width: '107px',
                    display: { xs: 'none', sm: 'none', md: 'table-cell' },
                  }}
                  align="left"
                >
                  Priority
                </TableCell>
                <TableCell sx={{ padding: 0, width: '80px' }} align="left" />
              </TableRow>
            </TableHead>
            <TableBody>
              {optimisticTasks.length > 0 ? (
                <>
                  {optimisticTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell sx={{ padding: 0 }} align="center">
                        <Checkbox
                          size="small"
                          sx={{ padding: 0 }}
                          checked={task.completedAt !== null}
                          onChange={(_, checked) =>
                            handleCheckTask(task.id, checked)
                          }
                          arial-label="Mark task as completed"
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingY: 0,
                          paddingLeft: 0,
                          paddingRight: '24px',
                        }}
                        align="left"
                      >
                        <div className="flex flex-row items-center gap-2">
                          {task.priority.value <= 1000 && (
                            <SignalCellularAlt1Bar
                              color="primary"
                              fontSize="small"
                            />
                          )}
                          {task.priority.value <= 5000 &&
                            task.priority.value > 1000 && (
                              <SignalCellularAlt2Bar
                                color="warning"
                                fontSize="small"
                              />
                            )}
                          {task.priority.value > 5000 && (
                            <SignalCellularAlt color="error" fontSize="small" />
                          )}
                          <StrikethroughText
                            text={task.title}
                            isComplete={task.completedAt !== null}
                          />
                        </div>
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingY: 0,
                          paddingLeft: 0,
                          paddingRight: '24px',
                          display: { xs: 'none', sm: 'table-cell' },
                        }}
                        align="left"
                      >
                        <StrikethroughText
                          text={task.description}
                          isComplete={task.completedAt !== null}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: '84px',
                          paddingY: 0,
                          paddingLeft: 0,
                          paddingRight: '24px',
                          display: { xs: 'none', sm: 'none', md: 'table-cell' },
                        }}
                        align="left"
                      >
                        {!task.completedAt ? (
                          <Select
                            sx={{ fontSize: '0.875rem' }}
                            value={task.priority.id}
                            variant="standard"
                            inputProps={{ 'aria-label': 'Priority' }}
                            size="small"
                            onChange={(event) =>
                              handleUpdatePriority(
                                task.id,
                                Number(event.target.value),
                              )
                            }
                          >
                            {priorities.map((priority) => (
                              <MenuItem key={priority.id} value={priority.id}>
                                {priority.name}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <StrikethroughText
                            text={task.priority.name}
                            isComplete={task.completedAt !== null}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ padding: 0, minWidth: '80px' }}
                        align="right"
                        aria-label="Manage tasks"
                      >
                        <IconButton
                          disabled={task.completedAt !== null}
                          onClick={() => router.push('/task/' + task.id)}
                          aria-label="Edit task"
                        >
                          <Edit color="primary" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteTask(task)}
                          aria-label="Delete task"
                        >
                          <DeleteForever color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{
                      padding: 0,
                      width: '100%',
                      height: '595px',
                    }}
                    align="center"
                  >
                    <div className="inline-flex flex-col gap-3">
                      No tasks found.
                      <Button
                        variant="text"
                        color="secondary"
                        onClick={() => router.push('/task')}
                        className="mt-4"
                      >
                        Create a new task
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <ConfirmationDialog
        message={`Are you sure you want to delete the task:
            ${pendingDelete?.title ?? ''}?`}
        open={dialogOpen}
        title="Delete Task Confirmation"
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDialog}
      />
      <ErrorSnack open={errorOpen} onClose={() => setErrorOpen(false)} />
    </div>
  );
}

export { ClientTasksTable };
