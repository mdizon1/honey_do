import React, { PropTypes } from 'react'
import Chip from 'material-ui/Chip/Chip'

const canEdit = (todo) => {
  return todo.permissions.canEdit
}

const TodoTag = (props) => {
  const { todo, tag, onDelete } = props
  if(canEdit(todo) && !!onDelete) {
    return (
      <Chip
        className="todo-tag"
        onDelete={onDelete(todo, tag)}
        label={tag}
      />
    )
  }else{
    return (
      <Chip
        className="todo-tag"
        label={tag}
      />
    )
  }
}

export default TodoTag
