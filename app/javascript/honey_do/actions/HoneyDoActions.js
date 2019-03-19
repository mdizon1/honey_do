export const ACCEPT_TODO_REQUEST = 'ACCEPT_TODO_REQUEST'
export const ACCEPT_TODO_SUCCESS = 'ACCEPT_TODO_SUCCESS'
export const ACCEPT_TODO_FAILURE = 'ACCEPT_TODO_FAILURE'
export const CLEAR_COMPLETED_CONFIRM = 'CLEAR_COMPLETED_CONFIRM'
export const CLOSE_CLEAR_COMPLETED_CONFIRM = 'CLOSE_CLEAR_COMPLETED_CONFIRM'
export const CLEAR_COMPLETED_REQUEST = 'CLEAR_COMPLETED_REQUEST'
export const CLEAR_COMPLETED_SUCCESS = 'CLEAR_COMPLETED_SUCCESS'
export const CLEAR_COMPLETED_FAILURE = 'CLEAR_COMPLETED_FAILURE'
export const CLOSE_CREATE_FORM = 'CLOSE_CREATE_FORM'
export const COMPLETE_TODO_REQUEST = 'COMPLETE_TODO_REQUEST'
export const COMPLETE_TODO_SUCCESS = 'COMPLETE_TODO_SUCCESS'
export const COMPLETE_TODO_FAILURE = 'COMPLETE_TODO_FAILURE'
export const CREATE_TODO_REQUEST = 'CREATE_TODO_REQUEST'
export const CREATE_TODO_SUCCESS = 'CREATE_TODO_SUCCESS'
export const CREATE_TODO_FAILURE = 'CREATE_TODO_FAILURE'
export const DELETE_TODO_REQUEST = 'DELETE_TODO_REQUEST'
export const DELETE_TODO_SUCCESS = 'DELETE_TODO_SUCCESS'
export const DELETE_TODO_FAILURE = 'DELETE_TODO_FAILURE'
export const DELETE_TODO_TAG_REQUEST = 'DELETE_TODO_TAG_REQUEST'
export const DELETE_TODO_TAG_SUCCESS = 'DELETE_TODO_TAG_SUCCESS'
export const DELETE_TODO_TAG_FAILURE = 'DELETE_TODO_TAG_FAILURE'
export const EDIT_TODO_CANCELED = 'EDIT_TODO_CANCELED'
export const EDIT_TODO_REQUEST  = 'EDIT_TODO_REQUEST'
export const FILTER_TODOS = 'FILTER_TODOS'
export const OPEN_CONFIG = 'OPEN_CONFIG'
export const CLOSE_CONFIG = 'CLOSE_CONFIG'
export const OPEN_CREATE_FORM = 'OPEN_CREATE_FORM'
export const SWITCH_TAB = 'SWITCH_TAB'
export const SYNC_PERMISSIONS_REQUEST = 'SYNC_PERMISSIONS_REQUEST'
export const SYNC_PERMISSIONS_SUCCESS = 'SYNC_PERMISSIONS_SUCCESS'
export const SYNC_PERMISSIONS_FAILURE = 'SYNC_PERMISSIONS_FAILURE'
export const SYNC_TODOS_REQUEST = 'SYNC_TODOS_REQUEST'
export const SYNC_TODOS_SUCCESS = 'SYNC_TODOS_SUCCESS'
export const SYNC_TODOS_FAILURE = 'SYNC_TODOS_FAILURE'
export const CANCEL_TODO_DRAG = 'CANCEL_TODO_DRAG'
export const TODO_REORDER_REQUEST = 'TODO_REORDER_REQUEST'
export const TODO_REORDER_SUCCESS = 'TODO_REORDER_SUCCESS'
export const TODO_REORDER_FAILURE = 'TODO_REORDER_FAILURE'
export const TOGGLE_HIDE_COMPLETED = "TOGGLE_HIDE_COMPLETED"
export const UPDATE_TODO_REQUEST = 'UPDATE_TODO_REQUEST'
export const UPDATE_TODO_SUCCESS = 'UPDATE_TODO_SUCCESS'
export const UPDATE_TODO_FAILURE = 'UPDATE_TODO_FAILURE'
export const UPDATE_TODO_DRAG = 'UPDATE_TODO_DRAG'
export const UNCOMPLETE_TODO_REQUEST = 'UNCOMPLETE_TODO_REQUEST'
export const UNCOMPLETE_TODO_SUCCESS = 'UNCOMPLETE_TODO_SUCCESS'
export const UNCOMPLETE_TODO_FAILURE = 'UNCOMPLETE_TODO_FAILURE'

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

export function cancelDragTodo() {
  return {
    type: CANCEL_TODO_DRAG,
    description: "Canceled a drag and drop action"
  }
}

export function clearCompletedConfirmCanceled() {
  return {
    type: CLOSE_CLEAR_COMPLETED_CONFIRM,
    description: "User canceled dialog that confirms clearing of completed items"
  }
}
export function clearCompletedConfirm() {
  return {
    type: CLEAR_COMPLETED_CONFIRM,
    description: "User requests dialog to confirm clearing of completed items"
  }
}

export function clearCompletedRequest() {
  return {
    type: CLEAR_COMPLETED_REQUEST,
    description: "Clear completed todos and shopping items"
  }
}

export function clearCompletedSuccess() {
  return {
    type: CLEAR_COMPLETED_SUCCESS
  }
}

export function clearCompletedFailure() {
  return {
    type: CLEAR_COMPLETED_FAILURE
  }
}

export function completeTodoRequest(todo) {
  return {
    type: COMPLETE_TODO_REQUEST,
    description: 'Make api call to complete the todo item given by id',
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

export function deleteTodoTagRequest(todo, tag) {
  return {
    type: DELETE_TODO_TAG_REQUEST,
    todo: todo,
    tag: tag
  }
}
export function deleteTodoTagSuccess(todo, tag) {
  return {
    type: DELETE_TODO_TAG_SUCCESS,
    todo: todo,
    tag: tag
  }
}
export function deleteTodoTagFailure(todo, tag) {
  return {
    type: DELETE_TODO_TAG_FAILURE,
    todo: todo,
    tag: tag
  }
}

export function filterTodos(filterVal) {
  return {
    type: FILTER_TODOS,
    filterValue: filterVal,
    description: 'Filter todos by the given value'
  }
}

export function switchTab(tab) {
  return {
    type: SWITCH_TAB,
    description: 'Change the current tab view',
    tab
  }
}
export function syncPermissionsRequest() {
  return {
    type: SYNC_PERMISSIONS_REQUEST,
    description: "Make a request to the server to get user permissions"
  }
}

export function syncPermissionsSuccess(permissionData) {
  return {
    type: SYNC_PERMISSIONS_SUCCESS,
    newPermissions: permissionData,
    description: "Got a successful response from the server with user permissions for this household"
  }


}

export function syncPermissinosFailure() {
  // TODO: Implement me
}

export function syncTodosRequest() {
  return {
    type: SYNC_TODOS_REQUEST,
    description: 'Make a request to the server to sync todo data'
  }
}

export function syncTodosSuccess(json) {
  return {
    type: SYNC_TODOS_SUCCESS,
    description: 'Make todo data in store match the passed in data',
    data: json,
    receivedAt: Date.now()
  }
}

export function syncTodosFailure(json, error) {
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
export function editTodoSuccess(todo) { }
export function editTodoFailure(todo) { }

export function openConfig() {
  return {
    type: OPEN_CONFIG,
    description: 'Open the configuration menu'
  }
}
export function closeConfig() {
  return {
    type: CLOSE_CONFIG,
    description: 'Close the configuration menu'
  }
}

export function openCreateForm() {
  return {
    type: OPEN_CREATE_FORM,
    description: 'Open the new todo form',
  }
}
export function closeCreateForm() {
  return {
    type: CLOSE_CREATE_FORM,
    description: 'Close the new todo form'
  }
}

export function todoReorderRequest(args) {
  return {
    type: TODO_REORDER_REQUEST,
    description: 'Todo was dragged and dropped into a new position',
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

export function toggleHideCompleted(){
  return {
    type: TOGGLE_HIDE_COMPLETED,
    description: "Show/Hide todos which were already completed"
  }
}

export function updateTodoDrag(draggedId, neighborId, isNeighborNorth){
  return {
    type: UPDATE_TODO_DRAG,
    description: "Todo item was dragged to a new position",
    draggedId: draggedId,
    neighborId: neighborId,
    isNeighborNorth: isNeighborNorth
  }
}

export function updateTodoRequest(todo) {
  return {
    type: UPDATE_TODO_REQUEST,
    todo: todo
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
