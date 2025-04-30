import { render, screen, waitFor } from '@testing-library/react';
import { TaskForm } from './TaskForm';

const mockPriorities = [
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

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  priorityId: 1,
  createdAt: new Date(),
  updatedAt: null,
  completedAt: null,
};

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('TaskForm', () => {
  it('renders the form with correct initial values for edit mode', async () => {
    render(<TaskForm task={mockTask} priorities={mockPriorities} />);
    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('Test Task');
      expect(screen.getByLabelText(/description/i)).toHaveValue(
        'Test Description',
      );
    });
  });
  it('renders the form with empty values for add mode', () => {
    render(<TaskForm priorities={mockPriorities} />);
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
  });
});
