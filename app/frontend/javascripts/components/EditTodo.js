import React, { PropTypes } from 'react'
import { TodoKlassToFriendlyString } from '../constants/TodoTypes'
import TodoForm from './TodoForm'

import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'

const EditTodo = (props) => {
  const { todo, isFormOpen, onClose, onChange, onSubmit } = props;
  var actions = [
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
