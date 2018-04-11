import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'

const  TodoItemDragPlaceholder = (props) => {
  const { todo } = props;
  return (
    <div className="todo-item todo-item-drag-placeholder">
      <ListItem>
        <Checkbox
          checked={todo.isCompleted}
          disabled
        />
        <ListItemText primary={todo.title} secondary={todo.notes} />
      </ListItem>
    </div>
  )
}

export default TodoItemDragPlaceholder
