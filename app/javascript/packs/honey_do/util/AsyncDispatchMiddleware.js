/* Taken from 
 * https://lazamar.github.io/dispatching-from-inside-of-reducers/
 */

const asyncDispatchMiddleware = store => next => action => {
  let syncActivityFinished = false;
  let actionQueue = [];

  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch = Object.assign({}, action, { asyncDispatch });

  let result = next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
  return result;
};   

export default asyncDispatchMiddleware
