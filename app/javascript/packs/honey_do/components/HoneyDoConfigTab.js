import React, { PropTypes } from 'react'
import Switch from "material-ui/Switch/Switch"

const renderCompletedTodoToggler = (props) => {
  var btn_state, lbl;

  btn_state = !props.uiProps.isCompletedHidden;
  lbl = btn_state ? "Completed todos are visible" : "Completed todos are hidden";
  return (
    <Switch
      label={lbl}
      checked={btn_state}
      onToggle={props.onToggleIsCompletedHidden}
    />
  )
}

const HoneyDoConfigTab = (props) => {
  return (
    <div>
      <h2>Configuration options</h2>
      { renderCompletedTodoToggler(props) }
    </div>
  );
}

export default HoneyDoConfigTab
