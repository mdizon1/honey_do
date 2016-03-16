import React from 'react'
import TodoList from './TodoList'
import TodoTabs from './TodoTabs'
import VisibleTodoList from './../containers/VisibleTodoList'
// import NewTodoButton from './NewTodoButton'

import { init, syncTodosRequest, syncTodosRequestSuccess, syncTodosRequestFailure } from './../actions/HoneyDoActions';
// import RaisedButton from 'material-ui/lib/raised-button';

export default class HoneyDo extends React.Component {
  componentWillMount() {
    // setup the initial empty store
    this.initAppConfig();
    this.initialTodoLoad();
  }

  initAppConfig() {
    this.props.store.dispatch(init({
      identity: this.props.identity,
      config: this.props.config
    }));
  }

  initialTodoLoad() {
    this.props.store.dispatch(syncTodosRequest());
    $.ajax(this.props.config.apiEndpoint, {
      type: 'GET',
      data: {authentication_token: this.props.identity.authToken}
    }).done((data, textStatus, jqXHR) => {
      this.props.store.dispatch(syncTodosRequestSuccess(data));
    }).fail((jqXHR, textStatus, errorThrown) => {
      // TODO: Implement
      //this.props.store.dispatch(syncTodosRequestFailure(jqXHR, textStatus));
    });
  }

  render() {
    return (
      <div className="honey-do-app-wrap">
        <h2>
          Hello woarld~!
        </h2>
        <TodoTabs />
        <VisibleTodoList />
      </div>
    )
  }
}
