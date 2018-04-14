import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
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

import { TodoTypeToKlass } from '../constants/TodoTypes'

const todosSelector = (state, props) => state.getIn(['dataState', 'todos']);
const typeSelector = (state, props) => props.todoType;
const isCompletedHiddenSelector = (state, props) => state.getIn(['uiState', 'isCompletedHidden'])
const searchValueSelector = (state, props) => state.getIn(['uiState', 'filterValue'])

const todosFilterSelector = createSelector(
  [todosSelector, typeSelector, isCompletedHiddenSelector, searchValueSelector],
  (todosFromStore, todoType, isCompletedHidden, searchValue) => {
    return filterTodosForProps(todosFromStore.toJS(), todoType, isCompletedHidden, searchValue)
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    searchValue: searchValueSelector(state, ownProps),
    isCompletedHidden: isCompletedHiddenSelector(state, ownProps),
    todos: todosFilterSelector(state, ownProps),
    dragState: state.getIn(['uiState', 'dragState'])
  }
}

const filterTodosForProps = (todos, type, isCompletedHidden, filterVal) => {
  let output = todos

  output = Object.keys(output).map(key => output[key]); // convert todos into array
  // filter out todos not in the current list

  output = _.filter(output, (curr_todo) => (curr_todo.klass === TodoTypeToKlass[type]))

  // filter out completed todos if the config is set to such
  if(isCompletedHidden){
    output = _.filter(output, (curr_todo) => { return !curr_todo.isCompleted });
  }
  if(filterVal){
    output = filterList(output, filterVal);
  }
  output = _.sortBy(output, (curr_todo) => { return curr_todo.position }); // sort by position
  _.forEach(output, (curr_todo, index) => { curr_todo.index = index; }); // renumber todo indices by their array index

  return output;
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

const mapTodosToIds = (list) => {
  return _.map(
    list,
    (curr_todo) => curr_todo.id
  );
}
class TodoListWrap extends Component {
  shouldComponentUpdate(nextProps){
    return (
      this.props.searchValue !== nextProps.searchValue ||
      this.props.todos !== nextProps.todos ||
      this.props.isCompletedHidden !== nextProps.isCompletedHidden ||
      this.props.dragState !== nextProps.dragState
    );
  }

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

  handleTodoCancelDrag(evt) {
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
    todo_data_path = ['dataState', 'todos', droppedId.toString()]
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

  renderTodoListMouse(todo_ids) {
    return (
      <div className="todo-list-wrap">
        <SearchTodos
          onChange={this.handleSearchChanged.bind(this)}
          onClear={this.handleSearchCleared.bind(this)}
          value={this.props.searchValue}
        />
        <TodoListMouse
          todoIds={todo_ids}
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

  renderTodoListTouch(todo_ids) {
    return (
      <div className="todo-list-wrap">
        <SearchTodos
          onChange={this.handleSearchChanged.bind(this)}
          onClear={this.handleSearchCleared.bind(this)}
          value={this.props.searchValue}
        />
        <TodoListTouch
          todoIds={todo_ids}
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
    let todo_ids = mapTodosToIds(this.props.todos);
    return (
      <div>
        { this.props.isTouch ? this.renderTodoListTouch(todo_ids) : this.renderTodoListMouse(todo_ids) }
      </div>
    )
  }
}

export default connect(mapStateToProps)(TodoListWrap)
