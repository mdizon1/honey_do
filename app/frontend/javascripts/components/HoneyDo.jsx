import React from 'react'
import TodoList from './TodoList'
import TodoTabs from './TodoTabs'
import VisibleTodoList from './../containers/VisibleTodoList'
// import NewTodoButton from './NewTodoButton'

import { init } from './../actions/HoneyDoActions';
// import RaisedButton from 'material-ui/lib/raised-button';

export default class HoneyDo extends React.Component {
  componentWillMount() {
    // setup the initial empty store
    this.props.store.dispatch(init(
      this.props.identity 
    ));

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // IN PROGRESS: ~~~~~~~~~~~~~~~~~~~~~~
    //   call the server to get the initial data for the store
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
