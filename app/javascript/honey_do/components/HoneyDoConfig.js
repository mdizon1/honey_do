import React, { PropTypes } from 'react'
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Switch from "material-ui/Switch/Switch"
import Button from "material-ui/Button"
import Dialog, { DialogTitle, DialogActions } from 'material-ui/Dialog'


const renderConfirmClearCompletedDialog = (isOpen, onClose, onAccept) => {
  return (
    <Dialog
      title="Confirm clear completed todos"
      open={isOpen}
      onClose={onClose}
    >
      <DialogTitle>
        Are you sure you want to remove completed items?
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={onAccept}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const renderClearCompletedTodosButton = (onClick) => {
  return (
    <FormGroup row>
      <Button
        variant="raised"
        color="secondary"
        onClick={onClick}
      >
        Clear Completed Todos
      </Button>
    </FormGroup>
  )
}

const HoneyDoConfig = (props) => {
  const {
    uiProps,
    shouldDisplayClearCompletedTodosButton,
    onToggleIsCompletedHidden,
    onClearCompleted,
    onRequestClearCompleted,
    onRequestClearCompletedCancelled } = props;
  let hide_completed_switch_state = uiProps.get('isCompletedHidden');
  let is_confirm_dialog_visible = uiProps.getIn(['dialogs', 'isConfirmClearCompletedOpen']);
  let label = hide_completed_switch_state ? "Completed todos are visible" : "Completed todos are hidden";

  console.log("DEBUG: rendering HoneyDoConfig, shoudl display ?? -> ", shouldDisplayClearCompletedTodosButton);

  return (
    <div className="honeydo-drawer-content honeydo-config">
      <p>
        <a href="/users/sign_out" data-method="delete">
          Sign out
        </a>
      </p>

      <h3>Configuration</h3>

      <FormGroup row>
        <FormControlLabel
          label="Hide completed todos"
          control={
            <Switch
              checked={hide_completed_switch_state}
              onChange={onToggleIsCompletedHidden}
            />
          }
        />
      </FormGroup>
      { shouldDisplayClearCompletedTodosButton ? renderClearCompletedTodosButton(onRequestClearCompleted) : null }
      {renderConfirmClearCompletedDialog(is_confirm_dialog_visible, onRequestClearCompletedCancelled, onClearCompleted)}
    </div>
  );
}

export default HoneyDoConfig
