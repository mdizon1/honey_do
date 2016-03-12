export const INITIALIZE = 'INITIALIZE'
export const COMPLETE_TODO = 'COMPLETE_TODO'

export function init() {
  return {
    type: INITIALIZE,
    description: 'Initialize the application/store to a default state'
  }
}

export function completeTodo(id) {
  return {
    type: COMPLETE_TODO,
    description: 'Complete the todo item given by id',
    id: id
  }
}
