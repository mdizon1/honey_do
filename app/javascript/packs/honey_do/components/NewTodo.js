import React, { PropTypes } from 'react'
import { TodoTypeToFriendlyString} from '../constants/TodoTypes'
import { Colors } from '../constants/Colors'
import TodoForm from './TodoForm'
import Button from 'material-ui/Button'
import Icon from 'material-ui/Icon'
import Dialog, { DialogTitle } from 'material-ui/Dialog'

const renderDialog = (onClose, onChange, onSubmit, isFormOpen, todoType) => {
  var actions, title;

  actions = [
    <Button
      label="Cancel"
      secondary={true}
      onMouseUp={onClose}
    />,
    <Button
      label="Submit"
      primary={true}
      onMouseUp={onSubmit}
    />,
  ];

  title = `Create a new ${TodoTypeToFriendlyString[todoType]}.`;

  return (
    <Dialog
      title={title}
      actions={actions}
      open={isFormOpen}
      onClose={onClose}
    >
      <DialogTitle>
        Create a new todo
      </DialogTitle>
      <TodoForm
        onChange={onChange}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </Dialog>
  )
}

const renderNewTodoButton = (onOpen) => {
  return (
    <Button
      className="new-todo-button"
      onMouseUp={onOpen}
      color="primary"
      variant="fab"
    >
      <Icon>
        add_circle
      </Icon>
    </Button>
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
