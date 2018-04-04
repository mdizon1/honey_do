import React from 'react'
import { connect } from 'react-redux'
import TodoTabs from './TodoTabs'
import NewTodoWrap from '../containers/NewTodoWrap'
import EditTodoWrap from '../containers/EditTodoWrap'
import { hot } from "react-hot-loader";
import { init, syncTodosRequest, syncTodosSuccess, syncTodosFailure, switchTab, loadTagSuccess } from './../actions/HoneyDoActions';
import { apiLoadTags } from '../util/Api'
import { UiTabToType } from '../constants/TodoTypes'
import CircularProgress from 'material-ui/Progress/CircularProgress'


const mapStateToProps = (state, ownProps) => {

  var new_props;
  new_props = {
    'interface': state.getIn(['configState', 'interface']),
    configState: getConfigState(state),
    currentTab: getCurrentTab(state),
    uiState: getUiState(state)
  }
  return new_props;
}

class HoneyDo extends React.Component {
  componentDidMount() {
    this.props.store.dispatch(syncTodosRequest());
  }

  handleChangeTab(tabVal){
    this.props.store.dispatch(switchTab(tabVal));
  }

  interfaceIsTouch() {
    return (this.props.interface === 'touch');
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
    if(!this.props.uiState.isSpinning) { return null; }
    return (
      <div className="honey-do-spinner">
        <CircularProgress />
      </div>
    )
  }

  render() {
    return (
      <div className="honey-do-app-wrap">
        { this.renderSpinner() }
        <EditTodoWrap />
        <TodoTabs
          store={this.props.store}
          currentTab={this.props.currentTab}
          appConfig={this.props.configState}
          onChangeTab={this.handleChangeTab.bind(this)}
          isTouch={this.interfaceIsTouch()}
        />
        { this.renderNewTodo() }
      </div>
    )
  }
}

// private
const getConfigState = (storeState) => {
  return storeState.get('configState').toJS();
}
const getCurrentTab = (storeState) => {
  return storeState.getIn(['uiState', 'currentTab']);
}
const getUiState = (storeState) => {
  return storeState.getIn(['uiState']).toJS();
}

export default connect(mapStateToProps)(hot(module)(HoneyDo))
