// Stub for reducers for now.  This will eventually be split into multiple 
// files which should be recombined into a top level reducer.  
// Doing that up front will be confusing as I'm just getting started on redux
// For now I'll build all reducers into this file and later split as necessary


// import { .. actions .. } from './../actions/HoneyDoActions'

// define any constants i'll need here, e.g. for UI state
// like current view or whatever

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// LEFT OFF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   Build this reducer. It seems to be the core of redux, 
//   My near term goal is to get a very skeletal implementation of redux in 
//   place which includes action, reducer, store that just has a single state
//   that can be referenced from the react front end. 
//   This doesn't appear to be something that can be built incrementally.
//   Redux is a composition of those three bits and they all have to be present
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import { INITIALIZE, COMPLETE_TODO } from './../actions/HoneyDoActions'
import {List, Map} from 'immutable';

const emptyState = Map({
  uiState: Map({}),
  dataState: Map({
    todos: List([])
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
    default:
      return state;
  }
}

export default honeyDoReducer
