import React, { Component, PropTypes } from 'react'
import List from 'material-ui/lib/lists/list';
import TodoItem from './TodoItem'
import { completeTodoRequest, completeTodoSuccess, completeTodoFailure,
  todoReorderRequest, todoReorderSuccess, todoReorderFailure,
  uncompleteTodoRequest, uncompleteTodoSuccess, uncompleteTodoFailure 
  } from '../actions/HoneyDoActions'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const completeTodo = (id, dispatch, ownProps) => {
  dispatch(completeTodoRequest(id)) 
  $.ajax({
    type: "PUT",
    url: ownProps.apiEndpoint + '/' +id+ '/complete',
    data: { authentication_token: ownProps.authToken }
  })
    .done((data, textStatus, jqXHR) => {
      dispatch(completeTodoSuccess(id, data));
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      dispatch(completeTodoFailure(id, jqXHR));
    });
}

const uncompleteTodo = (id, dispatch, ownProps) => {
  dispatch(uncompleteTodoRequest(id));
  $.ajax({
    type: "PUT",
    url: ownProps.apiEndpoint + '/' +id+ '/uncomplete',
    data: { authentication_token: ownProps.authToken }
  })
    .done((data, textStatus, jqXHR) => {
      dispatch(uncompleteTodoSuccess(id, data));
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      dispatch(uncompleteTodoFailure(id, jqXHR));
    });
}

const getTodosFromStore = (store) => {
  let todos =  store.getState().getIn(["dataState","todos"]).toJS();
  todos = Object.keys(todos).map(key => todos[key]); // convert todos into array
  todos = _.sortBy(todos, (val) => { return val.position });
  return todos;
}

class TodoList extends Component {
  componentWillMount() {
    this.setState({
      unsubscribe: this.props.store.subscribe(this.onStateChange.bind(this)),
      todos: getTodosFromStore(this.props.store)
    });
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  onStateChange(){
    this.setState({todos: getTodosFromStore(this.props.store)});
  }

  handleTodoClicked(id, isChecked){
    var dispatch = this.props.store.dispatch;

    if(isChecked) {
      uncompleteTodo(id, dispatch, this.props)
    }else{
      completeTodo(id, dispatch, this.props)
    }
  }

  handleTodoDropped(droppedId, newPosition){
    var self, dispatch;

    self = this;
    dispatch = this.props.store.dispatch;
    let temp_todo = this.props.store.getState().getIn(['dataState', 'todos', droppedId.toString()]).toJS();
    temp_todo.position = newPosition;

    dispatch(todoReorderRequest(droppedId, newPosition));
    $.ajax({
      type: "PUT",
      url: this.props.apiEndpoint + '/' + temp_todo.id,
      data: { 
        authentication_token: this.props.authToken,
        todo: temp_todo 
      }
    })
      .done((data, textStatus, jqXHR) => {
        dispatch(todoReorderSuccess(temp_todo.id, data));
        this.props.onSync();
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        dispatch(todoReorderFailure(temp_todo.id, jqXHR));
        this.props.onSync();
      });
  }

  render() {
    var self = this;

    if(!this.state.todos){
      return (
        <List className='honey-do-todo-list'>
          No items...
        </List>
      )
    }

    return (
      <List className='honey-do-todo-list'>
        <ul>
          {this.state.todos.map(function (todo){ return renderTodo(todo, self.handleTodoClicked.bind(self), self.handleTodoDropped.bind(self)) })}
        </ul>
      </List>
    )
  }
}

const renderTodo = (todo, handleClick, handleDrop) => {
  return (
    <li key={"todo_item_" + todo.id}>
      <TodoItem 
        key={"todo_"+todo.id}
        todo={todo}
        onTodoClicked={handleClick}
        onTodoDropped={handleDrop}
      />
    </li>
  )
}

export default DragDropContext(HTML5Backend)(TodoList)
