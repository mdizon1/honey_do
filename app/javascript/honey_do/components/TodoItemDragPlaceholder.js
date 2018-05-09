import React from 'react'
import Checkbox from 'material-ui/Checkbox'

const  TodoItemDragPlaceholder = (props) => {
  const { todo } = props;
  return (
    <div className="todo-item todo-item-drag-placeholder">
      <Checkbox
        checked={todo.isCompleted}
        disabled
      />
      {todo.title}
    </div>
  )
}

export default TodoItemDragPlaceholder
