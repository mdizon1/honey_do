import React, { PropTypes } from 'react'
import List from 'material-ui/List/List'
import TodoItem from './TodoItem'
const TodoList = (props) => {
  const {
    todos,
    todoDragState,
    onTodoAccepted,
    onTodoClicked,
    onTodoDestroyed,
    onTodoDropped,
    onTodoCancelDrag,
    onTodoReorder,
    dispatch
  } = props;

  // TODO: I think we can do todos == null means loading and todos == [] means no items
  if(!todos || (todos.length < 1)) {
    return (
      <List className='honey-do-todo-list'>
        No items...
      </List>
    )
  }

  return (
    <List className='honey-do-todo-list'>
      {_.map(todos, (todo, index) => {
        return (
          <TodoItem
            key={"todo_item_" + todo.id}
            todoDragState={todoDragState}
            currentIndex={index}
            todo={todo}
            onTodoAccepted={onTodoAccepted}
            onTodoClicked={onTodoClicked}
            onTodoDestroyed={onTodoDestroyed}
            onTodoDropped={onTodoDropped}
            onTodoReorder={onTodoReorder}
            onTodoCancelDrag={onTodoCancelDrag}
            dispatch={dispatch}
          />
        )
      })}
    </List>
  );
}

export default TodoList
