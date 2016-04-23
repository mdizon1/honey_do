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
  SWITCH_TAB,
  SYNC_TODOS_REQUEST,
  SYNC_TODOS_SUCCESS,
  SYNC_TODOS_FAILURE,
  EDIT_TODO_CANCELED,
  EDIT_TODO_REQUEST,
  EDIT_TODO_SUCCESS,
  EDIT_TODO_FAILURE,
  TODO_REORDER_REQUEST,
  TODO_REORDER_SUCCESS,
  TODO_REORDER_FAILURE,
  UNCOMPLETE_TODO_REQUEST, 
  UNCOMPLETE_TODO_SUCCESS, 
  UNCOMPLETE_TODO_FAILURE
} from '../actions/HoneyDoActions'
import { TodoKlassToDataState, TodoTypeToDataState, UiTabs } from '../constants/TodoTypes'

import * as Immutable from 'immutable';
import {List, Map} from 'immutable';

const emptyState = Immutable.fromJS({
  uiState: {
    currentTab: UiTabs.TODOS,
    isReady: false,
    isSyncing: false,
    isShuffling: false,
    isEditing: false
  },
  dataState: {
    shoppingItems: {},
    todos: {} 
  },
  configState: {
    apiEndpoint: null,
    "interface": 'html5',
    identity: {
      authToken: null,
      userName: null,
      userId: null,
      householdId: null,
      householdName: null
    },
  }
});

function honeyDoReducer(state, action) {
  var temp_state;
  var temp_item;
  var temp_data;

  console.log("DEBUG: ~~~~~~~~~~~~~~~~~~~~~~~~ REDUCER CALLED ~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log("DEBUG: type ------------> ", action.type);
  console.log("DEBUG: action ------------> ", action);

  switch (action.type) {
    case INITIALIZE:
      return emptyState
        .set('configState', action.data.config);

    case ACCEPT_TODO_REQUEST:
      return dropTodo(state, action.todo);
    case ACCEPT_TODO_SUCCESS:
    case ACCEPT_TODO_FAILURE:
      return state;

    case COMPLETE_TODO_REQUEST:
      return setTodoCompletedState(state, action.id, action.todoType, true);
    case COMPLETE_TODO_SUCCESS:
      return setTodoState(state, action.id, action.todoType, action.data);
    case COMPLETE_TODO_FAILURE:
      return setTodoCompletedState(state, action.id, action.todoType, false);

    case DELETE_TODO_REQUEST:
      return dropTodo(state, action.todo);
    case DELETE_TODO_SUCCESS:
    case DELETE_TODO_FAILURE:
     return state;

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
    case EDIT_TODO_SUCCESS:
    case EDIT_TODO_FAILURE:
    case EDIT_TODO_CANCELED:
      return state.setIn(["uiState", "isEditing"], false);

    case TODO_REORDER_REQUEST:
      return reorderTodos(state, action.todoType, action.todosList);
    case TODO_REORDER_SUCCESS:
    case TODO_REORDER_FAILURE:
      // TODO: Ok, some refactoring is in order here later.
      // Right now these do nothing, although error should spit out an error
      // message.
      // Eventually, these should use either react-thunk or react-promise and
      // after these actions complete, there is a trigger to sync.
      // For now, we'll just let this do nothing and sync immediately after
      // we get a success or failure back.
      return state;

    case UNCOMPLETE_TODO_REQUEST:
      return setTodoCompletedState(state, action.id, action.todoType, false);
    case UNCOMPLETE_TODO_SUCCESS:
      return setTodoState(state, action.id, action.todoType, action.data);
    case UNCOMPLETE_TODO_FAILURE:
      return setTodoCompletedState(state, action.id, action.todoType, true);

    default:
      return state;
  }
}

// Private.  May want to prefix with _

const dropTodo = (state, todo) => {
  return state.deleteIn(['dataState', TodoKlassToDataState[todo.klass], todo.id.toString()], null);
}

const reorderTodos = (state, todoType, todosList) => {
  _.forEach(todosList, (curr, index) => {
    state = state.setIn(['dataState', TodoTypeToDataState[todoType], curr.id.toString(), 'position'], index);
  });
  return state;
}

const setTodoCompletedState = (state, id, todoType, todoState) => {
  let todo_type_path = TodoTypeToDataState[todoType];
  let todo = state.getIn(['dataState', todo_type_path, id.toString()]);
  return state.setIn(['dataState', todo_type_path, id.toString()], todo.set('isCompleted', todoState));
}

const setTodoState = (state, id, todoType, todoState) => {
  return state.setIn(['dataState', TodoTypeToDataState[todoType], id.toString()], Immutable.fromJS(todoState));
}

const uiSyncingOn = (state) => {
  return state.set('uiState', state.get('uiState').set('isSyncing', true));
}

const uiSyncingOff = (state) => {
  return state.set('uiState', state.get('uiState').set('isSyncing', false));
}

export default honeyDoReducer
