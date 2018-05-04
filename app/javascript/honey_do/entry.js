//require("expose?$!expose?jQuery!jquery"); // adds $ to window so we can jquery in global scope
//require("jquery-ujs");
//require("bootstrap-loader");
//require("font-awesome-sass-loader");
//var _ = require("lodash");

// DEV_NOTE: This works.  I can move some of this off to the loaders section of
// configuration which allows me to omit the !style!css!sass bit
//var css = require("!style!css!sass!./../../assets/stylesheets/foo.scss");

//require("../../../styles/application.scss");

import React from "react"
import ReactDOM from "react-dom"
import * as Immutable from 'immutable'
import HoneyDo from "./components/HoneyDo.jsx"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import honeyDoReducer from "./reducers/HoneyDoReducer"
import Api from "./util/Api"
import asyncDispatchMiddleware from "./util/AsyncDispatchMiddleware"
import { EmptyStore } from "./constants/EmptyStore"

const prepareStore = (options) => {
  var store, initial_store_data, empty_state;

  empty_state = Immutable.fromJS(EmptyStore);
  initial_store_data = empty_state.set('configState', empty_state.get('configState').mergeDeep(options.config));

  return createStore(
    honeyDoReducer,
    initial_store_data,
    applyMiddleware(asyncDispatchMiddleware)
  );
}

$(function (){
  var honey_do_container = $("#honey-do");

  if(honey_do_container.length == 1){
    let honey_do_options = honey_do_container.data();

    let api = new Api({
      endpoint: honey_do_options.config.apiEndpoint, 
      authToken: honey_do_options.config.identity.authToken
    });

    window.api = api;

    let store = prepareStore(honey_do_options);

    ReactDOM.render(
      <Provider store={store}>
        <HoneyDo
          config={honey_do_options.config}
          store={store}
          />
      </Provider>,
      document.getElementById("honey-do")
    );
  }

  // Just some dev debug javascripts to ensure libs are loaded and working correctly
  // require("./setup/test");

  require("./util/Fastclick");
});