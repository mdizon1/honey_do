import React, { Component, PropTypes } from 'react'
import { TodoTypeToFriendlyString} from '../constants/TodoTypes'
import { Colors } from '../constants/Colors'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import FlatButton from 'material-ui/lib/flat-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';

const renderDialog = (onClose, onChange, onSubmit, isFormOpen, todoType) => {
  var actions;
 
  actions = [
    <FlatButton
      label="Cancel"
      secondary={true}
      onTouchEnd={onClose}
      onMouseUp={onClose}
    />,
    <FlatButton
      label="Submit"
      primary={true}
      onTouchEnd={onSubmit}
      onMouseUp={onSubmit}
    />,
  ];
 
  return (
    <Dialog
      title={`Create a new ${TodoTypeToFriendlyString[todoType]}.`}
      actions={actions}
      modal={false}
      open={isFormOpen}
      onRequestClose={onClose}
    >
      {renderForm(onChange, onSubmit)}
    </Dialog>
  )
}

const renderForm = (onChange, onSubmit) => {
  return (
    <form>
      <div>Form in progress </div>
      <div className="form-group">
        <TextField
          floatingLabelText="Title"
          fullWidth={true}
          onChange={onChange}
          name="title"
        />
        <TextField
          floatingLabelText="Notes"
          multiLine={true}
          fullWidth={true}
          onChange={onChange}
          name="notes"
        />
      </div>
    </form>
  )
}

const renderNewTodoButton = (onOpen) => {
  return (
    <FloatingActionButton 
      className="new-todo-button"
      onMouseUp={onOpen}
      onTouchEnd={onOpen}
      backgroundColor={Colors.BOOTSTRAP_GREEN}
    >
      <ContentAdd />
    </FloatingActionButton>
  )
}

const NewTodo = function (props) {
  const {onOpen, onClose, onValueChange, onSubmit, isFormOpen, todoType} = props;

  return (
    <div>
      {renderNewTodoButton(onOpen)}
      {renderDialog(onClose, onValueChange, onSubmit, isFormOpen, todoType)}
    </div>
  );
}

export default NewTodo
