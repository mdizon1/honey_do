import React, { PropTypes } from 'react'
import { TodoTypeToFriendlyString} from '../constants/TodoTypes'
import { Colors } from '../constants/Colors'
import TodoForm from './TodoForm'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import FlatButton from 'material-ui/lib/flat-button'
import ContentAdd from 'material-ui/lib/svg-icons/content/add'
import Dialog from 'material-ui/lib/dialog'

const renderDialog = (onClose, onChange, onSubmit, isFormOpen, todoType) => {
  var actions;
 
  actions = [
    <FlatButton
      label="Cancel"
      secondary={true}
      onMouseUp={onClose}
    />,
    <FlatButton
      label="Submit"
      primary={true}
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
    <TodoForm
      onChange={onChange}
      onSubmit={onSubmit}
    />
    </Dialog>
  )
}

const renderNewTodoButton = (onOpen) => {
  return (
    <FloatingActionButton 
      className="new-todo-button"
      onMouseUp={onOpen}
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
