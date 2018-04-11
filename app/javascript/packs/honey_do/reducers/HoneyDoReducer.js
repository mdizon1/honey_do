// Stub for reducers for now.  This will eventually be split into multiple
// files which should be recombined into a top level reducer.
// Doing that up front will be confusing as I'm just getting started on redux
// For now I'll build all reducers into this file and later split as necessary

import {
  ACCEPT_TODO_REQUEST,
  ACCEPT_TODO_SUCCESS,
  ACCEPT_TODO_FAILURE,
  CLOSE_CREATE_FORM,
  COMPLETE_TODO_REQUEST,
  COMPLETE_TODO_SUCCESS,
  COMPLETE_TODO_FAILURE,
  CREATE_TODO_REQUEST,
  CREATE_TODO_SUCCESS,
  CREATE_TODO_FAILURE,
  DELETE_TODO_REQUEST,
  DELETE_TODO_SUCCESS,
  DELETE_TODO_FAILURE,
  DELETE_TODO_TAG_REQUEST,
  DELETE_TODO_TAG_SUCCESS,
  DELETE_TODO_TAG_FAILURE,
  EDIT_TODO_CANCELED,
  EDIT_TODO_REQUEST,
  FILTER_TODOS,
  OPEN_CREATE_FORM,
  SWITCH_TAB,
  SYNC_TODOS_REQUEST,
  SYNC_TODOS_SUCCESS,
  SYNC_TODOS_FAILURE,
  TODO_CANCEL_DRAG,
  TODO_REORDER_REQUEST,
  TODO_REORDER_SUCCESS,
  TODO_REORDER_FAILURE,
  TOGGLE_HIDE_COMPLETED,
  UPDATE_TODO_DRAG,
  UPDATE_TODO_REQUEST,
  UPDATE_TODO_SUCCESS,
  UPDATE_TODO_FAILURE,
  UNCOMPLETE_TODO_REQUEST,
  UNCOMPLETE_TODO_SUCCESS,
  UNCOMPLETE_TODO_FAILURE,
  acceptTodoSuccess,
  acceptTodoFailure,
  closeCreateForm,
  completeTodoSuccess,
  completeTodoFailure,
  deleteTodoSuccess,
  deleteTodoFailure,
  editTodoCanceled,
  syncTodosRequest,
  syncTodosSuccess,
  todoReorderSuccess,
  todoReorderFailure,
  uncompleteTodoSuccess,
  uncompleteTodoFailure
} from '../actions/HoneyDoActions'

import {
  apiAcceptTodo,
  apiCompleteTodo,
  apiCreateTodo,
  apiDeleteTodo,
  apiRemoveTag,
  apiSyncTodos,
  apiTodoReorder,
  apiUncompleteTodo,
  apiUpdateTodo
} from '../util/Api'

import { TodoKlassToDataState, TodoTypeToDataState, TodoKlassToType, UiTabs } from '../constants/TodoTypes'
import { EmptyStore } from '../constants/EmptyStore'

import * as Immutable from 'immutable'
import {List, Map} from 'immutable'

import * as Logger from "../util/Logger"


function honeyDoReducer(state, action) {
  var temp_state;

  Logger.debug("~~~~~~~~~~~~~~~~~~~~~~~~ REDUCER CALLED ~~~~~~~~~~~~~~~~~~~~~~~~~~");
  Logger.debug("action ------------> ", action);

  switch (action.type) {

    case ACCEPT_TODO_REQUEST:
      requestAcceptTodoFromServer(state, action);
      return dropTodo(activateSpinner(state), action.todo);

    case ACCEPT_TODO_SUCCESS:
    case ACCEPT_TODO_FAILURE:
      return deactivateSpinner(state);

    case COMPLETE_TODO_REQUEST: //make the api call
      completeTodoOnServer(state, action);
      return setTodoCompletedState(activateSpinner(state), action.todo, true);
    case COMPLETE_TODO_SUCCESS:
      return setTodoState(deactivateSpinner(state), action.todo, action.data);
    case COMPLETE_TODO_FAILURE:
      return setTodoCompletedState(deactivateSpinner(state), action.todo, false);

    case CREATE_TODO_REQUEST:
      requestCreateTodoOnServer(state, action);
      return closeNewTodoForm(activateSpinner(state));

    case DELETE_TODO_REQUEST:
      requestDeleteTodoOnServer(state, action);
      return dropTodo(activateSpinner(state), action.todo);
    case DELETE_TODO_SUCCESS:
    case DELETE_TODO_FAILURE:
     return deactivateSpinner(state);

    case DELETE_TODO_TAG_REQUEST: // find the given todo and remove it's tag
      requestRemoveTodoTagOnServer(state, action);
      return removeTag(state, action.todo, action.tag);
    case DELETE_TODO_TAG_SUCCESS:
      return state;
    case DELETE_TODO_TAG_FAILURE: // TODO: In this case we should reload the todo
      return state;

    case FILTER_TODOS:
      return updateFilterState(state, action.filterValue);

    case OPEN_CREATE_FORM:
      return openNewTodoForm(state);
    case CLOSE_CREATE_FORM:
      return closeNewTodoForm(state);

    case SWITCH_TAB:
      if(!_.includes(UiTabs, action.tab)){ return state; } // ensure the tab given (action.tab) is one of UiTabs
      return state.setIn(["uiState", "currentTab"], action.tab);

    case SYNC_TODOS_REQUEST:
      obtainTodosFromServer(state, action);

      return uiSyncingOn(state);
    case SYNC_TODOS_SUCCESS:
      temp_state = uiSyncingOff(state);
      // TODO: This is actually doing a retrieve right now, I should refactor
      // the code to reflect this accordingly
      return temp_state.set('dataState', Immutable.fromJS(action.data));
    case SYNC_TODOS_FAILURE:
      return uiSyncingOff(state);

    case EDIT_TODO_REQUEST:
      return state.setIn(["uiState", "isEditing"], {todo: action.todo}); // TODO: Make this say Immutable.fromJS
    case EDIT_TODO_CANCELED:
      return state.setIn(["uiState", "isEditing"], false);

    case TODO_CANCEL_DRAG:
      return resetDragState(state);

    case TODO_REORDER_REQUEST:
      temp_state = resetDragState(state);
      if(action.positionsJumped == 0) { return temp_state; }
      requestReorderTodoOnServer(temp_state, action);
      return reorderTodos(activateSpinner(temp_state), action.todo, action.positionsJumped);
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

    case TOGGLE_HIDE_COMPLETED:
      return toggleHideCompletedTodos(state);

    case UPDATE_TODO_DRAG:
      return setTodoDragState(state, action.todo.id, action.newPosition, action.todoKlass);

    case UPDATE_TODO_REQUEST:
      requestUpdateTodoFromServer(state, action);
      return updateTodo(state, action.todo);
    case UPDATE_TODO_SUCCESS:
    case UPDATE_TODO_FAILURE:
      return state;

    case UNCOMPLETE_TODO_REQUEST:
      uncompleteTodoOnServer(state, action);
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

const closeNewTodoForm = (state) => {
  return state.setIn(['uiState', 'isCreating'], false);
}
const openNewTodoForm = (state) => {
  return state.setIn(['uiState', 'isCreating'], true);
}

const completeTodoOnServer = (state, action) => {
  let todo = action.todo
  apiCompleteTodo({
    endpoint: state.getIn(['configState', 'apiEndpoint']),
    authToken: state.getIn(['configState', 'identity', 'authToken']),
    todo: todo,
    onSuccess: (data, textStatus, jqXHR) => {
      action.asyncDispatch(completeTodoSuccess(todo, data));
    },
    onFailure: (jqXHR, textStatus, errorThrown) => {
      action.asyncDispatch(completeTodoFailure(todo, errorThrown));
    }
  });
}

const deactivateSpinner = (state) => {
  return state.setIn(['uiState', 'isSpinning'], false);
}

const dropTodo = (state, todo) => {
  return state.deleteIn(['dataState', TodoKlassToDataState[todo.klass], todo.id.toString()], null);
}

const obtainTodosFromServer = (state, action) => {
  apiSyncTodos({
    endpoint: state.getIn(['configState', 'apiEndpoint']),
    authToken: state.getIn(['configState', 'identity', 'authToken']),
    onSuccess: (data, textStatus, jqXHR) => {
      action.asyncDispatch(syncTodosSuccess(data));
    },
    onFailure: (jqXHR, textStatus, errorThrown) => { } // TODO: implement onFailure for this....
  });
}

// TODO: Here a problem lies with the way I'm handling state in Todo components
// removing a tag doesn't update the todo display when I expand the notes.
// Something up the tree should be using connect to grab it's state from the store
const removeTag = (state, todo, tag) => {
  var todo_from_state, tag_list;

  todo_from_state = retrieveTodo(state, todo);
  tag_list = todo_from_state.tags;
  tag_list = _.without(tag_list, tag);

  return state.setIn(
    ['dataState', TodoTypeToDataState[todo.klass], todo.id.toString, 'tags'],
    Immutable.fromJS(tag_list)
  );
}

const retrieveTodo = (state, todo) => {
  return state.getIn(['dataState', TodoKlassToDataState[todo.klass], todo.id.toString()]);
}

const reorderTodos = (state, todo, positionsJumped) => {
  var temp_state, temp_data, target_position;

  // pull store data into a js object
  temp_data = state.getIn(['dataState', TodoKlassToDataState[todo.klass]]).toJS();

  // order by position
  temp_data = _.sortBy(temp_data, (curr_todo) => {
    return curr_todo.position;
  });

  let temp_index = _.findIndex(temp_data, (curr_todo) => {
    return curr_todo.id === todo.id
  });

  // remove the todo from list
  temp_data.splice(temp_index, 1);


  // insert it at the desired position
  temp_data.splice(temp_index + positionsJumped, 0, todo);


  // renumber positions
  let itor=0;
  _.each(temp_data, (curr_todo) => {
    curr_todo.position = itor++;
  });

  // put the data back into a hash structure by id
  let output = {}
  _.each(temp_data, (curr_todo) => {
    output[curr_todo.id.toString()] = curr_todo;
  });

  return state.setIn(
    ['dataState', TodoKlassToDataState[todo.klass]],
    Immutable.fromJS(temp_data)
  );
}

const requestAcceptTodoFromServer = (state, action) => {
  apiAcceptTodo({
    endpoint: state.getIn(['configState', 'apiEndpoint']),
    authToken: state.getIn(['configState', 'identity', 'authToken']),
    todo: action.todo,
    onSuccess: (data, textStatus, jqXHR) => {
      action.asyncDispatch(acceptTodoSuccess(action.todo, data));
    },
    onFailure: (jqXHR, textStatus, errorThrown) => {
      action.asyncDispatch(acceptTodoFailure(action.todo, errorThrown));
    },
    onComplete: (data_jqXHR, textStatus, jqXHR_errorThrown) => {
      action.asyncDispatch(syncTodosRequest());
    }
  });
}

const requestCreateTodoOnServer = (state, action) => {
  apiCreateTodo({
    endpoint: state.getIn(['configState', 'apiEndpoint']),
    authToken: state.getIn(['configState', 'identity', 'authToken']),
    params: action.params,
    onSuccess: (data, textStatus, jqXHR) => {
      action.asyncDispatch(syncTodosRequest());
    },
    onFailure: (jqXHR, textStatus, errorThrown) => { }, // TODO: handle fail case ...
  });
}

const requestDeleteTodoOnServer = (state, action) => {
  apiDeleteTodo({
    endpoint: state.getIn(['configState', 'apiEndpoint']),
    authToken: state.getIn(['configState', 'identity', 'authToken']),
    todo: action.todo,
    onSuccess: (data, textStatus, jqXHR) => {
      action.asyncDispatch(deleteTodoSuccess(action.todo));
    },
    onFailure: (jqXHR, textStatus, errorThrown) => {
      action.asyncDispatch(deleteTodoFailure(action.todo));
    },
    onComplete: (data_jqXHR, textStatus, jqXHR_errorThrown) => {
      //action.asyncDispatch(syncTodosRequest()); // don't sync all the time, it's expensive
    }
  });
}

const requestRemoveTodoTagOnServer = (state, action) => {
  apiRemoveTag({
    endpoint: state.getIn(['configState', 'apiEndpoint']),
    authToken: state.getIn(['configState', 'identity', 'authToken']),
    todo: action.todo,
    tag: action.tag
  });
}

const requestReorderTodoOnServer = (state, action) => {
  apiTodoReorder({
    endpoint: state.getIn(['configState', 'apiEndpoint']),
    authToken: state.getIn(['configState', 'identity', 'authToken']),
    todo: action.todo,
    positionsJumped: action.positionsJumped,
    onSuccess: (data, textStatus, jqXHR) => {
      action.asyncDispatch(todoReorderSuccess(action.todo.id, action.todoType, data));
    },
    onFailure: (jqXHR, textStatus, errorThrown) => {
      action.asyncDispatch(todoReorderFailure(action.todo.id, action.todoType, jqXHR));
    },
    onComplete: (data_jqXHR, textStatus, jqXHR_errorThrown) => {
      action.asyncDispatch(syncTodosRequest()); // don't sync all the time, it's expensive
    }
  });
}

const requestUpdateTodoFromServer = (state, action) => {
  apiUpdateTodo({
    endpoint: state.getIn(['configState', 'apiEndpoint']),
    authToken: state.getIn(['configState', 'identity', 'authToken']),
    todo: action.todo,
    onSuccess: (data, textStatus, jqXHR) => { },
    onFailure: (jqXHR, textStatus, errorThrown) => {
      action.asyncDispatch(syncTodosRequest());
    },
    onComplete: () => {
      action.asyncDispatch(editTodoCanceled());
    }
  });
}

const resetDragState = (state) => {
  let temp_state = state;

  temp_state = temp_state.setIn(["uiState", "dragState", "isDragActive"], false);
  temp_state = temp_state.setIn(["uiState", "dragState", "currentDragPosition"], null);
  temp_state = temp_state.setIn(["uiState", "dragState", "currentDragTodoId"], null);
  return temp_state.setIn(["uiState", "dragState", "currentDragTodo"], null);
}

const setTodoDragState = (state, id, position, klass) => {
  let temp_state = state;

  temp_state = temp_state.setIn(["uiState", "dragState", "isDragActive"], true);
  temp_state = temp_state.setIn(["uiState", "dragState", "currentDragPosition"], position);
  temp_state = temp_state.setIn(["uiState", "dragState", "currentDragTodoId"], id);
  return temp_state.setIn(
    ["uiState", "dragState", "currentDragTodo"],
    temp_state.getIn(["dataState", TodoKlassToDataState[klass], id.toString()])
  );
}

const setTodoCompletedState = (state, todo, isCompleted) => {
  return state.setIn(
    ['dataState', TodoKlassToDataState[todo.klass], todo.id.toString(), 'isCompleted'],
    isCompleted
  );
}

const setTodoState = (state, todo, todoState) => {
  return state.setIn(['dataState', TodoKlassToDataState[todo.klass], todo.id.toString()], Immutable.fromJS(todoState));
}

const toggleHideCompletedTodos = (state) => {
  var curr_hidden_state;
  curr_hidden_state = state.getIn(["uiState", "isCompletedHidden"]);
  return state.setIn(["uiState", "isCompletedHidden"], !curr_hidden_state);
}

const uiSyncingOn = (state) => {
  let temp_state = state.setIn(['uiState', 'isSyncing'], true);
  return activateSpinner(temp_state);
}

const uiSyncingOff = (state) => {
  let temp_state = state.setIn(['uiState', 'isSyncing'], false);
  return deactivateSpinner(temp_state);
}

const updateFilterState = (state, filterVal) => {
  return state.setIn(['uiState', 'filterValue'], filterVal);
}

const updateTodo = (state, todo) => { // Look for given todo in state and replace with given todo
  let tags_in_title = _.words(todo.title, /#[\w\s]+\b/g);
  tags_in_title = _.map(tags_in_title, (tag_in_title) => {
    return _.trim(_.replace(tag_in_title, /#/g, ''));
  });
  todo.tags = _.uniq(_.concat(todo.tags, tags_in_title));
  let new_title = _.trim(_.replace(todo.title, /#.*/g, ''));
  todo.title = new_title;
  return state.setIn(['dataState', TodoKlassToDataState[todo.klass], todo.id.toString()], todo);
}

const uncompleteTodoOnServer = (state, action) => {
  let todo = action.todo

  apiUncompleteTodo({
    endpoint: state.getIn(['configState', 'apiEndpoint']),
    authToken: state.getIn(['configState', 'identity', 'authToken']),
    todo: todo,
    onSuccess: (data, textStatus, jqXHR) => {
      action.asyncDispatch(uncompleteTodoSuccess(todo, data));
    },
    onFailure: (jqXHR, textStatus, errorThrown) => {
      action.asyncDispatch(uncompleteTodoFailure(todo, errorThrown));
    }
  });
}
export default honeyDoReducer
