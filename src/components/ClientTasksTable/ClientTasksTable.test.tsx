import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ClientTasksTable } from './ClientTasksTable';
import { completeTask } from '../../actions';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('../../actions', () => ({
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  completeTask: jest.fn(),
}));

const mockTasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
    priorityId: 1,
    priority: {
      id: 1,
      name: 'Low',
      value: 1000,
    },
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
    priorityId: 1,
    priority: {
      id: 1,
      name: 'Low',
      value: 1000,
    },
  },
];

const mockpriorities = [
  {
    id: 1,
    name: 'Low',
    value: 1000,
  },
  {
    id: 2,
    name: 'Medium',
    value: 5000,
  },
  {
    id: 3,
    name: 'High',
    value: 10000,
  },
];

describe('ClientTasksTable', () => {
  it('renders the table with tasks', () => {
    render(
      <ClientTasksTable initialTasks={mockTasks} priorities={mockpriorities} />,
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('calls setTaskCompleted when checkbox is clicked', () => {
    render(
      <ClientTasksTable initialTasks={mockTasks} priorities={mockpriorities} />,
    );

    const checkbox = screen.getAllByRole('checkbox')[0];
    checkbox.click();

    expect(completeTask).toHaveBeenCalledWith(1, true);
  });

  it('calls removeTask when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ClientTasksTable initialTasks={mockTasks} priorities={mockpriorities} />,
    );

    await user.click(screen.getAllByRole('button', { name: /delete/i })[0]);

    expect(completeTask).toHaveBeenCalledWith(1, true);
  });
});
