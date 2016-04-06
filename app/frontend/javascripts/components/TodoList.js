import React, { PropTypes } from 'react'
import List from 'material-ui/lib/lists/list'
import TodoItem from './TodoItem'

const TodoList = (props) => {
  const { todos, onTodoClicked, onTodoDropped, onTodoReorder } = props

  if(!todos || (todos.length < 1)) {
    return (
      <List className='honey-do-todo-list'>
        No items...
      </List>
    )
  }

  return (
    <List className='honey-do-todo-list'>
      <ul>
        {todos.map(function (todo){ 
          return (
            <li key={"todo_item_" + todo.id}>
              <TodoItem 
                key={"todo_"+todo.id}
                todo={todo}
                onTodoClicked={onTodoClicked}
                onTodoDropped={onTodoDropped}
                onTodoReorder={onTodoReorder}
              />
            </li>
          )
        })}
      </ul>
    </List>
  )
}

export default TodoList
