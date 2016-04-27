// This file should handle all api calls to the server.

import { acceptTodoRequest, acceptTodoSuccess, acceptTodoFailure,
  completeTodoRequest, completeTodoSuccess, completeTodoFailure,
  deleteTodoRequest, deleteTodoSuccess, deleteTodoFailure,
  todoReorderRequest, todoReorderSuccess, todoReorderFailure,
  uncompleteTodoRequest, uncompleteTodoSuccess, uncompleteTodoFailure 
  } from '../actions/HoneyDoActions'

export const apiAcceptTodo = (args) => {
  const { endpoint, todo, authToken, onSuccess, onFailure, onComplete } = args;

  let promise = $.ajax({
    type: "PUT",
    url: endpoint + '/' +todo.id+ '/accept',
    data: { authentication_token: authToken }
  });

  promise = handleSuccess(promise, onSuccess);
  promise = handleFailure(promise, onFailure);
  promise = handleComplete(promise, onComplete);

  return promise;
}

export const apiCompleteTodo = (args) => {
  const { endpoint, todo, authToken, onSuccess, onFailure, onComplete } = args;

  let promise = $.ajax({
    type: "PUT",
    url: endpoint + '/' +todo.id+ '/complete',
    data: { authentication_token: authToken }
  })

  promise = handleSuccess(promise, onSuccess);
  promise = handleFailure(promise, onFailure);
  promise = handleComplete(promise, onComplete);

  return promise;
}

export const apiDeleteTodo = (args) => {
  const { endpoint, todo, authToken, onSuccess, onFailure, onComplete } = args;

  let promise = $.ajax({
    type: "DELETE",
    url: endpoint + '/' +todo.id,
    data: { authentication_token: authToken }
  })

  promise = handleSuccess(promise, onSuccess);
  promise = handleFailure(promise, onFailure);
  promise = handleComplete(promise, onComplete);

  return promise;
}

export const apiTodoDropped = (args) => {
  const { endpoint, todo, positionsJumped, authToken, onSuccess, onFailure, onComplete } = args;

  let promise = $.ajax({
    type: "PUT",
    url: endpoint + '/' + todo.id + '/reorder',
    data: { 
      authentication_token: authToken,
      todo: todo,
      positions_jumped: positionsJumped
    }
  });
  promise = handleSuccess(promise, onSuccess);
  promise = handleFailure(promise, onFailure);
  promise = handleComplete(promise, onComplete);

  return promise;
}

export const apiUncompleteTodo = (args) => {
  const { endpoint, todo, authToken, onSuccess, onFailure, onComplete } = args;

  let promise = $.ajax({
    type: "PUT",
    url: endpoint + '/' +todo.id+ '/uncomplete',
    data: { authentication_token: authToken }
  });

  promise = handleSuccess(promise, onSuccess);
  promise = handleFailure(promise, onFailure);
  promise = handleComplete(promise, onComplete);
}

function handleSuccess(promise, callback) {
  if(typeof(callback) === 'function') {
    return promise.done((data, textStatus, jqXHR) => {
      callback(data, textStatus, jqXHR);
    })
  }
  return promise;
}

function handleFailure(promise, callback) {
  if(typeof(callback) === 'function') {
    return promise.fail((jqXHR, textStatus, errorThrown) => {
      callback(jqXHR, textStatus, errorThrown);
    });
  }
  return promise;
}

function handleComplete(promise, callback) {
  if(typeof(callback) === 'function') {
    return promise.done((data_jqXHR, textStatus, jqXHR_errorThrown) => {
      callback(data_jqXHR, textStatus, jqXHR_errorThrown);
    });
  }
  return promise;
}
