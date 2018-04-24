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
  TODO_REORDER_REQUEST,
  TODO_REORDER_SUCCESS,
  TODO_REORDER_FAILURE,
  TOGGLE_HIDE_COMPLETED,
  UPDATE_TODO_DRAG,
  CANCEL_TODO_DRAG,
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
  apiReorderTodo,
  apiUncompleteTodo,
  apiUpdateTodo
} from '../util/Api'

import { EmptyStore } from '../constants/EmptyStore'
import { UiTabs } from '../constants/TodoTypes'

import * as Immutable from 'immutable'
import {List, Map} from 'immutable'

import * as Logger from "../util/Logger"

const TAG_IN_TITLE_REGEX = /#[\w \t]+\b/g

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
      temp_state = setTodoCompletedState(activateSpinner(state), action.todo, true);
      // If you checked a todo, you can uncheck it until the server says otherwise
      return temp_state.setIn(
        ['dataState', 'todos', action.todo.id.toString(), 'permissions', 'canUncomplete'],
        true
      );
    case COMPLETE_TODO_SUCCESS:
      return deactivateSpinner(state);
    case COMPLETE_TODO_FAILURE:
      return setTodoCompletedState(deactivateSpinner(state), action.todo, false);

    case CREATE_TODO_REQUEST:
      // TODO: The closing of the form should probably happen in the component
      temp_state = closeNewTodoForm(activateSpinner(state));
      temp_state = createTodo(temp_state, action.params);
      requestCreateTodoOnServer(temp_state, action);
      return temp_state;

    case DELETE_TODO_REQUEST:
      temp_state = dropTodo(activateSpinner(state), action.todo);
      requestDeleteTodoOnServer(state, action);
      return temp_state;
    case DELETE_TODO_SUCCESS:
    case DELETE_TODO_FAILURE:
     return deactivateSpinner(state);

    case DELETE_TODO_TAG_REQUEST: // find the given todo and remove it's tag
      temp_state = removeTag(state, action.todo, action.tag);
      requestRemoveTodoTagOnServer(state, action);
      return temp_state
    case DELETE_TODO_TAG_SUCCESS:
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
      return state.setIn(
        ["uiState", "isEditing"],
        Immutable.fromJS({
          id: action.todo.id,
        })
      );
    case EDIT_TODO_CANCELED:
      return state.setIn(["uiState", "isEditing"], false);

    case TODO_REORDER_REQUEST:
      let temp_state = reorderTodos(activateSpinner(state));
      requestReorderTodoOnServer(temp_state, action);
      return resetDragState(temp_state);
    case TODO_REORDER_SUCCESS:
    case TODO_REORDER_FAILURE:
      return deactivateSpinner(state);

    case TOGGLE_HIDE_COMPLETED:
      return toggleHideCompletedTodos(state);

    case UPDATE_TODO_DRAG:
      return setTodoDragState(state, {draggedId: action.draggedId, neighborId: action.neighborId, isNeighborNorth: action.isNeighborNorth});
    case CANCEL_TODO_DRAG:
      return resetDragState(state);


    case UPDATE_TODO_REQUEST:
      temp_state = updateTodo(state, action.todo);
      requestUpdateTodoFromServer(state, action);
      return temp_state;
    case UPDATE_TODO_SUCCESS:
    case UPDATE_TODO_FAILURE:
      return state;

    case UNCOMPLETE_TODO_REQUEST:
      temp_state = setTodoCompletedState(activateSpinner(state), action.todo, false);
      uncompleteTodoOnServer(state, action);
      return temp_state
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

const createTodo = (state, params) => {
  var match, tags;

  tags = [];
  match = params.title.match(TAG_IN_TITLE_REGEX);
  _.each(match, (v, k) => {
    tags.push(_.replace(v, '#', ''));
  });

  let new_todo = {
    id: _.uniqueId('placeholder_new_todo_'),
    klass: params.type,
    title: params.title.replace(TAG_IN_TITLE_REGEX, ''),
    notes: params.notes,
    tags: tags,
    position: 0,
    state: 'active',
    isActive: true,
    isCompleted: false,
    permissions: {
      canAccept: false,
      canComplete: false,
      canDestroy: false,
      canEdit: false,
      canTag: false,
      canUncomplete: false
    }
  };
  return state.setIn(['dataState', 'todos', new_todo.id.toString()], Immutable.fromJS(new_todo));
}

const deactivateSpinner = (state) => {
  return state.setIn(['uiState', 'isSpinning'], false);
}

const dropTodo = (state, todo) => {
  return state.deleteIn(['dataState', 'todos', todo.id.toString()], null);
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

const removeTag = (state, todo, tag) => {
  var todo_from_state, tag_list;

  todo_from_state = retrieveTodo(state, todo);
  tag_list = todo_from_state.tags;
  tag_list = _.without(tag_list, tag);

  return state.setIn(
    ['dataState', 'todos', todo.id.toString(), 'tags'],
    Immutable.fromJS(tag_list)
  );
}

const retrieveTodo = (state, todo) => {
  return state.getIn(['dataState', 'todos', todo.id.toString()]);
}

const reorderTodos = (state) => {
  var temp_data;

  const drag_state = state.getIn(['uiState', 'dragState']);
  const todo_id = drag_state.get('currentDragTodoId');
  const neighbor_id = drag_state.get('currentNeighborId');
  const is_neighbor_north = drag_state.get('isNeighborNorth');
  let todo = state.getIn(['dataState', 'todos', todo_id.toString()]).toJS();

  // pull store data into a js object
  temp_data = state.getIn(['dataState', 'todos']).toJS();

  // order by position
  temp_data = _.sortBy(temp_data, (curr_todo) => {
    return curr_todo.position;
  });

  // get the index of the chosen todo
  let temp_index = _.findIndex(temp_data, (curr_todo) => {
    return curr_todo.id === todo_id
  });

  // remove the todo from list
  temp_data.splice(temp_index, 1);

  // find the index of the target todo
  let target_index = _.findIndex(temp_data, (curr_todo) => {
    return curr_todo.id === neighbor_id;
  });

  // insert it at the desired position
  temp_data.splice((is_neighbor_north ? target_index+1 : target_index), 0, todo);

  // renumber positions
  let itor=1;
  _.each(temp_data, (curr_todo) => {
    curr_todo.position = itor++;
  });

  // put the data back into a hash structure by id
  let output = {}
  _.each(temp_data, (curr_todo) => {
    output[curr_todo.id.toString()] = curr_todo;
  });

  return state.setIn(
    ['dataState', 'todos'],
    Immutable.fromJS(output)
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
  const drag_state = state.getIn(['uiState', 'dragState']);
  const todo_id = drag_state.get('currentDragTodoId');
  let todo = state.getIn(['dataState', 'todos', todo_id.toString()]).toJS();
  let neighbor_id = drag_state.get('currentNeighborId');
  let is_neighbor_north = drag_state.get('isNeighborNorth');

  apiReorderTodo({
    endpoint: state.getIn(['configState', 'apiEndpoint']),
    authToken: state.getIn(['configState', 'identity', 'authToken']),
    todo: todo,
    todoNeighborId: neighbor_id,
    isTodoNeighborNorth: is_neighbor_north,
    onSuccess: (data, textStatus, jqXHR) => {
      action.asyncDispatch(todoReorderSuccess(todo_id, action.todoType, data));
    },
    onFailure: (jqXHR, textStatus, errorThrown) => {
      action.asyncDispatch(todoReorderFailure(todo_id, action.todoType, jqXHR));
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
  temp_state = temp_state.setIn(["uiState", "dragState", "currentNeighborId"], null);
  temp_state = temp_state.setIn(["uiState", "dragState", "isNeighborNorth"], null);
  return temp_state.setIn(["uiState", "dragState", "currentDragTodoId"], null);
}

const setTodoDragState = (state, options) => {
  const {draggedId, neighborId, isNeighborNorth} = options;
  let temp_state = state;

  temp_state = temp_state.setIn(["uiState", "dragState", "isDragActive"], true);
  temp_state = temp_state.setIn(["uiState", "dragState", "currentDragTodoId"], draggedId);
  temp_state = temp_state.setIn(["uiState", "dragState", "currentNeighborId"], neighborId );
  return temp_state.setIn(["uiState", "dragState", "isNeighborNorth"], isNeighborNorth );
}

const setTodoCompletedState = (state, todo, isCompleted) => {
  return state.setIn(
    ['dataState', 'todos', todo.id.toString(), 'isCompleted'],
    isCompleted
  );
}

const setTodoState = (state, todo, todoState) => {
  return state.setIn(['dataState', 'todos', todo.id.toString()], Immutable.fromJS(todoState));
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

// TODO: Separate tag processing into own function
const updateTodo = (state, todo) => { // Look for given todo in state and replace with given todo
  let match = todo.title.match(TAG_IN_TITLE_REGEX);
  let tags_in_title = [];
  _.each(match, (v, k) => {
    tags_in_title.push(_.replace(v, '#', ''));
  });

  todo.tags = _.uniq(_.concat(todo.tags, tags_in_title));
  todo.title = todo.title.replace(TAG_IN_TITLE_REGEX, '');
  return state.setIn(['dataState', 'todos', todo.id.toString()], Immutable.fromJS(todo));
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
