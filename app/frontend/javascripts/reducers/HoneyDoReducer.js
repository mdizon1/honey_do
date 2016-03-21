// Stub for reducers for now.  This will eventually be split into multiple 
// files which should be recombined into a top level reducer.  
// Doing that up front will be confusing as I'm just getting started on redux
// For now I'll build all reducers into this file and later split as necessary

// define any constants i'll need here, e.g. for UI state
// like current view or whatever

import { INITIALIZE, 
  COMPLETE_TODO_REQUEST, 
  COMPLETE_TODO_SUCCESS, 
  COMPLETE_TODO_FAILURE, 
  SWITCH_TAB,
  SYNC_TODOS_REQUEST,
  SYNC_TODOS_SUCCESS,
  SYNC_TODOS_FAILURE,
  UNCOMPLETE_TODO_REQUEST, 
  UNCOMPLETE_TODO_SUCCESS, 
  UNCOMPLETE_TODO_FAILURE,
  UiTabs } from './../actions/HoneyDoActions'

import * as Immutable from 'immutable';
import {List, Map} from 'immutable';

const emptyState = Immutable.fromJS({
  uiState: {
    currentTab: 'SHOW_TODOS',
    isSyncing: false
  },
  dataState: {
    shoppingItems: {},
    todos: {} 
  },
  identityState: {
    authToken: null,
    userName: null,
    userId: null,
    householdId: null,
    householdName: null
  },
  configState: {
    apiEndpoint: null
  }
});

const uiSyncingOn = (state) => {
  return state.set('uiState', state.get('uiState').set('isSyncing', true));
}

const uiSyncingOff = (state) => {
  return state.set('uiState', state.get('uiState').set('isSyncing', false));
}

const setTodoCompletedState = (state, id, todoState) => {
  let todo = state.getIn(['dataState', 'todos', id.toString()]);
  return state.setIn(['dataState', 'todos', id.toString()], todo.set('isCompleted', todoState));
}

const setTodoState = (state, id, todoState) => {
  return state.setIn(['dataState', 'todos', id.toString()], Immutable.fromJS(todoState));
}

function honeyDoReducer(state, action) {
  var temp_state;
  console.log("DEBUG: ~~~~~~~~~~~~~~~~~~~~~~~~ REDUCER CALLED ~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log("DEBUG: type ------------> ", action.type);

  switch (action.type) {
    case INITIALIZE:
      return emptyState
        .set('identityState', action.data.identity)
        .set('configState', action.data.config);

    case COMPLETE_TODO_REQUEST:
      return setTodoCompletedState(state, action.id, true);

    case COMPLETE_TODO_SUCCESS:
      return setTodoState(state, action.id, action.data);

    case COMPLETE_TODO_FAILURE:
      return setTodoCompletedState(state, action.id, false);

    case SWITCH_TAB:
      if(!_.includes(UiTabs, action.tab)){ return state; } // ensure the tab given (action.tab) is one of UiTabs
      return state.set('uiState', state.get('uiState').set('currentTab', action.tab));

    case SYNC_TODOS_REQUEST:
      return uiSyncingOn(state);

    case SYNC_TODOS_SUCCESS:
      temp_state = uiSyncingOff(state);
      // TODO: This is actually doing a retrieve right now, I should refactor
      // the code to reflect this fact accordingly
      return temp_state.set('dataState', Immutable.fromJS(action.data));

    case SYNC_TODOS_FAILURE:
      return uiSyncingOff(state);

    case UNCOMPLETE_TODO_REQUEST:
      return setTodoCompletedState(state, action.id, false);

    case UNCOMPLETE_TODO_SUCCESS:
      return setTodoState(state, action.id, action.data);

    case UNCOMPLETE_TODO_FAILURE:
      return setTodoCompletedState(state, action.id, true);

    default:
      return state;
  }
}

export default honeyDoReducer
