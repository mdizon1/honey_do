import React, { PropTypes } from 'react'
import { TodoKlassToFriendlyString } from '../constants/TodoTypes'
import TodoForm from './TodoForm'

import Dialog from 'material-ui/Dialog/Dialog'
import FlatButton from 'material-ui/FlatButton/FlatButton'

const EditTodo = (props) => {
  const { todo, isFormOpen, onClose, onChange, onSubmit } = props;
  var actions = [
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
      title={`Editing ${TodoKlassToFriendlyString[todo.klass]} "${todo.title}".`}
      actions={actions}
      modal={false}
      open={isFormOpen}
      onRequestClose={onClose}
    >
      <TodoForm
        todo={todo}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </Dialog>
  )
}

export default EditTodo
