import React, { PropTypes } from 'react'
import List from 'material-ui/lib/lists/list'
import TodoItem from './TodoItem'

const TodoList = (props) => {
  const { todos, onTodoAccepted, onTodoClicked, onTodoDropped, onTodoReorder, dispatch} = props

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
                todo={todo}
                onTodoAccepted={onTodoAccepted}
                onTodoClicked={onTodoClicked}
                onTodoDropped={onTodoDropped}
                onTodoReorder={onTodoReorder}
                dispatch={dispatch}
              />
            </li>
          )
        })}
      </ul>
    </List>
  )
}

export default TodoList
