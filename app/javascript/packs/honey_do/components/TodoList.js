import React, { PropTypes } from 'react'
import List from 'material-ui/List/List'
import TodoItem from './TodoItem'
const TodoList = (props) => {
  const {
    todoIds,
    onTodoAccepted,
    onTodoClicked,
    onTodoDestroyed,
    onTodoDropped,
    onTodoCancelDrag,
    onTodoReorder,
    dispatch
  } = props;

  // TODO: I think we can do todos == null means loading and todos == [] means no items
  if(!todoIds || (todoIds.length < 1)) {
    return (
      <List className='honey-do-todo-list'>
        No items...
      </List>
    )
  }

  return (
    <List className='honey-do-todo-list'>
      {_.map(todoIds, (curr_todo_id, index) => {
        return (
          <TodoItem
            key={"todo_item_" + curr_todo_id}
            currentIndex={index}
            todoId={curr_todo_id}
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
