import React, { PropTypes } from 'react'
import Chip from 'material-ui/Chip/Chip'

const TodoTag = (props) => {
  const { tag, onDelete } = props
  return (
    <Chip
      className="todo-tag"
      onDelete={((evt) => onDelete(tag))}
      label={tag}
    />
  )
}

export default TodoTag
