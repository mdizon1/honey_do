import React, { Component, PropTypes } from 'react'
import {Map} from 'immutable'
import TodoListMouse from './TodoListMouse'
import TodoListTouch from './TodoListTouch'
import SearchTodos from './SearchTodos'

import { acceptTodoRequest, acceptTodoSuccess, acceptTodoFailure,
  completeTodoRequest, completeTodoSuccess, completeTodoFailure,
  deleteTodoRequest, deleteTodoSuccess, deleteTodoFailure,
  todoReorderRequest, todoReorderSuccess, todoReorderFailure,
  uncompleteTodoRequest, uncompleteTodoSuccess, uncompleteTodoFailure
  } from '../actions/HoneyDoActions'

import {
  apiAcceptTodo,
  apiDeleteTodo,
  apiTodoDropped } from '../util/Api'
import { TodoTypeToDataState } from '../constants/TodoTypes'

const getTodosFromStore = (store, dataStatePath) => {
  // TODO: (hurrr) Might be able to avoid the toJS call here and use Immutable
  // map method rather than converting to hash first then array...
  let todos = store.getState().getIn(dataStatePath).toJS();
  todos = Object.keys(todos).map(key => todos[key]); // convert todos into array
  // filter out completed todos if the config is set to such
  if(store.getState().getIn(["uiState", "isCompletedHidden"])){
    todos = _.filter(todos, (curr_todo) => { return !curr_todo.isCompleted });
  }
  todos = _.sortBy(todos, (curr_todo) => { return curr_todo.position }); // sort by position
  _.forEach(todos, (curr_todo, index) => { curr_todo.index = index; }); // renumber todo indices by their array index
  return todos;
}

export default class TodoListWrap extends Component {
  componentWillMount() {
    let dataStatePath = ['dataState', TodoTypeToDataState[this.props.todoType]]

    this.setState({
      unsubscribe: this.props.store.subscribe(this.handleStateChange.bind(this)),
      dataStatePath: dataStatePath,
      searchValue: "",
      todos: getTodosFromStore(this.props.store, dataStatePath)
    });
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  acceptTodo(todo) {
    var dispatch = this.props.store.dispatch;

    dispatch(acceptTodoRequest(todo));
    apiAcceptTodo({
      endpoint: this.props.apiEndpoint,
      authToken: this.props.authToken,
      todo: todo,
      onSuccess: (data, textStatus, jqXHR) => {
        dispatch(acceptTodoSuccess(todo, data));
      },
      onFailure: (jqXHR, textStatus, errorThrown) => {
        dispatch(acceptTodoFailure(todo, errorThrown));
      },
      onComplete: (data_jqXHR, textStatus, jqXHR_errorThrown) => {
        this.props.onSync();
      }
    });
  }

  filterTodos(filterVal) {
    var all_todos, new_todo_state, sanitized_searchval, search_regex;

    sanitized_searchval = _.trim(filterVal);
    all_todos = getTodosFromStore(this.props.store, this.state.dataStatePath);

    if(sanitized_searchval.size < 1) { return all_todos; };
    search_regex = new RegExp(sanitized_searchval, "i");

    return _.filter(all_todos, (curr_todo) => {
      return (
        curr_todo.title.match(search_regex) ||
        curr_todo.tags.join(" ").match(search_regex)
      );
    });

  }

  handleSearchChanged(evt, newVal) {
    this.setState({todos: this.filterTodos(newVal), searchValue: newVal});
  }

  handleSearchCleared(evt) {
    this.setState({searchValue: ""});
  }

  handleTodoClicked(todo) {
    if(todo.isCompleted) {
      this.props.store.dispatch(uncompleteTodoRequest(todo);
    }else{
      this.props.store.dispatch(completeTodoRequest(todo));
    }
  }

  handleTodoDestroyed(todo) {
    var dispatch = this.props.store.dispatch;

    dispatch(deleteTodoRequest(todo));
    apiDeleteTodo({
      endpoint: this.props.apiEndpoint,
      authToken: this.props.authToken,
      todo: todo,
      onSuccess: (data, textStatus, jqXHR) => {
        dispatch(deleteTodoSuccess(todo));
      },
      onFailure: (jqXHR, textStatus, errorThrown) => {
        dispatch(deleteTodoFailure(todo));
      },
      onComplete: (data_jqXHR, textStatus, jqXHR_errorThrown) => {
        this.props.onSync();
      }
    });
  }

  handleTodoDropped(droppedId, positionsJumped) {
    var dispatch, todo_type, todo_data_path, temp_todo;

    dispatch = this.props.store.dispatch;
    todo_type = this.props.todoType;
    todo_data_path = ['dataState', TodoTypeToDataState[this.props.todoType], droppedId.toString()]
    temp_todo = this.props.store.getState().getIn(todo_data_path);
    if(Map.isMap(temp_todo)) { temp_todo = temp_todo.toJS(); }
    dispatch(todoReorderRequest(this.state.todos, todo_type));

    apiTodoDropped({
      endpoint: this.props.apiEndpoint,
      authToken: this.props.authToken,
      todo: temp_todo,
      positionsJumped: positionsJumped,
      onSuccess: (data, textStatus, jqXHR) => {
        dispatch(todoReorderSuccess(temp_todo.id, todo_type, positionsJumped));
      },
      onFailure: (jqXHR, textStatus, errorThrown) => {
        dispatch(todoReorderFailure(temp_todo.id, todo_type, jqXHR));
      },
      onComplete: (data_jqXHR, textStatus, jqXHR_errorThrown) => {
        this.props.onSync();
      }
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

  handleStateChange() {
    let new_todo_state = getTodosFromStore(this.props.store, this.state.dataStatePath);

    if(!_.isEqual(this.state.todos, new_todo_state)){
      this.setState({ todos: new_todo_state});
    }
  }

  renderTodoListMouse() {
    return (
      <div>
        <SearchTodos
          onChange={this.handleSearchChanged.bind(this)}
          onClear={this.handleSearchCleared.bind(this)}
          value={this.state.searchValue}
        />
        <TodoListMouse
          todos={this.state.todos}
          dispatch={this.props.store.dispatch}
          onTodoAccepted={this.acceptTodo.bind(this)}
          onTodoClicked={this.handleTodoClicked.bind(this)}
          onTodoDestroyed={this.handleTodoDestroyed.bind(this)}
          onTodoDropped={this.handleTodoDropped.bind(this)}
          onTodoReorder={this.handleTodoReorder.bind(this)}
        />
      </div>
    )
  }

  renderTodoListTouch() {
    return (
      <div>
        <SearchTodos
          onChange={this.handleSearchChanged.bind(this)}
          onClear={this.handleSearchCleared.bind(this)}
          value={this.state.searchValue}
        />
        <TodoListTouch
          todos={this.state.todos}
          dispatch={this.props.store.dispatch}
          onTodoAccepted={this.acceptTodo.bind(this)}
          onTodoClicked={this.handleTodoClicked.bind(this)}
          onTodoDestroyed={this.handleTodoDestroyed.bind(this)}
          onTodoDropped={this.handleTodoDropped.bind(this)}
          onTodoReorder={this.handleTodoReorder.bind(this)}
        />
      </div>
    )
  }

  render() {
    return (
      <div>
        { this.props.isTouch ? this.renderTodoListTouch() : this.renderTodoListMouse() }
      </div>
    )
  }
}
