import React, { Component, PropTypes } from 'react'
import TodoList from './TodoList'
import TodoDragLayer from './TodoDragLayer'
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';

class TodoListTouch extends Component {
  render() {
    return (
      <div>
        <TodoDragLayer />
        <TodoList
          todoIds={this.props.todoIds}
          onTodoAccepted={this.props.onTodoAccepted}
          onTodoClicked={this.props.onTodoClicked}
          onTodoDestroyed={this.props.onTodoDestroyed}
          onTodoDropped={this.props.onTodoDropped}
          onTodoCancelDrag={this.props.onTodoCancelDrag}
          onTodoReorder={this.props.onTodoReorder}
          dispatch={this.props.dispatch}
        />
      </div>
    )
  }
}

export default DragDropContext(TouchBackend({enableMouseEvents: false}))(TodoListTouch)
