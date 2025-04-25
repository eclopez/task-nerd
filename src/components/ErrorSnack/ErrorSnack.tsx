import * as React from 'react';
import { Error } from '@mui/icons-material';
import { Snackbar, type SnackbarProps } from '@mui/material';

interface ErrorSnackProps extends Omit<SnackbarProps, 'onClose'> {
  /**
   * Whether to show the snackbar or not.
   *
   * @type {boolean}
   * @required
   */
  open: boolean;
  /**
   * The callback to fire when the snackbar is closed.
   *
   * @type {function}
   * @param {React.SyntheticEvent} event The event that triggered the close.
   * @param {string} reason The reason for closing the snackbar.
   * @required
   */
  onClose: Required<Pick<SnackbarProps, 'onClose'>>['onClose'];
}

/**
 * A snackbar component that displays an error message.
 *
 * @param {ErrorSnackProps} props The properties for the component.
 * @returns {React.JSX.Element} The rendered component.
 */
function ErrorSnack(props: ErrorSnackProps): React.JSX.Element {
  const {
    anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
    autoHideDuration = 6000,
    message,
    open,
    onClose,
    ...others
  } = props;

  const defaultMessage = (
    <div
      className="flex flex-row items-center gap-2"
      role="alert"
      aria-live="assertive"
    >
      <Error color="error" /> An error occurred while performing the action.
    </div>
  );

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
      key={`${anchorOrigin.vertical}${anchorOrigin.horizontal}`}
      open={open}
      message={message ?? defaultMessage}
      onClose={onClose}
      {...others}
    />
  );
}

export { ErrorSnack, type ErrorSnackProps };
