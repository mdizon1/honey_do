import React, { PropTypes } from 'react'
import TodoItem from '../containers/TodoItem'
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
      <div className='honey-do-todo-list'>
        No items...
      </div>
    )
  }

  return (
    <div className='honey-do-todo-list'>
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
    </div>
  );
}

export default TodoList
