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
    if(this.state.isReady) { return; }
    this.setState({ isReady: true });
  }

  syncTodos() {
    this.props.store.dispatch(syncTodosRequest());
    $.ajax(this.props.config.apiEndpoint, {
      type: 'GET',
      data: {authentication_token: this.props.config.identityConfig.authToken}
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
          onChangeTab={this.handleChangeTab.bind(this)}
          currentTab={getCurrentTab(this.props.store)}
          appConfig={getConfigState(this.props.store)}
          onSync={this.syncTodos.bind(this)}
        />
      </div>
    )
  }
}
