// Stub for reducers for now.  This will eventually be split into multiple 
// files which should be recombined into a top level reducer.  
// Doing that up front will be confusing as I'm just getting started on redux
// For now I'll build all reducers into this file and later split as necessary

// define any constants i'll need here, e.g. for UI state
// like current view or whatever

import { INITIALIZE, COMPLETE_TODO, 
  SWITCH_TAB,
  SYNC_TODOS,
  SYNC_TODOS_REQUEST,
  SYNC_TODOS_SUCCESS,
  SYNC_TODOS_FAILURE } from './../actions/HoneyDoActions'
import * as Immutable from 'immutable';
import {List, Map} from 'immutable';

const emptyState = Immutable.fromJS({
  uiState: {
    currentTab: 'SHOW_TODOS',
    isSyncing: false
  },
  dataState: {
    shoppingItems: [],
    todos: []
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

function uiSyncingOn(state){
  return state.set('uiState', state.get('uiState').set('isSyncing', true));
}

function uiSyncingOff(state){
  return state.set('uiState', state.get('uiState').set('isSyncing', false));
}

function honeyDoReducer(state, action) {
  var temp_state;
  switch (action.type) {
    case INITIALIZE:
      console.log("DEBUG: reducer got initialize action");
      return emptyState
        .set('identityState', action.data.identity)
        .set('configState', action.data.config);

    case COMPLETE_TODO:
      console.log("DEBUG: reducer got complete todo action");
      return emptyState.set('dataState', Map({todos: List(['foo'])}));

    case SWITCH_TAB:
      console.log("DEBUG: reducer got a switch tab action");
      return state.set('uiState', state.get('uiState').set('currentTab', action.tab));

    case SYNC_TODOS_REQUEST:
      console.log("DEBUG: reducer got sync todo request action");
      return uiSyncingOn(state);

    case SYNC_TODOS_SUCCESS:
      temp_state = uiSyncingOff(state);
      // TODO: This is actually doing a retrieve right now, I should refactor
      // the code to reflect this fact accordingly
      return temp_state.set('dataState', Immutable.fromJS(action.data));

    case SYNC_TODOS_FAILURE:
      return uiSyncingOff(state);

    case SYNC_TODOS:
      console.log("DEBUG: reducer got sync todo action");

    default:
      return state;
  }
}

export default honeyDoReducer
