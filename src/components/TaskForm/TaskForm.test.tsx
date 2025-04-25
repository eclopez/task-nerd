import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { TaskForm } from './TaskForm';

const mockAddTask = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('../../hooks/useTaskForm', () => ({
  useTaskForm: jest.fn(() => ({
    isLoading: false,
    error: null,
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
    addTask: mockAddTask,
    editTask: jest.fn(),
    getTask: jest.fn(),
  })),
}));

describe('TaskForm', () => {
  it('renders the form with correct initial values for edit mode', () => {
    const task = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      priorityId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    };

    render(<TaskForm task={task} mode="edit" />);

    expect(screen.getByLabelText(/title/i)).toHaveValue('Test Task');
    expect(screen.getByLabelText(/description/i)).toHaveValue(
      'Test Description',
    );
  });

  it('renders the form with empty values for add mode', () => {
    render(<TaskForm mode="add" />);

    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
  });
});
