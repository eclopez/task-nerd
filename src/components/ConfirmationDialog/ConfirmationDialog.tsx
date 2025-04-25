import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  type DialogProps,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';

interface ConfirmationDialogProps extends Omit<DialogProps, 'onClose'> {
  /**
   * The text to display in the confirm button.
   *
   * @type {string}
   * @optional
   * @default 'Confirm'
   */
  confirmButtonText?: string;
  /**
   * The message to display in the dialog.
   *
   * @type {string}
   * @optional
   * @default 'Please confirm the action.'
   */
  message?: string;
  /**
   * The title of the dialog.
   *
   * @type {string}
   * @optional
   * @default 'Confirm'
   */
  title?: string;
  /**
   * The callback to fire when the dialog is closed.
   *
   * @type {function}
   * @param {React.SyntheticEvent} event The event that triggered the close.
   * @param {"backdropClick" | "escapeKeyDown" | "cancelClick" | null} reason The reason for closing the dialog.
   */
  onClose: (
    event: React.SyntheticEvent,
    reason: 'backdropClick' | 'escapeKeyDown' | 'cancelClick' | null,
  ) => void;
  /**
   * The callback to fire when the confirm button is clicked.
   *
   * @returns {void}
   */
  onConfirm: () => void;
}

/**
 * A confirmation dialog component that displays a confirmation message and a button for canceling or accepting the change.
 *
 * @param {ConfirmationDialogProps} props The properties for the component.
 * @returns {React.JSX.Element}
 */
function ConfirmationDialog(props: ConfirmationDialogProps): React.JSX.Element {
  const {
    confirmButtonText = 'Confirm',
    message = 'Please confirm the action.',
    open,
    title = 'Confirm',
    onConfirm,
    onClose,
    ...others
  } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...others}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={(event) => onClose(event, 'cancelClick')}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { ConfirmationDialog };
