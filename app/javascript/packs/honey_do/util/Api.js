// This file should handle all api calls to the server.
// TODO: Create a class rather than export a bunch of functions
//   then they don't have to all be named apiLameName


export default class Api {
  constructor(options) {

    const { endpoint, authToken } = options;

    if(!endpoint || !authToken) {
      this._offlineMode = true;
      return;
    }

    this._offlineMode = false;
    this.endpoint = endpoint;
    this.authToken = authToken;
  }

  get isOfflineMode(){
    return this._offlineMode;
  }

  apiAcceptTodo = (args) => {
    const { todo, onSuccess, onFailure, onComplete } = args;

    let promise = $.ajax({
      type: "PUT",
      url: this.endpoint + '/todos/' +todo.id+ '/accept',
      data: { authentication_token: this.authToken }
    });

    promise = handleSuccess(promise, onSuccess);
    promise = handleFailure(promise, onFailure);
    promise = handleComplete(promise, onComplete);

    return promise;
  }

  apiCompleteTodo = (args) => {
    const { todo, onSuccess, onFailure, onComplete } = args;

    let promise = $.ajax({
      type: "PUT",
      url: this.endpoint + '/todos/' +todo.id+ '/complete',
      data: { authentication_token: this.authToken }
    })

    promise = handleSuccess(promise, onSuccess);
    promise = handleFailure(promise, onFailure);
    promise = handleComplete(promise, onComplete);
    return promise;
  }

  apiCreateTodo = (args) => {
    const { params, onSuccess, onFailure, onComplete } = args;

    let promise = $.ajax({
      type: "POST",
      url: this.endpoint + '/todos',
      data: {
        authentication_token: this.authToken,
        todo: params
      }
    });

    promise = handleSuccess(promise, onSuccess);
    promise = handleFailure(promise, onFailure);
    promise = handleComplete(promise, onComplete);
    return promise;
  }

  apiDeleteTodo = (args) => {
    const { todo, onSuccess, onFailure, onComplete } = args;

    let promise = $.ajax({
      type: "DELETE",
      url: this.endpoint + '/todos/' +todo.id,
      data: { authentication_token: this.authToken }
    });

    promise = handleSuccess(promise, onSuccess);
    promise = handleFailure(promise, onFailure);
    promise = handleComplete(promise, onComplete);
    return promise;
  }

  // TOOD: This wasn't secured on the server side??
  apiRemoveTag = (args) => {
    const { todo, tag, onSuccess, onFailure, onComplete} = args;

    let promise = $.ajax({
      type: "DELETE",
      url: this.endpoint + '/todos/' + todo.id + '/tags/' + tag
    });

    promise = handleSuccess(promise, onSuccess);
    promise = handleFailure(promise, onFailure);
    promise = handleComplete(promise, onComplete);
    return promise;
  }

  apiLoadTags = (args) => {
    const { onSuccess, onFailure, onComplete } = args;
    let promise = $.ajax({
      type: "GET",
      url: this.endpoint + '/tags',
      data: { authentication_token: this.authToken }
    });

    promise = handleSuccess(promise, onSuccess);
    promise = handleFailure(promise, onFailure);
    promise = handleComplete(promise, onComplete);
  }

  apiSyncTodos = (args) => {
    const { onSuccess, onFailure, onComplete } = args;
    let promise = $.ajax({
      type: 'GET',
      url: this.endpoint + '/todos',
      data: {authentication_token: this.authToken}
    })

    promise = handleSuccess(promise, onSuccess);
    promise = handleFailure(promise, onFailure);
    promise = handleComplete(promise, onComplete);
    return promise;
  }

  apiReorderTodo = (args) => {
    const {
      todo,
      todoNeighborId,
      isTodoNeighborNorth,
      onSuccess,
      onFailure,
      onComplete
    } = args;

    let promise = $.ajax({
      type: "PUT",
      url: this.endpoint + '/todos/' + todo.id + '/reorder',
      data: {
        authentication_token: this.authToken,
        todo: todo,
        todo_neighbor_id: todoNeighborId,
        is_todo_neighbor_north: isTodoNeighborNorth
      }
    });
    promise = handleSuccess(promise, onSuccess);
    promise = handleFailure(promise, onFailure);
    promise = handleComplete(promise, onComplete);
    return promise;
  }

  apiUncompleteTodo = (args) => {
    const { todo, onSuccess, onFailure, onComplete } = args;
    let promise = $.ajax({
      type: "PUT",
      url: this.endpoint + '/todos/' +todo.id+ '/uncomplete',
      data: { authentication_token: this.authToken }
    });

    promise = handleSuccess(promise, onSuccess);
    promise = handleFailure(promise, onFailure);
    promise = handleComplete(promise, onComplete);
    return promise;
  }

  apiUpdateTodo = (args) => {
    const { todo, onSuccess, onFailure, onComplete } = args;
    let promise = $.ajax({
      type: "PUT", // TODO: make this PATCH i suppose
      url: this.endpoint + '/todos/' + todo.id,
      data: {
        authentication_token: this.authToken,
        todo: todo
      }
    });
    promise = handleSuccess(promise, onSuccess);
    promise = handleFailure(promise, onFailure);
    promise = handleComplete(promise, onComplete);
    return promise;
  }
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
