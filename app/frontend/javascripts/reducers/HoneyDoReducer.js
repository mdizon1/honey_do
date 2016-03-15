// Stub for reducers for now.  This will eventually be split into multiple 
// files which should be recombined into a top level reducer.  
// Doing that up front will be confusing as I'm just getting started on redux
// For now I'll build all reducers into this file and later split as necessary


// define any constants i'll need here, e.g. for UI state
// like current view or whatever

import { INITIALIZE, COMPLETE_TODO, SYNC_TODOS } from './../actions/HoneyDoActions'
import {List, Map} from 'immutable';

const emptyState = Map({
  uiState: Map({}),
  dataState: Map({
    shoppingItems: List([]),
    todos: List([])
  }),
  identityState: Map({
    authToken: null,
    userName: null,
    userId: null,
    householdId: null,
    householdName: null
  })
});

function honeyDoReducer(state, action) {
  switch (action.type) {
    case INITIALIZE:
      console.log("DEBUG: reducer got initialize action");
      return emptyState;

    case COMPLETE_TODO:
      console.log("DEBUG: reducer got complete todo action");
      return emptyState.set('dataState', Map({todos: List(['foo'])}));

    case SYNC_TODOS:
      console.log("DEBUG: reducer got sync todo action");

    default:
      return state;
  }
}

export default honeyDoReducer
