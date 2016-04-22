import React, { Component, PropTypes } from 'react'
import TodoList from './TodoList'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


class TodoListMouse extends Component {
  render() {
    return (
      <div>
        <TodoList 
          todos={this.props.todos}
          onTodoAccepted={this.props.onTodoAccepted}
          onTodoClicked={this.props.onTodoClicked}
          onTodoDropped={this.props.onTodoDropped}
          onTodoReorder={this.props.onTodoReorder}
          dispatch={this.props.dispatch}
        />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(TodoListMouse)
