// Stub for reducers for now.  This will eventually be split into multiple 
// files which should be recombined into a top level reducer.  
// Doing that up front will be confusing as I'm just getting started on redux
// For now I'll build all reducers into this file and later split as necessary

import { INITIALIZE, 
  COMPLETE_TODO_REQUEST, 
  COMPLETE_TODO_SUCCESS, 
  COMPLETE_TODO_FAILURE, 
  SWITCH_TAB,
  SYNC_TODOS_REQUEST,
  SYNC_TODOS_SUCCESS,
  SYNC_TODOS_FAILURE,
  TODO_REORDER_REQUEST,
  TODO_REORDER_SUCCESS,
  TODO_REORDER_FAILURE,
  UNCOMPLETE_TODO_REQUEST, 
  UNCOMPLETE_TODO_SUCCESS, 
  UNCOMPLETE_TODO_FAILURE,
  UiTabs } from './../actions/HoneyDoActions'

import * as Immutable from 'immutable';
import {List, Map} from 'immutable';

const emptyState = Immutable.fromJS({
  uiState: {
    currentTab: 'SHOW_TODOS',
    isSyncing: false,
    isShuffling: false
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

  switch (action.type) {
    case INITIALIZE:
      return emptyState
        .set('configState', action.data.config);

    case COMPLETE_TODO_REQUEST:
      return setTodoCompletedState(state, action.id, action.todoType, true);

    case COMPLETE_TODO_SUCCESS:
      return setTodoState(state, action.id, action.todoType, action.data);

    case COMPLETE_TODO_FAILURE:
      return setTodoCompletedState(state, action.id, action.todoType, false);

    case SWITCH_TAB:
      if(!_.includes(UiTabs, action.tab)){ return state; } // ensure the tab given (action.tab) is one of UiTabs
      return state.set('uiState', state.get('uiState').set('currentTab', action.tab));

    case SYNC_TODOS_REQUEST:
      return uiSyncingOn(state);

    case SYNC_TODOS_SUCCESS:
      temp_state = uiSyncingOff(state);
      // TODO: This is actually doing a retrieve right now, I should refactor
      // the code to reflect this fact accordingly
      temp_data = action.data;
      return temp_state.set('dataState', Immutable.fromJS(temp_data));

    case SYNC_TODOS_FAILURE:
      return uiSyncingOff(state);

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

// Privates, might want to rename them with leading _ for readability

const reorderTodos = (state, todoType, todosList) => {
  _.forEach(todosList, (curr, index) => {
    state = state.setIn(['dataState', todoType, curr.id.toString(), 'position'], index);
  });
  return state;
}

const setTodoCompletedState = (state, id, todoType, todoState) => {
  let todo = state.getIn(['dataState', todoType, id.toString()]);
  return state.setIn(['dataState', todoType, id.toString()], todo.set('isCompleted', todoState));
}

const setTodoState = (state, id, todoType, todoState) => {
  return state.setIn(['dataState', todoType, id.toString()], Immutable.fromJS(todoState));
}

const uiSyncingOn = (state) => {
  return state.set('uiState', state.get('uiState').set('isSyncing', true));
}

const uiSyncingOff = (state) => {
  return state.set('uiState', state.get('uiState').set('isSyncing', false));
}

export default honeyDoReducer
