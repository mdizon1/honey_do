import React from 'react'
import TodoTabs from './TodoTabs'
import { Map } from 'immutable'

import { init, syncTodosRequest, syncTodosRequestSuccess, syncTodosRequestFailure, switchTab } from './../actions/HoneyDoActions';

const getConfigState = (store) => {
  return store.getState().get('configState');
}
const getCurrentTab = (store) => {
  return store.getState().getIn(['uiState', 'currentTab'])
}

export default class HoneyDo extends React.Component {
  componentWillMount() {
    this.initAppConfig();
    this.initialTodoLoad();
    this.setState({
      isReady: false,
      unsubscribe: this.props.store.subscribe(this.onStateChange.bind(this))
    });
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  initAppConfig() {
    this.props.store.dispatch(init({
      config: this.props.config
    }));
  }

  initialTodoLoad() {
    this.syncTodos();
  }

  handleChangeTab(tabVal){
    this.props.store.dispatch(switchTab(tabVal));
  }

  isComponentReady(){
    return this.state.isReady;
  }

  isLoading(){
    return false;
  }

  onStateChange(){
    let new_state = {};

    if(!this.state.isReady) { 
      new_state.isReady = true;
      new_state.configState = getConfigState(this.props.store);
    }

    let curr_tab = getCurrentTab(this.props.store);
    if(!this.state.currentTab == curr_tab){ new_state.currentTab = curr_tab }
    this.setState(new_state);
  }

  syncTodos() {
    this.props.store.dispatch(syncTodosRequest());
    $.ajax(this.props.config.apiEndpoint, {
      type: 'GET',
      data: {authentication_token: this.props.config.identity.authToken}
    }).done((data, textStatus, jqXHR) => {
      this.props.store.dispatch(syncTodosRequestSuccess(data));
    }).fail((jqXHR, textStatus, errorThrown) => {
      // TODO: Implement
      //this.props.store.dispatch(syncTodosRequestFailure(jqXHR, textStatus));
    });
  }

  renderLoading() {
    return (
      <div className="honey-do-app-wrap">
        <h1> Loading... </h1>
      </div>
    )
  }

  render() {
    if(!this.isComponentReady() || this.isLoading()){
      return this.renderLoading();
    }

    return (
      <div className="honey-do-app-wrap">
        <TodoTabs 
          store={this.props.store}
          currentTab={this.state.currentTab}
          appConfig={this.state.configState}
          onChangeTab={this.handleChangeTab.bind(this)}
          onSync={this.syncTodos.bind(this)}
        />
      </div>
    )
  }
}
