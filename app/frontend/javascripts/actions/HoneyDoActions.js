export const ACCEPT_TODO_REQUEST = 'ACCEPT_TODO_REQUEST'
export const ACCEPT_TODO_SUCCESS = 'ACCEPT_TODO_SUCCESS'
export const ACCEPT_TODO_FAILURE = 'ACCEPT_TODO_FAILURE'
export const COMPLETE_TODO_REQUEST = 'COMPLETE_TODO_REQUEST'
export const COMPLETE_TODO_SUCCESS = 'COMPLETE_TODO_SUCCESS'
export const COMPLETE_TODO_FAILURE = 'COMPLETE_TODO_FAILURE'
export const CREATE_TODO_REQUEST = 'CREATE_TODO_REQUEST'
export const CREATE_TODO_SUCCESS = 'CREATE_TODO_SUCCESS'
export const CREATE_TODO_FAILURE = 'CREATE_TODO_FAILURE'
export const DELETE_TODO_REQUEST = 'DELETE_TODO_REQUEST'
export const DELETE_TODO_SUCCESS = 'DELETE_TODO_SUCCESS'
export const DELETE_TODO_FAILURE = 'DELETE_TODO_FAILURE'
export const EDIT_TODO_CANCELED = 'EDIT_TODO_CANCELED'
export const EDIT_TODO_REQUEST  = 'EDIT_TODO_REQUEST'
export const EDIT_TODO_SUCCESS  = 'EDIT_TODO_SUCCESS'
export const EDIT_TODO_FAILURE  = 'EDIT_TODO_FAILURE'
export const INITIALIZE = 'INITIALIZE'
export const LOAD_TAG_SUCCESS = 'LOAD_TAG_SUCCESS'
export const SWITCH_TAB = 'SWITCH_TAB'
export const SYNC_TODOS_REQUEST = 'SYNC_TODOS_REQUEST'
export const SYNC_TODOS_SUCCESS = 'SYNC_TODOS_SUCCESS'
export const SYNC_TODOS_FAILURE = 'SYNC_TODOS_FAILURE'
export const TODO_REORDER_REQUEST = 'TODO_REORDER_REQUEST'
export const TODO_REORDER_SUCCESS = 'TODO_REORDER_SUCCESS'
export const TODO_REORDER_FAILURE = 'TODO_REORDER_FAILURE'
export const UNCOMPLETE_TODO_REQUEST = 'UNCOMPLETE_TODO_REQUEST'
export const UNCOMPLETE_TODO_SUCCESS = 'UNCOMPLETE_TODO_SUCCESS'
export const UNCOMPLETE_TODO_FAILURE = 'UNCOMPLETE_TODO_FAILURE'

export function init(options) {
  return {
    type: INITIALIZE,
    description: 'Initialize the application/store to a default state',
    data: options
  }
}

export function acceptTodoRequest(todo) {
  return {
    type: ACCEPT_TODO_REQUEST,
    description: 'Admin requests to accept the todo',
    todo: todo
  }
}

export function acceptTodoSuccess(todo) {
  return {
    type: ACCEPT_TODO_SUCCESS
  }
}

export function acceptTodoFailure(todo) {
  return {
    type: ACCEPT_TODO_FAILURE
  }
}

export function completeTodoRequest(todo) {
  return {
    type: COMPLETE_TODO_REQUEST,
    description: 'Complete the todo item given by id',
    todo: todo
  }
}

export function completeTodoSuccess(todo, json) {
  return {
    type: COMPLETE_TODO_SUCCESS,
    todo: todo,
    data: json
  }
}

export function completeTodoFailure(todo, jqXHR) {
  return {
    type: COMPLETE_TODO_FAILURE,
    todo: todo,
    data: jqXHR
  }
}

export function createTodoRequest(params) {
  return {
    type: CREATE_TODO_REQUEST,
    params: params
  }
}

export function deleteTodoRequest(todo) {
  return {
    type: DELETE_TODO_REQUEST,
    todo: todo
  }
}
export function deleteTodoSuccess(todo) {
  return {
    type: DELETE_TODO_SUCCESS
  }
}
export function deleteTodoFailure(todo) {
  return {
    type: DELETE_TODO_FAILURE
  }
}

export function loadTagSuccess(data) {
  return {
    tags: data,
    type: LOAD_TAG_SUCCESS
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

export function syncTodosRequestSuccess(json) {
  return {
    type: SYNC_TODOS_SUCCESS,
    description: 'Make todo data in store match the passed in data',
    data: json,
    receivedAt: Date.now()
  }
}

export function syncTodosRequestFailure(json, error) {
  return {
    type: SYNC_TODOS_FAILURE,
    description: 'Got a failure response from the server while attempting to sync todos',
    data: json,
    receivedAt: Date.now()
  }
}

export function editTodoCanceled() {
  return {
    type: EDIT_TODO_CANCELED,
    description: 'Canceled the request to edit the todo'
  }
}

export function editTodoRequest(todo) {
  return {
    type: EDIT_TODO_REQUEST,
    description: 'Edit todo request triggered',
    todo: todo
  }
}
export function editTodoSuccess(todo) {
}
export function editTodoFailure(todo) {
}

// TODO: Rename todosList to todoList
export function todoReorderRequest(todosList, todoType) {
  return {
    type: TODO_REORDER_REQUEST,
    description: 'Todo was dragged and dropped into a new position',
    todosList: todosList,
    todoType: todoType
  }
}

export function todoReorderSuccess(id, todoType, json) {
  return {
    type: TODO_REORDER_SUCCESS,
    description: 'Server acknowledges a todo reorder successfully',
    data: json,
    todoType: todoType
  }
}

export function todoReorderFailure(id, todoType, json) {
  return {
    type: TODO_REORDER_FAILURE,
    description: 'Todo was dragged and dropped into a new position',
    data: json,
    todoType: todoType
  }
}

export function uncompleteTodoRequest(todo) {
  return {
    type: UNCOMPLETE_TODO_REQUEST,
    todo: todo
  }
}

export function uncompleteTodoSuccess(todo, json) {
  return {
    type: UNCOMPLETE_TODO_SUCCESS,
    todo: todo,
    data: json
  }
}

export function uncompleteTodoFailure(todo, jqXHR) {
  return {
    type: UNCOMPLETE_TODO_FAILURE,
    todo: todo,
    data: jqXHR
  }
}
