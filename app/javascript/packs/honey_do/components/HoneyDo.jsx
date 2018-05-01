import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import HoneyDoAppBar from './HoneyDoAppBar'
import TodoListWrap from './TodoListWrap'
import HoneyDoConfigWrap from '../containers/HoneyDoConfigWrap'
import NewTodoWrap from '../containers/NewTodoWrap'
import EditTodoDialogWrap from '../containers/EditTodoDialogWrap'
import HoneyDoSpinner from '../containers/HoneyDoSpinner'
import { hot } from "react-hot-loader";
import { init, syncTodosRequest, switchTab, openConfig } from './../actions/HoneyDoActions';
import { apiLoadTags } from '../util/Api'
import { UiTabs, UiTabToType } from '../constants/TodoTypes'
import CircularProgress from 'material-ui/Progress/CircularProgress'

const configSelector = (state, props) => state.get('configState')
const configObjectSelector = createSelector([configSelector], (config) => config.toJS())

//const uiSelector = (state, props) => state.get('uiState')
//const uiConversionSelector = createSelector([uiSelector], (uiState) => uiState.toJS())

const mapStateToProps = (state, ownProps) => {
  return {
    configState: configObjectSelector(state, ownProps),
    'interface': state.getIn(['configState', 'interface']),
    currentTab: state.getIn(['uiState', 'currentTab'])
  }
}

class HoneyDo extends React.Component {
  componentDidMount() {
    this.props.store.dispatch(syncTodosRequest());
  }

  handleChangeTab(evt, tabVal){
    this.props.store.dispatch(switchTab(tabVal));
  }

  handleOpenConfig(evt) {
    this.props.store.dispatch(openConfig());
  }

  interfaceIsTouch() {
    return (this.props.interface === 'touch');
  }

  renderEditTodo() {
    return (
      <EditTodoDialogWrap />
    )
  }

  renderNewTodo() {
    if(!this.props.configState.identity.permissions.canCreateTodo) { return null; }
    return (
      <NewTodoWrap
        todoType={UiTabToType[this.props.currentTab]}
        store={this.props.store}
        appConfig={this.props.config}
      />
    )
  }

  renderSpinner() {
    return (
      <HoneyDoSpinner />
    )
  }

  renderTabContent() {
    switch(this.props.currentTab){
      case UiTabs.TODOS:
      case UiTabs.SHOPPING_LIST:
        return (
          <TodoListWrap
            store={this.props.store}
            todoType={UiTabToType[this.props.currentTab]}
            isTouch={this.props.isTouch}
            apiEndpoint={this.props.configState.apiEndpoint}
            authToken={this.props.configState.identity.authToken}
          />
        );
      default:
        throw new Error("Unknown tab selected --> ", this.props.currentTab);
    };
  }

  render() {
    return (
      <div className="honey-do-app-wrap">
        { this.renderSpinner() }
        <HoneyDoAppBar
          store={this.props.store}
          currentTab={this.props.currentTab}
          onChangeTab={this.handleChangeTab.bind(this)}
          onOpenConfig={this.handleOpenConfig.bind(this)}
          isTouch={this.interfaceIsTouch()}
        />
        <HoneyDoConfigWrap />
        { this.renderTabContent() }
        { this.renderEditTodo() }
        { this.renderNewTodo() }
      </div>
    )
  }
}


// TODO: try this:
// hot(module)(connect(mapStateToProps)(HoneyDo))
export default connect(mapStateToProps)(hot(module)(HoneyDo))
