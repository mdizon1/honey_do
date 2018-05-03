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

const todoIdsSelector = createSelector([todosFilterSelector], (todos) => {
  return _.map(todos, (curr_todo) => curr_todo.id)
});

const mapStateToProps = (state, ownProps) => {
  return {
    searchValue: searchValueSelector(state, ownProps),
    isCompletedHidden: isCompletedHiddenSelector(state, ownProps),
    todos: todosFilterSelector(state, ownProps),
    todoIds: todoIdsSelector(state, ownProps),
    isDragActive: state.getIn(['uiState', 'dragState', 'isDragActive'])
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

class TodoListWrap extends Component {
  shouldComponentUpdate(nextProps){
    let should_update = (
      this.props.searchValue !== nextProps.searchValue ||
      !_.isEqual(this.props.todoIds, nextProps.todoIds) ||
      this.props.isCompletedHidden !== nextProps.isCompletedHidden ||
      (this.props.isDragActive && !nextProps.isDragActive) // was dragging, now not dragging
    );
    return should_update;
  }

  acceptTodo = (todo) => {
    this.props.store.dispatch(acceptTodoRequest(todo));
  }

  handleSearchChanged = (name) => {
    return (evt) => {
      let newVal = evt.target.value;
      this.props.store.dispatch(filterTodos(newVal));
  }}

  handleSearchCleared = (evt) => {
    this.props.store.dispatch(filterTodos(''));
  }

  handleTodoCancelDrag = (evt) => {
    this.props.store.dispatch(cancelDragTodo());
  }

  handleTodoClicked = (todo) => {
    if(todo.isCompleted) {
      this.props.store.dispatch(uncompleteTodoRequest(todo));
    }else{
      this.props.store.dispatch(completeTodoRequest(todo));
    }
  }

  handleTodoDestroyed = (todo) => {
    this.props.store.dispatch(deleteTodoRequest(todo));
  }

  handleTodoDropped = (args) => {
    this.props.store.dispatch(todoReorderRequest());
  }

  handleTodoDragged = (draggedId, neighborId, isNeighborNorth) => {
    this.props.store.dispatch(updateTodoDrag(draggedId, neighborId, isNeighborNorth));
  }

  renderTodoListMouse(todo_ids) {
    return (
      <div className="todo-list-wrap">
        <SearchTodos
          onChange={this.handleSearchChanged}
          onClear={this.handleSearchCleared}
          value={this.props.searchValue}
        />
        <TodoListMouse
          todoIds={todo_ids}
          dispatch={this.props.store.dispatch}
          onTodoAccepted={this.acceptTodo}
          onTodoClicked={this.handleTodoClicked}
          onTodoDestroyed={this.handleTodoDestroyed}
          onTodoReorder={this.handleTodoDragged}
          onTodoDropped={this.handleTodoDropped}
          onTodoCancelDrag={this.handleTodoCancelDrag}
        />
      </div>
    )
  }

  renderTodoListTouch(todo_ids) {
    return (
      <div className="todo-list-wrap">
        <SearchTodos
          onChange={this.handleSearchChanged}
          onClear={this.handleSearchCleared}
          value={this.props.searchValue}
        />
        <TodoListTouch
          todoIds={todo_ids}
          dispatch={this.props.store.dispatch}
          onTodoAccepted={this.acceptTodo}
          onTodoClicked={this.handleTodoClicked}
          onTodoDestroyed={this.handleTodoDestroyed}
          onTodoReorder={this.handleTodoDragged}
          onTodoDropped={this.handleTodoDropped}
          onTodoCancelDrag={this.handleTodoCancelDrag}
        />
      </div>
    )
  }

  render() {

    if(this.props.isTouch){
      return this.renderTodoListTouch(this.props.todoIds);
    }else{
      return this.renderTodoListMouse(this.props.todoIds);
    }
  }
}

export default connect(mapStateToProps)(TodoListWrap)
