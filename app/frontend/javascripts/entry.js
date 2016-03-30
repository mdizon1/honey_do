require('expose?$!expose?jQuery!jquery'); // adds $ to window so we can jquery in global scope
require('jquery-ujs');
require('bootstrap-loader');
var _ = require('lodash');

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
  let honey_do_identity = _.clone(honey_do_options);
  delete honey_do_identity.apiEndpoint;
  let honey_do_config = {apiEndpoint: honey_do_options.apiEndpoint, identityConfig: honey_do_identity};
//  console.log("DEBUG: options ----> ", honey_do_options);
//  console.log("DEBUG: identity options ----> ", honey_do_identity);
//  console.log("DEBUG: config options ----> ", honey_do_config);
  ReactDOM.render( 
    <Provider store={store}>
      <HoneyDo 
        config={honey_do_config}
        store={store}
        />
    </Provider>,
  document.getElementById('honey-do'));
}

// Just some dev debug javascripts to ensure libs are loaded and working correctly
// require('./setup/test');
