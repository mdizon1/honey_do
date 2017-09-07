//TODO: Rename this file to HoneyDo.js .. no need for jsx anymore
import React from 'react'
import TodoTabs from './TodoTabs'
import NewTodoWrap from '../containers/NewTodoWrap'
import EditTodoWrap from '../containers/EditTodoWrap'
import { init, syncTodosRequest, syncTodosRequestSuccess, syncTodosRequestFailure, switchTab, loadTagSuccess } from './../actions/HoneyDoActions';
import { apiSyncTodos, apiLoadTags } from '../util/Api'
import { UiTabToType } from '../constants/TodoTypes'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import CircularProgress from 'material-ui/CircularProgress/CircularProgress'

export default class HoneyDo extends React.Component {
  componentWillMount() {
    this.initAppConfig();
    this.initialTagLoad();
    this.initialTodoLoad();
    this.setState({
      isReady: false,
      'interface': this.props.store.getState().getIn(['configState', 'interface']),
      unsubscribe: this.props.store.subscribe(this.onStateChange.bind(this)),
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

  initialTagLoad() {
    apiLoadTags({
      endpoint: this.props.config.apiEndpoint, 
      authToken: this.props.config.identity.authToken,
      onSuccess: (data, textStatus, jqXHR) => {
        this.props.store.dispatch(loadTagSuccess(data));
      }
    });
  }

  initialTodoLoad() {
    this.syncTodos();
  }

  handleChangeTab(tabVal){
    this.props.store.dispatch(switchTab(tabVal));
  }

  interfaceIsTouch() {
    return (this.state['interface'] == 'touch' ? true : false);
  }

  isComponentReady(){
    return this.state.isReady;
  }

  isLoading(){
    return false;
  }

  onStateChange(){
    const store = this.props.store
    const new_state = {};

    if(!this.state.isReady) { 
      new_state.isReady = true;
      new_state.configState = getConfigState(store);
    }
    if(!this.state.uiState || !_.isEqual(this.state.uiState, store.getState(['uiState']).toJS())){
      new_state.uiState = getUiState(store);
    }

    let curr_tab = getCurrentTab(store);
    if(this.state.currentTab != curr_tab){ new_state.currentTab = curr_tab }
    this.setState(new_state);
  }

  syncTodos() {
    this.props.store.dispatch(syncTodosRequest());
    apiSyncTodos({
      endpoint: this.props.config.apiEndpoint, 
      authToken: this.props.config.identity.authToken,
      onSuccess: (data, textStatus, jqXHR) => {
        this.props.store.dispatch(syncTodosRequestSuccess(data));
      }
      // TODO: implement onFailure for this....
    });
  }

  renderLoading() {
    return (
      <div className="honey-do-app-wrap">
        <h1> Loading... </h1>
      </div>
    )
  }

  renderNewTodo() {
    if(!this.state.configState.identity.permissions.canCreateTodo) { return null; }
    return (
      <NewTodoWrap 
        todoType={UiTabToType[this.state.currentTab]}
        store={this.props.store}
        appConfig={this.props.config}
        onSync={this.syncTodos.bind(this)}
      />
    )
  }

  renderSpinner() {
    if(!this.state.uiState.isSpinning) { return null; }
    return (
      <div className="honey-do-spinner">
        <CircularProgress />
      </div>
    )
  }

  render() {
    if(!this.isComponentReady() || this.isLoading()){
      return this.renderLoading();
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div className="honey-do-app-wrap">
          { this.renderSpinner() }
          <EditTodoWrap onSync={this.syncTodos.bind(this)} />
          <TodoTabs 
            store={this.props.store}
            currentTab={this.state.currentTab}
            appConfig={this.state.configState}
            onChangeTab={this.handleChangeTab.bind(this)}
            onSync={this.syncTodos.bind(this)}
            isTouch={this.interfaceIsTouch()}
          />
          { this.renderNewTodo() }
        </div>
      </MuiThemeProvider>
    )
  }
}

// private
const getConfigState = (store) => {
  return store.getState().get('configState').toJS();
}
const getCurrentTab = (store) => {
  return store.getState().getIn(['uiState', 'currentTab']);
}
const getUiState = (store) => {
  return store.getState().getIn(['uiState']).toJS();
}

