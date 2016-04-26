// This file should handle all api calls to the server.

import { acceptTodoRequest, acceptTodoSuccess, acceptTodoFailure,
  completeTodoRequest, completeTodoSuccess, completeTodoFailure,
  deleteTodoRequest, deleteTodoSuccess, deleteTodoFailure,
  todoReorderRequest, todoReorderSuccess, todoReorderFailure,
  uncompleteTodoRequest, uncompleteTodoSuccess, uncompleteTodoFailure 
  } from '../actions/HoneyDoActions'

export const apiAcceptTodo = (endpoint, authToken, todo, dispatch) => {
  return $.ajax({
    type: "PUT",
    url: endpoint + '/' +todo.id+ '/accept',
    data: { authentication_token: authToken }
  })
    .done((data, textStatus, jqXHR) => {
      dispatch(acceptTodoSuccess(todo, data));
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      dispatch(acceptTodoFailure(todo, errorThrown));
    });
}

export const apiCompleteTodo = (endpoint, authToken, todo, dispatch) => {
  return $.ajax({
    type: "PUT",
    url: endpoint + '/' +todo.id+ '/complete',
    data: { authentication_token: authToken }
  })
    .done((data, textStatus, jqXHR) => {
      dispatch(completeTodoSuccess(todo, data));
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      dispatch(completeTodoFailure(todo, errorThrown));
    });
}

export const apiUncompleteTodo = (endpoint, authToken, todo, dispatch) => {
  $.ajax({
    type: "PUT",
    url: endpoint + '/' +todo.id+ '/uncomplete',
    data: { authentication_token: authToken }
  })
    .done((data, textStatus, jqXHR) => {
      dispatch(uncompleteTodoSuccess(todo, data));
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      dispatch(uncompleteTodoFailure(todo, jqXHR));
    });
}
