import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Map} from 'immutable'
import TodoListMouse from './TodoListMouse'
import TodoListTouch from './TodoListTouch'
import SearchTodos from './SearchTodos'

import { acceptTodoRequest, acceptTodoSuccess, acceptTodoFailure,
  cancelDragTodo,
  completeTodoRequest, completeTodoSuccess, completeTodoFailure,
  deleteTodoRequest, deleteTodoSuccess, deleteTodoFailure,
  filterTodos,
  todoReorderRequest, todoReorderSuccess, todoReorderFailure,
  updateTodoDrag,
  uncompleteTodoRequest, uncompleteTodoSuccess, uncompleteTodoFailure
} from '../actions/HoneyDoActions'

import { TodoTypeToDataState } from '../constants/TodoTypes'


const mapStateToProps = (state, ownProps) => {
  let dataStatePath = ['dataState', TodoTypeToDataState[ownProps.todoType]]

  let currState = state.getIn(dataStatePath);
  let newSearchValue = state.getIn(['uiState', 'filterValue']);

  let dragState = state.getIn(['uiState', 'dragState']);

  if(
    ownProps.prevState &&
    ownProps.prevState.equals(currState) &&
    ownProps.searchValue == newSearchValue &&
    ownProps.dragState.equals(dragState)
  ){ return; }

  return {
    dataStatePath: dataStatePath,
    searchValue: newSearchValue,
    todos: filterList(getTodosFromStore(state, dataStatePath), newSearchValue),
    prevState: currState,
    dragState: dragState
  }
}

const getTodosFromStore = (store, dataStatePath) => {
  // TODO: (hurrr) Might be able to avoid the toJS call here and use Immutable
  // map method rather than converting to hash first then array...

  let todos = store.getIn(dataStatePath).toJS();

  todos = Object.keys(todos).map(key => todos[key]); // convert todos into array
  // filter out completed todos if the config is set to such
  if(store.getIn(["uiState", "isCompletedHidden"])){
    todos = _.filter(todos, (curr_todo) => { return !curr_todo.isCompleted });
  }
  todos = _.sortBy(todos, (curr_todo) => { return curr_todo.position }); // sort by position
  _.forEach(todos, (curr_todo, index) => { curr_todo.index = index; }); // renumber todo indices by their array index

  return todos;
}

const filterList = (todoList, filterVal) => {
  var sanitized_searchval, search_regex;

  sanitized_searchval = _.trim(filterVal);
  if(sanitized_searchval.size < 1) { return todoList; };
  search_regex = new RegExp(sanitized_searchval, "i");

  return _.filter(todoList, (curr_todo) => {
    return (
      curr_todo.title.match(search_regex) ||
      curr_todo.tags.join(" ").match(search_regex)
    );
  });
}

class TodoListWrap extends Component {
  acceptTodo(todo) {
    this.props.store.dispatch(acceptTodoRequest(todo));
  }

  handleSearchChanged(name){
    return (evt) => {
      let newVal = evt.target.value;
      this.props.store.dispatch(filterTodos(newVal));
  }}

  handleSearchCleared(evt) {
    this.props.store.dispatch(filterTodos(''));
  }

  handleTodoCancelDrop(evt) {
    this.props.store.dispatch(cancelDragTodo());
  }

  handleTodoClicked(todo) {
    if(todo.isCompleted) {
      this.props.store.dispatch(uncompleteTodoRequest(todo));
    }else{
      this.props.store.dispatch(completeTodoRequest(todo));
    }
  }

  handleTodoDestroyed(todo) {
    this.props.store.dispatch(deleteTodoRequest(todo));
  }

  handleTodoDropped(droppedId, positionsJumped) {
    var dispatch, todo_type, todo_data_path, temp_todo;

    dispatch = this.props.store.dispatch;
    todo_type = this.props.todoType;
    todo_data_path = ['dataState', TodoTypeToDataState[this.props.todoType], droppedId.toString()]
    temp_todo = this.props.store.getState().getIn(todo_data_path);
    if(Map.isMap(temp_todo)) { temp_todo = temp_todo.toJS(); }
    dispatch(todoReorderRequest(temp_todo, positionsJumped, todo_type, this.props.todos));
  }

  handleTodoDragged(id, newIndex, klass) {
    var local_todo_state, todo, prev_index;

    local_todo_state = this.props.todos;
    todo = _.find(local_todo_state, (curr) => { return curr.id == id; });
    prev_index = todo.index;

    this.props.store.dispatch(updateTodoDrag(todo, newIndex, klass));
  }

  renderTodoListMouse() {
    return (
      <div className="todo-list-wrap">
        <SearchTodos
          onChange={this.handleSearchChanged.bind(this)}
          onClear={this.handleSearchCleared.bind(this)}
          value={this.props.searchValue}
        />
        <TodoListMouse
          todos={this.props.todos}
          dispatch={this.props.store.dispatch}
          todoDragState={this.props.dragState}
          onTodoAccepted={this.acceptTodo.bind(this)}
          onTodoClicked={this.handleTodoClicked.bind(this)}
          onTodoDestroyed={this.handleTodoDestroyed.bind(this)}
          onTodoReorder={this.handleTodoDragged.bind(this)}
          onTodoDropped={this.handleTodoDropped.bind(this)}
          onTodoCancelDrag={this.handleTodoCancelDrop.bind(this)}
        />
      </div>
    )
  }

  renderTodoListTouch() {
    return (
      <div className="todo-list-wrap">
        <SearchTodos
          onChange={this.handleSearchChanged.bind(this)}
          onClear={this.handleSearchCleared.bind(this)}
          value={this.props.searchValue}
        />
        <TodoListTouch
          todos={this.props.todos}
          dispatch={this.props.store.dispatch}
          todoDragState={this.props.dragState}
          onTodoAccepted={this.acceptTodo.bind(this)}
          onTodoClicked={this.handleTodoClicked.bind(this)}
          onTodoDestroyed={this.handleTodoDestroyed.bind(this)}
          onTodoReorder={this.handleTodoDragged.bind(this)}
          onTodoDropped={this.handleTodoDropped.bind(this)}
          onTodoCancelDrag={this.handleTodoCancelDrag.bind(this)}
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

export default connect(mapStateToProps)(TodoListWrap)
