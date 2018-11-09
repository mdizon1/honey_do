import React, { PropTypes } from 'react'
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Switch from "material-ui/Switch/Switch"
import Button from "material-ui/Button"


const renderClearCompletedTodosButton = (permissions) => {
  if(!permissions.get("isAdmin")){return;}
  return (
    <FormGroup row>
      <Button
        variant="raised"
        color="secondary"
      >
        Clear Completed Todos
      </Button>
    </FormGroup>
  )
}

const HoneyDoConfig = (props) => {
  const { uiProps, permissions, onToggleIsCompletedHidden } = props;
  let hide_completed_switch_state = uiProps.get('isCompletedHidden');
  let label = hide_completed_switch_state ? "Completed todos are visible" : "Completed todos are hidden";

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
      {renderClearCompletedTodosButton(permissions)}
    </div>
  );
}

export default HoneyDoConfig
