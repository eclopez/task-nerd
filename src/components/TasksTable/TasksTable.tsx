'use client';

import * as React from 'react';
import { DeleteForever, Edit } from '@mui/icons-material';
import {
  Checkbox,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { Task } from '@/prisma/generated/prisma';
import { useTaskData } from '@/src/hooks/useTaskData';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { ErrorSnack } from '@/components/ErrorSnack';

function StrikethroughText({
  text,
  isComplete,
}: {
  text: string;
  isComplete: boolean;
}) {
  return <span className={`${isComplete && 'line-through'}`}>{text}</span>;
}

function TasksTable() {
  const {
    error,
    tasks,
    priorities,
    removeTask,
    setTaskCompleted,
    setTaskPriority,
  } = useTaskData();

  const [pendingDelete, setPendingDelete] = React.useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [errorOpen, setErrorOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (error) {
      setErrorOpen(true);
    }
  }, [error]);

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
    removeTask(pendingDelete.id);
    handleCloseDialog();
  };

  const handleEditTask = (id: number) => {};

  return (
    <div className="sm:px-12">
      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ minWidth: 320, maxHeight: 640 }}>
          <Table stickyHeader size="small" aria-label="Tasks table">
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
              {tasks.length > 0 ? (
                <>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell sx={{ padding: 0 }} align="center">
                        <Checkbox
                          size="small"
                          sx={{ padding: 0 }}
                          checked={task.completedAt !== null}
                          onChange={(_, checked) =>
                            setTaskCompleted(task.id, checked)
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
                        <StrikethroughText
                          text={task.title}
                          isComplete={task.completedAt !== null}
                        />
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
                              setTaskPriority(
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
                          onClick={() => handleEditTask(task.id)}
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
                [...Array(10)].map((_, index) => (
                  <TableRow key={index} sx={{ padding: 0 }}>
                    <TableCell
                      colSpan={6}
                      sx={{
                        padding: 0,
                        width: '100%',
                        height: '42px',
                      }}
                      align="center"
                    >
                      <Skeleton
                        variant="rectangular"
                        sx={{ height: '100%', width: '100%' }}
                      />
                    </TableCell>
                  </TableRow>
                ))
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

export { TasksTable };
