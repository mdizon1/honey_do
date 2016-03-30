export const COMPLETE_TODO_REQUEST = 'COMPLETE_TODO_REQUEST'
export const COMPLETE_TODO_SUCCESS = 'COMPLETE_TODO_SUCCESS'
export const COMPLETE_TODO_FAILURE = 'COMPLETE_TODO_FAILURE'
export const INITIALIZE = 'INITIALIZE'
export const SWITCH_TAB = 'SWITCH_TAB'
export const SYNC_TODOS_REQUEST = 'SYNC_TODOS_REQUEST'
export const SYNC_TODOS_SUCCESS = 'SYNC_TODOS_SUCCESS'
export const SYNC_TODOS_FAILURE = 'SYNC_TODOS_FAILURE'
export const UNCOMPLETE_TODO_REQUEST = 'UNCOMPLETE_TODO_REQUEST'
export const UNCOMPLETE_TODO_SUCCESS = 'UNCOMPLETE_TODO_SUCCESS'
export const UNCOMPLETE_TODO_FAILURE = 'UNCOMPLETE_TODO_FAILURE'
export const TODO_REORDER_REQUEST = 'TODO_REORDER_REQUEST'
export const TODO_REORDER_SUCCESS = 'TODO_REORDER_REQUEST'
export const TODO_REORDER_FAILURE = 'TODO_REORDER_REQUEST'

export const UiTabs = {
  SHOW_TODOS: 'SHOW_TODOS',
  SHOW_SHOPPING_LIST: 'SHOW_SHOPPING_LIST',
}

export function init(options) {
  return {
    type: INITIALIZE,
    description: 'Initialize the application/store to a default state',
    data: options
  }
}

export function completeTodoRequest(id) {
  return {
    type: COMPLETE_TODO_REQUEST,
    description: 'Complete the todo item given by id',
    id: id
  }
}

export function completeTodoSuccess(id, json) {
  return {
    type: COMPLETE_TODO_SUCCESS,
    id: id,
    data: json
  }
}

export function completeTodoFailure(id, jqXHR) {
  return {
    type: COMPLETE_TODO_FAILURE,
    id: id,
    data: jqXHR
  }
}

export function switchTab(tab) {
  return {
    type: SWITCH_TAB,
    description: 'Change the current tab view',
    tab
  }
}

export function syncTodosRequest() {
  return {
    type: SYNC_TODOS_REQUEST,
    description: 'Make a request to the server to sync todo data'
  }
}

export function syncTodosRequestSuccess(json){
  return {
    type: SYNC_TODOS_SUCCESS,
    description: 'Make todo data in store match the passed in data',
    data: json,
    receivedAt: Date.now()
  }
}

export function syncTodosRequestFailure(json, error){
  return {
    type: SYNC_TODOS_FAILURE,
    description: 'Got a failure response from the server while attempting to sync todos',
    data: json,
    receivedAt: Date.now()
  }
}

export function todoReorderRequest(id, newPosition) {
  return {
    type: TODO_REORDER_REQUEST,
    description: 'Todo was dragged and dropped into a new position',
    id: id,
    newPosition: newPosition
  }
}

export function uncompleteTodoRequest(id) {
  return {
    type: UNCOMPLETE_TODO_REQUEST,
    id: id
  }
}

export function uncompleteTodoSuccess(id, json) {
  return {
    type: UNCOMPLETE_TODO_SUCCESS,
    id: id,
    data: json
  }
}

export function uncompleteTodoFailure(id, jqXHR) {
  return {
    type: UNCOMPLETE_TODO_FAILURE,
    id: id,
    data: jqXHR
  }
}
