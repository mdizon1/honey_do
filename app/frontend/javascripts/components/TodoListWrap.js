import React, { Component, PropTypes } from 'react'

import TodoListMouse from './TodoListMouse'
import TodoListTouch from './TodoListTouch'

import { completeTodoRequest, completeTodoSuccess, completeTodoFailure,
  todoReorderRequest, todoReorderSuccess, todoReorderFailure,
  uncompleteTodoRequest, uncompleteTodoSuccess, uncompleteTodoFailure 
  } from '../actions/HoneyDoActions'


const getTodosFromStore = (store, dataStatePath) => {
  let todos =  store.getState().getIn(dataStatePath).toJS();
  todos = Object.keys(todos).map(key => todos[key]); // convert todos into array
  todos = _.sortBy(todos, (val) => { return val.position });
  _.forEach(todos, (curr, index) => { curr.index = index; });
  
  return todos;
}

export default class TodoListWrap extends Component {
  componentWillMount() {
    let dataStatePath = ['dataState', this.props.type]
    this.setState({
      unsubscribe: this.props.store.subscribe(this.onStateChange.bind(this)),
      dataStatePath: dataStatePath,
      todos: getTodosFromStore(this.props.store, dataStatePath)
    });
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  completeTodo(id, dispatch) {
    dispatch(completeTodoRequest(id)) 
    $.ajax({
      type: "PUT",
      url: this.props.apiEndpoint + '/' +id+ '/complete',
      data: { authentication_token: this.props.authToken }
    })
      .done((data, textStatus, jqXHR) => {
        dispatch(completeTodoSuccess(id, data));
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        dispatch(completeTodoFailure(id, jqXHR));
      });
  }

  uncompleteTodo(id, dispatch) {
    dispatch(uncompleteTodoRequest(id));
    $.ajax({
      type: "PUT",
      url: this.props.apiEndpoint + '/' +id+ '/uncomplete',
      data: { authentication_token: this.props.authToken }
    })
      .done((data, textStatus, jqXHR) => {
        dispatch(uncompleteTodoSuccess(id, data));
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        dispatch(uncompleteTodoFailure(id, jqXHR));
      });
  }


  handleTodoClicked(id, isChecked){
    var dispatch = this.props.store.dispatch;

    if(isChecked) {
      this.uncompleteTodo(id, dispatch)
    }else{
      this.completeTodo(id, dispatch)
    }
  }

  handleTodoDropped(droppedId, positionsJumped){
    var self, dispatch;

    self = this;
    dispatch = this.props.store.dispatch;

    let temp_todo = this.props.store.getState().getIn(['dataState', 'todos', droppedId.toString()]).toJS();

    dispatch(todoReorderRequest(this.state.todos));
    $.ajax({
      type: "PUT",
      url: this.props.apiEndpoint + '/' + temp_todo.id + '/reorder',
      data: { 
        authentication_token: this.props.authToken,
        todo: temp_todo,
        positions_jumped: positionsJumped
      }
    })
      .done((data, textStatus, jqXHR) => {
        dispatch(todoReorderSuccess(temp_todo.id, positionsJumped));
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        dispatch(todoReorderFailure(temp_todo.id, jqXHR));
      })
      .always((data_jqXHR, textStatus, jqXHR_errorThrown) => {
        this.props.onSync();
      });
  }

  handleTodoReorder(id, newIndex) {
    let local_todo_state = this.state.todos;
    let todo = _.find(local_todo_state, (curr) => { return curr.id == id; });
    let prev_index = todo.index;

    // change it's index
    todo.index = newIndex;

    // update other indices
    _.forEach(local_todo_state, (curr, index) => {
      if(curr.id == id) { return; }
      // moving down
      if(newIndex >= prev_index) {
        if(curr.index >= newIndex) { return curr.index-=1; }
      }
      // moving up
      if(newIndex <= prev_index) {
        if(curr.index >= newIndex) { return curr.index+=1; }
      }
    });

    // reorder by index

    local_todo_state = _.sortBy(local_todo_state, (curr) => {
      return curr.index;
    });

    // renumber indices
    _.forEach(local_todo_state, (curr, index) => {
      curr.index = index;
    });

    this.setState({todos: local_todo_state});
  }

  onStateChange(){
    let new_todo_state = getTodosFromStore(this.props.store, this.state.dataStatePath);

    if(!_.isEqual(this.state.todos, new_todo_state)){
      this.setState({ todos: new_todo_state});
    }
  }

  render() {
    if(this.props.isTouch) {
      return (
        <div>
          <TodoListTouch
            todos={this.state.todos}
            onTodoClicked={this.handleTodoClicked.bind(this)}
            onTodoDropped={this.handleTodoDropped.bind(this)}
            onTodoReorder={this.handleTodoReorder.bind(this)}
          />
        </div>
      )
    }else{
      return (
        <div>
          <TodoListMouse
            todos={this.state.todos}
            onTodoClicked={this.handleTodoClicked.bind(this)}
            onTodoDropped={this.handleTodoDropped.bind(this)}
            onTodoReorder={this.handleTodoReorder.bind(this)}
          />
        </div>
      )
    }
  }
}
