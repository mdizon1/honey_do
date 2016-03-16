export const INITIALIZE = 'INITIALIZE'
export const COMPLETE_TODO = 'COMPLETE_TODO'
export const SYNC_TODOS = 'SYNC_TODOS'

export function init(identityData) {
  return {
    type: INITIALIZE,
    description: 'Initialize the application/store to a default state',
    data: identityData
  }
}

export function completeTodo(id) {
  return {
    type: COMPLETE_TODO,
    description: 'Complete the todo item given by id',
    id: id
  }
}

export function syncTodos(todoData) {
  return {
    type: SYNC_TODOS,
    description: 'Make todo data in store match the passed in data',
    data: todoData
  }
}

export function syncIdentityState(identityData) {
  return {
    type: SYNC_TODOS,
    description: 'Update only the identity data of the app',
    data: identityData
  }
}
