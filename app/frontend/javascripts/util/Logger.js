const log = (msg, outArgs=[]) => {
  _output("LOG: "+msg, 1, outArgs);
}
const debug = (msg, outArgs=[]) => {
  _output("DEBUG: "+msg, 2, outArgs);
}
const dev = (msg, outArgs=[]) => {
  _output("DEV_DEBUG: "+msg, 3, outArgs);
}

function _output(msg, logLevel, outObjects){
  if(!window.logLevel) {
    window.logLevel = 0;
  }

  if(window.logLevel < logLevel) {
    return;
  }

  if(!outObjects || outObjects.length === 0) {
    console.log(msg);
    return
  }

  console.log(msg, outObjects);
}

export { log, debug, dev };
