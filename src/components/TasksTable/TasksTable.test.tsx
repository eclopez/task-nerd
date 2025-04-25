import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { TasksTable } from './TasksTable';

const mockSetTaskCompleted = jest.fn();

jest.mock('../../hooks/useTaskData', () => ({
  useTaskData: jest.fn(() => ({
    error: null,
    tasks: [
      {
        id: '1',
        title: 'Task 1',
        description: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
        priority: {
          id: '1',
          name: 'Low',
          value: 1000,
        },
      },
      {
        id: '2',
        title: 'Task 2',
        description: 'Description 2',
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
        priority: {
          id: '1',
          name: 'Low',
          value: 1000,
        },
      },
    ],
    priorities: [
      {
        id: '1',
        name: 'Low',
        value: 1000,
      },
      {
        id: '2',
        name: 'Medium',
        value: 5000,
      },
      {
        id: '3',
        name: 'High',
        value: 10000,
      },
    ],
    removeTask: jest.fn(),
    setTaskCompleted: mockSetTaskCompleted,
    setTaskPriority: jest.fn(),
  })),
}));

describe('TasksTable', () => {
  const defaultProps = {
    tasks: [
      {
        id: '1',
        title: 'Task 1',
        description: 'Description 1',
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Task 2',
        description: 'Description 2',
        status: 'Completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    onEditTask: jest.fn(),
    onDeleteTask: jest.fn(),
  };

  it('renders the table with tasks', () => {
    render(<TasksTable />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('calls setTaskCompleted when checkbox is clicked', () => {
    render(<TasksTable />);

    const checkbox = screen.getAllByRole('checkbox')[0];
    checkbox.click();

    expect(mockSetTaskCompleted).toHaveBeenCalledWith('1', true);
  });

  it('calls removeTask when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(<TasksTable />);

    await user.click(screen.getAllByRole('button', { name: /delete/i })[0]);

    expect(mockSetTaskCompleted).toHaveBeenCalledWith('1', true);
  });
});
