require('expose?$!expose?jQuery!jquery'); // adds $ to window so we can jquery in global scope
require('jquery-ujs');
require('bootstrap-loader');

// DEV_NOTE: This works.  I can move some of this off to the loaders section of 
// configuration which allows me to omit the !style!css!sass bit
//var css = require("!style!css!sass!./../../assets/stylesheets/foo.scss");
require("./../stylesheets/application.scss");

require('./setup/initTapEventPlugin');
 
import React from 'react';
import ReactDOM from 'react-dom';
import HoneyDo from './components/HoneyDo.jsx';
import { Provider } from 'react-redux'

import { createStore } from 'redux';
import honeyDoReducer from './reducers/HoneyDoReducer';

var store = createStore(honeyDoReducer, {});

var honey_do_container = $('#honey-do');
if(honey_do_container.length == 1){
  let honey_do_options = honey_do_container.data();
  ReactDOM.render( 
    <Provider store={store}>
      <HoneyDo 
        identity={honey_do_options}
        store={store}
        />
    </Provider>,
  document.getElementById('honey-do'));
}


// Just some dev debug javascripts to ensure 
// libs are loaded and working correctly
require('./setup/test');


// Below is a little playground ensuring that the redux stuff works
// import { init, completeTodo } from './actions/HoneyDoActions';
// 
// console.log("DEBUG: let's play around with the redux a bit...store state =========>" );
// console.log(store.getState());
// 
// let unsubscribe = store.subscribe(() => {
//   console.log("new state upon state change --------> ", store.getState());
// });
// 
// store.dispatch(init());
// store.dispatch(completeTodo(1));
// 
// unsubscribe();
// 
