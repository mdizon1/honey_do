import React, { PropTypes } from 'react'
import Chip from 'material-ui/Chip'

const canEdit = (todo) => {
  if(!todo) { throw new Error("No todo supplied to TodoTag")}
  if(!todo.permissions) { return false; }
  return todo.permissions.canEdit
}

const TodoTag = (props) => {
  const { todo, tag, onDelete } = props
  if(canEdit(todo) && !!onDelete) {
    return (
      <Chip
        className="todo-tag"
        onDelete={evt => onDelete(todo, tag)}
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
