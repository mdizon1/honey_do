import React from 'react'
import TodoList from './TodoList'
import TodoTabs from './TodoTabs'
import { Map } from 'immutable'
// import NewTodoButton from './NewTodoButton'

import { init, syncTodosRequest, syncTodosRequestSuccess, syncTodosRequestFailure, switchTab } from './../actions/HoneyDoActions';
// import RaisedButton from 'material-ui/lib/raised-button';

export default class HoneyDo extends React.Component {
  componentWillMount() {
    this.initAppConfig();
    this.initialTodoLoad();
    this.setState({
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

  handleChangeTab(tabVal){
//    debugger;
    this.props.store.dispatch(switchTab(tabVal));
  }

  isComponentReady(){
    if(this.state.store) { return true; }
    return false;
  }

  isLoading(){
    return false;
  }

  onStateChange(){
    this.setState({store: this.props.store.getState().toJS()});
    console.log("DEBUG: state was changed.. current tab? ---> ", this.state.store.uiState.currentTab);
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
          onChangeTab={this.handleChangeTab.bind(this)}
          currentTab={this.state.store.uiState.currentTab}
          appConfig={this.state.store.configState}
        />
      </div>
    )
  }
}
