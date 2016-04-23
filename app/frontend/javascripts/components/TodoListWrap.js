import React, { Component, PropTypes } from 'react'
import TodoListMouse from './TodoListMouse'
import TodoListTouch from './TodoListTouch'

import { acceptTodoRequest, acceptTodoSuccess, acceptTodoFailure,
  completeTodoRequest, completeTodoSuccess, completeTodoFailure,
  deleteTodoRequest, deleteTodoSuccess, deleteTodoFailure,
  todoReorderRequest, todoReorderSuccess, todoReorderFailure,
  uncompleteTodoRequest, uncompleteTodoSuccess, uncompleteTodoFailure 
  } from '../actions/HoneyDoActions'
import { TodoTypeToDataState } from '../constants/TodoTypes'


const getTodosFromStore = (store, dataStatePath) => {
  let todos = store.getState().getIn(dataStatePath).toJS();
  todos = Object.keys(todos).map(key => todos[key]); // convert todos into array
  todos = _.sortBy(todos, (val) => { return val.position });
  _.forEach(todos, (curr, index) => { curr.index = index; });
  
  return todos;
}

export default class TodoListWrap extends Component {
  componentWillMount() {
    let dataStatePath = ['dataState', TodoTypeToDataState[this.props.todoType]]

    this.setState({
      unsubscribe: this.props.store.subscribe(this.onStateChange.bind(this)),
      dataStatePath: dataStatePath,
      todos: getTodosFromStore(this.props.store, dataStatePath)
    });
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  acceptTodo(todo) {
    var dispatch = this.props.store.dispatch;

    dispatch(acceptTodoRequest(todo));
    $.ajax({
      type: "PUT",
      url: this.props.apiEndpoint + '/' +todo.id+ '/accept',
      data: { authentication_token: this.props.authToken }
    })
      .done((data, textStatus, jqXHR) => {
        dispatch(acceptTodoSuccess(todo));
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        dispatch(acceptTodoFailure(todo));
      })
      .always((data_jqXHR, textStatus, jqXHR_errorThrown) => {
        this.props.onSync();
      });
  }

  completeTodo(id) {
    var dispatch, todo_type;

    dispatch = this.props.store.dispatch;
    todo_type = this.props.todoType;

    dispatch(completeTodoRequest(id, todo_type)) 
    $.ajax({
      type: "PUT",
      url: this.props.apiEndpoint + '/' +id+ '/complete',
      data: { authentication_token: this.props.authToken }
    })
      .done((data, textStatus, jqXHR) => {
        dispatch(completeTodoSuccess(id, todo_type, data));
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        dispatch(completeTodoFailure(id, todo_type, jqXHR));
      });
  }

  uncompleteTodo(id) {
    var dispatch, todo_type;

    dispatch = this.props.store.dispatch;
    todo_type = this.props.todoType;

    dispatch(uncompleteTodoRequest(id, todo_type));
    $.ajax({
      type: "PUT",
      url: this.props.apiEndpoint + '/' +id+ '/uncomplete',
      data: { authentication_token: this.props.authToken }
    })
      .done((data, textStatus, jqXHR) => {
        dispatch(uncompleteTodoSuccess(id, todo_type, data));
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        dispatch(uncompleteTodoFailure(id, todo_type, jqXHR));
      });
  }

  handleTodoClicked(id, isChecked) {
    if(isChecked) {
      this.uncompleteTodo(id)
    }else{
      this.completeTodo(id)
    }
  }

  handleTodoDestroyed(todo) {
    var dispatch = this.props.store.dispatch;


    dispatch(deleteTodoRequest(todo));
    $.ajax({
      type: "DELETE",
      url: this.props.apiEndpoint + '/' +todo.id,
      data: { authentication_token: this.props.authToken }
    })
      .done((data, textStatus, jqXHR) => {
        dispatch(deleteTodoSuccess(todo));
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        dispatch(deleteTodoFailure(todo));
      })
      .always((data_jqXHR, textStatus, jqXHR_errorThrown) => {
        this.props.onSync();
      });
  }

  handleTodoDropped(droppedId, positionsJumped) {
    var dispatch, todo_type, todo_data_path, temp_todo;

    dispatch = this.props.store.dispatch;
    todo_type = this.props.todoType;
    todo_data_path = ['dataState', TodoTypeToDataState[this.props.todoType], droppedId.toString()]
    temp_todo = this.props.store.getState().getIn(todo_data_path).toJS();

    dispatch(todoReorderRequest(this.state.todos, todo_type));
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
        dispatch(todoReorderSuccess(temp_todo.id, todo_type, positionsJumped));
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        dispatch(todoReorderFailure(temp_todo.id, todo_type, jqXHR));
      })
      .always((data_jqXHR, textStatus, jqXHR_errorThrown) => {
        this.props.onSync();
      });
  }

  handleTodoReorder(id, newIndex) {
    var local_todo_state, todo, prev_index;

    local_todo_state = this.state.todos;
    todo = _.find(local_todo_state, (curr) => { return curr.id == id; });
    prev_index = todo.index;

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

  onStateChange() {
    let new_todo_state = getTodosFromStore(this.props.store, this.state.dataStatePath);

    if(!_.isEqual(this.state.todos, new_todo_state)){
      this.setState({ todos: new_todo_state});
    }
  }

  renderTodoListMouse() {
    return (
      <TodoListMouse
        todos={this.state.todos}
        dispatch={this.props.store.dispatch}
        onTodoAccepted={this.acceptTodo.bind(this)}
        onTodoClicked={this.handleTodoClicked.bind(this)}
        onTodoDestroyed={this.handleTodoDestroyed.bind(this)}
        onTodoDropped={this.handleTodoDropped.bind(this)}
        onTodoReorder={this.handleTodoReorder.bind(this)}
      />
    )
  }

  renderTodoListTouch() {
    return (
      <TodoListTouch
        todos={this.state.todos}
        dispatch={this.props.store.dispatch}
        onTodoAccepted={this.acceptTodo.bind(this)}
        onTodoClicked={this.handleTodoClicked.bind(this)}
        onTodoDestroyed={this.handleTodoDestroyed.bind(this)}
        onTodoDropped={this.handleTodoDropped.bind(this)}
        onTodoReorder={this.handleTodoReorder.bind(this)}
      />
    )
  }

  render() {
    return (
      <div>
        { this.props.isTouch ? renderTodoListTouch() : this.renderTodoListMouse() }
      </div>
    )
  }
}
