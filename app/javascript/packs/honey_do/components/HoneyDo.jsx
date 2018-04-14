import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import TodoTabs from './TodoTabs'
import NewTodoWrap from '../containers/NewTodoWrap'
import EditTodoDialogWrap from '../containers/EditTodoDialogWrap'
import HoneyDoSpinner from '../containers/HoneyDoSpinner'
import { hot } from "react-hot-loader";
import { init, syncTodosRequest, switchTab } from './../actions/HoneyDoActions';
import { apiLoadTags } from '../util/Api'
import { UiTabToType } from '../constants/TodoTypes'
import CircularProgress from 'material-ui/Progress/CircularProgress'

const configSelector = (state, props) => state.get('configState')
const configConversionSelector = createSelector([configSelector], (config) => config.toJS())

//const uiSelector = (state, props) => state.get('uiState')
//const uiConversionSelector = createSelector([uiSelector], (uiState) => uiState.toJS())

const mapStateToProps = (state, ownProps) => {
  return {
    configState: configConversionSelector(state, ownProps),
    'interface': state.getIn(['configState', 'interface']),
    //    uiState: uiConversionSelector(state, ownProps),
    currentTab: state.getIn(['uiState', 'currentTab'])
  }
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

  render() {
    return (
      <div className="honey-do-app-wrap">
        { this.renderSpinner() }
        <TodoTabs
          store={this.props.store}
          currentTab={this.props.currentTab}
          appConfig={this.props.configState}
          onChangeTab={this.handleChangeTab.bind(this)}
          isTouch={this.interfaceIsTouch()}
        />
        { this.renderEditTodo() }
        { this.renderNewTodo() }
      </div>
    )
  }
}


// TODO: try this:
// hot(module)(connect(mapStateToProps)(HoneyDo))
export default connect(mapStateToProps)(hot(module)(HoneyDo))
