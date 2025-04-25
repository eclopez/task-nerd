import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ConfirmationDialog } from './ConfirmationDialog';

describe('ConfirmationDialog', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  it('renders the dialog with default title and message', () => {
    // Suppress console.error for the test
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ConfirmationDialog {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Confirm' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Please confirm the action.')).toBeInTheDocument();
  });

  it('renders the dialog with custom title, message, and confirm button text', () => {
    // Suppress console.error for the test
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ConfirmationDialog
        {...defaultProps}
        confirmButtonText="Delete"
        message="Custom Message"
        title="Custom Title"
      />,
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Message')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it.only('calls onClose when the cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(<ConfirmationDialog {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it.only('calls onConfirm when the confirm button is clicked', async () => {
    const user = userEvent.setup();

    render(<ConfirmationDialog {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });
});
