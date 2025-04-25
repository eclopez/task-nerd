import { act, render, screen } from '@testing-library/react';
import { ErrorSnack } from './ErrorSnack';

describe('ErrorSnack', () => {
  it('renders the default message when no message prop is provided', () => {
    render(<ErrorSnack open={true} onClose={jest.fn()} />);

    const defaultMessage = screen.getByText(
      /An error occurred while performing the action/i,
    );
    expect(defaultMessage).toBeInTheDocument();
  });

  it('renders the custom message when provided', () => {
    const customMessage = 'Custom error message';
    render(
      <ErrorSnack open={true} message={customMessage} onClose={jest.fn()} />,
    );

    const messageElement = screen.getByText(customMessage);
    expect(messageElement).toBeInTheDocument();
  });

  it('renders nothing when open is false', () => {
    render(<ErrorSnack open={false} onClose={jest.fn()} />);

    const defaultMessage = screen.queryByText(
      /An error occurred while performing the action/i,
    );
    expect(defaultMessage).not.toBeInTheDocument();
  });

  it('closes after the specified duration', () => {
    const onCloseMock = jest.fn();
    jest.useFakeTimers();

    render(
      <ErrorSnack open={true} onClose={onCloseMock} autoHideDuration={2000} />,
    );

    expect(onCloseMock).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onCloseMock).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onCloseMock).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
