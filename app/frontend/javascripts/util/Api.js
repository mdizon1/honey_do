// This file should handle all api calls to the server.
// TODO: Create a class rather than export a bunch of functions
//   then they don't have to all be named apiLameName

export const apiAcceptTodo = (args) => {
  const { endpoint, todo, authToken, onSuccess, onFailure, onComplete } = args;

  let promise = $.ajax({
    type: "PUT",
    url: endpoint + '/todos/' +todo.id+ '/accept',
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
    url: endpoint + '/todos/' +todo.id+ '/complete',
    data: { authentication_token: authToken }
  })

  promise = handleSuccess(promise, onSuccess);
  promise = handleFailure(promise, onFailure);
  promise = handleComplete(promise, onComplete);
  return promise;
}

export const apiCreateTodo = (args) => {
  const { endpoint, params, authToken, onSuccess, onFailure, onComplete } = args;

  let promise = $.ajax({
    type: "POST",
    url: endpoint,
    data: {
      authentication_token: authToken, 
      todo: params
    }
  });

  promise = handleSuccess(promise, onSuccess);
  promise = handleFailure(promise, onFailure);
  promise = handleComplete(promise, onComplete);
  return promise;
}

export const apiDeleteTodo = (args) => {
  const { endpoint, todo, authToken, onSuccess, onFailure, onComplete } = args;

  let promise = $.ajax({
    type: "DELETE",
    url: endpoint + '/todos/' +todo.id,
    data: { authentication_token: authToken }
  });

  promise = handleSuccess(promise, onSuccess);
  promise = handleFailure(promise, onFailure);
  promise = handleComplete(promise, onComplete);
  return promise;
}

export const apiLoadTags = (args) => {
  const { endpoint, authToken, onSuccess, onFailure, onComplete } = args;
  let promise = $.ajax({
    type: "GET",
    url: endpoint + '/tags',
    data: { authentication_token: authToken }
  });
  
  promise = handleSuccess(promise, onSuccess);
  promise = handleFailure(promise, onFailure);
  promise = handleComplete(promise, onComplete);
}

export const apiSyncTodos = (args) => {
  const { endpoint, authToken, onSuccess, onFailure, onComplete } = args;

  let promise = $.ajax({
    type: 'GET',
    url: endpoint,
    data: {authentication_token: authToken}
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
    url: endpoint + '/todos/' + todo.id + '/reorder',
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
    url: endpoint + '/todos/' +todo.id+ '/uncomplete',
    data: { authentication_token: authToken }
  });

  promise = handleSuccess(promise, onSuccess);
  promise = handleFailure(promise, onFailure);
  promise = handleComplete(promise, onComplete);
  return promise;
}

export const apiUpdateTodo = (args) => {
  const { endpoint, todo, authToken, onSuccess, onFailure, onComplete } = args;

  let promise = $.ajax({
    type: "PUT", // TODO: make this PATCH i suppose
    url: endpoint + '/todos/' + todo.id,
    data: {
      authentication_token: authToken, 
      todo: todo
    }
  });
  promise = handleSuccess(promise, onSuccess);
  promise = handleFailure(promise, onFailure);
  promise = handleComplete(promise, onComplete);
  return promise;
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
    return promise.always((data_jqXHR, textStatus, jqXHR_errorThrown) => {
      callback(data_jqXHR, textStatus, jqXHR_errorThrown);
    });
  }
  return promise;
}
