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
          todos={this.props.todos}
          onTodoClicked={this.props.onTodoClicked}
          onTodoDropped={this.props.onTodoDropped}
          onTodoReorder={this.props.onTodoReorder}
        />
      </div>
    )
  }
}

export default DragDropContext(TouchBackend({enableMouseEvents: false}))(TodoListTouch)
