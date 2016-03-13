require('expose?$!expose?jQuery!jquery'); // adds $ to window so we can jquery in global scope
require('bootstrap-loader');

// DEV_NOTE: This works.  I can move some of this off to the loaders section of 
// configuration which allows me to omit the !style!css!sass bit
//var css = require("!style!css!sass!./../../assets/stylesheets/foo.scss");
require("./../stylesheets/application.scss");

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

 
var _ = require('lodash');
_.times(5, function(i) {
  console.log(i);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                      TEST INITS
// Just some stuff to ensure that things are installed and working properly
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DEV_NOTE: to prove that babel install is working ?
//  the => syntax seems to work
var foo = [1,2,3,4,5];
foo = foo.map(v => v*2);
console.log(foo);

foo = _.map(foo, (v => v/2));
console.log(foo);

//                        END TEST INITS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



// The real stuff starts here

import React from 'react';
import ReactDOM from 'react-dom';
import HoneyDo from './components/HoneyDo.jsx';

import { createStore } from 'redux';
import honeyDoReducer from './reducers/HoneyDoReducer';

let store = createStore(honeyDoReducer, {});

var honey_do_container = $('#honey-do');
if(honey_do_container.length == 1){
  ReactDOM.render(<HoneyDo />, document.getElementById('honey-do'));
}



// Below is a little playground ensuring that the redux stuff works
import { init, completeTodo } from './actions/HoneyDoActions';

console.log("DEBUG: let's play around with the redux a bit...store state =========>" );
console.log(store.getState());

let unsubscribe = store.subscribe(() => {
  console.log("new state upon state change --------> ", store.getState());
});

store.dispatch(init());
store.dispatch(completeTodo(1));

debugger;

unsubscribe();
