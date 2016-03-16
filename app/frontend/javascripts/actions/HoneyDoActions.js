export const INITIALIZE = 'INITIALIZE'
export const COMPLETE_TODO = 'COMPLETE_TODO'
export const SYNC_TODOS_REQUEST = 'SYNC_TODOS_REQUEST'
export const SYNC_TODOS_SUCCESS = 'SYNC_TODOS_SUCCESS'
export const SYNC_TODOS_FAILURE = 'SYNC_TODOS_FAILURE'

export function init(options) {
  return {
    type: INITIALIZE,
    description: 'Initialize the application/store to a default state',
    data: options
  }
}

export function completeTodo(id) {
  return {
    type: COMPLETE_TODO,
    description: 'Complete the todo item given by id',
    id: id
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
