import React, { PropTypes } from 'react'
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Switch from "material-ui/Switch/Switch"

const HoneyDoConfig = (props) => {
  const { uiProps, onToggleIsCompletedHidden } = props;
  let button_state = uiProps.get('isCompletedHidden');
  let label = button_state ? "Completed todos are visible" : "Completed todos are hidden";

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
              checked={button_state}
              onChange={onToggleIsCompletedHidden}
            />
          }
        />
      </FormGroup>

    </div>
  );
}

export default HoneyDoConfig
