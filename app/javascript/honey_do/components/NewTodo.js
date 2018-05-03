import React, { PropTypes } from 'react'
//import { withStyles } from 'material-ui/styles'
import { TodoTypeToFriendlyString} from '../constants/TodoTypes'
import { Colors } from '../constants/Colors'
import Button from 'material-ui/Button'
import Icon from 'material-ui/Icon'
import Dialog, { DialogTitle } from 'material-ui/Dialog'
import TodoForm from './TodoForm'
import NewTodoButton from './NewTodoButton'

const renderDialog = (onClose, onChange, onSubmit, isFormOpen, todoType) => {
  var title;

  title = `Create a new ${TodoTypeToFriendlyString[todoType]}.`;

  return (
    <Dialog
      title={title}
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

const NewTodo = function (props) {
  const {onOpen, onClose, onValueChange, onSubmit, isFormOpen, todoType} = props;

  return (
    <div>
      <NewTodoButton onClick={onOpen} />
      {renderDialog(onClose, onValueChange, onSubmit, isFormOpen, todoType)}
    </div>
  );
}

export default NewTodo
