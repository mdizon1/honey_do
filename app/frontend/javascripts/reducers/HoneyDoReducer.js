// Stub for reducers for now.  This will eventually be split into multiple 
// files which should be recombined into a top level reducer.  
// Doing that up front will be confusing as I'm just getting started on redux
// For now I'll build all reducers into this file and later split as necessary

import { INITIALIZE, 
  ACCEPT_TODO_REQUEST,
  ACCEPT_TODO_SUCCESS,
  ACCEPT_TODO_FAILURE,
  COMPLETE_TODO_REQUEST, 
  COMPLETE_TODO_SUCCESS, 
  COMPLETE_TODO_FAILURE, 
  DELETE_TODO_REQUEST,
  DELETE_TODO_SUCCESS,
  DELETE_TODO_FAILURE,
  DELETE_TODO_TAG_REQUEST,
  DELETE_TODO_TAG_SUCCESS,
  DELETE_TODO_TAG_FAILURE,
  SWITCH_TAB,
  SYNC_TODOS_REQUEST,
  SYNC_TODOS_SUCCESS,
  SYNC_TODOS_FAILURE,
  EDIT_TODO_CANCELED,
  EDIT_TODO_REQUEST,
  LOAD_TAG_SUCCESS,
  TODO_REORDER_REQUEST,
  TODO_REORDER_SUCCESS,
  TODO_REORDER_FAILURE,
  UPDATE_TODO_REQUEST,
  UPDATE_TODO_SUCCESS,
  UPDATE_TODO_FAILURE,
  UNCOMPLETE_TODO_REQUEST, 
  UNCOMPLETE_TODO_SUCCESS, 
  UNCOMPLETE_TODO_FAILURE
} from '../actions/HoneyDoActions'
import { TodoKlassToDataState, TodoTypeToDataState, TodoKlassToType, UiTabs } from '../constants/TodoTypes'
import { EmptyStore } from '../constants/EmptyStore'

import * as Immutable from 'immutable';
import {List, Map} from 'immutable';

const emptyState = Immutable.fromJS(EmptyStore);

function honeyDoReducer(state, action) {
  var temp_state;

  console.log("DEBUG: ~~~~~~~~~~~~~~~~~~~~~~~~ REDUCER CALLED ~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log("DEBUG: action ------------> ", action);

  switch (action.type) {
    case INITIALIZE:
      return emptyState
        .set('configState', emptyState.get('configState').mergeDeep(action.data.config));

    case ACCEPT_TODO_REQUEST:
      return dropTodo(activateSpinner(state), action.todo);
    case ACCEPT_TODO_SUCCESS:
    case ACCEPT_TODO_FAILURE:
      return deactivateSpinner(state);

    case COMPLETE_TODO_REQUEST:
      return setTodoCompletedState(activateSpinner(state), action.todo, true);
    case COMPLETE_TODO_SUCCESS:
      return setTodoState(deactivateSpinner(state), action.todo, action.data);
    case COMPLETE_TODO_FAILURE:
      return setTodoCompletedState(deactivateSpinner(state), action.todo, false);

    case DELETE_TODO_REQUEST:
      return dropTodo(activateSpinner(state), action.todo);
    case DELETE_TODO_SUCCESS:
    case DELETE_TODO_FAILURE:
     return deactivateSpinner(state);

    case DELETE_TODO_TAG_REQUEST:
      // find the given todo and remove it's tag
      return removeTag(state, action.todo, action.tag);
    case DELETE_TODO_TAG_SUCCESS:
      return state;
    case DELETE_TODO_TAG_FAILURE: // TODO: In this case we should reload the todo
      return state;

    case LOAD_TAG_SUCCESS:
      return loadTags(state, action.tags);

    case SWITCH_TAB:
      if(!_.includes(UiTabs, action.tab)){ return state; } // ensure the tab given (action.tab) is one of UiTabs
      return state.setIn(["uiState", "currentTab"], action.tab);

    case SYNC_TODOS_REQUEST:
      return uiSyncingOn(state);
    case SYNC_TODOS_SUCCESS:
      temp_state = uiSyncingOff(state);
      // TODO: This is actually doing a retrieve right now, I should refactor
      // the code to reflect this fact accordingly
      return temp_state.set('dataState', Immutable.fromJS(action.data));
    case SYNC_TODOS_FAILURE:
      return uiSyncingOff(state);

    case EDIT_TODO_REQUEST: 
      return state.setIn(["uiState", "isEditing"], {todo: action.todo});
    case EDIT_TODO_CANCELED:
      return state.setIn(["uiState", "isEditing"], false);

    case TODO_REORDER_REQUEST:
      return reorderTodos(activateSpinner(state), action.todoType, action.todosList);
    case TODO_REORDER_SUCCESS:
    case TODO_REORDER_FAILURE:
      // TODO: Ok, some refactoring is in order here later.
      // Right now these do nothing, although error should spit out an error
      // message.
      // Eventually, these should use either react-thunk or react-promise and
      // after these actions complete, there is a trigger to sync.
      // For now, we'll just let this do nothing and sync immediately after
      // we get a success or failure back.
      return deactivateSpinner(state);

    case UPDATE_TODO_REQUEST:
      return updateTodo(state, action.todo);
    case UPDATE_TODO_SUCCESS:
    case UPDATE_TODO_FAILURE:
      return state;

    case UNCOMPLETE_TODO_REQUEST:
      return setTodoCompletedState(activateSpinner(state), action.todo, false);
    case UNCOMPLETE_TODO_SUCCESS:
      return setTodoState(deactivateSpinner(state), action.todo, action.data);
    case UNCOMPLETE_TODO_FAILURE:
      return setTodoCompletedState(deactivateSpinner(state), action.todo, true);

    default:
      return state;
  }
}

// Private.  May want to prefix with _

const activateSpinner = (state) => {
  return state.setIn(['uiState', 'isSpinning'], true);
}

const deactivateSpinner = (state) => {
  return state.setIn(['uiState', 'isSpinning'], false);
}

const dropTodo = (state, todo) => {
  return state.deleteIn(['dataState', TodoKlassToDataState[todo.klass], todo.id.toString()], null);
}

const loadTags = (state, tags) => {
  return state.setIn(['dataState', 'tags'], tags);
}

const removeTag = (state, todo, tag) => {
  var todo_from_state, tag_list;

  todo_from_state = retrieveTodo(state, todo);
  tag_list = todo_from_state.tags;
  tag_list = _.without(tag_list, tag);
  tag_list = Immutable.fromJS(tag_list);

  return state.setIn(['dataState', TodoTypeToDataState[todo.klass], todo.id.toString, 'tags'], tag_list);
}

const retrieveTodo = (state, todo) => {
  return state.getIn(['dataState', TodoKlassToDataState[todo.klass], todo.id.toString()]);
}

const reorderTodos = (state, todoType, todosList) => {
  _.forEach(todosList, (curr, index) => {
    state = state.setIn(['dataState', TodoTypeToDataState[todoType], curr.id.toString(), 'position'], index);
  });
  return state;
}

const setTodoCompletedState = (state, todo, isCompleted) => {
  return state.setIn(['dataState', TodoKlassToDataState[todo.klass], todo.id.toString(), 'isCompleted'], isCompleted);
}

const setTodoState = (state, todo, todoState) => {
  return state.setIn(['dataState', TodoKlassToDataState[todo.klass], todo.id.toString()], Immutable.fromJS(todoState));
}

const uiSyncingOn = (state) => {
  let temp_state = state.set('uiState', state.get('uiState').set('isSyncing', true));
  return activateSpinner(temp_state);
}

const uiSyncingOff = (state) => {
  let temp_state = state.set('uiState', state.get('uiState').set('isSyncing', false));
  return deactivateSpinner(temp_state);
}

const updateTodo = (state, todo) => { // Look for given todo in state and replace with given todo
  let tags_in_title = _.words(todo.title, /#.*/g);
  tags_in_title = _.map(tags_in_title, (tag_in_title) => { return _.replace(tag_in_title, /#/g, '')});
  todo.tags = _.uniq(_.concat(todo.tags, tags_in_title));
  let new_title = _.trim(_.replace(todo.title, /#.*/g, ''));
  todo.title = new_title;
  return state.setIn(['dataState', TodoKlassToDataState[todo.klass], todo.id.toString()], todo);
}

export default honeyDoReducer
